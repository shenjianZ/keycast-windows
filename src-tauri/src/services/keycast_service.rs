use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::{
    fs,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread::{self, JoinHandle},
    time::Duration,
};
use tauri::{AppHandle, Emitter, Manager};

const KEYCAST_LABEL: &str = "keycast_overlay";
const KEYCAST_CONFIG_FILE: &str = "keycast-overlay.json";
const DEFAULT_COMBO_WINDOW_MS: i64 = 500;

#[cfg(target_os = "windows")]
use windows::Win32::UI::Input::KeyboardAndMouse::GetAsyncKeyState;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum KeycastDisplayMode {
    ComboOnly,
    SingleOnly,
    ComboPrecedence,
    AllSequential,
    AllSequentialPersistent,
    SmartMixed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum KeycastScrollDirection {
    Horizontal,
    Vertical,
    Fade,
}

#[derive(Clone)]
pub struct KeycastRuntime {
    is_listening: Arc<AtomicBool>,
    stop_flag: Arc<Mutex<Option<Arc<AtomicBool>>>>,
    worker: Arc<Mutex<Option<JoinHandle<()>>>>,
    overlay_config: Arc<Mutex<KeycastOverlayConfig>>,
}

#[derive(Debug, Clone, Serialize)]
pub struct KeycastState {
    pub is_listening: bool,
    pub is_overlay_visible: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct KeycastDisplayPayload {
    pub text: String,
    pub keys: Vec<String>,
    pub key_count: usize,
    pub clear: bool,
    pub timestamp: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeycastOverlayConfig {
    pub x: f64,
    pub y: f64,
    #[serde(default = "default_combo_window_ms")]
    pub combo_window_ms: i64,
    #[serde(default = "default_keycast_theme")]
    pub theme: String,
    #[serde(default = "default_keycast_text_color")]
    pub text_color: String,
    #[serde(default = "default_keycast_accent_visible")]
    pub accent_visible: bool,
    #[serde(default = "default_keycast_accent_color")]
    pub accent_color: String,
    // 新增配置项
    #[serde(default = "default_display_mode")]
    pub display_mode: KeycastDisplayMode,
    #[serde(default = "default_max_consecutive_keys")]
    pub max_consecutive_keys: i64,
    #[serde(default = "default_consecutive_window_ms")]
    pub consecutive_window_ms: i64,
    #[serde(default = "default_queue_idle_timeout_ms")]
    pub queue_idle_timeout_ms: i64,
    #[serde(default = "default_show_key_count")]
    pub show_key_count: bool,
    #[serde(default = "default_scroll_direction")]
    pub scroll_direction: KeycastScrollDirection,
}

#[derive(Default)]
struct KeySequenceTracker {
    pending_modifiers: Vec<String>,
    pending_started_at: Option<i64>,
    consecutive_keys: Vec<String>,
    consecutive_started_at: Option<i64>,
    consecutive_count: usize,
}

pub struct KeycastService;

impl Default for KeycastRuntime {
    fn default() -> Self {
        Self {
            is_listening: Arc::new(AtomicBool::new(false)),
            stop_flag: Arc::new(Mutex::new(None)),
            worker: Arc::new(Mutex::new(None)),
            overlay_config: Arc::new(Mutex::new(KeycastOverlayConfig::default())),
        }
    }
}

impl Default for KeycastOverlayConfig {
    fn default() -> Self {
        Self {
            x: 24.0,
            y: 24.0,
            combo_window_ms: default_combo_window_ms(),
            theme: default_keycast_theme(),
            text_color: default_keycast_text_color(),
            accent_visible: default_keycast_accent_visible(),
            accent_color: default_keycast_accent_color(),
            display_mode: default_display_mode(),
            max_consecutive_keys: default_max_consecutive_keys(),
            consecutive_window_ms: default_consecutive_window_ms(),
            queue_idle_timeout_ms: default_queue_idle_timeout_ms(),
            show_key_count: default_show_key_count(),
            scroll_direction: default_scroll_direction(),
        }
    }
}

fn default_combo_window_ms() -> i64 {
    DEFAULT_COMBO_WINDOW_MS
}

fn default_keycast_theme() -> String {
    "text-only".to_string()
}

fn default_keycast_text_color() -> String {
    "#111827".to_string()
}

fn default_keycast_accent_visible() -> bool {
    true
}

fn default_keycast_accent_color() -> String {
    "#fb923c".to_string()
}

// 新增默认值函数
fn default_display_mode() -> KeycastDisplayMode {
    KeycastDisplayMode::ComboPrecedence
}

fn default_max_consecutive_keys() -> i64 {
    5
}

fn default_consecutive_window_ms() -> i64 {
    400
}

fn default_queue_idle_timeout_ms() -> i64 {
    400
}

fn default_show_key_count() -> bool {
    false
}

fn default_scroll_direction() -> KeycastScrollDirection {
    KeycastScrollDirection::Horizontal
}

impl KeySequenceTracker {
    fn take_idle_clear_payload(
        &mut self,
        display_mode: &KeycastDisplayMode,
        queue_idle_timeout_ms: i64,
    ) -> Option<KeycastDisplayPayload> {
        if !matches!(display_mode, KeycastDisplayMode::AllSequentialPersistent) {
            return None;
        }
        let now = Utc::now().timestamp_millis();
        if !self.consecutive_keys.is_empty() && self.is_consecutive_stale(now, queue_idle_timeout_ms) {
            self.consecutive_keys.clear();
            self.consecutive_started_at = None;
            self.consecutive_count = 0;
            return Some(build_clear_payload());
        }
        None
    }

    fn handle(
        &mut self,
        virtual_key: u16,
        is_down: bool,
        combo_window_ms: i64,
        display_mode: &KeycastDisplayMode,
        max_consecutive_keys: i64,
        consecutive_window_ms: i64,
        queue_idle_timeout_ms: i64,
    ) -> Option<KeycastDisplayPayload> {
        let now = Utc::now().timestamp_millis();
        let key = key_name(virtual_key)?;

        // 根据显示模式处理按键
        match display_mode {
            KeycastDisplayMode::ComboOnly => {
                // 仅组合键模式
                self.handle_combo_only(key, is_down, now, combo_window_ms)
            }
            KeycastDisplayMode::SingleOnly => {
                // 仅单个按键模式
                self.handle_single_only(key, is_down, now, consecutive_window_ms, max_consecutive_keys)
            }
            KeycastDisplayMode::ComboPrecedence => {
                // 组合键优先模式
                self.handle_combo_precedence(key, is_down, now, combo_window_ms, consecutive_window_ms, max_consecutive_keys)
            }
            KeycastDisplayMode::AllSequential => {
                // 所有按键连续显示
                self.handle_all_sequential(key, is_down, now, consecutive_window_ms, max_consecutive_keys)
            }
            KeycastDisplayMode::AllSequentialPersistent => {
                // 所有按键队列显示（空闲超时后清空）
                self.handle_all_sequential_persistent(key, is_down, now, queue_idle_timeout_ms, max_consecutive_keys)
            }
            KeycastDisplayMode::SmartMixed => {
                // 智能混合模式
                self.handle_smart_mixed(key, is_down, now, combo_window_ms, consecutive_window_ms, max_consecutive_keys)
            }
        }
    }

    // 仅组合键模式
    fn handle_combo_only(
        &mut self,
        key: String,
        is_down: bool,
        now: i64,
        combo_window_ms: i64,
    ) -> Option<KeycastDisplayPayload> {
        if is_modifier_key(&key) {
            return if is_down {
                self.handle_modifier_down(key, now, combo_window_ms)
            } else {
                self.handle_modifier_up()
            };
        }
        if !is_down {
            return None;
        }
        if self.is_pending_stale(now, combo_window_ms) {
            self.pending_modifiers.clear();
            self.pending_started_at = None;
        }
        // 只有当有修饰键时才显示
        if !self.pending_modifiers.is_empty() {
            let mut keys = take_modifiers(&mut self.pending_modifiers);
            self.pending_started_at = None;
            keys.push(key);
            Some(build_payload(keys))
        } else {
            None
        }
    }

    // 仅单个按键模式
    fn handle_single_only(
        &mut self,
        key: String,
        is_down: bool,
        _now: i64,
        _consecutive_window_ms: i64,
        _max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        if is_modifier_key(&key) {
            return None; // 忽略修饰键
        }
        if !is_down {
            return None;
        }
        // 只显示当前按键，不累积
        Some(build_payload(vec![key]))
    }

    // 组合键优先模式
    fn handle_combo_precedence(
        &mut self,
        key: String,
        is_down: bool,
        now: i64,
        combo_window_ms: i64,
        _consecutive_window_ms: i64,
        _max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        if is_modifier_key(&key) {
            return if is_down {
                self.handle_modifier_down(key, now, combo_window_ms)
            } else {
                self.handle_modifier_up()
            };
        }
        if !is_down {
            return None;
        }

        // 检查是否有待处理的修饰键
        if !self.pending_modifiers.is_empty() {
            if self.is_pending_stale(now, combo_window_ms) {
                self.pending_modifiers.clear();
                self.pending_started_at = None;
            } else {
                // 有修饰键，作为组合键处理
                let mut keys = take_modifiers(&mut self.pending_modifiers);
                self.pending_started_at = None;
                keys.push(key);
                return Some(build_payload(keys));
            }
        }

        // 没有修饰键，作为单个按键处理
        // 在 combo-precedence 模式下，不累积显示，只显示当前按键
        Some(build_payload(vec![key]))
    }

    // 所有按键连续显示模式
    fn handle_all_sequential(
        &mut self,
        key: String,
        is_down: bool,
        now: i64,
        queue_idle_timeout_ms: i64,
        max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        if !is_down {
            return None;
        }

        if self.is_consecutive_stale(now, queue_idle_timeout_ms) {
            self.consecutive_keys.clear();
            self.consecutive_started_at = None;
            self.consecutive_count = 0;
        }
        self.handle_consecutive_key(key, now, queue_idle_timeout_ms, max_consecutive_keys)
    }

    fn handle_all_sequential_persistent(
        &mut self,
        key: String,
        is_down: bool,
        now: i64,
        queue_idle_timeout_ms: i64,
        max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        if !is_down {
            return None;
        }
        if self.is_consecutive_stale(now, queue_idle_timeout_ms) {
            self.consecutive_keys.clear();
            self.consecutive_started_at = None;
            self.consecutive_count = 0;
        }
        self.consecutive_keys.push(key);
        self.consecutive_started_at = Some(now);
        if self.consecutive_keys.len() > max_consecutive_keys as usize {
            self.consecutive_keys.remove(0);
        }
        self.consecutive_count = self.consecutive_keys.len();
        Some(build_payload_with_count(
            self.consecutive_keys.clone(),
            self.consecutive_count,
        ))
    }

    // 智能混合模式
    fn handle_smart_mixed(
        &mut self,
        key: String,
        is_down: bool,
        now: i64,
        combo_window_ms: i64,
        consecutive_window_ms: i64,
        max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        // 智能判断：如果短时间内连续按普通键，使用连续模式
        // 如果按修饰键组合，使用组合键模式
        if is_modifier_key(&key) {
            return if is_down {
                self.handle_modifier_down(key, now, combo_window_ms)
            } else {
                self.handle_modifier_up()
            };
        }
        if !is_down {
            return None;
        }

        // 如果有待处理的修饰键，作为组合键
        if !self.pending_modifiers.is_empty() {
            if self.is_pending_stale(now, combo_window_ms) {
                self.pending_modifiers.clear();
                self.pending_started_at = None;
            } else {
                let mut keys = take_modifiers(&mut self.pending_modifiers);
                self.pending_started_at = None;
                keys.push(key);
                return Some(build_payload(keys));
            }
        }

        // 检查是否在连续按键窗口内
        if self.is_consecutive_window_active(now, consecutive_window_ms) {
            // 在连续按键窗口内，继续累积显示
            self.handle_consecutive_key(key, now, consecutive_window_ms, max_consecutive_keys)
        } else {
            // 新序列的首个按键也要进入连续追踪，否则后续普通键无法升级为连续显示
            self.consecutive_keys.clear();
            self.consecutive_started_at = None;
            self.consecutive_count = 0;
            self.handle_consecutive_key(key, now, consecutive_window_ms, max_consecutive_keys)
        }
    }

    // 处理连续按键
    fn handle_consecutive_key(
        &mut self,
        key: String,
        now: i64,
        consecutive_window_ms: i64,
        max_consecutive_keys: i64,
    ) -> Option<KeycastDisplayPayload> {
        // 检查连续按键窗口是否过期
        if self.is_consecutive_stale(now, consecutive_window_ms) {
            self.consecutive_keys.clear();
            self.consecutive_started_at = None;
            self.consecutive_count = 0;
        }

        self.consecutive_keys.push(key.clone());
        self.consecutive_started_at.get_or_insert(now);
        self.consecutive_count += 1;

        if self.consecutive_keys.len() > max_consecutive_keys as usize {
            self.consecutive_keys.remove(0);
        }

        Some(build_payload_with_count(
            self.consecutive_keys.clone(),
            self.consecutive_count,
        ))
    }

    fn handle_modifier_down(
        &mut self,
        key: String,
        now: i64,
        combo_window_ms: i64,
    ) -> Option<KeycastDisplayPayload> {
        if self.is_pending_stale(now, combo_window_ms) {
            self.pending_modifiers.clear();
            self.pending_started_at = None;
        }
        if self.pending_modifiers.contains(&key) {
            return None;
        }
        self.pending_modifiers.push(key);
        self.pending_modifiers
            .sort_by_key(|item| modifier_rank(item));
        self.pending_started_at.get_or_insert(now);
        None
    }

    fn handle_modifier_up(&mut self) -> Option<KeycastDisplayPayload> {
        if self.pending_modifiers.is_empty() {
            return None;
        }
        self.pending_modifiers.clear();
        self.pending_started_at = None;
        None
    }

    fn is_pending_stale(&self, now: i64, combo_window_ms: i64) -> bool {
        self.pending_started_at
            .map(|started_at| now - started_at > combo_window_ms)
            .unwrap_or(false)
    }

    fn is_consecutive_stale(&self, now: i64, consecutive_window_ms: i64) -> bool {
        self.consecutive_started_at
            .map(|started_at| now - started_at > consecutive_window_ms)
            .unwrap_or(false)
    }

    fn is_consecutive_window_active(&self, now: i64, consecutive_window_ms: i64) -> bool {
        !self.is_consecutive_stale(now, consecutive_window_ms) && !self.consecutive_keys.is_empty()
    }
}

fn build_payload(keys: Vec<String>) -> KeycastDisplayPayload {
    build_payload_with_count(keys.clone(), keys.len())
}

fn build_payload_with_count(keys: Vec<String>, key_count: usize) -> KeycastDisplayPayload {
    KeycastDisplayPayload {
        text: keys.join(" + "),
        keys,
        key_count,
        clear: false,
        timestamp: Utc::now().timestamp_millis(),
    }
}

fn build_clear_payload() -> KeycastDisplayPayload {
    KeycastDisplayPayload {
        text: String::new(),
        keys: Vec::new(),
        key_count: 0,
        clear: true,
        timestamp: Utc::now().timestamp_millis(),
    }
}

fn take_modifiers(keys: &mut Vec<String>) -> Vec<String> {
    let mut taken = Vec::new();
    std::mem::swap(keys, &mut taken);
    taken
}

fn is_modifier_key(key: &str) -> bool {
    matches!(key, "Ctrl" | "Shift" | "Alt" | "Win")
}

fn modifier_rank(key: &str) -> usize {
    match key {
        "Ctrl" => 0,
        "Shift" => 1,
        "Alt" => 2,
        "Win" => 3,
        _ => 10,
    }
}

#[cfg(target_os = "windows")]
fn is_virtual_key_down(virtual_key: u16) -> bool {
    unsafe { GetAsyncKeyState(i32::from(virtual_key)) as u16 & 0x8000 != 0 }
}

#[cfg(not(target_os = "windows"))]
fn is_virtual_key_down(_virtual_key: u16) -> bool {
    false
}

fn key_name(virtual_key: u16) -> Option<String> {
    match virtual_key {
        0x08 => Some("Backspace".to_string()),
        0x09 => Some("Tab".to_string()),
        0x0D => Some("Enter".to_string()),
        0x1B => Some("Esc".to_string()),
        0x20 => Some("Space".to_string()),
        0x21 => Some("PageUp".to_string()),
        0x22 => Some("PageDown".to_string()),
        0x23 => Some("End".to_string()),
        0x24 => Some("Home".to_string()),
        0x25 => Some("Left".to_string()),
        0x26 => Some("Up".to_string()),
        0x27 => Some("Right".to_string()),
        0x28 => Some("Down".to_string()),
        0x2D => Some("Insert".to_string()),
        0x2E => Some("Delete".to_string()),
        0x5B | 0x5C => Some("Win".to_string()),
        0xA0 | 0xA1 => Some("Shift".to_string()),
        0xA2 | 0xA3 => Some("Ctrl".to_string()),
        0xA4 | 0xA5 => Some("Alt".to_string()),
        0x70..=0x87 => Some(format!("F{}", virtual_key - 0x6F)),
        0x60..=0x69 => Some(format!("Num{}", virtual_key - 0x60)),
        0x30..=0x39 | 0x41..=0x5A => {
            char::from_u32(u32::from(virtual_key)).map(|ch| ch.to_string())
        }
        _ => None,
    }
}

impl KeycastService {
    fn emit_state(app: &AppHandle, runtime: &KeycastRuntime) {
        if let Ok(state) = Self::get_state(app, runtime) {
            let _ = app.emit("keycast:state-updated", state);
        }
    }

    pub fn initialize(app: &AppHandle, runtime: &KeycastRuntime) -> Result<(), String> {
        let config =
            Self::normalize_overlay_config(Self::load_overlay_config(app).unwrap_or_default());
        let mut current = runtime
            .overlay_config
            .lock()
            .map_err(|_| "初始化按键屏显配置失败".to_string())?;
        *current = config;
        Ok(())
    }

    pub fn get_state(app: &AppHandle, runtime: &KeycastRuntime) -> Result<KeycastState, String> {
        let is_overlay_visible = app
            .get_webview_window(KEYCAST_LABEL)
            .map(|window| window.is_visible().unwrap_or(false))
            .unwrap_or(false);
        Ok(KeycastState {
            is_listening: runtime.is_listening.load(Ordering::SeqCst),
            is_overlay_visible,
        })
    }

    pub fn get_overlay_config(
        _app: &AppHandle,
        runtime: &KeycastRuntime,
    ) -> Result<KeycastOverlayConfig, String> {
        runtime
            .overlay_config
            .lock()
            .map(|current| current.clone())
            .map_err(|_| "读取按键屏显配置失败".to_string())
    }

    pub fn prewarm_overlay_async(app: &AppHandle, runtime: &KeycastRuntime) -> Result<(), String> {
        if app.get_webview_window(KEYCAST_LABEL).is_some() {
            return Ok(());
        }
        let app_handle = app.clone();
        let runtime_handle = runtime.clone();
        app.run_on_main_thread(move || {
            let _ = Self::ensure_overlay_window(&app_handle, &runtime_handle);
        })
        .map_err(|e| format!("投递按键屏显预热任务失败: {}", e))
    }

    pub fn update_overlay_config(
        app: &AppHandle,
        runtime: &KeycastRuntime,
        next: KeycastOverlayConfig,
    ) -> Result<KeycastOverlayConfig, String> {
        let next = Self::normalize_overlay_config(next);
        let mut config = runtime
            .overlay_config
            .lock()
            .map_err(|_| "更新按键屏显配置失败".to_string())?;
        *config = next.clone();
        drop(config);
        Self::save_overlay_config(app, &next)?;
        let _ = app.emit("keycast:config-updated", &next);
        Self::ensure_overlay_window(app, runtime)?;
        Self::apply_overlay_config(app, &next)?;
        Ok(next)
    }

    pub fn start(app: &AppHandle, runtime: &KeycastRuntime) -> Result<(), String> {
        Self::ensure_overlay_window(app, runtime)?;
        if runtime.is_listening.swap(true, Ordering::SeqCst) {
            return Ok(());
        }
        let stop_flag = Arc::new(AtomicBool::new(false));
        if let Ok(mut guard) = runtime.stop_flag.lock() {
            *guard = Some(stop_flag.clone());
        }
        let app_handle = app.clone();
        let runtime_handle = runtime.clone();
        let worker = thread::spawn(move || Self::run_worker(app_handle, runtime_handle, stop_flag));
        if let Ok(mut guard) = runtime.worker.lock() {
            *guard = Some(worker);
        }
        runtime.is_listening.store(true, Ordering::SeqCst);
        Self::emit_state(app, runtime);
        Ok(())
    }

    pub fn stop(app: &AppHandle, runtime: &KeycastRuntime) -> Result<(), String> {
        if let Ok(mut guard) = runtime.stop_flag.lock() {
            if let Some(flag) = guard.take() {
                flag.store(true, Ordering::SeqCst);
            }
        }
        if let Ok(mut guard) = runtime.worker.lock() {
            if let Some(handle) = guard.take() {
                let _ = handle.join();
            }
        }
        runtime.is_listening.store(false, Ordering::SeqCst);
        Self::emit_state(app, runtime);
        Self::hide_overlay(app)
    }

    fn run_worker(app: AppHandle, runtime: KeycastRuntime, stop_flag: Arc<AtomicBool>) {
        #[cfg(target_os = "windows")]
        {
            let mut tracker = KeySequenceTracker::default();
            let mut pressed = [false; 256];
            while !stop_flag.load(Ordering::SeqCst) {
                // 读取所有需要的配置项
                let (combo_window_ms, display_mode, max_consecutive_keys, consecutive_window_ms, queue_idle_timeout_ms) = runtime
                    .overlay_config
                    .lock()
                    .map(|config| (
                        config.combo_window_ms,
                        config.display_mode.clone(),
                        config.max_consecutive_keys,
                        config.consecutive_window_ms,
                        config.queue_idle_timeout_ms
                    ))
                    .unwrap_or((
                        DEFAULT_COMBO_WINDOW_MS,
                        KeycastDisplayMode::ComboPrecedence,
                        5,
                        400,
                        400
                    ));

                if let Some(payload) = tracker.take_idle_clear_payload(&display_mode, queue_idle_timeout_ms) {
                    let _ = app.emit("keycast:display", payload);
                }

                for vk in 1_u16..=254_u16 {
                    let is_down = is_virtual_key_down(vk);
                    let slot = &mut pressed[vk as usize];
                    if is_down == *slot {
                        continue;
                    }
                    *slot = is_down;
                    if let Some(payload) = tracker.handle(
                        vk,
                        is_down,
                        combo_window_ms,
                        &display_mode,
                        max_consecutive_keys,
                        consecutive_window_ms,
                        queue_idle_timeout_ms
                    ) {
                        let _ = app.emit("keycast:display", payload);
                    }
                }
                thread::sleep(Duration::from_millis(16));
            }
            return;
        }

        #[cfg(not(target_os = "windows"))]
        {
            let payload = build_payload(vec!["Unsupported".to_string()]);
            let _ = app.emit("keycast:display", payload);
        }
    }

    fn ensure_overlay_window(app: &AppHandle, runtime: &KeycastRuntime) -> Result<(), String> {
        use tauri::{WebviewUrl, WebviewWindowBuilder};

        if app.get_webview_window(KEYCAST_LABEL).is_some() {
            return Ok(());
        }
        WebviewWindowBuilder::new(app, KEYCAST_LABEL, WebviewUrl::App("keycast.html".into()))
            .title("按键屏显")
            .transparent(true)
            .decorations(false)
            .always_on_top(true)
            .skip_taskbar(true)
            .resizable(false)
            .focused(false)
            .visible(false)
            .inner_size(560.0, 140.0)
            .build()
            .map_err(|e| format!("创建按键屏显窗口失败: {}", e))?;
        #[cfg(target_os = "windows")]
        if let Some(window) = app.get_webview_window(KEYCAST_LABEL) {
            window
                .set_shadow(false)
                .map_err(|e| format!("关闭按键屏显窗口阴影失败: {}", e))?;
        }
        let config = Self::get_overlay_config(app, runtime)?;
        Self::apply_overlay_config(app, &config)
    }

    fn hide_overlay(app: &AppHandle) -> Result<(), String> {
        if let Some(window) = app.get_webview_window(KEYCAST_LABEL) {
            window
                .hide()
                .map_err(|e| format!("隐藏按键屏显窗口失败: {}", e))?;
        }
        Ok(())
    }

    fn apply_overlay_config(app: &AppHandle, config: &KeycastOverlayConfig) -> Result<(), String> {
        use tauri::LogicalPosition;

        let window = app
            .get_webview_window(KEYCAST_LABEL)
            .ok_or_else(|| "按键屏显窗口不存在".to_string())?;
        window
            .set_position(LogicalPosition::new(config.x, config.y))
            .map_err(|e| format!("设置按键屏显位置失败: {}", e))
    }

    fn overlay_config_path(app: &AppHandle) -> Result<std::path::PathBuf, String> {
        let data_dir = app
            .path()
            .home_dir()
            .map_err(|e| format!("获取用户目录失败: {}", e))?
            .join(".keycast-windows");
        fs::create_dir_all(&data_dir).map_err(|e| format!("创建数据目录失败: {}", e))?;
        Ok(data_dir.join(KEYCAST_CONFIG_FILE))
    }

    fn load_overlay_config(app: &AppHandle) -> Result<KeycastOverlayConfig, String> {
        let path = Self::overlay_config_path(app)?;
        if !path.exists() {
            let defaults = KeycastOverlayConfig::default();
            Self::save_overlay_config(app, &defaults)?;
            return Ok(defaults);
        }
        let content =
            fs::read_to_string(&path).map_err(|e| format!("读取按键屏显配置失败: {}", e))?;
        serde_json::from_str(&content).map_err(|e| format!("解析按键屏显配置失败: {}", e))
    }

    fn save_overlay_config(app: &AppHandle, config: &KeycastOverlayConfig) -> Result<(), String> {
        let path = Self::overlay_config_path(app)?;
        let content = serde_json::to_string_pretty(config)
            .map_err(|e| format!("序列化按键屏显配置失败: {}", e))?;
        fs::write(path, content).map_err(|e| format!("保存按键屏显配置失败: {}", e))
    }

    fn normalize_overlay_config(mut config: KeycastOverlayConfig) -> KeycastOverlayConfig {
        config.combo_window_ms = config.combo_window_ms.clamp(100, 2000);
        config.text_color = if config.text_color.trim().is_empty() {
            default_keycast_text_color()
        } else {
            config.text_color.trim().to_string()
        };
        config.accent_color = if config.accent_color.trim().is_empty() {
            default_keycast_accent_color()
        } else {
            config.accent_color.trim().to_string()
        };
        if !matches!(
            config.theme.as_str(),
            "keycaps-dark"
                | "keycaps-light"
                | "text-only"
                | "broadcast-orange"
                | "broadcast-green"
                | "minimal-light"
                | "glass-soft"
                | "fresh-mint"
                | "sky-card"
                | "terminal"
                | "neon-cyan"
                | "paper-card"
        ) {
            config.theme = default_keycast_theme();
        }
        // 新增配置项的验证和规范化
        config.max_consecutive_keys = config.max_consecutive_keys.clamp(3, 20);
        config.consecutive_window_ms = config.consecutive_window_ms.clamp(200, 800);
        config.queue_idle_timeout_ms = config.queue_idle_timeout_ms.clamp(200, 5000);
        config
    }
}

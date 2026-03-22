use serde::{Deserialize, Serialize};
use std::{fs, sync::{Arc, Mutex}};
use tauri::{AppHandle, Manager};

const APP_SETTINGS_FILE: &str = "app-settings.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(default)]
    pub locale_override: Option<String>,
    #[serde(default)]
    pub listen_on_startup: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            locale_override: None,
            listen_on_startup: true,
        }
    }
}

#[derive(Clone)]
pub struct AppSettingsRuntime {
    pub settings: Arc<Mutex<AppSettings>>,
    pub current_locale: Arc<Mutex<String>>,
}

pub struct AppSettingsService;

impl AppSettingsService {
    pub fn initialize(app: &AppHandle) -> Result<AppSettingsRuntime, String> {
        let settings = Self::load(app)?;
        let current_locale = settings.locale_override.clone().unwrap_or_else(|| "en-US".to_string());
        Ok(AppSettingsRuntime { settings: Arc::new(Mutex::new(settings)), current_locale: Arc::new(Mutex::new(current_locale)) })
    }

    pub fn get(runtime: &AppSettingsRuntime) -> Result<AppSettings, String> {
        runtime.settings.lock().map(|settings| settings.clone()).map_err(|_| "读取应用设置失败".to_string())
    }

    pub fn update(app: &AppHandle, runtime: &AppSettingsRuntime, settings: AppSettings) -> Result<AppSettings, String> {
        let next = AppSettings {
            locale_override: settings.locale_override.as_deref().map(Self::normalize_locale),
            listen_on_startup: settings.listen_on_startup,
        };
        Self::save(app, &next)?;
        let current = next.locale_override.clone().unwrap_or_else(|| Self::current_locale(runtime));
        *runtime.settings.lock().map_err(|_| "写入应用设置失败".to_string())? = next.clone();
        *runtime.current_locale.lock().map_err(|_| "写入应用语言失败".to_string())? = current;
        Ok(next)
    }

    pub fn sync_system_locale(runtime: &AppSettingsRuntime, system_locale: &str) -> Result<String, String> {
        let settings = runtime.settings.lock().map_err(|_| "读取应用设置失败".to_string())?.clone();
        let next = settings.locale_override.unwrap_or_else(|| Self::normalize_locale(system_locale));
        *runtime.current_locale.lock().map_err(|_| "写入应用语言失败".to_string())? = next.clone();
        Ok(next)
    }

    pub fn current_locale(runtime: &AppSettingsRuntime) -> String {
        runtime.current_locale.lock().map(|locale| locale.clone()).unwrap_or_else(|_| "en-US".to_string())
    }

    fn normalize_locale(locale: &str) -> String {
        if locale.to_lowercase().starts_with("zh") { "zh-CN".to_string() } else { "en-US".to_string() }
    }

    fn load(app: &AppHandle) -> Result<AppSettings, String> {
        let path = Self::path(app)?;
        if !path.exists() { return Ok(AppSettings::default()); }
        let content = fs::read_to_string(path).map_err(|e| format!("读取应用设置失败: {}", e))?;
        serde_json::from_str(&content).map_err(|e| format!("解析应用设置失败: {}", e))
    }

    fn save(app: &AppHandle, settings: &AppSettings) -> Result<(), String> {
        let path = Self::path(app)?;
        let content = serde_json::to_string_pretty(settings).map_err(|e| format!("序列化应用设置失败: {}", e))?;
        fs::write(path, content).map_err(|e| format!("保存应用设置失败: {}", e))
    }

    fn path(app: &AppHandle) -> Result<std::path::PathBuf, String> {
        let data_dir = app.path().home_dir().map_err(|e| format!("获取用户目录失败: {}", e))?.join(".keycast-windows");
        fs::create_dir_all(&data_dir).map_err(|e| format!("创建数据目录失败: {}", e))?;
        Ok(data_dir.join(APP_SETTINGS_FILE))
    }
}

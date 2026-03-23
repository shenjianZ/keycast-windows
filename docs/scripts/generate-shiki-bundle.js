import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, "..")
const CONFIG_DIR = path.join(ROOT_DIR, "public", "config")
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "generated", "shiki-bundle.ts")

const DEFAULT_LANGS = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "bash",
  "shell",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "sql",
  "json",
  "yaml",
  "toml",
  "markdown",
  "html",
  "css",
  "scss",
  "less",
  "vue",
  "svelte",
  "docker",
  "nginx",
  "xml",
  "diff",
  "regex",
]

const LANG_ALIAS_MAP = {
  js: "javascript",
  ts: "typescript",
  sh: "shell",
  shell: "bash",
  yml: "yaml",
  md: "markdown",
  rb: "ruby",
  py: "python",
  dockerfile: "docker",
  conf: "nginx",
}

function resolveLang(lang) {
  if (!lang) return null
  const normalized = String(lang).trim().toLowerCase()
  if (!normalized) return null
  return LANG_ALIAS_MAP[normalized] || normalized
}

function readYamlConfig(fileName) {
  const filePath = path.join(CONFIG_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    return null
  }

  return yaml.load(fs.readFileSync(filePath, "utf8"))
}

function collectBundleConfig() {
  const configs = ["site.yaml", "site.en.yaml"]
    .map(readYamlConfig)
    .filter(Boolean)

  const langs = new Set()
  const themes = new Set()

  for (const config of configs) {
    const configuredLangs = config?.codeHighlight?.langs
    const sourceLangs = Array.isArray(configuredLangs) && configuredLangs.length > 0
      ? configuredLangs
      : DEFAULT_LANGS

    for (const lang of sourceLangs) {
      const resolved = resolveLang(lang)
      if (resolved) {
        langs.add(resolved)
      }
    }

    const lightTheme = String(
      config?.codeHighlight?.lightTheme || "github-light"
    ).trim()
    const darkTheme = String(
      config?.codeHighlight?.darkTheme || "github-dark"
    ).trim()

    if (lightTheme) themes.add(lightTheme)
    if (darkTheme) themes.add(darkTheme)
  }

  if (langs.size === 0) {
    DEFAULT_LANGS.forEach(lang => langs.add(resolveLang(lang)))
  }

  if (themes.size === 0) {
    themes.add("github-light")
    themes.add("github-dark")
  }

  return {
    langs: Array.from(langs).sort(),
    themes: Array.from(themes).sort(),
  }
}

function toObjectEntries(values, basePath) {
  return values
    .map(value => `    ${JSON.stringify(value)}: () => import(${JSON.stringify(`${basePath}/${value}`)}),`)
    .join("\n")
}

function generateFileContent(bundleConfig) {
  return `export const siteShikiBundle = {
  langs: {
${toObjectEntries(bundleConfig.langs, "shiki/langs")}
  },
  themes: {
${toObjectEntries(bundleConfig.themes, "shiki/themes")}
  },
}
`
}

function main() {
  const bundleConfig = collectBundleConfig()
  const fileContent = generateFileContent(bundleConfig)

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8")

  console.log(
    `[shiki-bundle] generated ${path.relative(ROOT_DIR, OUTPUT_FILE)} with ${bundleConfig.langs.length} languages and ${bundleConfig.themes.length} themes`
  )
}

main()

import fs from "node:fs/promises"
import path from "node:path"

const rootDir = process.cwd()
const publicDir = path.join(rootDir, "public")

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) return { data: {}, content: source }
  const endIndex = source.indexOf("\n---\n", 4)
  if (endIndex === -1) return { data: {}, content: source }
  const raw = source.slice(4, endIndex)
  const data = {}
  for (const line of raw.split("\n")) {
    const index = line.indexOf(":")
    if (index <= 0) continue
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^["']|["']$/g, "")
  }
  return { data, content: source.slice(endIndex + 5).trim() }
}

function compareVersionsDesc(leftVersion, rightVersion) {
  const leftParts = String(leftVersion || "").replace(/^[^\d]*/, "").split(/[^0-9]+/).filter(Boolean).map(Number)
  const rightParts = String(rightVersion || "").replace(/^[^\d]*/, "").split(/[^0-9]+/).filter(Boolean).map(Number)
  const length = Math.max(leftParts.length, rightParts.length)
  for (let index = 0; index < length; index += 1) {
    const diff = (rightParts[index] || 0) - (leftParts[index] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

async function buildIndex(lang) {
  const changelogDir = path.join(publicDir, "docs", lang, "changelog")
  const files = (await fs.readdir(changelogDir, { withFileTypes: true }))
    .filter(entry => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
    .map(entry => path.join(changelogDir, entry.name))
  const items = await Promise.all(files.map(async (file) => {
    const { data, content } = parseFrontmatter(await fs.readFile(file, "utf8"))
    const slug = path.basename(file).replace(/\.(md|mdx)$/i, "")
    return {
      slug,
      title: data.title || data.version || slug,
      version: data.version || slug,
      date: data.date || "",
      summary: data.summary || content.slice(0, 140),
      type: data.type || "release",
      breaking: data.breaking === "true",
      draft: data.draft === "true",
      path: `/${lang}/changelog/${slug}`,
    }
  }))
  return items.filter(item => !item.draft).sort((a, b) => {
    const dateDiff = Date.parse(b.date || "") - Date.parse(a.date || "")
    if (dateDiff !== 0) return dateDiff
    const versionDiff = compareVersionsDesc(a.version, b.version)
    return versionDiff !== 0 ? versionDiff : a.slug.localeCompare(b.slug)
  })
}

for (const lang of ["zh-cn", "en"]) {
  const items = await buildIndex(lang)
  await fs.writeFile(path.join(publicDir, `changelog-index-${lang}.json`), `${JSON.stringify({ lang, items }, null, 2)}\n`, "utf8")
  console.log(`[changelog] Generated public/changelog-index-${lang}.json (${items.length} items)`)
}

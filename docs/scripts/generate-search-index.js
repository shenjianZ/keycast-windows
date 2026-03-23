import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const DOCS_DIR = path.join(PUBLIC_DIR, 'docs')

const SEARCH_INDEX_VERSION = '2.0.0'

function isChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text)
}

function tokenize(text) {
  if (!text) return []
  
  const tokens = []
  const parts = text.split(/(\s+|[，。！？、；：""''（）【】《》\n\r]+)/)
  
  for (const part of parts) {
    if (!part.trim()) continue
    
    if (isChinese(part)) {
      const chars = part.split('')
      for (let i = 0; i < chars.length - 1; i++) {
        tokens.push(chars[i] + chars[i + 1])
      }
      tokens.push(...chars.filter(c => c.trim()))
    } else {
      const words = part.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(w => w.length > 0)
      tokens.push(...words)
    }
  }
  
  return [...new Set(tokens)]
}

function parseFrontmatter(content) {
  const lines = content.split('\n')
  const data = {}
  let contentStart = 0
  
  if (lines[0]?.startsWith('---')) {
    let i = 1
    while (i < lines.length && !lines[i]?.startsWith('---')) {
      const line = lines[i]
      const colonIndex = line?.indexOf(':') ?? -1
      if (colonIndex > 0 && line) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        data[key] = value
      }
      i++
    }
    if (i < lines.length && lines[i]?.startsWith('---')) {
      contentStart = i + 1
    }
  }
  
  return {
    data,
    content: lines.slice(contentStart).join('\n')
  }
}

function cleanContent(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#*`_~>|]/g, '')
    .replace(/\$\$?[^$]+\$\$?/g, '')
    .trim()
}

function extractTextContent(node) {
  if (!node || typeof node !== 'object') return ''
  
  if (node.type === 'text') {
    return node.value || ''
  }
  
  if (node.type === 'inlineCode') {
    return `\`${node.value}\``
  }
  
  if ('children' in node && Array.isArray(node.children)) {
    return node.children.map(extractTextContent).join(' ')
  }
  
  return ''
}

async function parseMarkdown(content) {
  const { unified } = await import('unified')
  const remarkParse = (await import('remark-parse')).default
  const remarkGfm = (await import('remark-gfm')).default
  
  const { data: frontmatter, content: markdownContent } = parseFrontmatter(content)
  
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
  
  const tree = processor.parse(markdownContent)
  
  const title = frontmatter.title || ''
  const sections = []
  
  let currentSection = null
  let contentParts = []
  
  const saveCurrentSection = () => {
    if (currentSection && contentParts.length > 0) {
      currentSection.content = cleanContent(contentParts.join(' '))
      sections.push(currentSection)
    }
    contentParts = []
  }
  
  for (const node of tree.children) {
    if (node.type === 'heading') {
      saveCurrentSection()
      
      const headingTitle = extractTextContent(node)
      const anchor = headingTitle
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      currentSection = {
        title: headingTitle,
        anchor,
        content: '',
        level: node.depth,
      }
    } else if (currentSection) {
      if (node.type === 'paragraph') {
        const text = extractTextContent(node)
        if (text) contentParts.push(text)
      } else if ('children' in node) {
        const text = extractTextContent(node)
        if (text) contentParts.push(text)
      }
    }
  }
  
  saveCurrentSection()
  
  return { title, sections }
}

function scanDocsDirectory(docsDir, baseDir, lang, results = []) {
  if (!fs.existsSync(docsDir)) return results
  
  const entries = fs.readdirSync(docsDir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(docsDir, entry.name)
    
    if (entry.isDirectory()) {
      scanDocsDirectory(fullPath, baseDir, lang, results)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)
      if (['.md', '.mdx'].includes(ext)) {
        const relativePath = path.relative(baseDir, fullPath)
        results.push({ filePath: fullPath, relativePath, lang })
      }
    }
  }
  
  return results
}

async function generateSearchIndex(lang) {
  console.log(`Generating search index for language: ${lang}`)
  
  const docsLangDir = path.join(DOCS_DIR, lang)
  const files = scanDocsDirectory(docsLangDir, path.join(PUBLIC_DIR, 'docs'), lang)
  
  const sections = []
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file.filePath, 'utf-8')
      const docPath = file.relativePath
        .replace(new RegExp(`^${lang}[/\\\\]`), '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/[/\\]index$/, '')
      
      const parsed = await parseMarkdown(content)
      
      for (const section of parsed.sections) {
        const id = docPath.replace(/[\/\\]/g, '-') + (section.anchor ? `--${section.anchor}` : '')
        const url = `/${lang}/${docPath}` + (section.anchor ? `#${section.anchor}` : '')
        
        const truncatedContent = section.content.length > 300 
          ? section.content.slice(0, 300) + '...' 
          : section.content
        
        const allTokens = tokenize(`${section.title} ${section.content}`)
        
        sections.push({
          id,
          pageTitle: parsed.title,
          sectionTitle: section.title,
          content: truncatedContent,
          url,
          lang,
          tokens: allTokens,
        })
      }
    } catch (error) {
      console.warn(`Failed to process ${file.filePath}:`, error.message)
    }
  }
  
  return {
    version: SEARCH_INDEX_VERSION,
    generatedAt: Date.now(),
    lang,
    sections,
  }
}

async function main() {
  console.log('Starting search index generation...')
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('Docs directory not found:', DOCS_DIR)
    process.exit(1)
  }
  
  const entries = fs.readdirSync(DOCS_DIR, { withFileTypes: true })
  const langs = entries.filter(e => e.isDirectory()).map(e => e.name)
  
  console.log('Found languages:', langs.join(', '))
  
  for (const lang of langs) {
    const index = await generateSearchIndex(lang)
    const outputPath = path.join(PUBLIC_DIR, `search-index-${lang}.json`)
    
    fs.writeFileSync(outputPath, JSON.stringify(index))
    console.log(`Generated: ${outputPath} (${index.sections.length} sections)`)
  }
  
  console.log('Search index generation complete!')
}

main().catch(error => {
  console.error('Error generating search index:', error)
  process.exit(1)
})

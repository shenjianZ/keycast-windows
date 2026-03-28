import path from "node:path";
import fs from "node:fs/promises";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");

function stripFrontmatter(source) {
    if (!source.startsWith("---\n")) return source;
    const endIndex = source.indexOf("\n---\n", 4);
    return endIndex === -1 ? source : source.slice(endIndex + 5);
}

async function collectDocFiles(dir, results = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await collectDocFiles(fullPath, results);
        } else if (/\.(md|mdx)$/i.test(entry.name)) {
            results.push(fullPath);
        }
    }
    return results;
}

async function main() {
    const files = await collectDocFiles(path.join(publicDir, "docs"));
    const docs = await Promise.all(
        files.map(async file => {
            const relative = path.relative(rootDir, file).replace(/\\/g, "/");
            const urlPath = relative
                .replace(/^public\/docs\//, "")
                .replace(/\.(md|mdx)$/i, "");
            const content = stripFrontmatter(await fs.readFile(file, "utf8")).trim();
            return { relative, urlPath, content };
        }),
    );

    const llms = docs.map(doc => `- /${doc.urlPath} | ${doc.relative}`).join("\n");
    const llmsFull = docs.map(doc => `# /${doc.urlPath}\n\n${doc.content}`).join("\n\n");

    await fs.writeFile(path.join(publicDir, "llms.txt"), `${llms}\n`, "utf8");
    await fs.writeFile(path.join(publicDir, "llms-full.txt"), `${llmsFull}\n`, "utf8");
    console.log(`[llms] Generated public/llms.txt, public/llms-full.txt (${docs.length} docs)`);
}

main().catch(error => {
    console.error("[llms] Failed:", error);
    process.exitCode = 1;
});

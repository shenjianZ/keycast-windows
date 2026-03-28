import { promisify } from "node:util";
import { execFile } from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "doc-git-meta.json");

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

async function getGitValue(args, cwd = rootDir) {
    try {
        const { stdout } = await execFileAsync("git", args, { cwd });
        return stdout.trim();
    } catch {
        return "";
    }
}

async function main() {
    const repoRoot =
        (await getGitValue(["rev-parse", "--show-toplevel"], rootDir)) || rootDir;
    const files = await collectDocFiles(path.join(publicDir, "docs"));

    const entries = [];
    for (const file of files) {
        const gitRelativePath = path.relative(repoRoot, file).replace(/\\/g, "/");
        const outputRelativePath = path.relative(rootDir, file).replace(/\\/g, "/");
        const [lastUpdated, author] = await Promise.all([
            getGitValue(["log", "-1", "--format=%cI", "--", gitRelativePath], repoRoot),
            getGitValue(["log", "-1", "--format=%an", "--", gitRelativePath], repoRoot),
        ]);
        entries.push({
            relativePath: outputRelativePath,
            meta: { lastUpdated: lastUpdated || undefined, author: author || undefined },
        });
    }

    const docMeta = Object.fromEntries(
        entries.filter(({ meta }) => meta.lastUpdated || meta.author).map(({ relativePath, meta }) => [relativePath, meta])
    );
    const payload = { generatedAt: new Date().toISOString(), files: docMeta };
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`[doc-git-meta] Generated public/doc-git-meta.json (${Object.keys(docMeta).length} entries)`);
}

main().catch((error) => {
    console.error("[doc-git-meta] Failed:", error);
    process.exitCode = 1;
});

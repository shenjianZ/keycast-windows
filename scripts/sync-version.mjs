import { readFileSync, writeFileSync } from "node:fs";

const version = process.argv[2]?.trim();

if (!version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) {
  console.error("用法: pnpm version:sync 0.1.1");
  process.exit(1);
}

const files = [
  ["package.json", [[/"version":\s*"[^"]+"/, `"version": "${version}"`]]],
  ["src-tauri/tauri.conf.json", [[/"version":\s*"[^"]+"/, `"version": "${version}"`]]],
  ["src-tauri/Cargo.toml", [[/^version = "[^"]+"/m, `version = "${version}"`]]],
  [
    "src/use-app-model.ts",
    [
      [/currentVersion: "[^"]+"/, `currentVersion: "${version}"`],
      [
        /const \[version, setVersion\] = useState\("[^"]+"\);/,
        `const [version, setVersion] = useState("${version}");`,
      ],
      [/setVersion\("[^"]+"\)/, `setVersion("${version}")`],
      [
        /setUpdateState\(\(current\) => \(\{ \.\.\.current, currentVersion: "[^"]+" \}\)\);/,
        `setUpdateState((current) => ({ ...current, currentVersion: "${version}" }));`,
      ],
    ],
  ],
];

for (const [file, replacements] of files) {
  let content = readFileSync(file, "utf8");
  for (const [pattern, next] of replacements) {
    if (!pattern.test(content)) {
      console.error(`未找到可替换版本号: ${file}`);
      process.exit(1);
    }
    content = content.replace(pattern, next);
  }
  writeFileSync(file, content);
  console.log(`已更新 ${file} -> ${version}`);
}

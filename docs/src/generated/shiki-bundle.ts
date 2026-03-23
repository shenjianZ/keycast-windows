export const siteShikiBundle = {
  langs: {
    "bash": () => import("shiki/langs/bash"),
    "javascript": () => import("shiki/langs/javascript"),
    "json": () => import("shiki/langs/json"),
    "jsx": () => import("shiki/langs/jsx"),
    "markdown": () => import("shiki/langs/markdown"),
    "powershell": () => import("shiki/langs/powershell"),
    "rust": () => import("shiki/langs/rust"),
    "tsx": () => import("shiki/langs/tsx"),
    "typescript": () => import("shiki/langs/typescript"),
    "yaml": () => import("shiki/langs/yaml"),
  },
  themes: {
    "github-dark": () => import("shiki/themes/github-dark"),
    "github-light": () => import("shiki/themes/github-light"),
  },
}

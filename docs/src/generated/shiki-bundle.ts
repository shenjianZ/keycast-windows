export const siteShikiBundle = {
  langs: {
    "bash": () => import("shiki/langs/bash"),
    "powershell": () => import("shiki/langs/powershell"),
  },
  themes: {
    "github-dark": () => import("shiki/themes/github-dark"),
    "github-light": () => import("shiki/themes/github-light"),
  },
}

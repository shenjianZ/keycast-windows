import { Buffer } from "buffer";
window.Buffer = Buffer;

import React from "react";
import ReactDOM from "react-dom/client";

import "react-docs-ui/style.css";
import { DocsApp, preloadDocsRuntime } from "react-docs-ui/docs-app";
// import "../../../react-docs-ui/dist/react-docs-ui.css";
// @ts-ignore using local built ES module for development
// import { DocsApp, preloadDocsRuntime } from "../../../react-docs-ui/dist/docs-app.es.js";
import { siteShikiBundle } from "./generated/shiki-bundle";

preloadDocsRuntime();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <DocsApp shikiBundle={siteShikiBundle} />
    </React.StrictMode>,
);

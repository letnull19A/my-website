import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSR-режим: Node-сервер (`next start`), Docker-образ на базе standalone.
  // Статического экспорта (`output: "export"`) больше нет.
  output: "standalone",
  sassOptions: {
    // Современный SCSS API — @use / @forward, без legacy @import
    // includePaths позволяет писать `@use "variables"` вместо `@use "@/styles/variables"`
    includePaths: ["./src/styles", "./src"],
    silenceDeprecations: ["legacy-js-api", "import", "color-4-api"],
  },
};

export default nextConfig;

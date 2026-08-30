import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Статический экспорт на GitHub Pages не имеет Node-сервера для
    // серверной оптимизации изображений, поэтому unoptimized задан глобально.
    unoptimized: true,
  },
  sassOptions: {
    // Современный SCSS API — @use / @forward, без legacy @import
    // includePaths позволяет писать `@use "variables"` вместо `@use "@/styles/variables"`
    includePaths: ["./src/styles", "./src"],
    silenceDeprecations: ["legacy-js-api", "import", "color-4-api"],
  },
};

export default nextConfig;

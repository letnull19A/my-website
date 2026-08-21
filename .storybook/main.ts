import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
  addons: [],
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    config.css ??= {};
    config.css.preprocessorOptions ??= {};
    // @ts-expect-error — vite types allow index signature
    config.css.preprocessorOptions.scss = {
      // Дублирует sassOptions.includePaths из next.config.ts для Storybook/Vite
      includePaths: ["src/styles", "src"],
      silenceDeprecations: ["legacy-js-api", "import", "color-4-api"],
    };
    return config;
  },
};

export default config;

import type { Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";
import "../src/styles/main.scss";

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0C0D0A" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  initialGlobals: {
    backgrounds: { value: "dark" },
  },
};

export default preview;

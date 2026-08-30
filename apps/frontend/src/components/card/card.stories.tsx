import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./card";

const meta: Meta<typeof Card> = {
  title: "Components/Card (SCSS Module)",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    highlighted: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: "SCSS-модуль",
    description:
      "Карточка на современном SCSS (Dart Sass 1.103, @use/@forward). Демонстрирует миксины, вложенность и адаптив.",
    badge: "SCSS",
  },
};

export const Highlighted: Story = {
  args: {
    title: "Выделенная карточка",
    description: "Модификатор --highlighted через SCSS & и CSS-переменные темы.",
    badge: "New",
    highlighted: true,
  },
};

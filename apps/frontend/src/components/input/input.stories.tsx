import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    type: { control: "select", options: ["text", "password", "email", "number"] },
  },
  args: {
    placeholder: "Enter text...",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => <Input {...args} className="w-64" />,
};

export const Disabled: Story = {
  render: () => <Input placeholder="Disabled" disabled className="w-64" />,
};

export const WithValue: Story = {
  render: () => <Input defaultValue="Hello world" className="w-64" />,
};

export const Invalid: Story = {
  render: () => <Input defaultValue="invalid" aria-invalid className="w-64" />,
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      <Input placeholder="text" type="text" />
      <Input placeholder="password" type="password" />
      <Input placeholder="email@example.com" type="email" />
      <Input placeholder="123" type="number" />
    </div>
  ),
};

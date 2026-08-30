import type { Meta, StoryObj } from "@storybook/nextjs-vite";

// Only for Storybook — not a site component.
type Token = { name: string; varName: string; value: string };

const TOKENS: Token[] = [
  // custom figma palette
  { name: "lime", varName: "--lime", value: "#9AD000" },
  { name: "lime-light", varName: "--lime-light", value: "#E1FF8C" },
  { name: "lime-soft", varName: "--lime-soft", value: "#CAF05F" },
  { name: "green-dark", varName: "--green-dark", value: "#005803" },
  { name: "green-mid", varName: "--green-mid", value: "#519528" },
  { name: "green-deep", varName: "--green-deep", value: "#243000" },
  { name: "surface", varName: "--surface", value: "#141414" },
  { name: "surface-alt", varName: "--surface-alt", value: "#102211" },
  // shadcn mapping
  { name: "background", varName: "--background", value: "#0C0D0A" },
  { name: "foreground", varName: "--foreground", value: "#FFFFFF" },
  { name: "card", varName: "--card", value: "#141414" },
  { name: "card-foreground", varName: "--card-foreground", value: "#FFFFFF" },
  { name: "popover", varName: "--popover", value: "#141414" },
  { name: "popover-foreground", varName: "--popover-foreground", value: "#FFFFFF" },
  { name: "primary", varName: "--primary", value: "#9AD000" },
  { name: "primary-foreground", varName: "--primary-foreground", value: "#005803" },
  { name: "secondary", varName: "--secondary", value: "#141414" },
  { name: "secondary-foreground", varName: "--secondary-foreground", value: "#E1FF8C" },
  { name: "muted", varName: "--muted", value: "#1A1D1A" },
  { name: "muted-foreground", varName: "--muted-foreground", value: "#8A8F8A" },
  { name: "accent", varName: "--accent", value: "#E1FF8C" },
  { name: "accent-foreground", varName: "--accent-foreground", value: "#005803" },
  { name: "destructive", varName: "--destructive", value: "#FF3B30" },
  { name: "border", varName: "--border", value: "#454645" },
  { name: "input", varName: "--input", value: "#454645" },
  { name: "ring", varName: "--ring", value: "#9AD000" },
  { name: "chart-1", varName: "--chart-1", value: "#9AD000" },
  { name: "chart-2", varName: "--chart-2", value: "#CAF05F" },
  { name: "chart-3", varName: "--chart-3", value: "#519528" },
  { name: "chart-4", varName: "--chart-4", value: "#005803" },
  { name: "chart-5", varName: "--chart-5", value: "#E1FF8C" },
  { name: "sidebar", varName: "--sidebar", value: "#0B0C09" },
  { name: "sidebar-foreground", varName: "--sidebar-foreground", value: "#FFFFFF" },
  { name: "sidebar-primary", varName: "--sidebar-primary", value: "#9AD000" },
  { name: "sidebar-primary-foreground", varName: "--sidebar-primary-foreground", value: "#005803" },
  { name: "sidebar-accent", varName: "--sidebar-accent", value: "#141414" },
  { name: "sidebar-accent-foreground", varName: "--sidebar-accent-foreground", value: "#E1FF8C" },
  { name: "sidebar-border", varName: "--sidebar-border", value: "#454645" },
  { name: "sidebar-ring", varName: "--sidebar-ring", value: "#9AD000" },
];

function Swatch({ token }: { token: Token }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
      <div
        className="h-20 w-full rounded-lg border border-border"
        style={{ background: `var(${token.varName})` }}
        title={token.value}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{token.name}</span>
        <span className="text-xs text-muted-foreground">{token.varName}</span>
        <span className="text-xs font-mono text-muted-foreground">{token.value}</span>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Design Tokens/Palette",
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Grid: Story = {
  render: () => (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Цветовая палитра токенов
          </h1>
          <p className="text-sm text-muted-foreground">
            Токены из <code className="rounded bg-muted px-1 py-0.5">src/app/globals.css</code> — dark-only (
            #0C0D0A). Сетка для Storybook, не компонент сайта.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {TOKENS.map((t) => (
            <Swatch key={t.varName} token={t} />
          ))}
        </div>
      </div>
    </div>
  ),
};

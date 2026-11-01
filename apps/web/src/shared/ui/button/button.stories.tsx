import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button.js";

const meta = {
  title: "Design System/Button",
  component: Button,
  args: {
    children: "Get started",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "tonal", "outlined", "text"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    fullWidth: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    variant: "filled",
  },
};

export const Tonal: Story = {
  args: {
    variant: "tonal",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
  },
};

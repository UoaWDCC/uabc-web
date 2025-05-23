import type { Meta, StoryObj } from "@storybook/react"
import { Image } from "."

const meta: Meta<typeof Image> = {
  title: "Components / Image",
  component: Image,
  argTypes: {
    src: {
      control: "text",
      description: "Image source (URL, static import, or path)",
      table: { type: { summary: "string | StaticImport" } },
    },
    alt: {
      control: "text",
      description: "Alternative text for the image",
      table: { type: { summary: "string" } },
    },
    width: {
      control: "number",
      description: "Width of the image (px)",
      table: { type: { summary: "number" } },
    },
    height: {
      control: "number",
      description: "Height of the image (px)",
      table: { type: { summary: "number" } },
    },
  },
  args: {
    src: "https://placehold.co/300x200/png",
    alt: "Placeholder image",
    width: 300,
    height: 200,
  },
}

export default meta

type Story = StoryObj<typeof Image>

export const Basic: Story = {
  args: {
    src: "https://placehold.co/300x200/png",
    alt: "Placeholder image",
    width: 300,
    height: 200,
  },
}

export const RemoteImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600",
    alt: "Unsplash example",
    width: 600,
    height: 400,
  },
}

export const Fallback: Story = {
  args: {
    src: "https://not-a-real-image-url.com/404.png",
    fallback: "https://placehold.co/128x128?text=Fallback",
    alt: "Fallback image",
    width: 128,
    height: 128,
  },
}

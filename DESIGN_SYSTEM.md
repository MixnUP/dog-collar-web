# Dog Collar App Design System

This document outlines the design system for the Dog Collar application, ensuring consistency in UI/UX across the project. It is based on the analysis of the existing codebase, including styles, components, and dependencies.

## 1. Core Technologies

The design system is built upon a modern frontend stack:

- **Framework:** React
- **Styling:** Tailwind CSS
- **UI Primitives:** Radix UI (via `shadcn/ui` conventions)
- **Icons:** Lucide React
- **Animation:** `tw-animate-css`

## 2. Typography

We use a combination of three fonts to create a clear visual hierarchy.

- **Headings:** `Plus Jakarta Sans` is used for all heading levels (`h1` to `h6`) to provide a clean, modern look.
- **Body Text:** `Inter` is the primary font for all paragraph and body content, chosen for its excellent readability.
- **Monospace/Code:** `JetBrains Mono` is used for code snippets, keyboard inputs, and other monospaced text needs.

### Font Usage

```css
body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

code, kbd, pre, samp, .font-mono {
  font-family: 'JetBrains Mono', monospace;
}
```

## 3. Color System

The application features a dark theme by default, with a light theme variant available. Colors are managed via CSS custom properties for easy theming and consistency.

### Dark Theme (Default)

| Variable Name              | Hex Value        | Description                               |
| -------------------------- | ---------------- | ----------------------------------------- |
| `--background`             | `#060A12`        | Dark blue-gray base                       |
| `--foreground`             | `#E8F0F8`        | Light blue-tinted text                    |
| `--card`                   | `#0C1420`        | Dark blue card background                 |
| `--primary`                | `#1E6BC9`        | Vibrant blue for interactive elements     |
| `--primary-foreground`     | `#F8FBFF`        | Text on primary-colored elements          |
| `--secondary`              | `#1A4B8C`        | Deep blue for secondary elements          |
| `--muted`                  | `#1A2435`        | Dark blue-gray for muted content          |
| `--muted-foreground`       | `#A0B4D0`        | Text for muted content                    |
| `--accent`                 | `#2A3A5C`        | Blue-tinted dark gray for accents         |
| `--destructive`            | `#D34545`        | Warmer red for destructive actions        |
| `--border`                 | `rgba(140,170,200,0.3)` | Blue-tinted borders               |
| `--ring`                   | `#3A8AEA`        | Bright blue focus ring                    |

### Light Theme

| Variable Name              | Hex Value        | Description                               |
| -------------------------- | ---------------- | ----------------------------------------- |
| `--background`             | `#F0F6FF`        | Light blue-tinted background              |
| `--foreground`             | `#050F1A`        | Dark blue-tinted text                     |
| `--card`                   | `#FFFFFF`        | Pure white cards                          |
| `--primary`                | `#1A5A9E`        | Rich blue for interactive elements        |
| `--secondary`              | `#1E6BC9`        | Brighter blue for secondary elements      |
| `--muted`                  | `#D0E0F0`        | Light blue-tinted for muted content       |
| `--destructive`            | `#C53030`        | Warmer red for destructive actions        |
| `--border`                 | `rgba(10,30,60,0.15)` | Blue-tinted borders                   |
| `--ring`                   | `#1E6BC9`        | Blue focus ring                           |

## 4. Sizing and Spacing

- **Spacing:** Follows Tailwind's default spacing scale (multiples of `0.25rem`).
- **Border Radius:** A consistent border-radius is applied using CSS variables.
  - `--radius: 0.5rem` (base)
  - `--radius-sm: calc(var(--radius) - 4px)`
  - `--radius-md: calc(var(--radius) - 2px)`
  - `--radius-lg: var(--radius)`
  - `--radius-xl: calc(var(--radius) + 4px)`

## 5. Iconography

**Lucide React** is the official icon library. Icons should be used to enhance visual communication and draw attention to interactive elements.

- **Size:** Default size should be `h-4 w-4` or `h-6 w-6` depending on the context.
- **Usage Example:**
  ```tsx
  import { Download, List } from "lucide-react";

  // In a button
  <Button>
    <Download className="mr-2 h-4 w-4" />
    Export
  </Button>

  // In a card title
  <CardTitle className="flex items-center gap-2">
    <List className="h-6 w-6" />
    <span>Data Table</span>
  </CardTitle>
  ```

## 6. Component Library

The application uses a set of reusable components located in `src/components/ui`.

### Card

The `Card` component is a versatile container for grouping related content. It is the primary building block for layout sections.

- **Anatomy:** `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Styling:** Uses `--card` for background and `--border` for the border. A `backdrop-blur-sm` effect is often applied for a semi-transparent look.
- **Usage Example:**
  ```tsx
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { BarChart3 } from "lucide-react";

  <Card className="bg-card border-border backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <span>Main Graph</span>
      </CardTitle>
      <CardDescription>
        A visual representation of the data.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* ... content ... */}
    </CardContent>
  </Card>
  ```

### Button

The `Button` component is used for all interactive actions.

- **Styling:** Uses `bg-primary` and `text-primary-foreground` by default.
- **Usage Example:**
  ```tsx
  import { Button } from "@/components/ui/button";
  import { Download } from "lucide-react";

  <Button onClick={handleExport} disabled={isExporting}>
    <Download className="mr-2 h-4 w-4" />
    {isExporting ? "Exporting..." : "Export to CSV"}
  </Button>
  ```

### Table

The `Table` component is used for displaying tabular data.

- **Anatomy:** `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`.
- **Styling:**
  - `TableHeader` has a `bg-secondary` background.
  - `TableHead` text is `text-primary-foreground`.
  - `TableRow` borders use `border-border/50`.
- **Usage Example:**
  ```tsx
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  <Table>
    <TableHeader className="bg-secondary">
      <TableRow className="border-border/50">
        <TableHead className="text-primary-foreground">Person</TableHead>
        <TableHead className="text-primary-foreground">Visits</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow className="border-border/50">
        <TableCell className="font-medium">Person A</TableCell>
        <TableCell>12</TableCell>
      </TableRow>
    </TableBody>
  </Table>
  ```

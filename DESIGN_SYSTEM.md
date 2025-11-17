# Dog Collar Design System

## Colors

### Theme Colors

#### Dark Theme (Default)
- **Background**
  - Base: `#060A12`
  - Card: `#0C1420`
  - Popover: `#101A2A`
  - Muted: `#1A2435`
  - Accent: `#2A3A5C`

- **Text**
  - Primary: `#E8F0F8`
  - Muted: `#A0B4D0`

- **Interactive**
  - Primary: `#1E6BC9`
  - Primary Hover: `#3A8AEA`
  - Secondary: `#1A4B8C`
  - Accent: `#2A3A5C`
  - Destructive: `#D34545`

- **Borders & Inputs**
  - Border: `rgba(140, 170, 200, 0.3)`
  - Input: `rgba(140, 170, 200, 0.3)`
  - Ring: `#3A8AEA`

#### Light Theme
- **Background**
  - Base: `#F0F6FF`
  - Card: `#FFFFFF`
  - Muted: `#D0E0F0`
  - Accent: `#E8F0FF`

- **Text**
  - Primary: `#050F1A`
  - Muted: `#2A4A6A`

- **Interactive**
  - Primary: `#1A5A9E`
  - Primary Hover: `#1E6BC9`
  - Secondary: `#1E6BC9`
  - Accent: `#E8F0FF`
  - Destructive: `#C53030`

- **Borders & Inputs**
  - Border: `rgba(10, 30, 60, 0.15)`
  - Input: `rgba(10, 30, 60, 0.15)`
  - Ring: `#1E6BC9`

### Chart Colors
- Chart 1: `#1E8AC9` (Blue)
- Chart 2: `#D4A020` (Amber)
- Chart 3: `#D34545` (Red)
- Chart 4: `#2A5A9E` (Blue)
- Chart 5: `#5A6BC9` (Periwinkle)

### Status Colors
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`
- Info: `#3A8AEA` (Using primary blue for consistency)

## Typography

### Font Families
- **Heading**: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
- **Body**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Mono**: `'JetBrains Mono', 'Roboto Mono', monospace`

### Type Scale
- **Display**: `3rem` (48px)
- **H1**: `2.25rem` (36px)
- **H2**: `1.8rem` (28.8px)
- **H3**: `1.5rem` (24px)
- **H4**: `1.25rem` (20px)
- **Body**: `1rem` (16px)
- **Small**: `0.875rem` (14px)
- **Label**: `0.8rem` (12.8px)

### Responsive Typography
*Note: Font sizes scale based on viewport width for better readability across devices.*

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing
- `0`: 0
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `5`: 1.25rem (20px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `10`: 2.5rem (40px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)
- `20`: 5rem (80px)
- `24`: 6rem (96px)

## Border Radius
- `none`: 0
- `sm`: 0.125rem (2px)
- `DEFAULT`: 0.25rem (4px)
- `md`: 0.375rem (6px)
- `lg`: 0.5rem (8px)
- `xl`: 0.75rem (12px)
- `2xl`: 1rem (16px)
- `full`: 9999px

## Shadows
- `sm`: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- `DEFAULT`: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- `md`: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- `lg`: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- `xl`: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)

## Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components as the foundation for its UI. These components are built on top of [Radix UI](https://www.radix-ui.com/) and styled with Tailwind CSS.

### Customizing shadcn/ui Components
- All shadcn/ui components are located in `src/components/ui/`
- To modify a component's styles, edit its corresponding `.tsx` file
- Component variants can be customized in `tailwind.config.js`
- Follow the [shadcn/ui documentation](https://ui.shadcn.com/docs) for adding new components

### Component Guidelines
1. Use shadcn/ui components as the base
2. Extend or customize components using the `className` prop
3. Maintain consistent spacing and theming
4. Follow accessibility best practices
5. Document any custom props or variants


### Buttons
```tsx
// Primary Button
<Button variant="default">Click me</Button>

// Secondary Button
<Button variant="secondary">Click me</Button>

// Outline Button
<Button variant="outline">Click me</Button>

// Ghost Button
<Button variant="ghost">Click me</Button>

// Link Button
<Button variant="link">Click me</Button>
```

### Inputs
```tsx
<Input placeholder="Enter your email" />
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

## Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Z-Index Scale
- `0`: 0
- `10`: 10
- `20`: 20
- `30`: 30
- `40`: 40
- `50`: 50
- `auto`: auto

## Animation
### Duration
- `75`: 75ms
- `100`: 100ms
- `150`: 150ms
- `200`: 200ms
- `300`: 300ms
- `500`: 500ms
- `700`: 700ms
- `1000`: 1000ms

### Easing
- `DEFAULT`: cubic-bezier(0.4, 0, 0.2, 1)
- `linear`: linear
- `in`: cubic-bezier(0.4, 0, 1, 1)
- `out`: cubic-bezier(0, 0, 0.2, 1)
- `in-out`: cubic-bezier(0.4, 0, 0.2, 1)

## Icons
We use [Lucide](https://lucide.dev/) for our icon system.

```tsx
import { Home, Settings, User } from 'lucide-react';

<Home className="h-4 w-4" />
<Settings className="h-4 w-4" />
<User className="h-4 w-4" />
```

## Best Practices
1. Use semantic HTML elements
2. Follow WCAG accessibility guidelines
3. Maintain consistent spacing using the defined scale
4. Use the color palette consistently
5. Follow mobile-first responsive design
6. Test components in different viewports
7. Ensure proper contrast ratios for text
8. Use relative units (rem) for typography
9. Maintain consistent icon sizes
10. Document all new components

## Contributing
1. Follow the existing design patterns
2. Update this document when adding new components or making changes
3. Keep component interfaces consistent
4. Add proper TypeScript types
5. Include proper documentation
6. Test components in different states
7. Ensure accessibility compliance
8. Get design review for visual changes
9. Update relevant documentation when making changes
10. Follow the commit message convention: `type(scope): description`

## Version History
- `1.0.0` - Initial design system implementation

---
*Last updated: November 17, 2025*

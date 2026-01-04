# Navigation Components Documentation

## Overview

The navigation system has been refactored into maintainable, reusable components for better code organization and scalability.

## Components Structure

### 1. **Header.tsx** (Main Component)

The main navbar wrapper component that orchestrates all sub-components.

**Features:**

- Mobile menu toggle state management
- Responsive layout for mobile and desktop
- Integration of all sub-components

### 2. **Logo.tsx**

Reusable logo component with customizable size and text display.

**Props:**

- `size`: "sm" | "md" | "lg" (default: "md")
- `showText`: boolean (default: true)

**Usage:**

```tsx
<Logo size="md" showText={true} />
```

### 3. **SearchBar.tsx**

Product search component with mobile and desktop variants.

**Features:**

- Search form with input field
- Redirects to products page with search query
- Responsive design for mobile and desktop

**Props:**

- `variant`: "desktop" | "mobile" (default: "desktop")

**Usage:**

```tsx
<SearchBar variant="desktop" />
<SearchBar variant="mobile" />
```

### 4. **UserMenu.tsx**

User authentication menu with dropdown for logged-in users.

**Features:**

- Displays login link for guest users
- Shows user avatar and dropdown menu for authenticated users
- Sign out functionality
- Payment history link
- Separate mobile and desktop variants

**Props:**

- `user`: UserData | null
- `variant`: "mobile" | "desktop" (default: "desktop")

**Usage:**

```tsx
<UserMenu user={user} variant="desktop" />
<UserMenu user={user} variant="mobile" />
```

### 5. **CartIcon.tsx**

Shopping cart icon with badge showing item count.

**Features:**

- Displays cart item count
- Automatically updates from Redux store
- Badge only shows when cart has items

**Usage:**

```tsx
<CartIcon />
```

### 6. **NavigationMenu.tsx**

Desktop navigation menu bar with main navigation links.

**Features:**

- Displays: Everything, Women, Men, Accessories, About, Contact Us
- Hidden on mobile devices
- Hover effects and smooth transitions

**Usage:**

```tsx
<NavigationMenu />
```

### 7. **MobileMenuDrawer.tsx**

Slide-in drawer menu for mobile devices.

**Features:**

- Backdrop overlay
- User profile section
- Navigation links organized by category
- Help & Settings section
- Sign out option for logged-in users
- Smooth slide-in/out animation

**Props:**

- `isOpen`: boolean
- `onClose`: () => void
- `user`: UserData | null

**Usage:**

```tsx
<MobileMenuDrawer
  isOpen={isMobileMenuOpen}
  onClose={handleMenuClose}
  user={user}
/>
```

## Configuration File

### **navigation.ts**

Centralized configuration file for all navigation items.

**Exports:**

- `MAIN_NAVIGATION`: Main menu items (Everything, Women, Men, etc.)
- `MOBILE_QUICK_CATEGORIES`: Quick access categories for mobile
- `HELP_LINKS`: Help and support links

**Benefits:**

- Easy to update navigation items in one place
- Type-safe with TypeScript interfaces
- Reusable across multiple components

## Responsive Behavior

### Desktop (lg+)

- Full navigation menu bar visible
- Desktop search bar in header
- Desktop user menu with dropdown
- Mobile menu icon hidden

### Tablet (sm to lg)

- Mobile menu icon visible
- Desktop search bar in header
- Desktop user menu
- Navigation menu hidden

### Mobile (< sm)

- Mobile menu icon visible
- Mobile search bar below header
- Mobile user menu (compact)
- Hamburger menu for navigation

## Navigation Menu Items

### Main Navigation

1. **Everything** - `/products` (All products)
2. **Women** - `/category/women` (Women's category)
3. **Men** - `/category/men` (Men's category)
4. **Accessories** - `/category/accessories` (Accessories category)
5. **About** - `/about` (About page)
6. **Contact Us** - `/contact` (Contact page)

### Help & Settings (Mobile Menu)

- Payment History
- Help Center
- Customer Service
- Sign Out (when logged in)

## Styling

### Color Scheme

- Primary: Rose (rose-500, rose-400)
- Accent: Amber (amber-400, amber-500)
- Background: White
- Text: Gray scale

### Responsive Breakpoints

- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm to lg)
- Desktop: > 1024px (lg+)

## State Management

### Local State (useState)

- Mobile menu open/close state
- User dropdown toggle
- Search query input

### Redux State

- Cart items and count (from cartSlice)
- User authentication data

## Accessibility Features

- ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus states on all clickable elements
- Semantic HTML structure

## Future Enhancements

Potential improvements for future iterations:

1. Add search suggestions/autocomplete
2. Add category dropdown menus
3. Add wishlist icon
4. Add notification bell
5. Add multi-language support
6. Add dark mode toggle

## Maintenance Tips

### Adding New Navigation Item

1. Update `navigation.ts` configuration
2. Components will automatically reflect the change

### Styling Changes

- Update color variables in the component files
- Consider creating a theme configuration file

### Adding New Features

- Create new component in `components/layout/`
- Import and use in `Header.tsx`
- Follow the same component pattern

## Dependencies

- React
- Next.js (App Router)
- lucide-react (Icons)
- Redux Toolkit (State management)
- next-auth (Authentication)
- TypeScript

## File Structure

```
src/
├── components/
│   └── layout/
│       ├── Header.tsx (Main)
│       ├── Logo.tsx
│       ├── SearchBar.tsx
│       ├── UserMenu.tsx
│       ├── CartIcon.tsx
│       ├── NavigationMenu.tsx
│       └── MobileMenuDrawer.tsx
├── constants/
│   └── navigation.ts
└── services/
    └── auth/
        └── index.ts (logoutUser function)
```

## Testing Checklist

- [ ] Desktop navigation menu visible and clickable
- [ ] Mobile menu icon appears on small screens
- [ ] Mobile drawer opens and closes smoothly
- [ ] Search functionality works on both variants
- [ ] User menu displays correctly when logged in/out
- [ ] Cart count updates dynamically
- [ ] Sign out works properly
- [ ] All navigation links route correctly
- [ ] Responsive breakpoints work as expected
- [ ] No console errors

---

**Note:** This is a production-ready, professional navigation system built for e-commerce business use.

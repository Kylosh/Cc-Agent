# FruitHub - Apple Style Frontend

A modern, minimalist React-based fruit delivery website frontend inspired by Apple's design principles.

## Project Overview

FruitHub is a complete Apple-style fruit delivery website built with React and vanilla CSS. The design emphasizes clean layouts, smooth animations, and an intuitive user experience with a focus on minimalism and white space.

## Directory Structure

```
frontend/
├── public/
│   └── index.html                 # HTML entry point
├── src/
│   ├── index.js                   # React entry point
│   ├── App.js                     # Main app component with routing
│   ├── App.css                    # Global app styles
│   │
│   ├── components/                # Reusable components
│   │   ├── Header.js              # Navigation bar (sticky)
│   │   ├── Header.css
│   │   ├── Hero.js                # Hero section with animations
│   │   ├── Hero.css
│   │   ├── ProductCard.js         # Product card with hover effects
│   │   ├── ProductCard.css
│   │   ├── ShoppingCart.js        # Sidebar cart (slide-in animation)
│   │   ├── ShoppingCart.css
│   │   ├── Footer.js              # Footer
│   │   └── Footer.css
│   │
│   ├── pages/                     # Page components
│   │   ├── Home.js                # Homepage
│   │   ├── Home.css
│   │   ├── Products.js            # Products listing page
│   │   ├── Products.css
│   │   ├── ProductDetail.js       # Product detail page
│   │   ├── ProductDetail.css
│   │   ├── Checkout.js            # Checkout/order page
│   │   └── Checkout.css
│   │
│   └── styles/                    # Global styles
│       ├── variables.css          # CSS variables (colors, spacing, fonts)
│       ├── index.css              # Base styles and utilities
│       └── globals.css            # Legacy global styles
│
└── package.json
```

## Key Features

### 1. Header Component
- Sticky positioning (stays at top while scrolling)
- Logo with emoji
- Navigation links (Home, Products, About)
- Shopping cart button with item count badge
- Responsive mobile hamburger menu

### 2. Hero Section
- Gradient background (Apple style)
- Large, bold headline
- Animated floating fruit emojis
- Call-to-action button
- Smooth slide-up animation on page load

### 3. Product Cards
- 2x2 responsive grid
- Image hover zoom effect (1.05x scale)
- Overlay with add-to-cart button
- Price display with original price strikethrough
- Smooth transitions

### 4. Shopping Cart
- Slide-in from right animation
- Product list with quantity controls (+/- buttons)
- Remove item functionality
- Order summary (subtotal, shipping, tax)
- Persistent storage (localStorage)

### 5. Pages
- **Home**: Featured products, features showcase, CTA section
- **Products**: Full product grid with sorting (price, name, popularity)
- **Product Detail**: Full product information with ratings
- **Checkout**: Order form with shipping and payment details

### 6. Routing
- Client-side routing with React Router
- Smooth page transitions
- Back navigation support

## Design Principles

### Apple-Inspired Design
- **Minimalism**: Clean, uncluttered layouts with generous whitespace
- **Typography**: Clear hierarchy with system fonts
- **Colors**: Light color scheme with high contrast for accessibility
- **Rounded Corners**: Soft, friendly UI with border-radius
- **Smooth Animations**: Subtle transitions (150ms-300ms)
- **Icons**: Clean SVG icons and emojis
- **Gradients**: Subtle gradient backgrounds for CTAs

### Responsive Breakpoints
- **Desktop**: 1024px+ (full layout)
- **Tablet**: 768px - 1023px (adjusted grid)
- **Mobile**: < 768px (single column, hamburger menu)
- **Small Mobile**: < 480px (optimized for small screens)

## CSS Features

### Variables System
All styling uses CSS custom properties for consistency:
```css
/* Colors */
--color-primary: #000000
--color-accent: #0071e3
--color-background: #ffffff
--color-secondary: #f5f5f7

/* Spacing (rem based) */
--space-md: 1rem
--space-lg: 1.5rem
--space-xl: 2rem

/* Typography */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI'
--font-size-base: 1rem
--font-size-xl: 1.25rem

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Animations
- `fadeIn`: Opacity transition
- `slideUp`: Vertical slide with fade
- `slideDown`: Reverse slide
- `scaleIn`: Zoom in with fade
- `float`: Subtle vertical bounce

### Layouts
- Flexbox for components and navigation
- CSS Grid for product grids (auto-fit, minmax)
- Fixed/Sticky positioning for header and cart

## Component Props

### Header
```javascript
<Header
  cartCount={number}        // Total items in cart
  onCartClick={function}    // Toggle cart visibility
/>
```

### ShoppingCart
```javascript
<ShoppingCart
  cartItems={array}             // Products in cart
  removeFromCart={function}     // Remove item by ID
  updateQuantity={function}     // Update item quantity
  onClose={function}            // Close cart
/>
```

### ProductCard
```javascript
<ProductCard
  product={object}          // { id, name, price, emoji, description }
  onAddToCart={function}    // Add product to cart
/>
```

## State Management

### App.js State
```javascript
const [cartItems, setCartItems] = useState([]);
const [showCart, setShowCart] = useState(false);
```

### localStorage Integration
- Cart persists across page reloads
- Stored as JSON string: `localStorage.getItem('cart')`

## Data Models

### Product Model
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  originalPrice: number,     // Optional, for discounts
  emoji: string,             // Product icon/image
  category: string           // Product category
}
```

### Cart Item Model
```javascript
{
  id: number,
  name: string,
  price: number,
  quantity: number,
  emoji: string
}
```

## Accessibility Features
- Semantic HTML elements
- ARIA labels for buttons
- Form labels properly associated
- High contrast colors (WCAG AA compliant)
- Keyboard navigation support
- Focus states for interactive elements

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations
- CSS Grid with auto-fit for responsive layouts
- Hardware-accelerated animations (transform, opacity)
- Debounced event handlers
- Lazy loading ready
- localStorage for state persistence

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Available Scripts

```bash
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests (if configured)
npm run eject      # Eject from Create React App
```

## Future Enhancements
- Dark mode support
- User authentication
- Wishlist functionality
- Product reviews/ratings
- Search functionality
- Filter by category
- Payment integration
- Order tracking
- User profile

## File Sizes (Approximate)
- HTML: < 2KB
- CSS: ~15KB (all styles combined)
- JavaScript: ~25KB (components and logic)

## Dependencies
- React 18+
- React Router 6+
- (No external UI framework, pure CSS)

## Credits
Designed with inspiration from Apple's minimalist design philosophy. Built with React and vanilla CSS.

---

Created: June 2024
Version: 1.0

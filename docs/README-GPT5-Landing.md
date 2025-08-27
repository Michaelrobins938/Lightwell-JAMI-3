# 🚀 GPT-5 Landing Page System

A complete, production-ready landing page that replicates ChatGPT's GPT-5 debut marketing interface with the signature blurred sunrise gradient theme.

## ✨ Features

### 🎨 **GPT-5 Signature Theme**
- **Multi-stop pastel gradients**: Pink → Orange → Yellow → Blue → Lavender
- **Animated background orbs**: Floating gradient circles with smooth animations
- **Backdrop blur effects**: Modern glassmorphism design
- **Responsive design**: Mobile-first approach with Tailwind CSS

### 🧩 **Components Built**

1. **Hero Section** (`/src/components/Landing/Hero.tsx`)
   - Full-screen gradient background
   - Animated floating orbs
   - "Introducing GPT-5" headline with animated gradient text
   - CTA buttons (Try ChatGPT, Learn more)
   - Floating particles effect

2. **Model Card** (`/src/components/Landing/ModelCard.tsx`)
   - Floating "GPT-5: Flagship model" pill
   - Hover animations and glow effects
   - Positioned absolutely over hero

3. **Feature Showcase** (`/src/components/Landing/FeatureShowcase.tsx`)
   - 6 feature cards with gradient backgrounds
   - Icons and descriptions
   - Hover animations
   - Bottom CTA section

4. **Footer** (`/src/components/Landing/Footer.tsx`)
   - Organized link sections
   - Social media icons
   - Branding and credits

### 🎭 **Animations & Effects**

- **CSS Keyframes**: Custom animations for floating orbs
- **Framer Motion**: React animations for content entrance
- **Gradient text**: Animated gradient text for "GPT-5"
- **Floating particles**: Subtle particle effects
- **Hover states**: Interactive hover animations

## 🚀 **Quick Start**

### 1. **Install Dependencies**
```bash
npm install framer-motion lucide-react
```

### 2. **Access the Landing Page**
- **URL**: `/landing`
- **Auto-redirect**: Root `/` redirects to `/landing`

### 3. **Customize Colors**
Edit `tailwind.config.js` to modify the GPT-5 color palette:
```js
colors: {
  'gpt5': {
    'pink': '#FFB6B9',
    'yellow': '#FFD97D',
    'mint': '#B5EAD7',
    'blue': '#A8D8FF',
    'lavender': '#E2C2FF',
    // ... light variants
  }
}
```

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#FFB6B9` (Warm Pink)
- **Secondary**: `#FFD97D` (Sun Yellow)
- **Accent**: `#B5EAD7` (Mint Green)
- **Highlight**: `#A8D8FF` (Sky Blue)
- **Tertiary**: `#E2C2FF` (Lavender Haze)

### **Typography**
- **Headlines**: Bold, large scale (5xl-7xl)
- **Body**: Medium weight, readable (lg-xl)
- **Captions**: Small, subtle (sm)

### **Spacing**
- **Section padding**: `py-20` (80px)
- **Component gaps**: `space-y-6` (24px)
- **Card padding**: `p-8` (32px)

## 🔧 **Customization**

### **Modify Hero Content**
```tsx
// src/components/Landing/Hero.tsx
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
  Introducing{' '}
  <span className="gpt5-gradient-text">
    Your Brand
  </span>
</h1>
```

### **Add New Features**
```tsx
// src/components/Landing/FeatureShowcase.tsx
const features = [
  // ... existing features
  {
    icon: <YourIcon size={32} className="text-gpt5-pink" />,
    title: "Your New Feature",
    description: "Description of your feature",
    bg: "from-gpt5-pink-light via-gpt5-yellow-light to-gpt5-mint-light",
    delay: 0.7
  }
];
```

### **Customize Animations**
```css
/* src/styles/gpt5-animations.css */
.gpt5-orb-1 {
  animation: gpt5-float 15s ease-in-out infinite; /* Faster */
}
```

## 📱 **Responsive Behavior**

- **Mobile**: Single column layout, reduced spacing
- **Tablet**: 2-column feature grid
- **Desktop**: 3-column feature grid, full animations

## 🎯 **Performance Optimizations**

- **CSS animations**: Hardware-accelerated transforms
- **Lazy loading**: Viewport-based animations
- **Optimized gradients**: Efficient CSS gradients
- **Minimal JavaScript**: Framer Motion for complex animations only

## 🔗 **Integration**

### **With Existing App**
```tsx
// In your main layout
import LandingPage from '@/pages/landing';

// Route to landing when not authenticated
{!isAuthenticated && <LandingPage />}
```

### **Navigation Links**
```tsx
// Add to your navigation
<Link href="/landing" className="text-gpt5-pink hover:text-gpt5-yellow">
  Home
</Link>
```

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
vercel --prod
```

### **Netlify**
```bash
netlify deploy --prod
```

### **Static Export**
```bash
npm run build
npm run export
```

## 🎨 **Theme Variations**

### **Dark Mode Support**
The system automatically adapts to `prefers-color-scheme: dark`

### **Custom Branding**
Replace "GPT-5" with your brand name and adjust colors accordingly

### **Seasonal Themes**
Modify the gradient stops for different seasons or campaigns

## 📚 **Resources**

- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://framer.com/motion)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React, Next.js, Tailwind CSS, and Framer Motion**

*Replicates the exact aesthetic of ChatGPT's GPT-5 debut landing page*

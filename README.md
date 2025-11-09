# Everything Uganda - Tourism Website

A comprehensive React-based tourism website showcasing Uganda's destinations, culture, and tour packages with a complete booking system.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Booking System**: Complete form validation with React Hook Form + Zod
- **Rich Content Management**: JSON-based content system for easy updates
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Comprehensive Pages**: 10+ pages covering all aspects of Uganda tourism
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

## 📋 Pages & Features

### Core Pages
- **Home**: Hero carousel, featured packages, destinations, testimonials
- **Why Uganda**: Compelling reasons, statistics, safety information
- **Discover Uganda**: Interactive destination explorer with detailed modals
- **Packages**: Three-tier system (Standard/Gold/Platinum) with comparison table
- **Package Details**: Full itineraries, inclusions/exclusions, booking integration
- **Where to Stay**: Curated accommodations with external booking links
- **Activities**: Comprehensive activity listings with difficulty ratings
- **Stories**: Cultural heritage of Uganda's 56+ tribes
- **Visa & Flights**: Complete travel preparation guide
- **About**: Company information, team, values, statistics
- **Contact**: Contact form with booking integration

### Key Components
- **Booking Modal**: Complete booking flow with form validation
- **Package Cards**: Reusable package display components
- **Testimonials Carousel**: Rotating customer testimonials
- **Destination Grid**: Filterable destination explorer
- **Cultural Stories**: Detailed tribal information with respectful tourism guidelines

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom color palette
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **UI Components**: Headless UI, custom component library
- **Icons**: Lucide React
- **Data**: JSON-based content management

## 🎨 Design System

### Color Palette
- **Primary Green**: #16a34a (Uganda's natural beauty)
- **Secondary Orange**: #f97316 (Sunset colors)
- **Accent Gold**: #eab308 (Cultural richness)
- **Neutral Grays**: Complete scale for text and backgrounds

### Typography
- **Headings**: Georgia serif for elegance
- **Body**: Inter sans-serif for readability
- **Spacing**: 8px grid system

## 📦 Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd everything-uganda

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Email Service (Optional)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Admin Dashboard (Optional)
VITE_ADMIN_PASSWORD=your_admin_password
```

### Content Management
All content is stored in `src/data/` as JSON files:
- `packages.json` - Tour packages with detailed itineraries
- `destinations.json` - Tourist destinations with coordinates
- `tribes.json` - Cultural stories and traditions
- `accommodations.json` - Hotels and lodges
- `activities.json` - Available activities and experiences
- `testimonials.json` - Customer reviews

## 🚀 Deployment

### Recommended: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Alternative: Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
# Configure environment variables in Netlify dashboard
```

## 🔌 Integrations

### Email Service Integration
Replace the mock booking submission in `src/hooks/useBookings.ts`:

```typescript
// Replace this mock implementation
const submitBooking = async (data: BookingFormData) => {
  // TODO: Replace with actual API call
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  // TODO: Send confirmation email
  await sendConfirmationEmail(data);
};
```

### CMS Integration
To replace JSON files with a headless CMS (Sanity, Contentful):

1. Install CMS SDK: `npm install @sanity/client` or `npm install contentful`
2. Create data fetching hooks in `src/hooks/`
3. Replace JSON imports with API calls
4. Update TypeScript interfaces if needed

### Payment Integration
For Stripe integration:
```bash
npm install @stripe/stripe-js
```

Add Stripe configuration to booking flow and implement payment processing.

## 📱 Mobile Optimization

- Responsive breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch-friendly interface elements
- Optimized images with proper sizing
- Mobile-first CSS approach

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management in modals

## 🧪 Testing

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Build test
npm run build
```

## 📈 Performance Optimization

- Lazy loading for images
- Code splitting with React.lazy()
- Optimized bundle size with Vite
- Efficient re-renders with proper React patterns
- Compressed assets in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: info@everythinguganda.com
- Phone: +256 700 123 456
- Documentation: Check this README and inline code comments

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core website functionality
- ✅ Booking system
- ✅ Content management
- ✅ Responsive design

### Phase 2 (Future)
- [ ] Payment processing integration
- [ ] User accounts and booking history
- [ ] Real-time availability checking
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Blog/news section
- [ ] Social media integration
- [ ] Analytics dashboard

### Phase 3 (Advanced)
- [ ] Mobile app development
- [ ] AI-powered trip recommendations
- [ ] Virtual reality previews
- [ ] Integration with local service providers
- [ ] Advanced booking management system
- [ ] Customer loyalty program

---

Built with ❤️ for Uganda Tourism
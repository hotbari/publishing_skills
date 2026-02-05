# Quick Start Guide - Travel Planner

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd travel-planner
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Step 3: Start Planning!

1. Click "Create New Trip" on the Trips page
2. Fill in trip details (name, country, dates, transport)
3. Click on the map to add places
4. Drag and drop to reorder your itinerary
5. Use AI optimization for smart suggestions

## 📁 Project Structure

```
src/
├── components/common/     # Reusable UI components (Button, Input, Modal, etc.)
├── components/features/   # Feature-specific components (Map, Timeline, etc.)
├── pages/                 # Route pages (Trips List, Planner, etc.)
├── store/                 # Zustand state management
├── services/              # API client
├── types/                 # TypeScript definitions
└── i18n/                  # Translations (EN/KO)
```

## 🎨 Design System

### Colors
- Deep Night Blue: `#0F1729` (Background)
- Evening Slate: `#1E293B` (Cards)
- Frost White: `#F8FAFC` (Text)
- Frost Blue: `#60A5FA` (Primary)

### Spacing (8px scale)
- `gap-2` → 8px
- `gap-4` → 16px
- `gap-6` → 24px
- `p-4` → 16px
- `p-6` → 24px

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Language Support

Switch between English and Korean:

```typescript
import { useTranslation } from 'react-i18next'

const { t, i18n } = useTranslation()
i18n.changeLanguage('ko') // or 'en'
```

## 🗺️ Map Features

- **Click to Add**: Click anywhere on the map to add a new place
- **Markers**: Blue markers for places, highlighted when selected
- **Routes**: Polylines showing travel paths
- **Popups**: Click markers to see place details

## ⚡ Key Features

### Drag & Drop Timeline
- Reorder activities by dragging
- Auto-updates times and travel durations
- Visual business hours indicators (🟢 🟡 🔴)

### AI Optimization
1. Click "Optimize Schedule"
2. Choose mode: "Optimize Only" or "Suggest & Optimize"
3. Review AI suggestions
4. Apply or reject changes

### Place Templates
- Save frequently used places (e.g., "Lunch Break", "Museum Visit")
- Reuse with one click
- Pre-filled duration and category

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
VITE_OPENAI_API_KEY=sk-...
```

## 📝 Component Usage

### Button

```tsx
import { Button } from '@/components/common'

<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="destructive">Delete</Button>
```

### Input with Validation

```tsx
import { Input } from '@/components/common'

<Input
  label="Trip Name"
  placeholder="Enter name"
  error={errors.name?.message}
  required
/>
```

### Modal

```tsx
import { Modal } from '@/components/common'

<Modal isOpen={open} onClose={() => setOpen(false)} title="Add Place">
  {/* Content */}
</Modal>
```

## 🌍 State Management

```tsx
import { useTripStore } from '@/store/tripStore'

const currentTrip = useTripStore(state => state.currentTrip)
const addPlace = useTripStore(state => state.addPlace)
```

## 🎯 Next Steps

1. **Connect Backend**: Point `VITE_API_URL` to your FastAPI server
2. **Add OpenAI Key**: Enable AI optimization features
3. **Customize**: Modify `tailwind.config.js` for theme tweaks
4. **Deploy**: Run `npm run build` and deploy `dist/` folder

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Map Not Loading
- Check internet connection (needs OpenStreetMap tiles)
- Verify Leaflet CSS is imported in `TravelMap.tsx`

### Styles Not Applying
- Ensure `globals.css` is imported in `main.tsx`
- Check Tailwind config includes all content paths

## 📚 Learn More

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/)
- [Leaflet Documentation](https://leafletjs.com/)
- [TailwindCSS Reference](https://tailwindcss.com/docs)

## 🤝 Contributing

Follow these consistency rules:

1. Use only components from `@/components/common`
2. Follow 8px spacing scale (`gap-2, gap-4, gap-6`, etc.)
3. Maintain Frost Winter color theme
4. Use standard page templates (List, Form, Detail, Dashboard)

---

**Happy Planning! ❄️**

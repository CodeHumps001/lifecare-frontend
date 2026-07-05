# LifeCare HMS — Frontend

Divine Netcare Hospital Management System — Public Website & Admin Dashboard

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** with custom green/white brand theme
- **shadcn/ui** components
- **Zustand** for auth state
- **React Hook Form + Zod** for form validation
- **Axios** for API calls
- **Lucide React** for icons
- **Google Fonts** — Playfair Display + Inter

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://devine-care-backend-production.up.railway.app/api/v1
NEXT_PUBLIC_SOCKET_URL=https://devine-care-backend-production.up.railway.app
```

For local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production

```bash
npm run build
npm start
```

## Pages

### Public Website
| Route | Description |
|-------|-------------|
| `/` | Home page with hero, services, reviews, blog |
| `/about` | About Divine Netcare Hospital |
| `/services` | All medical services |
| `/doctors` | Doctor directory (fetched from API) |
| `/appointments` | Multi-step appointment booking |
| `/blog` | Health blog (fetched from API) |
| `/blog/:id` | Single blog post |
| `/careers` | Job listings (fetched from API) |
| `/careers/:id` | Job application form |
| `/reviews` | Patient reviews + submission |
| `/contact` | Contact form, map, social links |

### Admin Panel (Protected)
| Route | Description |
|-------|-------------|
| `/admin/login` | Staff portal login |
| `/admin/dashboard` | Overview stats and quick actions |
| `/admin/departments` | Manage hospital departments |
| `/admin/users` | Register and manage staff |
| `/admin/shifts` | Generate and view shift schedules |
| `/admin/attendance` | Monitor staff attendance |
| `/admin/leave` | Approve/reject leave applications |
| `/admin/appointments` | Manage patient appointments |
| `/admin/jobs` | Post jobs and review applications |
| `/admin/reviews` | Moderate patient reviews |
| `/admin/posts` | Write and publish blog posts |
| `/admin/announcements` | Create staff announcements |

## Brand Colors

```
Primary:   #006B3C  (Deep green)
Secondary: #00A86B  (Jade green)
Light:     #E8F5EE  (Mint mist)
Gold:      #F59E0B  (Accent)
Dark:      #1A2E1A  (Text)
```

## Deployment

Deploy to Vercel:

```bash
npx vercel
```

Set `NEXT_PUBLIC_API_URL` in Vercel environment variables to your Railway API URL.

## Notes

- Replace Unsplash images with real hospital photos
- Update hospital phone, email, and address if changed
- The staff mobile app (React Native/Expo) is a separate project

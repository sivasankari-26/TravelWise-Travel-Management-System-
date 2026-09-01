# Travel Wise — Frontend

A complete frontend-only Travel Management System built with React, Vite, and React Router.

## Tech Stack
- React 19 + Vite
- React Router DOM (routing)
- lucide-react (icons)
- recharts (admin charts)
- Plain CSS design system (no UI component library)

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically http://localhost:5173).

To build for production:
```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  assets/            Images, icons, logo
  components/
    common/          Button, Card, Input, Modal, Footer, Loader, SearchBar, StatusBadge,
                      Pagination, DataTable, StatCard, AnalyticsCard, ProtectedRoute, etc.
    customer/         CustomerNavbar, DestinationCard, PackageCard, BookingCard,
                      RecommendationCard, TravelBudgetCard, HotelCard, TransportCard, StepIndicator
    admin/            AdminSidebar, AdminNavbar, AdminModal
  pages/
    auth/             CustomerLogin, CustomerRegister, ForgotPassword, AdminLogin
    customer/         Home, Destinations, DestinationDetails, Packages, PackageDetails,
                      CustomizePackage, Booking, Payment, BookingConfirmation, MyBookings, Profile
    admin/            Dashboard, AdminDestinations, AdminHotels, AdminTransport, AdminPackages,
                      AdminBookings, AdminCustomers, AdminAnalytics
    Home.jsx          Public landing page
    NotFound.jsx      404 page
  layouts/            CustomerLayout, AdminLayout
  context/            AuthContext (simulated login), ToastContext (notifications)
  hooks/              useDocumentTitle, useScrollReveal, useLocalStorage
  data/               destinations, packages, hotels, transport, bookings, customers, testimonials
  utils/              format.js (currency/date), validators.js
  App.jsx             Full route definitions
  main.jsx            App entry point
  index.css           Design system (tokens, components, utilities)
```

## Routes

### Public
- `/` — Landing page
- `/login`, `/register`, `/forgot-password` — Customer auth
- `/admin/login` — Admin auth

### Customer (protected — requires simulated login)
- `/customer/home`
- `/customer/destinations`, `/customer/destinations/:id`
- `/customer/packages`, `/customer/packages/:id`
- `/customer/customize-package`
- `/customer/booking`, `/customer/payment`, `/customer/booking-confirmation`
- `/customer/bookings`
- `/customer/profile`

### Admin (protected — requires simulated admin login)
- `/admin/dashboard`
- `/admin/destinations`, `/admin/hotels`, `/admin/transport`, `/admin/packages`
- `/admin/bookings`, `/admin/customers`, `/admin/analytics`

## Frontend-Only Simulated Features
- **Authentication**: Login/register/logout use localStorage — no real backend or security.
  Log in with any valid-looking email and a password of 4+ characters.
- **Payments**: The payment page is a UI mock only; no real transaction occurs.
- **Admin CRUD**: Add/Edit/Delete for destinations, hotels, transport, and packages persist
  to localStorage only (per-browser), seeded from `src/data/`.
- **Bookings**: Created bookings are saved to localStorage and shown in both "My Bookings"
  and the admin Bookings table.

## Ready for Backend Integration
Data files in `src/data/` mirror the shape a future REST API would return, and `AuthContext`
is structured so its simulated functions can be swapped for real API calls without touching
the pages that consume it.

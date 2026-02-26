# ✨ Wedding Photography Management System - Frontend

A premium, modern, and highly interactive web application for managing wedding photography services. Built with **React** and **Vite**, this frontend provides a seamless experience for clients, photographers, and administrators.

## 🌟 Key Features

- **Modern UI/UX**: Clean, responsive design with premium aesthetics (dark mode variants, smooth transitions).
- **Role-Based Dashboards**: Customized interfaces for:
  - **Admin**: Oversee the entire platform, manage users, and track revenue.
  - **Photographer**: Manage assignments, update availability, and track earnings.
  - **Client**: Discover photographers, book sessions, and chat in real-time.
- **Dynamic Booking Flow**: Intelligent scheduling and booking management.
- **Real-time Chat**: Instant communication via Socket.io.
- **State Management**: Centralized application state using Redux Toolkit.
- **Animations**: Fluid micro-animations powered by Framer Motion.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit & React Context API
- **Routing**: React Router Dom
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Networking**: Axios & Socket.io-client

## 📂 Project Structure

```text
Frontend/src/
├── assets/          # Static files (images, icons)
├── components/      # Reusable UI components (Buttons, Modals, Cards)
├── hooks/           # Custom React hooks
├── layouts/         # Role-based layout wrappers
├── pages/           # Feature-specific pages (Admin, Client, Photographer)
├── services/        # API and Socket service configurations
├── store/           # Redux slices and Context providers
└── utils/           # Helper functions and constants
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- Backend server running on `http://localhost:5000`

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Wedding-Photography-Frontend/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

- **Development mode**:
  ```bash
  npm run dev
  ```

The application will be accessible at `http://localhost:5175` (or the port specified in your terminal).

## 🎨 Design Philosophy

This project aims for a **premium** feel:
- **Consistent Spacing**: Generous use of padding and margins for a clean look.
- **Typography**: Clear hierarchy using modern sans-serif fonts.
- **Interactivity**: Hover effects and refined transitions to make the UI feel alive.
- **Mobile First**: Fully responsive layouts that look great on any device.

---

Designed for capturing and managing life's most beautiful moments. 📸

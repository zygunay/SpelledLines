# SpelledLines | Laravel React CRM & Artwork Gallery

A modern, robust full-stack web application engineered with **Laravel 12**, **React 19**, and **Inertia.js v2**. This repository houses a dual-purpose platform: a visually engaging public storefront for original artwork and a comprehensive, secure internal Customer Relationship Management (CRM) system.

## ©️ Artwork & Copyright Notice

⚠️ **Important:** While the source code of this application is open-source, **all artworks, illustrations, and images displayed within this repository and the application are my original creations and are strictly copyrighted.** These visual assets are **excluded** from the MIT License. You may not extract, reproduce, distribute, modify, or use any of the artwork for personal or commercial purposes without explicit written permission.

🎨 **View more of my original work on Instagram:** [@spelledlines](https://www.instagram.com/spelledlines/)

---

## 🚀 Key Features

### 🎨 Storefront & Public Gallery
- **Artwork Exhibition:** A dynamic showcase of original illustrations and artworks, featuring advanced filtering and detailed view panes.
- **Interactive Engagement:** Authenticated users can actively engage with the gallery by liking and commenting on specific pieces.
- **Member Dashboard:** A dedicated portal for registered users to manage their profiles, preferences, and personal settings.

### 💼 CRM & Admin Panel (Staff Access)
- **Role-Based Access Control (RBAC):** Secure, isolated routing ensuring that only authorized staff can access the CRM via dedicated middleware (`EnsureStaff`).
- **Customer Management:** A comprehensive interface to view, edit, and manage customer records seamlessly.
- **Order Tracking:** End-to-end management of order statuses and their complete lifecycle.
- **User Administration:** Tools to provision, update, and revoke access for staff members and regular users.
- **Audit Trails & Logging:** Extensive system tracking (`UserLog`, `OrderActionLog`, `UserActionLog`) to monitor user activity, order modifications, and critical system events, ensuring full accountability.

### 🔐 Authentication & Security
- Fully integrated, robust authentication flow (Registration, Login, and Password Recovery).
- Secure session management and native CSRF protection powered seamlessly by Laravel and Inertia.

## 🛠️ Tech Stack

### Backend
- **Framework:** [Laravel 12.x](https://laravel.com)
- **Language:** PHP 8.2+
- **Database:** SQLite (Configurable for MySQL/PostgreSQL)
- **Testing:** [Pest PHP](https://pestphp.com/) v3

### Frontend
- **Framework:** [React](https://react.dev/) 19 & TypeScript
- **Bridging:** [Inertia.js](https://inertiajs.com/) v2 (Server-driven SPA)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) Primitives & Lucide Icons
- **Build Tool:** [Vite](https://vitejs.dev/)

## 📦 Installation & Setup

Follow these instructions to configure your local development environment:

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js (v18+) & NPM
- SQLite

### 1. Clone the Repository
```bash
git clone [https://github.com/zygunay/SpelledLines.git](https://github.com/zygunay/SpelledLines.git)
cd SpelledLines
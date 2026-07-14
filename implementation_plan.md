# Comprehensive Project Audit (Phase 1)

This document outlines the Phase 1 understanding of the CreateBharat project as part of the requested 14-phase End-to-End Audit.

## 1. Executive Summary & Tech Stack

The project is a monolithic repository split into two main directories: `frontend` (React SPA) and `Backend` (Node.js/Express REST API).

### Technologies Used:
* **Frontend:** React 19, Vite, Tailwind CSS 4.x, React Router DOM v7, Framer Motion, AOS (Animate on Scroll).
* **Backend:** Express 5.x, Node.js, MongoDB (via Mongoose), JWT (Authentication), BcryptJS, Multer & Cloudinary (File Uploads), Nodemailer (Email), Razorpay (Payments), Socket.io (Real-time).

## 2. Folder Structure

* **`frontend/`**
  * `src/pages/`: Contains view components segregated by roles (Admin, CA, Company, Mentors, Profile, Legal, Loans, Internships, Pitch, Training).
  * `src/components/`: Reusable UI components (Navbar, Footers, Modals, Forms) and `ProtectedRoute.jsx`.
  * `src/contexts/`: React Context API for global state management (e.g., `UserContext`).
  * `src/hooks/`: Custom React hooks for abstracted logic.
  * `src/utils/`: Utility functions, specifically `api.js` for Axios instance configuration.
* **`Backend/`**
  * `routes/`: Express route definitions.
  * `controllers/`: Request handling logic mapping to routes.
  * `models/`: Mongoose schemas defining MongoDB collections.
  * `middleware/`: Authentication checks (JWT), Multer upload handlers, and error handlers.
  * `services/`: Abstracted business logic (e.g., Payment processing, Emails).
  * `config/`: Database connection and external service configuration.

## 3. Architecture & Flow

### Architecture
The app follows a standard Client-Server architecture. The frontend acts as a Single Page Application (SPA) communicating with the backend over a RESTful JSON API.

### State Management
State is managed locally using React `useState` and `useReducer`. Global authentication and user state are managed via React Context (`UserContext`). There is no Redux or Zustand setup detected; state is scoped closely to where it's needed.

### Routing Flow
Routing is handled by `react-router-dom`. The main entry point is `App.jsx`, which contains:
* **Public Routes:** Home, Login, Signup, Legal, About.
* **Role-Specific Auth Routes:** `/mentors/login`, `/ca/login`, `/company/login`.
* **Protected Routes:** Handled by a `<ProtectedRoute>` wrapper that reads local storage (`isMentorLoggedIn`, `isCALoggedIn`, `userType`) and redirects unauthorized users to their respective login screens.

### Authentication & Authorization Flow
1. User submits credentials to the respective login API (e.g., `/api/mentors/login`).
2. Backend validates via `bcryptjs`, signs a JWT token, and returns it.
3. Frontend saves the token in `localStorage` and updates the `UserContext`.
4. Subsequent requests include the token in the `Authorization: Bearer <token>` header via Axios interceptors in `api.js`.

### Specialized Flows
* **Upload Flow:** Forms use `FormData`. Backend uses `multer` to intercept files and streams them to Cloudinary.
* **Payment Flow:** Initiates via Razorpay. Backend generates an order ID, frontend captures payment details via Razorpay checkout script, and backend verifies the payment signature webhook.
* **Notification Flow:** Asynchronous email dispatch using `nodemailer`, possibly triggered by `node-cron` for scheduled jobs. Real-time updates (if utilized in the dashboard) are managed via `Socket.io`.

## 4. Complete Project Flow (Beginning to End)

1. **Onboarding:** A user visits the landing page. They choose a pathway: General User, Mentor, CA, or Company.
2. **Authentication:** They register and log in through their specific portal.
3. **Session:** A JWT is granted and stored. The `ProtectedRoute` grants access to their specific dashboard (e.g., `/mentors/dashboard`).
4. **Interaction (Core Logic):**
   * **Users** can view loans, apply for internships, consume training modules, or book mentors.
   * **Mentors/CAs** manage their schedules, accept bookings, and provide consultations.
   * **Companies** post internships and review applications.
5. **Transactions:** Users pay for legal services or certificates via Razorpay.
6. **Data Storage:** Operations are saved to MongoDB, files to Cloudinary.
7. **Termination:** User logs out, clearing `localStorage`, and is redirected to the root `/`.

---

## Next Steps for the Audit

As per your instructions, I have completed **Phase 1** (Understanding the Project) without modifying any code. 

To execute the remaining rigorous, file-by-file audit (Phases 2 to 13), I will require your approval to proceed. Due to the massive scope of checking *every single file, route, API, and flow*, I propose we execute the remaining audit iteratively, starting with **Phase 2 (Project Flow) & Phase 3 (API Audit)** in the next pass.

## User Review Required
Please review my Phase 1 understanding. Do you approve moving forward with the deep-dive audit starting with Phase 2 and 3?

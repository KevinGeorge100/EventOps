# ◆ EventOps

**A Dockerized SSR Dashboard & Live Site** — built with Node.js, Express, and EJS.

🚀 **Live Demo:** [http://3.111.51.209](http://3.111.51.209)  
⚙️ **Admin Panel:** [http://3.111.51.209/admin](http://3.111.51.209/admin) (Login: `admin` / `eventops2024`)  
🔄 **CI/CD:** Automated deployment via GitHub Actions to AWS EC2.

A full-stack event management platform featuring a stunning public landing page and a protected admin dashboard. Create, edit, and delete events from the dashboard, and watch them instantly appear on the live site. Fully containerized with Docker for seamless deployment.

---

## ✨ Features

- **🌐 Public Landing Page** — A high-impact, Antigravity-inspired design showcasing all events
- **🔒 Protected Admin Dashboard** — Session-based authentication with full CRUD operations
- **⚡ Instant SSR Updates** — Dashboard changes immediately reflect on the public site
- **📦 Docker Ready** — One command to build and deploy the entire stack
- **📱 Fully Responsive** — Optimized for desktop, tablet, and mobile
- **🎨 Premium Design** — Dark theme with glassmorphism, gradients, and micro-animations

---

## 🛠 Tech Stack

| Layer          | Technology           |
|----------------|---------------------|
| **Runtime**    | Node.js 18          |
| **Framework**  | Express.js          |
| **Templating** | EJS (SSR)           |
| **Auth**       | Express Sessions    |
| **Database**   | JSON file storage   |
| **Container**  | Docker + Compose    |
| **Fonts**      | Inter, Space Grotesk|

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ 
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server (with hot reload)
npm run dev

# 3. Open in browser
#    Public site:  http://localhost:3000
#    Admin panel:  http://localhost:3000/admin
```

### Docker Deployment

```bash
# Build and start
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### AWS EC2 Deployment

The application is deployed on an **AWS EC2 Ubuntu Instance** using **Docker Compose**.

- **Public IP:** `3.111.51.209`
- **Reverse Proxy:** Nginx (Port 80 → 3000)
- **Persistence:** Docker Volumes for `uploads` and `data`
- **CI/CD:** GitHub Actions triggers on push to `main`

#### Manual Deployment Commands
```bash
# SSH into server
ssh -i "your-key.pem" ubuntu@3.111.51.209

# Pull latest code
cd ~/EventOps
git pull origin main

# Rebuild containers
sudo docker compose up --build -d
```

---

## 🔐 Default Credentials

| Field      | Value           |
|------------|-----------------|
| Username   | `admin`         |
| Password   | `eventops2024`  |

> ⚠️ Change these in `.env` or via Docker environment variables for production!

---

## 📁 Project Structure

```
EventOps/
├── src/
│   ├── server.js               # Express server entry point
│   ├── routes/
│   │   ├── index.js            # Public routes (/)
│   │   └── admin.js            # Admin routes (/admin)
│   ├── middleware/
│   │   └── auth.js             # Session auth middleware
│   ├── models/
│   │   └── eventModel.js       # JSON data access layer
│   ├── views/
│   │   ├── index.ejs           # Public landing page
│   │   ├── admin.ejs           # Admin dashboard
│   │   ├── login.ejs           # Login page
│   │   ├── 404.ejs / error.ejs # Error pages
│   │   └── partials/           # Header & footer partials
│   └── public/
│       ├── css/styles.css      # Antigravity design system
│       └── js/main.js          # Client-side interactions
├── data/events.json            # Event data storage
├── Dockerfile                  # Multi-stage Docker build
├── docker-compose.yml          # Container orchestration
└── .env.example                # Environment template
```

---

## 🔧 Environment Variables

| Variable         | Default                  | Description              |
|------------------|--------------------------|--------------------------|
| `PORT`           | `3000`                   | Server port              |
| `NODE_ENV`       | `development`            | Environment mode         |
| `SESSION_SECRET` | `eventops-super-secret`  | Session encryption key   |
| `ADMIN_USERNAME` | `admin`                  | Dashboard login username |
| `ADMIN_PASSWORD` | `eventops2024`           | Dashboard login password |

---

## 📡 API Routes

| Method | Route                     | Auth | Description           |
|--------|---------------------------|------|-----------------------|
| GET    | `/`                       | No   | Public landing page   |
| GET    | `/admin`                  | Yes  | Admin dashboard       |
| GET    | `/admin/login`            | No   | Login page            |
| POST   | `/admin/login`            | No   | Process login         |
| GET    | `/admin/logout`           | Yes  | Logout                |
| POST   | `/admin/event`            | Yes  | Create event          |
| POST   | `/admin/event/:id`        | Yes  | Update event          |
| POST   | `/admin/event/:id/delete` | Yes  | Delete event          |
| GET    | `/admin/edit/:id`         | Yes  | Edit event form       |
| GET    | `/health`                 | No   | Health check endpoint |

---

## 📝 License

ISC

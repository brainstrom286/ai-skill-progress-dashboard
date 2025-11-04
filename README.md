<<<<<<< HEAD
# AI Skill Progress Dashboard

The **AI Skill Progress Dashboard** is a responsive web app that helps learners **track their study progress**, **visualize learning trends**, and **generate personalized AI-powered 7-day study plans** using **Google Gemini API**.  
It’s built for students, developers, or anyone improving their technical skills — with a focus on clean design and smooth UX.

---

## 🚀 Features

✅ **Add & Manage Topics**  
- Add or remove study topics like ML, DSA, OS, etc.  
- Add your own custom categories anytime.  
- Automatically removes topics that reach 100% completion.  

✅ **AI Study Plan Generator**  
- Generates a personalized 7-day study roadmap using **Gemini API**.  
- Adapts suggestions based on topic progress and hours spent.  

✅ **Interactive Dashboard**  
- Dynamic bar chart showing progress by category.  
- Automatically updates when you log study time.  

✅ **Modern Dark Theme**  
- Eye-friendly dark mode for focus and long sessions.  
- Clean UI designed with Tailwind CSS.  

✅ **Local Data Persistence**  
- Topics are stored locally, so you never lose progress.  
- New users start with a clean blank dashboard.

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Custom Dark Theme |
| **State Management** | Zustand |
| **Charts** | Recharts (Responsive Bar Chart) |
| **AI Integration** | Google Gemini API *(fallback: heuristic AI plan)* |
| **Deployment** | Vercel |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/ai-skill-progress-dashboard.git
cd ai-skill-progress-dashboard
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Create your environment file
In the project root, create a file named .env.local and add:
```
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash-latest
```
⚠️ Don’t commit this file — it’s already listed in .gitignore.

### 4️⃣ Run locally
```
npm run dev
```
Now open 👉 http://localhost:3000
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> b6e125e (feat: AI Skill Progress Dashboard (initial))

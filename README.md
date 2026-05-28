# CareFirst Health - Patient Intake Portal

A modern, responsive Next.js landing page integrated with an automated n8n workflow to handle patient intake, generate AI-drafted pre-visit instructions, and send confirmation emails.

## 🚀 Features
- **Modern UI/UX**: Built with Next.js, Tailwind CSS, and Framer Motion for beautiful animations.
- **Automated Webhooks**: Sends form data directly to an n8n webhook upon submission.
- **AI-Powered Instructions**: n8n uses the Groq API to draft personalized pre-visit instructions based on the patient's age and medical concern.
- **Automated Emails**: Sends a beautifully formatted HTML confirmation email to the patient using Gmail SMTP.

## 📸 Screenshots

### Landing Page
![CareFirst Landing Page](public/landing-page.png)

### n8n Automation Workflow
![n8n Workflow](public/n8n-workflow.png)

## 🛠️ Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Lucide React
- **Automation**: n8n (Webhooks, Groq API, Gmail Node)
- **Deployment**: Vercel

## ⚙️ Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file and add your n8n webhook URL:
   `CAREFIRST_N8N_WEBHOOK_URL=https://madhurhitaganguly.app.n8n.cloud/webhook/patient-intake`
4. Run `npm run dev` to start the development server.

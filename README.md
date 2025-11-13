# WhatsApp Lead Agent

A Next.js web app that lets you capture a lead's details and send a personalized WhatsApp message instantly using Twilio's WhatsApp Business API.

## Features
- Lead form with name, WhatsApp number, and customizable message template
- Merge tag support (`{{name}}`) for personalized outreach
- Serverless API route that triggers a WhatsApp message via Twilio
- Ready for deployment on Vercel with environment variable configuration

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create an `.env.local` file (or set these variables in Vercel):
```
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

> `TWILIO_WHATSAPP_FROM` must be a Twilio-enabled WhatsApp sender. Keep the `whatsapp:` prefix.

### 3. Run the development server
```bash
npm run dev
```
Visit `http://localhost:3000` to use the app.

### 4. Production build
```bash
npm run build
npm start
```

## Deployment
This project is optimized for Vercel. After setting the environment variables, deploy with:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-38c3426d
```

## How It Works
1. User submits the form.
2. Client calls the `/api/send-message` route with the form data.
3. The API route validates input, formats the message, and invokes Twilio's API.
4. Twilio delivers the WhatsApp message to the provided number.

## Notes
- Phone numbers must be supplied in E.164 format (e.g. `+15551234567`).
- The `{{name}}` placeholder in the message is replaced with the lead's actual name before sending.
- Ensure your Twilio account has WhatsApp capabilities enabled for the sender number.

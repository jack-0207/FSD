# Food Processing Laboratory Management System

A MERN stack application for food-processing companies to manage laboratory testing, quality checks, regulatory compliance, and batch traceability.

## Features
- Batch tracking and traceability
- Chemical, microbial, and quality testing records
- Compliance reporting and audit support
- Dashboard for operations and quality overview

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js

## Project Structure
- `server` – Express API and MongoDB models
- `client` – React frontend

## Run the app
1. Start MongoDB locally.
2. Install dependencies:
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
3. Start both apps:
   ```bash
   npm run dev
   ```
4. Open the client in a browser at `http://localhost:5173`.

## Environment
The backend uses `server/.env` with:
- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/foodlab`

## AI compliance reports
On the Reports page, select a batch and choose **Generate with AI**. The server sends that batch's test results to OpenAI and generates the regulation, generated-by value, status, and summary before saving the compliance report. Add these optional values to `server/.env` to enable the provider:
- `OPENAI_API_KEY=your-api-key`
- `OPENAI_MODEL=gpt-4o-mini`

When `OPENAI_API_KEY` is not set, the feature still works with a local evidence-based assessment of passed and failed tests.

## Deploy to Vercel
The Vite client is built as a static site, and the Express API is served by Vercel functions. This repository stores the project in the `FSD` subfolder, so set **Root Directory** to `FSD` in the Vercel project settings.

In the Vercel project settings, add `MONGO_URI` with a MongoDB Atlas connection string. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` if AI-generated compliance reports should use OpenAI. Redeploy after setting environment variables. Vercel's hosted functions cannot connect to a MongoDB instance running only on your local machine. Keep deployment protection enabled unless you intend the app to be publicly accessible.
"
# 🌾 Krishi Mandi

**Krishi Mandi** is a full-stack web application that leverages **blockchain technology** to streamline agricultural transactions by creating secure, transparent, and automated contracts between **farmers** and **buyers**. It empowers farmers to directly engage with buyers, lease land, and utilize AI assistance for a seamless experience.

---

## 🚀 Features

### 🧾 Contract Types

1. **📦 Post-Harvest Contract (Implemented)**  
   - Farmers list their harvested crops with details.  
   - Buyers can view listings and send contract requests.  
   - Farmers can either **accept** or **reject** the requests.  
   - Once accepted, the contract is saved on the **blockchain** ensuring tamper-proof, immutable records.

2. **🌱 Land Lease Contract (Coming Soon)**  
   - Farmers can offer their land on lease for a defined period.  
   - Buyers can explore and initiate lease contracts.  
   - Feature under development.

---

### 🤖 AI Assistance via Gemini

- Integrated **Gemini AI** enables:
  - 🔊 Voice chat  
  - 💬 Typed chat  
  - 🌐 Multilingual interaction for both input and AI replies  
- Helps farmers navigate the platform, resolve doubts, and access support in their local language.

---

### 🏠 User Dashboard

- View contract details at a glance.
- Monitor status and manage your contracts with ease.

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/krishi-mandi.git
cd krishi-mandi

2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install


3. Setup Environment Variables
Rename .env.example to .env and add the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL (API section)
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Your Supabase anon public key
NEXT_PUBLIC_GEMINI_API_KEY=        # Your Gemini API key
NEXT_PUBLIC_YOUTUBE_VIDEO_URL=     # Tutorial video URL for farmers
NEXT_SUPABASE_DOMAIN=              # Your Supabase domain (without https://)

4. Run the Application

```bash
npm run dev       # Starts the development server
npm run build     # Compiles the project
npm run start     # Runs the compiled project
# or
yarn dev
# or
pnpm dev
# or
bun dev

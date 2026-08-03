# StudySprint AI — A Gamified Web3 Learning Companion on Injective

StudySprint AI is a production-ready, gamified study tracking application built on the Injective network. It assists students in establishing consistent study schedules through AI companion features (AI study roadmaps, MCQs, note summarization) combined with on-chain proofs of completion and milestone-based NFT badges.

---

## Key Features

1. **Keplr Wallet Authentication (Web3 Login)**: Sign stateless challenges using Keplr to authenticate and create profiles without emails or passwords.
2. **AI learning Companion**:
   - 🤖 **AI Study Planner**: Formulates study schedules divided into daily milestone roadmaps based on exam targets.
   - 📝 **AI Quiz Generator**: Produces MCQ practice cards on input subjects with scoring and explanation feeds.
   - 📚 **AI Notes Summarizer**: Condenses long notes into vocabulary terms and structured takeaways.
3. **Pomodoro Study Clock**: Configurable focus sessions (25/5, 50/10, Custom) synced to daily goals and recorded client-side when offline.
4. **On-Chain Sprints**: Broadcasts immutable proofs of study completion and mints custom-generated SVG badges as NFTs directly to Injective Testnet.
5. **PWA & Offline IndexedDB**: Serves offline assets and cues focus sessions inside IndexedDB, syncs queues automatically once the network recovers.
6. **Analytics Visualization**: Heatmap calendars and Recharts graphs illustrating daily/weekly hours.
7. **Social & Competition Arena**: Compete on podiums ranked by XP, targets completed, hours focused, and NFTs earned.

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Docker-ready)
- **Blockchain**: Injective TypeScript SDK (`@injectivelabs/sdk-ts`), Keplr Wallet
- **Smart Contract**: CosmWasm (Rust)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- Keplr Wallet Browser Extension

### 1. Database Setup
Spin up the local PostgreSQL container using Docker Compose:
```bash
docker-compose up -d
```

### 2. Backend Installation & Run
Configure environment variables:
```bash
cd backend
cp .env.example .env
```
Install dependencies and run migrations:
```bash
npm install
npx prisma migrate dev --name init
npm run seed
```
Run the development server:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 3. Frontend Installation & Run
Install dependencies:
```bash
cd ../frontend
npm install
```
Start Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Injective Testnet Integration

- **Default Network**: `injective-888` (Testnet).
- **Dual-Mode System**:
  - **Keplr Mode**: Connects to the Keplr extension, checks account state, prompts chain suggestions, and executes messages.
  - **Simulator Mode**: Evaluates the platform instantly inside sandboxes with pre-configured mock data if Keplr is unavailable.
- **Smart Contract Location**: Located in `/smart-contract`. Rust entrypoints: `instantiate`, `create_challenge`, `complete_challenge`, `reward_user`, and `mint_achievement_nft`.

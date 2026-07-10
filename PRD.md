PRD - Digital Twin Autopilot
Development Edition (Hackathon / MVP)
Version: 1.0-dev
Date: July 10, 2026
Status: ⚠️ DEVELOPMENT ONLY - Not for Production
Target Users: 1-10 Users (Demo / Personal Use)

1. Objective
Build a Digital Twin Autopilot that integrates with social/communication platforms (WhatsApp, Telegram, Discord, Email) to automatically reply to messages using an AI clone. The clone is trained on the user's chat history, mimicking their tone, slang, and personality.

⚠️ Development Only Constraint: This stack is optimized for zero-cost development, local testing, and live demos. It is not designed for production scaling, high availability, or enterprise security.

2. Scope
2.1 In-Scope (Development Features)
✅ Fine-tune Llama 3.1 8B using Unsloth (Google Colab)

✅ Triple-Route Classifier (Factual / Vibe / Unknown)

✅ Identity Core (Static facts) + Temporal RAG (Time-decayed memories)

✅ Verifier Agent (Checks if RAG evidence answers the question)

✅ Rolling Context Window (Last 5 conversation turns)

✅ Unified Voice Renderer (One voice across all paths)

✅ Telegram Bot Integration (Webhooks)

✅ Discord Bot Integration (Gateway / WebSocket)

✅ Gmail Integration (Pub/Sub push notifications)

✅ Celery Background Workers (Async processing with random delays)

✅ Web Dashboard (Next.js / Tailwind)

✅ Human Override (Pending approvals for low-confidence replies)

2.2 Out-of-Scope (Dev Exclusions)
❌ WhatsApp Integration (Requires paid Business Account)

❌ Multi-tenancy for hundreds of users

❌ High Availability / Load Balancing

❌ Enterprise-grade security / SOC2

❌ Mobile Apps (Web-only dashboard)

❌ Persistent PostgreSQL (We use local JSON + Qdrant only)

3. Folder Structure (Monorepo)
text
digital-twin-autopilot/
│
├── backend/                         # FastAPI + Celery
│   ├── app/
│   │   ├── api/                     # Webhook endpoints
│   │   │   ├── webhooks/
│   │   │   │   ├── telegram.py      # POST /webhook/telegram
│   │   │   │   ├── discord.py       # POST /webhook/discord
│   │   │   │   └── email.py         # POST /webhook/email
│   │   │   └── routes.py            # Health, Dashboard API
│   │   │
│   │   ├── core/                    # AI Engine (The Clone)
│   │   │   ├── router.py            # Triple-Route Classifier (LangGraph)
│   │   │   ├── memory.py            # Identity Core + Temporal RAG (Qdrant)
│   │   │   ├── verifier.py          # Evidence Checker
│   │   │   ├── renderer.py          # Unified Voice Renderer
│   │   │   └── context.py           # Rolling Window Manager
│   │   │
│   │   ├── workers/                 # Celery Background Tasks
│   │   │   ├── tasks.py             # process_message_task
│   │   │   └── delays.py            # Randomized delay logic
│   │   │
│   │   ├── services/                # External Platform Integrations
│   │   │   ├── telegram.py          # Send message via Bot API
│   │   │   ├── discord.py           # Send message via Gateway
│   │   │   └── gmail.py             # Send email via Gmail API
│   │   │
│   │   ├── models/                  # Pydantic Schemas
│   │   │   ├── messages.py
│   │   │   └── user_config.py
│   │   │
│   │   └── config.py                # Load environment variables
│   │
│   ├── data/                        # Local storage (Dev only)
│   │   ├── identity_core.json       # User's permanent facts
│   │   └── chat_exports/            # Place chat history files here
│   │
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile                   # Local dev container (optional)
│
├── frontend/                        # Next.js Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx             # Dashboard homepage
│   │   │   ├── approvals/           # Pending approvals page
│   │   │   └── api/                 # Next.js API (dashboard calls only)
│   │   ├── components/
│   │   │   ├── ActivityFeed.tsx
│   │   │   ├── StatusCard.tsx
│   │   │   └── PlatformToggle.tsx
│   │   └── lib/
│   │       └── socket.ts            # Socket.IO client
│   ├── package.json
│   └── tailwind.config.js
│
├── scripts/
│   ├── fine_tune.py                 # Unsloth Colab script export
│   └── setup_webhooks.py            # Helper to set Telegram/Discord URLs
│
├── docker-compose.yml               # Local Redis + Qdrant (dev)
├── .env.example                     # All required env variables (see Section 6)
├── README.md
└── PRD.md                           # This file
4. Tech Stack (Development Optimized)
4.1 Mandatory Stack (Will be used)
Layer	Technology	Version	Purpose
Frontend	Next.js	14+	Dashboard UI
Frontend UI	Tailwind CSS	3.x	Styling
Backend API	FastAPI	0.110+	Webhook endpoints + Routing
AI Orchestration	LangGraph	0.2+	Triple-Route State Machine
Task Queue	Celery	5.3+	Background message processing
Broker/Queue	Redis	7.x	Celery broker (via Upstash)
Vector DB	Qdrant	1.9+	Memory storage (Cloud or local)
Primary LLM	Groq API	-	Llama 3.1 8B (14.4k req/day free)
Fallback LLM	Together AI	-	Additional free credits
Embeddings	Sentence-Transformers	2.2+	all-MiniLM-L6-v2 (local)
Fine-Tuning	Unsloth + Colab	-	LoRA on Llama 3.1 8B
Platform SDKs	python-telegram-bot / discord.py / google-api-python-client	Latest	Integrations
Tunneling (Dev)	Ngrok	Latest	Expose local backend to webhooks
4.2 Hosting (Free Tier for Dev/Demo)
Service	Tier	Limits	Used For
Vercel	Hobby	Unlimited static	Frontend Hosting
Render	Free	512MB RAM, sleeps after 15m	Backend Web + Worker
Upstash	Free	256MB, 10k cmd/day	Redis Broker
Qdrant Cloud	Free	1GB RAM, 4GB Disk	Vector Storage
Google Colab	Free	T4 GPU (12GB VRAM)	Fine-tuning
Ngrok	Free	4k req/min, URL changes	Local tunneling
5. Core Architecture Flow (Development Implementation)
6. Required Environment Variables (The "Ask Us" Section)
⚠️ The AI/SysOps team will ask the user for the following EXACT values during onboarding.
(These must be placed in the .env file on Render and locally).

Variable Name	Where to Get It	Example Value
TELEGRAM_BOT_TOKEN	@BotFather on Telegram	123456:ABC-DEF1234ghIkl-zyx57W2
DISCORD_BOT_TOKEN	Discord Developer Portal	MTIzNDU2Nzg5MDEyMzQ1Njc4.G...
GROQ_API_KEY	console.groq.com (Free Signup)	gsk_abc123def456...
TOGETHER_API_KEY	api.together.xyz (Free Credits)	abc123def456...
QDRANT_URL	Qdrant Cloud Cluster URL	https://xyz-example.cloud.qdrant.io
QDRANT_API_KEY	Qdrant Cloud Access Key	abc-123-def-456
REDIS_URL	Upstash Redis REST URL	redis://default:pass@fly-xyz.upstash.io:6379
GMAIL_OAUTH_CREDENTIALS	Google Cloud Console (JSON string)	{"web":{"client_id":"..."}}
GMAIL_PUBSUB_TOPIC	Google Cloud Pub/Sub Topic Name	projects/your-project/topics/email-notifications
WEBHOOK_BASE_URL	Your Render or Ngrok public URL	https://your-app.onrender.com
User Must Provide During Setup:

Chat export file (.txt, .json, .csv) for training.

Preferred Formality Dial Level (1 = Casual, 5 = Professional).

Preferred Reply Delay Range (e.g., 30 to 120 seconds).

7. Human-Like Texting Behavior (Dev Implementation)
These features are explicitly added to the renderer to pass the "Turing Test" during the demo.

Feature	Implementation Detail	File Location
Bubble Splitting	Split long replies into 2-3 short messages with 400ms intervals	renderer.py
Typing Simulation	delay = (len(reply)/10)*800ms + random(200ms)	delays.py
Messy Text Preservation	Do NOT lowercase/clean training data; keep typos and slang	data_ingestion.py
Variable Length Sampling	Generate replies within the user's historical 40th-80th percentile length	router.py
Formality Dial	Adjust slang density and greetings (1-5 scale)	renderer.py
8. Development Setup Instructions
Step 1: Clone & Environment
bash
git clone <repo-url>
cd digital-twin-autopilot
cp .env.example .env
# Fill .env with keys from Section 6
Step 2: Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run Redis locally (or use Upstash via .env)
docker run -d -p 6379:6379 redis

# Start FastAPI (Terminal 1)
uvicorn app.api.routes:app --reload --port 8000

# Start Celery Worker (Terminal 2)
celery -A app.workers.tasks worker --loglevel=info
Step 3: Frontend Setup
bash
cd frontend
npm install
npm run dev  # Runs on localhost:3000
Step 4: Tunneling (For Webhooks)
bash
ngrok http 8000
# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Set it as WEBHOOK_BASE_URL in .env
# Run: python scripts/setup_webhooks.py (to update Telegram/Discord webhooks)
Step 5: Fine-Tune the Clone
bash
# Run the Unsloth notebook in Google Colab (provided in /scripts/fine_tune.ipynb)
# Export model to GGUF and place in /backend/data/model/
9. Constraints & Free-Tier Caveats
During the pitch, explicitly mention these to judges to show you understand production tradeoffs.

Constraint	Impact	Mitigation (Dev)
Render Sleeps after 15 mins	Webhooks may have 10-30s cold start	Keep the Worker awake manually, or use a cron job to ping every 14 mins
Groq 14.4k req/day	Fine for <100 messages/day	Use Together AI fallback for bursts
Ngrok URL changes	Breaks Telegram webhook	Run scripts/setup_webhooks.py after each restart
No Custom Models on Groq	Can't serve fine-tuned LoRA via Groq	Serve fine-tuned model locally via Ollama during demo, or use a high-quality system prompt on Groq's base model
Gmail 100 sends/day	Fine for personal demo	Warn judges not to spam emails
No persistence for User config	Config resets on redeploy	Store preferences in data/user_config.json (committed to local only)
10. Success Criteria (For Hackathon Demo)
Demonstrate 3 Platforms: Show a live Telegram message, a Discord message, and an Email being replied to automatically.

Show "Cloning": Open the dashboard, compare a generic ChatGPT reply vs. the Clone's reply for the same prompt—highlight slang, typos, and "I don't know" deflections.

Show Intelligence: Ask a factual question ("What's my mom's name?") and a vibe question ("What do you think about AI?"). Show the Identity Core + Verifier working.

Show UX Magic: Point out the 45-second delay, the bubble splitting, and the "typing..." simulation.

11. Summary
This PRD defines a Development-Only MVP for a Digital Twin Autopilot. All tools are free (Vercel, Render, Upstash, Qdrant, Groq, Colab). The architecture uses Celery for async processing, LangGraph for routing, and a hybrid RAG + Fine-tuned model for personality.

Key Differentiator vs. Other Teams: Human-like UX delays + "Three Paths, One Voice" + Verifier Agent against fake facts.

Next Step: Start Phase 1. Ensure .env is populated with the keys listed in Section 6 before running the setup script.




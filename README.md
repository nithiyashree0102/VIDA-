# 🧠 VIDA – AI Memory Companion

> Connect your thoughts. Understand your journey.

VIDA is an AI-powered memory companion that helps users capture thoughts, identify recurring patterns, and visualize relationships between memories using an interactive Knowledge Graph.
Built as a full-stack web application, VIDA transforms simple text memories into structured knowledge using AI-powered entity extraction and relationship analysis.

Features

- 📝 Capture personal memories and thoughts
- 🤖 AI-powered memory analysis
- 🧩 Automatic entity extraction
- 🔗 Knowledge Graph visualization
- 💡 AI-generated insights from recurring memories
- 📊 Memory statistics dashboard
- 🌙 Light & Dark mode support
- ⚡ Fast React + Express architecture

Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Flow
- Vite

### Backend

- Node.js
- Express.js
- TypeScript

### AI

- OpenAI Responses API
- JSON Schema Structured Output

 Project Structure
 
VIDA
│
├── client
│   ├── src
│   ├── components
│   ├── lib
│   └── assets
│
├── server
│   ├── routes
│   ├── services
│   ├── types
│   └── storage
│
└── README.md
 Installation

## Clone Repository

```bash
git clone https://github.com/nithiyashree00102/VIDA.git
```


## Backend

```bash
cd server

npm install

npm run dev
```

Backend runs on

```
http://localhost:3001
```

---

## Frontend

```bash
cd client

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# How VIDA Works

### Step 1

User captures a memory.

↓

### Step 2

The backend sends the memory to the AI analysis service.

↓

### Step 3

The AI extracts:

- Summary
- Entities
- Goals
- Relationships

↓

### Step 4

The memory is stored locally.

↓

### Step 5

VIDA generates:

- Knowledge Graph
- AI Insights
- Statistics Dashboard


# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/health | Server Health |
| GET | /api/memories | Get all memories |
| POST | /api/memories | Save a memory |
| GET | /api/graph | Knowledge Graph |
| GET | /api/insights | AI Insights |
| GET | /api/stats | Dashboard Statistics |


# 🎯 Future Improvements

- User Authentication
- Cloud Database
- Semantic Search
- Memory Timeline
- Voice Notes
- Image Memories
- AI Chat with Memories
- Multi-device Sync

## 🤖 AI Assistance

This project was developed with the help of OpenAI's ChatGPT and Codex during the development process.

AI assistance was used for:
- Brainstorming the project architecture.
- Designing the Express.js REST API.
- Building React and TypeScript components.
- Debugging frontend and backend integration.
- Improving the Knowledge Graph implementation.
- Refining the UI and user experience.

All project design decisions, implementation, testing, and integration were completed by the developer.


# 👩‍💻 Developer

**Nithiya Shree**

Computer Science Engineering Student

Passionate about AI, Product Development, and Human-Centered Technology.


# 📜 License

This project was developed for educational and hackathon purposes.

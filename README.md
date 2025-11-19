# FocusFlow

A lightweight focus assistant that helps you break big tasks into subtasks, stay on track with Pomodoro timers, and get AI guidance.

## Features

- 🎯 **AI-Powered Task Breakdown** - Automatically generates 3-7 actionable subtasks from your big goals
- ⏱️ **Pomodoro Timer** - 25-minute focus sessions to keep you on track
- 🤖 **AI Reflection** - Get feedback on your work, drift warnings, and encouragement
- 📊 **Session History** - Review all your past focus sessions
- 💾 **LocalStorage Persistence** - All data stored locally in your browser

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** components
- **OpenAI API** (GPT-4o-mini)
- **LocalStorage** (no database needed)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

3. **Add your OpenAI API key to `.env.local`:**
```bash
OPENAI_API_KEY=sk-your-key-here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
focusflow/
├── app/
│   ├── api/
│   │   ├── subtasks/      # AI subtask generation endpoint
│   │   └── reflection/    # AI reflection endpoint
│   ├── new/               # Create new task page
│   ├── history/           # Session history page
│   ├── page.tsx           # Dashboard (home page)
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Timer.tsx          # Pomodoro timer
│   ├── ReflectionModal.tsx # Session reflection modal
│   ├── SubtaskList.tsx    # Subtask list display
│   └── SessionCard.tsx    # Session history card
├── lib/
│   ├── storage.ts         # LocalStorage utilities
│   └── utils.ts           # Utility functions
└── Documentation files:
    ├── frontend.md        # Frontend architecture & components
    ├── backend.md         # API routes & business logic
    └── api.md            # API endpoint documentation
```

## Usage

1. **Create a Task:**
   - Click "New Task" on the dashboard
   - Enter your big task (e.g., "Finish the landing page for my app")
   - Click "Generate Subtasks"
   - AI will break it down into 3-7 actionable subtasks

2. **Start a Focus Session:**
   - Choose a subtask from the list
   - Click "Start" to begin a 25-minute Pomodoro timer
   - Work on your subtask

3. **Reflect:**
   - When the timer completes, a reflection modal opens
   - Describe what you worked on
   - Mark if you finished the subtask
   - Get AI feedback on your progress

4. **Review History:**
   - Visit the History page to see all past sessions
   - Review AI feedback and track your progress

## Documentation

- **[Frontend Documentation](./frontend.md)** - Components, pages, and UI architecture
- **[Backend Documentation](./backend.md)** - API routes and business logic
- **[API Documentation](./api.md)** - API endpoint reference

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `OPENAI_API_KEY` in environment variables
4. Deploy!

The API routes will work automatically as serverless functions.

## LocalStorage Keys

- `focusflow-current-task` - Current big task and subtasks
- `focusflow-sessions` - All past sessions

**Note:** Clearing browser data will delete all your tasks and sessions.

## Cost Considerations

- Uses GPT-4o-mini for cost efficiency
- Estimated cost: ~$0.001-0.002 per session
- Two AI calls per session (subtask generation + reflection)

## License

MIT

## Contributing

This is a prototype project. Feel free to fork and modify for your needs!

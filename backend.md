# Backend Documentation

## Overview
This is a serverless Next.js application with no traditional backend. All business logic and data persistence happens on the client side (LocalStorage). The only server-side code consists of two API routes that handle OpenAI API calls.

## API Routes

### `/api/subtasks` (`app/api/subtasks/route.ts`)
**What it does:** Generates 3-7 actionable subtasks from a user's big task using OpenAI.

**What it contains:**
- POST endpoint handler
- OpenAI API integration
- Input validation
- Error handling

**How it works:**
1. Receives POST request with `{ task: string }`
2. Validates input (checks for task string)
3. Checks for `OPENAI_API_KEY` environment variable
4. Constructs prompt asking AI to break task into subtasks
5. Calls OpenAI GPT-4o-mini model
6. Parses response (splits by newlines, filters empty lines)
7. Returns `{ subtasks: string[] }` (max 7 items)

**Request format:**
```typescript
POST /api/subtasks
Content-Type: application/json

{
  "task": "Finish the landing page for my app"
}
```

**Response format:**
```typescript
{
  "subtasks": [
    "Design the hero section",
    "Create responsive layout",
    "Add call-to-action buttons",
    "Implement form validation",
    "Optimize images and assets"
  ]
}
```

**Error responses:**
- `400` - Missing or invalid task
- `500` - OpenAI API key not configured or API error

**What you can change safely:**
- Prompt text (to change AI behavior)
- Model selection (currently `gpt-4o-mini`)
- Temperature and max_tokens parameters
- Response parsing logic (if AI output format changes)
- Error messages

**What to avoid:**
- Don't remove input validation
- Don't change the request/response structure without updating frontend
- Don't remove error handling
- Don't expose API key in responses

**Impact of modifications:**
- Changing prompt will affect subtask quality
- Changing model will affect cost and speed
- Removing validation will cause runtime errors
- Changing response structure will break frontend

**Environment variables:**
- `OPENAI_API_KEY` (required) - Your OpenAI API key

---

### `/api/reflection` (`app/api/reflection/route.ts`)
**What it does:** Analyzes a user's work session and provides AI feedback on drift, next steps, and encouragement.

**What it contains:**
- POST endpoint handler
- OpenAI API integration with JSON mode
- Input validation
- Error handling with fallback responses

**How it works:**
1. Receives POST request with `{ subtask, userNotes, finished }`
2. Validates all required fields
3. Checks for `OPENAI_API_KEY` environment variable
4. Constructs prompt asking AI to analyze the session
5. Calls OpenAI GPT-4o-mini with `response_format: { type: "json_object" }`
6. Parses JSON response
7. Returns structured feedback object
8. Falls back to default response if parsing fails

**Request format:**
```typescript
POST /api/reflection
Content-Type: application/json

{
  "subtask": "Design the hero section",
  "userNotes": "I worked on the layout and added some placeholder text",
  "finished": false
}
```

**Response format:**
```typescript
{
  "drift": false,
  "driftMessage": "You seem to have focused on layout instead of design...",
  "nextStep": "Continue refining the hero section design",
  "encouragement": "Great progress! Keep iterating on the design."
}
```

**Error responses:**
- `400` - Missing required fields
- `500` - OpenAI API key not configured or API error

**What you can change safely:**
- Prompt text (to change AI analysis style)
- Model selection
- Temperature and max_tokens parameters
- Fallback response values
- JSON parsing error handling

**What to avoid:**
- Don't remove input validation
- Don't change the request/response structure without updating frontend
- Don't remove JSON mode (ensures valid JSON)
- Don't remove fallback responses (handles API failures gracefully)

**Impact of modifications:**
- Changing prompt will affect feedback quality
- Removing JSON mode will cause parsing errors
- Removing fallbacks will break user experience on API failures
- Changing response structure will break frontend

**Environment variables:**
- `OPENAI_API_KEY` (required) - Your OpenAI API key

---

## Data Persistence

### LocalStorage
All data is stored in the browser's LocalStorage. No server-side database exists.

**Storage keys:**
- `focusflow-current-task` - Current big task and subtasks
- `focusflow-sessions` - Array of all past sessions

**Storage utilities:** See `lib/storage.ts` in frontend documentation.

**What you can change safely:**
- Add new LocalStorage keys for new features
- Change data structures (with migration logic)

**What to avoid:**
- Don't change existing key names (breaks existing user data)
- Don't remove data migration when changing structures
- Don't store sensitive data (LocalStorage is not secure)

---

## Business Logic

### Task Management
- Tasks are broken down into subtasks via AI
- Subtasks have three states: pending, in_progress, done
- Only one subtask can be in_progress at a time (enforced by UI)

### Session Management
- Each Pomodoro session (25 minutes) creates a reflection opportunity
- Sessions are saved with timestamp, notes, and AI feedback
- Sessions are never deleted automatically (user must clear manually)

### AI Integration
- Uses OpenAI GPT-4o-mini for cost efficiency
- Two AI calls per session: subtask generation and reflection
- Both calls have error handling and fallbacks

**What you can change safely:**
- Add new AI endpoints for new features
- Change AI models (consider cost implications)
- Add caching for AI responses (to reduce API calls)

**What to avoid:**
- Don't remove error handling
- Don't expose API keys
- Don't make AI calls without rate limiting (if adding more features)

---

## Environment Setup

### Required Environment Variables
```bash
OPENAI_API_KEY=sk-...
```

**Setup:**
1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key
3. Restart the dev server

**What you can change safely:**
- Add new environment variables for new features
- Change variable names (update all references)

**What to avoid:**
- Don't commit `.env.local` to version control
- Don't hardcode API keys in source code
- Don't expose API keys in client-side code

---

## Deployment Considerations

### Vercel (Recommended)
- API routes work automatically as serverless functions
- Environment variables can be set in Vercel dashboard
- No additional configuration needed

### Other Platforms
- Ensure Next.js API routes are supported
- Set environment variables in platform settings
- Ensure Node.js runtime is available

**What you can change safely:**
- Add new API routes
- Change deployment platform (with proper configuration)

**What to avoid:**
- Don't assume server-side state (each request is stateless)
- Don't use file system for storage (use LocalStorage or external DB)
- Don't make long-running operations (serverless function timeout limits)

---

## Suggestions for Improvement

1. **Add rate limiting** - Prevent abuse of AI endpoints
2. **Add caching** - Cache common subtask patterns to reduce API calls
3. **Add analytics** - Track API usage and costs
4. **Add retry logic** - Retry failed AI calls with exponential backoff
5. **Add request validation** - Use Zod or similar for type-safe validation
6. **Add logging** - Log API calls for debugging (without exposing sensitive data)
7. **Add monitoring** - Monitor API response times and error rates
8. **Add cost tracking** - Track OpenAI API costs per user/session
9. **Add webhooks** - Optional webhook support for external integrations
10. **Add batch processing** - Process multiple reflections in parallel (if needed)


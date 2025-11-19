# API Documentation

## Overview
FocusFlow has two API endpoints, both serverless Next.js API routes that interact with OpenAI. All endpoints are POST-only and return JSON.

## Base URL
- Development: `http://localhost:3000`
- Production: Your deployed domain

---

## Endpoints

### POST `/api/subtasks`

Generates actionable subtasks from a user's big task description.

**Request:**
```typescript
POST /api/subtasks
Content-Type: application/json

{
  "task": string  // The big task description
}
```

**Response (Success - 200):**
```typescript
{
  "subtasks": string[]  // Array of 3-7 subtask titles
}
```

**Response (Error - 400):**
```typescript
{
  "error": "Task is required"
}
```

**Response (Error - 500):**
```typescript
{
  "error": "OpenAI API key not configured" | "Failed to generate subtasks"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{"task": "Finish the landing page for my app"}'
```

**Response:**
```json
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

**Notes:**
- Returns 3-7 subtasks (AI may generate more, but we limit to 7)
- Subtasks are returned as plain strings (no IDs or metadata)
- Frontend generates unique IDs when creating `Subtask` objects
- Uses GPT-4o-mini model for cost efficiency

---

### POST `/api/reflection`

Analyzes a user's work session and provides AI feedback.

**Request:**
```typescript
POST /api/reflection
Content-Type: application/json

{
  "subtask": string,        // The subtask the user worked on
  "userNotes": string,      // What the user says they did
  "finished": boolean       // Whether the subtask was completed
}
```

**Response (Success - 200):**
```typescript
{
  "drift": boolean,                    // Whether user drifted off task
  "driftMessage"?: string,              // Warning message (only if drift is true)
  "nextStep": string,                  // Recommended next action
  "encouragement": string               // Encouraging message
}
```

**Response (Error - 400):**
```typescript
{
  "error": "subtask, userNotes, and finished are required"
}
```

**Response (Error - 500):**
```typescript
{
  "error": "OpenAI API key not configured" | "Failed to generate reflection"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/reflection \
  -H "Content-Type: application/json" \
  -d '{
    "subtask": "Design the hero section",
    "userNotes": "I worked on the layout and added some placeholder text",
    "finished": false
  }'
```

**Response:**
```json
{
  "drift": false,
  "nextStep": "Continue refining the hero section design and add real content",
  "encouragement": "Good progress on the layout! Keep iterating on the design."
}
```

**Example with drift:**
```json
{
  "drift": true,
  "driftMessage": "You seem to have focused on layout instead of design. Consider refocusing on visual design elements.",
  "nextStep": "Refocus on the visual design of the hero section",
  "encouragement": "It's easy to get sidetracked. Refocus and you'll make great progress!"
}
```

**Notes:**
- Uses JSON mode to ensure valid JSON responses
- Falls back to default response if JSON parsing fails
- `driftMessage` is only present when `drift` is `true`
- All string fields are always present (even if empty)

---

## Error Handling

All endpoints follow consistent error handling:

1. **400 Bad Request** - Invalid or missing input
2. **500 Internal Server Error** - Server/API errors

Error responses always include an `error` field with a descriptive message.

**Client-side handling:**
- Frontend checks `response.ok` before parsing JSON
- Displays error messages to users
- Falls back gracefully when API calls fail

---

## Authentication

Currently, no authentication is required. API endpoints are publicly accessible.

**Security considerations:**
- API keys are stored server-side (environment variables)
- No user authentication means anyone can call the endpoints
- Consider adding rate limiting for production use
- Consider adding API key authentication if exposing publicly

---

## Rate Limiting

No rate limiting is currently implemented.

**Recommendations:**
- Add rate limiting per IP address
- Consider user-based rate limiting if adding authentication
- Monitor OpenAI API usage to prevent cost overruns

---

## CORS

CORS is handled automatically by Next.js API routes. No additional configuration needed for same-origin requests.

For cross-origin requests, you may need to add CORS headers.

---

## Testing

### Manual Testing
Use `curl` or Postman to test endpoints:

```bash
# Test subtasks endpoint
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{"task": "Build a todo app"}'

# Test reflection endpoint
curl -X POST http://localhost:3000/api/reflection \
  -H "Content-Type: application/json" \
  -d '{
    "subtask": "Set up project structure",
    "userNotes": "Created folders and installed dependencies",
    "finished": true
  }'
```

### Frontend Integration
Endpoints are called from:
- `app/new/page.tsx` - Calls `/api/subtasks`
- `components/ReflectionModal.tsx` - Calls `/api/reflection`

---

## Environment Variables

Both endpoints require:
- `OPENAI_API_KEY` - Your OpenAI API key

Set in `.env.local`:
```bash
OPENAI_API_KEY=sk-...
```

---

## Cost Considerations

### OpenAI API Costs
- Model: GPT-4o-mini (cost-effective)
- Average tokens per request:
  - Subtasks: ~100-200 tokens
  - Reflection: ~150-300 tokens
- Estimated cost per session: ~$0.001-0.002

### Optimization Tips
1. Cache common subtask patterns
2. Use shorter prompts where possible
3. Consider using cheaper models for simple tasks
4. Implement request caching for identical inputs

---

## Future Enhancements

1. **Add request validation** - Use Zod schemas
2. **Add response caching** - Cache identical requests
3. **Add batch processing** - Process multiple requests at once
4. **Add webhooks** - Notify external services
5. **Add analytics** - Track usage and costs
6. **Add versioning** - Version API endpoints
7. **Add OpenAPI/Swagger docs** - Auto-generated API docs
8. **Add rate limiting** - Prevent abuse
9. **Add authentication** - Secure endpoints
10. **Add monitoring** - Track performance and errors


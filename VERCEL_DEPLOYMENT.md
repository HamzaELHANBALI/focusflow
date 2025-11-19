# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 404 NOT_FOUND Error

If you're seeing a `404: NOT_FOUND` error when deploying to Vercel, this usually means:

1. **The route handler is throwing an error during initialization** (most common)
2. **Environment variable is missing** (causes early return that might appear as 404)
3. **Build issue** (routes not being included in build)

**Quick Diagnostic Steps:**

1. **Test the health endpoint:**
   Visit: `https://your-domain.vercel.app/api/health`
   - If this works → API routes are being built correctly
   - If this also 404s → There's a build or routing issue

2. **Check Vercel Function Logs:**
   - Go to your Vercel project → **Deployments** → Click on deployment
   - Go to **Functions** tab
   - Look for any errors or warnings
   - Check if the functions are listed (should see `/api/subtasks` and `/api/reflection`)

3. **Verify Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Ensure `OPENAI_API_KEY` is set for **all environments**
   - The key should start with `sk-`
   - After adding, **redeploy** (environment variables require redeploy)

4. **Check Build Logs:**
   - Look for TypeScript errors
   - Look for missing dependencies
   - Ensure build completes successfully

**If health endpoint works but other routes 404:**

The issue is likely in the route handler. Check the following:

#### 1. Environment Variables
**Most Common Cause:** Missing `OPENAI_API_KEY` in Vercel environment variables.

**Solution:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add `OPENAI_API_KEY` with your OpenAI API key value
4. Make sure to select all environments (Production, Preview, Development)
5. Redeploy your application

#### 2. API Route Configuration
The API routes are configured with:
- `runtime = "nodejs"` (required for OpenAI SDK)
- `dynamic = "force-dynamic"` (prevents static optimization)

If routes still don't work, verify:
- Routes are in `app/api/subtasks/route.ts` and `app/api/reflection/route.ts`
- Both files export `POST` handlers
- Files are committed to your repository

#### 3. Build Logs
Check Vercel build logs for errors:
1. Go to your project → **Deployments**
2. Click on the failed deployment
3. Check the **Build Logs** tab
4. Look for TypeScript errors, missing dependencies, or build failures

#### 4. Function Timeout
If API calls are timing out:
- The `vercel.json` file sets `maxDuration: 30` seconds
- OpenAI API calls should complete within this time
- If needed, increase the timeout in `vercel.json`

#### 5. Testing API Routes Locally
Before deploying, test locally:
```bash
# Start dev server
npm run dev

# Test subtasks endpoint
curl -X POST http://localhost:3000/api/subtasks \
  -H "Content-Type: application/json" \
  -d '{"task": "Test task"}'

# Test reflection endpoint
curl -X POST http://localhost:3000/api/reflection \
  -H "Content-Type: application/json" \
  -d '{
    "subtask": "Test subtask",
    "userNotes": "Test notes",
    "finished": false
  }'
```

#### 6. Verify Route Structure
Ensure your file structure matches:
```
app/
  api/
    subtasks/
      route.ts
    reflection/
      route.ts
```

#### 7. Check Network Tab
In your browser's developer tools:
1. Open **Network** tab
2. Try making a request (e.g., create a new task)
3. Check if the request is going to the correct URL
4. Verify the request method is POST
5. Check the response status and error message

## Deployment Checklist

- [ ] Environment variable `OPENAI_API_KEY` is set in Vercel
- [ ] All files are committed to your repository
- [ ] Build completes successfully (check build logs)
- [ ] API routes are accessible (test with curl or Postman)
- [ ] Frontend can successfully call API routes
- [ ] No TypeScript errors in build logs
- [ ] All dependencies are installed (`npm install` completes)

## Quick Fixes

### Re-deploy after fixing environment variables:
1. Update environment variables in Vercel dashboard
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Or push a new commit to trigger a new deployment

### Clear Vercel cache:
1. Go to **Settings** → **General**
2. Scroll to **Clear Build Cache**
3. Click **Clear** and redeploy

### Verify API routes are working:
Visit these URLs in your browser (should return 405 Method Not Allowed for GET):
- `https://your-domain.vercel.app/api/subtasks`
- `https://your-domain.vercel.app/api/reflection`

If you get 404, the routes aren't being found. If you get 405, the routes exist but need POST requests.

## Still Having Issues?

1. **Check Vercel Function Logs:**
   - Go to **Deployments** → Select deployment → **Functions** tab
   - Check for runtime errors

2. **Test with Postman/curl:**
   - Test API routes directly to isolate frontend vs backend issues

3. **Compare with local:**
   - If it works locally but not on Vercel, it's likely an environment variable issue

4. **Check Next.js version compatibility:**
   - Ensure you're using Next.js 16+ (App Router)
   - Check `package.json` for correct version


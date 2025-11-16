 Deploy notes for DocsenderF (frontend)

This project is a Vite React SPA. Client-side routing is handled by React Router (BrowserRouter). When deploying a SPA to Vercel, visiting subpaths such as `/send` or `/combine` will return 404 unless the server rewrites the request to `index.html` so React Router can handle it.

Quick fixes:

1. Add `vercel.json` with a rewrite rule so the server returns `index.html` for all routes:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. For environment variables, set `REACT_APP_API_BASE_URL` to your backend API URL (Render or other host).
   - For Vercel: Project -> Settings -> Environment Variables -> add `REACT_APP_API_BASE_URL` with value `https://db-74vi.onrender.com` (or your backend URL).

3. Ensure `package.json` build script works on Vercel (we added `postinstall` permission fix and fallback to run the Vite binary via `node`).

4. To use HashRouter (no server rewrites required), change BrowserRouter to HashRouter in `src/main.jsx`:
```javascript
import { HashRouter as Router } from 'react-router-dom'
<Router>
  ...
</Router>
```
This avoids rewrites but gives URLs like `/#/send`.


Troubleshooting:
- If a page still returns 404, it means Vercel tried to match a file or API route first; verify that `index.html` is present in the deployed `dist` and that `vercel.json` is checked into the repo and used by Vercel.
- If your deployment build failed previously, try `npm run build` locally to ensure the `dist` is buildable.


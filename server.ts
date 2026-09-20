import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const BACKEND_URL =
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://apix-backend-vusx.onrender.com'
      : 'http://127.0.0.1:8000');

  app.use(express.json());

  // Transparent reverse-proxy for all /api endpoints directly to Python FastAPI backend
  app.use('/api', async (req: Request, res: Response) => {
    try {
      const targetUrl = `${BACKEND_URL}/api${req.url}`;
      const headers: Record<string, string> = {};
      if (req.headers['content-type']) {
        headers['content-type'] = req.headers['content-type'] as string;
      }

      const options: RequestInit = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD' && req.body && Object.keys(req.body).length > 0) {
        options.body = JSON.stringify(req.body);
        headers['content-type'] = 'application/json';
      }

      const backendRes = await fetch(targetUrl, options);
      res.status(backendRes.status);

      const contentType = backendRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await backendRes.json();
        res.json(data);
      } else {
        const text = await backendRes.text();
        res.send(text);
      }
    } catch (err: any) {
      console.warn(`[APIx Proxy] FastAPI backend at ${BACKEND_URL} not reachable:`, err.message);
      res.status(502).json({
        error: 'Backend engine offline or restarting',
        detail: 'FastAPI service on http://127.0.0.1:8000 is required for live data.',
      });
    }
  });

  // Vite middleware setup for frontend SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[APIx Web Portal] Live on http://localhost:${PORT} (Proxying to FastAPI at ${BACKEND_URL})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

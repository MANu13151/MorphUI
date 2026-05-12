import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  plugins: [
    {
      name: 'figma-cors-proxy',
      configureServer(server) {
        // Proxy endpoint to bypass CORS when fetching Figma-exported SVGs
        // Browser calls /api/proxy?url=<encoded_figma_s3_url>
        // Server fetches it server-side (no CORS) and returns the content
        server.middlewares.use('/api/proxy', async (req, res) => {
          const reqUrl = new URL(req.url, 'http://localhost');
          const targetUrl = reqUrl.searchParams.get('url');

          if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Missing "url" query parameter');
            return;
          }

          try {
            const response = await fetch(targetUrl);

            if (!response.ok) {
              res.writeHead(response.status, { 'Content-Type': 'text/plain' });
              res.end(`Upstream error: ${response.status} ${response.statusText}`);
              return;
            }

            const contentType = response.headers.get('content-type') || 'application/octet-stream';
            const body = await response.text();

            res.writeHead(200, {
              'Content-Type': contentType,
              'Access-Control-Allow-Origin': '*',
              'Cache-Control': 'public, max-age=300',
            });
            res.end(body);
          } catch (err) {
            res.writeHead(502, { 'Content-Type': 'text/plain' });
            res.end(`Proxy fetch failed: ${err.message}`);
          }
        });
      },
    },
  ],
});

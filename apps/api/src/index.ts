import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();
const api = app.basePath('/api/v1');

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

api.doc('/docs', {
  openapi: '3.0.0',
  info: {
    title: 'TEMS API',
    version: process.env.npm_package_version!,
  },
});
api.get('/docs/ui', swaggerUI({ url: '/api/v1/docs' }));

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

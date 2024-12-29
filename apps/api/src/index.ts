import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import admins from './application/routes/adminRoute.js';
import login from './application/routes/loginRoute.js';
import members from './application/routes/memberRoute.js';

const app = new OpenAPIHono();
const api = app.basePath('/api/v1');

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

api.openAPIRegistry.registerComponent('securitySchemes', 'JWT', {
  type: 'http',
  in: 'header',
  scheme: 'bearer',
  description: 'JWT Access Token',
});

api.route('/members', members);
api.route('/admins', admins);
api.route('/login', login);

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

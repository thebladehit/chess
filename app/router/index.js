import { HOST } from "#app/config/app.js";

const routes = [];

export function addRoute(url, callback) {
  routes.push({ url, callback });
}

export function runRouter(request, response) {
  const parsedUrl = new URL(request.url, HOST)
  for (const route of routes) {
    if (route.url === parsedUrl.pathname) {
      route.callback(request, response, parsedUrl);
      return;
    }
  }
  response.writeHead(404);
  response.end('Not found');
}
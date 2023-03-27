const routes = [];

export function addRoute(url, callback) {
  routes.push({ url, callback });
}

export function runRouter(request, response) {
  for (const route of routes) {
    if (request.url === route.url) {
      route.callback(request, response);
      return;
    }
  }
  response.writeHead(404);
  response.end('Not found');
}
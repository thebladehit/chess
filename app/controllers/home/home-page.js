import fs from 'fs';

export default async (request, response) => {
  try {
    const data = await fs.promises.readFile('./public/index.html', 'utf-8');
    response.writeHead(200);
    response.end(data);
  } catch (e) {
    console.log(e);
    response.writeHead(404);
    response.end('Can not found');
  }
}
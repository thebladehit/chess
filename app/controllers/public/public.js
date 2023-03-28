import fs from 'fs';

export default async (request, response, parsedUrl) => {
  try {
    const file = parsedUrl.searchParams.get('');
    const data = await fs.promises.readFile(`./game/${file}`, 'utf-8');
    const splited = file.split('.');

    if (splited[splited.length - 1] === 'js') {
      response.writeHead(200, {'Content-Type': 'text/javascript'});
    } else if (splited[splited.length - 1] === 'css') {
      response.writeHead(200, {'Content-Type': 'text/css'});
    }
    response.end(data);
  } catch (e) {
    console.log(e);
    response.writeHead(404);
    response.end('Can not found');
  }
}
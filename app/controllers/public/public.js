import fs from 'fs';

const types = {
  js: {'Content-Type': 'text/javascript'},
  css: {'Content-Type': 'text/css'},
  png: {'Content-Type': 'image/png'}
};

export default async (request, response, parsedUrl) => {
  try {
    const file = parsedUrl.searchParams.get('');
    const data = await fs.promises.readFile(`./game/${file}`);
    const splited = file.split('.');

    for (const [ext, header] of Object.entries(types)) {
      if (splited[splited.length - 1] === ext) {
        response.writeHead(200, header);
      }
    }
    response.end(data, 'binary');
  } catch (e) {
    console.log(e);
    response.writeHead(404);
    response.end('Can not found');
  }
}
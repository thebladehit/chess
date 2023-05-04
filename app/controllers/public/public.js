import fs from 'fs';

const availableFolder = {
  game: 'game',
  public: 'public'
};

const types = {
  js: {'Content-Type': 'text/javascript'},
  css: {'Content-Type': 'text/css'},
  png: {'Content-Type': 'image/png'}
};

export default async (request, response, parsedUrl) => {
  try {
    const fileName = parsedUrl.searchParams.get('');
    const folderName = fileName.split('/')[0];
    if (!availableFolder[folderName]) {
      throw new Error('Can not reach this folder');
    }
    const data = await fs.promises.readFile(`./${fileName}`);
    const splited = fileName.split('.');
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
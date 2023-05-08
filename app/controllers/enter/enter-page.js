import fs from 'fs';

export default async (request, response, parsedUrl) => {
    try {
        const data = await fs.promises.readFile('./public/enter.html', 'utf-8');
        response.writeHead(200);
        response.end(data);
    } catch (e) {
        console.log(e);
        response.writeHead(404);
        response.end('Something went wrong :(');
    }
}
import 'dotenv/config';
import http from 'http';

import { PORT } from '#app/config/app.js';
import { runRouter, addRoute } from "#app/router/index.js";
import homePage from "#app/controllers/home/home-page.js";
import share from "#app/controllers/public/public.js";

addRoute('/', homePage);
addRoute('/game', share);

const server = http.createServer(runRouter);
server.listen(PORT);
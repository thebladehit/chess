import 'dotenv/config';
import http from 'http';

import { PORT } from '#app/config/app.js';
import { runRouter, addRoute } from "#app/router/index.js";
import homePage from "#app/controllers/home/home-page.js";
import share from "#app/controllers/public/public.js";
import enterPage from "#app/controllers/enter/enter-page.js"
import { enter, autoEnter } from "#app/controllers/enter/enter.js";

addRoute('/', homePage);
addRoute('/getFile', share);
addRoute('/enterPage', enterPage);
addRoute('/enter', enter);
addRoute('/autoEnter', autoEnter);

const server = http.createServer(runRouter);
server.listen(PORT);
import 'dotenv/config';
import http from 'http';

import { PORT } from './app/config/app.js';
import { runRouter, addRoute } from "./app/router/index.html.js";
import mainPage from "./app/controllers/main/main-page.js";

addRoute('/', mainPage);

const server = http.createServer(runRouter);
server.listen(PORT);
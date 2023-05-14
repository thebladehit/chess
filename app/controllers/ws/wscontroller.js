import { USERS } from "#app/stores/users.js";
import Games from "#app/core/games.js";
import { WebSocket } from "ws";

export default (ws) => {
  const GAMES = new Games();
  ws.on('connection', (connection, request) => {
    let user;
    connection.on('message', (message) => {
      message = JSON.parse(message);
      if (message.event === 'authorization') {
        user = USERS.get(message.token);
        if (user) {
          user.connections++;
          user.connection = connection;
          const currentGame = GAMES.getUserCurrentGame(user);
          if (currentGame) {
            connection.send(JSON.stringify({ event: 'gameCurrent', data: currentGame }));
          }
          connection.send(JSON.stringify({ event: 'gamesList', data: GAMES.getAcceptableGames() }));
        }
        else connection.close();
      } else if (message.event === 'gameCreate') {
        const game = GAMES.create(user);
        if (game !== null) {
          connection.send(JSON.stringify({ event: 'gameCreated', data: game.toPublic() }));
          const data = JSON.stringify({ event: 'gamesList', data: GAMES.getAcceptableGames() });
          sendToAll(ws, data);
        }
      } else if (message.event === 'gameJoin') {
        const game = GAMES.games.get(message.data);
        game.u2 = user;
        connection.send(JSON.stringify({ event: 'gameJoined', data: game.toPublic() }));
        game.u1.connection.send(JSON.stringify({ event: 'gameJoined', data: game.toPublic() }));
        const data = JSON.stringify({ event: 'gamesList', data: GAMES.getAcceptableGames() });
        sendToAll(ws, data);
      }
    });
    connection.on('close', () => {
      user.connections--;
    })
  });
}

function sendToAll(ws, data) {
  for (const client of ws.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}
// function createGame(GAMES, user) {
//   return GAMES.create(user);
// }
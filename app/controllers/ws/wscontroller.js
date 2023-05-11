import { USERS } from "#app/stores/users.js";
import Games from "#app/core/games.js";

export default (ws) => {
  const GAMES = new Games();
  ws.on('connection', (connection, request) => {
    let user;
    connection.on('message', (message) => {
      message = JSON.parse(message);
      if (message.event === 'authorization') {
        user = USERS.get(message.token);
        if (user) user.connections++;
      } else if (message.event === 'getGamesData') {
        connection.send(JSON.stringify({ event: 'getGamesData', data: [{id: 1, hoster:'123', action: 'Add'}]}));
      } else if (message.event === 'gameCreate') {
        const game = GAMES.create(user);
        if (game !== null) {
          connection.send(JSON.stringify({ event: 'gameCreated', game: game.toPublic() }));
        }
      }
    });
    connection.on('close', () => {
      user.connections--;
    })
  });
}

// function createGame(GAMES, user) {
//   return GAMES.create(user);
// }
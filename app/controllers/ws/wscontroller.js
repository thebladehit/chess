import { USERS } from "#app/stores/users.js";
import Games from "#app/core/games.js";
import { WebSocket } from "ws";

const messageEvents = {
  authorization: (message, GAMES, connection) => {
    const user = USERS.get(message.token);
    if (!user) return connection.close();

    user.connections++;
    user.connection = connection;

    const currentGame = GAMES.getUserCurrentGame(user);
    if (currentGame) {
      if (currentGame.u1 && currentGame.u2) return sendMessage(connection, { event: 'gameJoined', data: currentGame.toPublic() });
      else return sendMessage(connection, { event: 'gameCurrent', data: currentGame.toPublic() });
    }
    sendMessage(connection, { event: 'gamesList', data: GAMES.getAcceptableGames() });
  },
  gameCreate: (message, GAMES, connection, ws) => {
    const user = findUserByConnection(connection);
    if (!user) return connection.close();

    const game = GAMES.create(user);
    if (game !== null) {
      sendMessage(connection, { event: 'gameCreated', data: game.toPublic() });

      const data = { event: 'gamesList', data: GAMES.getAcceptableGames() };
      sendToAll(ws, data);
    }
  },
  gameJoin: (message, GAMES, connection, ws) => {
    const user = findUserByConnection(connection);
    if (!user) return connection.close();
    const game = GAMES.games.get(message.data);
    game.u2 = user;
    sendMessage(connection, { event: 'gameJoined', data: game.toPublic() });
    sendMessage(game.u1.connection, { event: 'gameJoined', data: game.toPublic() });

    const data = { event: 'gamesList', data: GAMES.getAcceptableGames() };
    sendToAll(ws, data);

    console.log(GAMES.games);
  },
  sendMove: (message, GAMES, connection) => {
    const user = findUserByConnection(connection);
    const game = GAMES.getUserCurrentGame(user);
    sendMessage(user.connection === game.u1.connection ? game.u2.connection : game.u1.connection, 'work ahahhaha');
  }
};


function sendToAll(ws, data) {
  for (const client of ws.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }
}

function sendMessage(connection, data) {
  return connection.send(JSON.stringify(data));
}

function closeConnection(connection) {
  for (const value of USERS.values()) {
    if (connection === value.connection) {
      value.connections--;
    }
  }
}

function findUserByConnection(connection) {
  for (const value of USERS.values()) {
    if (value.connection === connection) {
      return value;
    }
  }
}

function messageListener(message, GAMES, connection, ws) {
  message = JSON.parse(message);

  for (const [eventName, event] of Object.entries(messageEvents)) {
    if (eventName === message.event) {
      event(message, GAMES, connection, ws);
    }
  }
}

export default (ws) => {
  const GAMES = new Games();
  ws.on('connection', (connection, request) => {
    connection.on('message', (message) => messageListener(message, GAMES, connection, ws));
    connection.on('close', () => closeConnection(connection));
  });
}
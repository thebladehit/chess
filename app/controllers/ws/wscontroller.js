import { USERS } from "#app/stores/users.js";

export default (ws) => {
  ws.on('connection', (connection, request) => {
    let user;
    connection.on('message', (message) => {
      message = JSON.parse(message);
      if (message.event === 'authorization') {
        user = USERS.get(message.token);
        if (user) user.connections++;
      } else if (message.event === 'getGamesData') {
        connection.send(JSON.stringify({ event: 'getGamesData', data: [{id: 1, hoster:'123', action: 'Add'}]}));
      }
      console.log(USERS); // console
    });
    connection.on('close', () => {
      user.connections--;
    })
  });
}
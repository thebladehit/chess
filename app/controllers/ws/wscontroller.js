import { USERS } from "#app/stores/users.js";

export default (ws) => {
  ws.on('connection', (connection, request) => {
    let user;
    connection.on('message', (message) => {
      message = JSON.parse(message);
      user = USERS.get(message.token);
      if (message.event === 'authorization' && user) {
        user.connections++;
      }
      console.log(USERS);
    });
    connection.on('close', () => {
      user.connections--;
    })
  });
}
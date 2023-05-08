import { getUsers, setUser } from "#app/stores/users.js";

export function enter(request, response) {
  try {
    const name = request.headers['chess_name'];
    if (name.length < 3) {
      response.end(JSON.stringify({res: false}));
    } else {
      const token = generateToken();
      const user = {
        token,
        name,
        connections: 0
      };
      setUser(user);
      response.writeHead(200);
      response.end(JSON.stringify({res: true, token}));
    }
  } catch (err) {
    console.log(err);
    response.writeHead(500);
    response.end('Something went wrong');
  }
}

export function autoEnter(request, response) {
  const token = request.headers['chess_token'];

  if (token && getUsers().has(token)) {
    response.writeHead(200);
    return response.end(JSON.stringify({ res: true, user: getUsers().get(token) }));
  }
  response.writeHead(401);
  return response.end(JSON.stringify({ res: false }));
}

function generateToken() {
  return Date.now() + '-' + Math.random();
}
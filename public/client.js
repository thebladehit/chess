const token = localStorage.getItem('CHESS_TOKEN');

(async ()=> {
  if (!token) {
    redirect('/enterPage');
  } else {
    if (await autoEnter()) {

      const socket = new WebSocket('ws://localhost:3000');
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ event: 'authorization', token }));
        const btn = document.querySelector('#create');
        btn.addEventListener('click', () => {
          createGame(socket);
        });
      });

      socket.addEventListener('message', (message) => {
        message = JSON.parse(message.data);
        console.log(message);
        if (message.event === 'gamesList') {
          createTrForTable(message.data);
        } else if (message.event === 'gameCreated') {
          console.log(message.game);
          waitingForPlayer();
        } else if (message.event === 'gameCurrent') {
          console.log(message.game);
          waitingForPlayer();
        }
      });

    } else {
      redirect('/enterPage');
    }
  }
})()

async function autoEnter() {
  const response = await fetch(`/autoEnter`, {
    method: 'GET',
    headers: {
      'CHESS_TOKEN': token
    }
  });
  const data = await response.json();
  return data.res;
}

function redirect(url) {
  location.href = url;
}

function createTrForTable(games) {
  const table = document.querySelector('#table');
  for (const game of games) {
    const tr = document.createElement('tr');
    for (const value of Object.values(game)) {
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    table.append(tr);
  }
}

function createGame(socket) {
  socket.send(JSON.stringify({ event: 'gameCreate' }));
  console.log('send game create'); // console
}

function waitingForPlayer() {
  const userZone = document.querySelector('.userZone');
  userZone.innerHTML = `<div class="alert">Waiting for player...</div>`;
}
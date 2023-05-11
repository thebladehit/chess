const token = localStorage.getItem('CHESS_TOKEN');

(async ()=> {
  if (!token) {
    redirect('/enterPage');
  } else {
    if (await autoEnter()) {
      const socket = new WebSocket('ws://localhost:3000');
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ event: 'authorization', token }));
        socket.send(JSON.stringify({ event: 'getGamesData' }));
      });
      socket.addEventListener('message', (message) => {
        message = JSON.parse(message.data);
        if (message.event === 'getGamesData') {
          createMainTable(message.data);
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

async function getGamesData(socket) {
  socket.send(JSON.stringify({ event: 'getGamesData' }))
}

function createMainTable(games) {
  console.log(games);
  const table = document.querySelector('#table');
  for (const game of games) {
    console.log(game)
    const tr = document.createElement('tr');
    for (const value of Object.values(game)) {
      console.log(value);
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(td);
    }
    table.append(tr);
  }
}
const token = localStorage.getItem('CHESS_TOKEN');

(async ()=> {
  if (!token) {
    redirect('/enterPage');
  } else {
    if (await autoEnter()) {
      const socket = new WebSocket('ws://localhost:3000');
      socket.addEventListener('open', () => {
        socket.send(JSON.stringify({ event: 'authorization', token }));
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


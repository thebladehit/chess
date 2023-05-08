const token = localStorage.getItem('CHESS_TOKEN');

if (!token) {
  redirect('/enterPage');
} else {
  autoEnter();
}

async function autoEnter() {
  const response = await fetch(`/autoEnter`, {
    method: 'GET',
    headers: {
      'CHESS_TOKEN': token
    }
  });
  const data = await response.json();
  if (!data.res) {
    redirect('/enterPage');
  }
  console.log('Successful');
}

function redirect(url) {
  location.href = url;
}
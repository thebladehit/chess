const btn = document.querySelector('#btn');
const nameInput = document.querySelector('#name');

btn.addEventListener('click', async () => {
  const name = nameInput.value;
  try {
    const response = await fetch(`/enter`, {
      method: 'GET',
      headers: {
        'CHESS_NAME': name
      }
    });
    const data = await response.json();
    if (data.res) {
      localStorage.setItem('CHESS_TOKEN', data.token);
      localStorage.setItem('CHESS_NAME', name);
      redirect('/');
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.log(err);
  }
});

function redirect(url) {
  location.href = url;
}
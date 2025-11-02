(async () => {
  try {
  const res = await fetch('http://127.0.0.1:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Tushar Sharma', email: 'tushar@example.com', password: '123456', role: 'USER' })
    });
    const text = await res.text();
    console.log('STATUS', res.status);
    console.log(text);
  } catch (err) {
    console.error('FETCH ERROR', err);
  }
})();

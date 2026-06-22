document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginMessage = document.getElementById('login-message');

  if (!loginForm || !usernameInput || !passwordInput || !loginMessage) {
    return;
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      loginMessage.textContent = 'Username dan password wajib diisi.';
      loginMessage.style.color = '#dc2626';
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login gagal');
      }

      if (result.data?.role === 'admin') {
        window.location.href = 'admin.html';
        return;
      }

      loginMessage.textContent = 'Akun ini bukan admin.';
      loginMessage.style.color = '#dc2626';
    } catch (error) {
      loginMessage.textContent = error.message;
      loginMessage.style.color = '#dc2626';
    }
  });
});

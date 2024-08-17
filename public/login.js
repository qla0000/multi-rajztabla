document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Sikeres bejelentkezés!');
            window.location.href = '/index.html'; // Átirányítás a főoldalra
        } else {
            alert(data.message || 'Hiba történt a bejelentkezés során.');
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a bejelentkezés során.');
    }
});
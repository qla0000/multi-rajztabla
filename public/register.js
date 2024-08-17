document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Sikeres regisztráció! Most már bejelentkezhetsz.');
            window.location.href = '/login.html'; // Átirányítás a bejelentkezési oldalra
        } else {
            alert(data.message || 'Hiba történt a regisztráció során.');
        }
    } catch (error) {
        console.error('Hiba:', error);
        alert('Hiba történt a regisztráció során.');
    }
});

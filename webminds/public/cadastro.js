document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');


    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Envia para o srver
        fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Erro ao salvar o usuario:', error);
            });
    });

});


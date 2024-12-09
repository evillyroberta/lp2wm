document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');

    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
        if (!emailRegex.test(email)) {
            alert('coloque um email válido');
            return;
        }


        fetch('/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })
            .then(response => response.json())
            .then(data => {
               if
                 (data.error) {
                    alert('Erro: ' + data.error);
                }
                else {
                    alert('Cadastro realizado com sucesso!');
                }
            })
            .catch(error => {
                console.error('Erro ao salvar o usuário:', error);
                alert('Ocorreu um erro ao tentar realizar o cadastro.'); 
            });
    });
});

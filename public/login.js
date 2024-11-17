document.getElementById('cardForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        
        const response = await fetch('/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();

            // armazena o token
            localStorage.setItem('token', data.token);
            console.log('Token armazenado:', data.token);
            alert('Login realizado com sucesso!');
            
        
            window.location.href = './home.html';
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Ocorreu um erro. Tente novamente.');
    }
});

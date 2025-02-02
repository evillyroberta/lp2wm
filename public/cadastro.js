document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');

    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const image = document.getElementById('inputGroupFile04').files[0]; //

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('image', image); //

        fetch('/cadastro', {
            method: 'POST',
            body: formData, //
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Erro: ' + data.error);
            } else {
                alert('Cadastro realizado com sucesso!');
            }
        })
        .catch(error => {
            console.error('Erro ao salvar o usuário:', error);
            alert('Ocorreu um erro ao tentar realizar o cadastro.');
        });
    });
});

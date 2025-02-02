document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');
    const cardsContainer = document.getElementById('cardsContainer');
    const token = localStorage.getItem('token');
   
    const createCard = (titulo, descricao) => {
        if (titulo && descricao) {  // Verificao se titulo e descricao são válidos
            const novoCard = document.createElement('div');
            novoCard.classList.add('card');

            const tituloElement = document.createElement('h3');
            tituloElement.innerText = titulo;

            const descricaoElement = document.createElement('p');
            descricaoElement.innerText = descricao;

            novoCard.appendChild(tituloElement);
            novoCard.appendChild(descricaoElement);

            cardsContainer.appendChild(novoCard);
        } else {
            console.error('Erro: Título ou descrição são indefinidos');
            alert('Erro: Título ou descrição inválidos.');
        }
    };

    const fetchCards = () => {
        fetch('/cards')
            .then(response => response.json())
            .then(data => {
                cardsContainer.innerHTML = ''; // Limpa os cards existentes
                data.forEach(card => {
                    createCard(card.titulo, card.descricao);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar os cards:', error);
                alert('Erro ao carregar os cards.');
            });
    };

    // Fazer o card
    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if (!titulo || !descricao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Envia para o servidor
        fetch('/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ titulo, descricao })
        })
        .then(response => response.json())
        .then(data => {
            if (data.titulo && data.descricao) {
                console.log('Card salvo no banco de dados:', data);
                createCard(data.titulo, data.descricao);
                cardForm.reset();
            } else {
                console.error('Erro ao criar o card: Título ou descrição indefinidos');
                alert('Erro ao criar o card. Dados inválidos.');
            }
        })
        .catch(error => {
            console.error('Erro ao salvar o card:', error);
            alert('Erro ao salvar o card.');
        });
    });

    fetchCards();
});

fetch("/api/user", {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
    }
})
.then(response => response.json())
.then(data => {
    document.getElementById("user-name").innerText = data.name;
    
    document.getElementById("user-image").src = data.image ;
})
.catch(error => console.error("Erro ao buscar dados do usuário:", error));

function logout() {
    localStorage.removeItem('token');
    window.location.href = './login.html'; 
}


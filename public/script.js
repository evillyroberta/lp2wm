document.addEventListener('DOMContentLoaded', () => {
    const cardForm = document.getElementById('cardForm');
    const cardsContainer = document.getElementById('cardsContainer');
    const token = localStorage.getItem('token');
   
    const createCard = (titulo, descricao) => {
        const novoCard = document.createElement('div');
        novoCard.classList.add('card');

        const tituloElement = document.createElement('h3');
        tituloElement.innerText = titulo;

        const descricaoElement = document.createElement('p');
        descricaoElement.innerText = descricao;

        novoCard.appendChild(tituloElement);
        novoCard.appendChild(descricaoElement);

        cardsContainer.appendChild(novoCard);
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
            });
    };

    // fazer o card
    cardForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        if (!titulo || !descricao) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Envia para o srver
        

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
            console.log('Card salvo no banco de dados:', data);
            createCard(data.titulo, data.descricao);
            cardForm.reset();
        })
        .catch(error => {
            console.error('Erro ao salvar o card:', error);
        });
    });

    
    fetchCards();
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = './login.html'; 
}
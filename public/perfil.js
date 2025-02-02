fetch("/api/user", {
    headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
    }
})
.then(response => response.json())
.then(data => {
    document.getElementById("user-name").innerText = data.name;
    document.getElementById("user-email").innerText = data.email;
    document.getElementById("user-image").src = data.image ;
})
.catch(error => console.error("Erro ao buscar dados do usuário:", error));

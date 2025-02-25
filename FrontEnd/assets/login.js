document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Blocage du rechargement de la page

    const formData = new FormData(e.target);
    const jsonData = Object.fromEntries(formData.entries()); // Convertir FormData en objet JSON

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Indiquer qu'on envoie du JSON
        },
        body: JSON.stringify(jsonData)
    })
        .then((response) => {
            console.log(response);
            if (response.status !== 200) {
                response.json().then((data) => {
                    document.querySelector('.error').textContent = data.message;
                });
            } else {

                response.json().then((data) => {
                    loginToken = data.token;
                    window.location.href = 'index.html';
                });
            }
        })
})
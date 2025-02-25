console.log("bonjour samira");

let loginToken = null;
let works = [];
const gallery = document.querySelector('section#portfolio div.gallery');
const categories = document.querySelector('section#portfolio div.categories');

// Affichages des travaux au chargement de la page
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            works = data; // Stockage de la liste des traveaux dans une variable globale
            const work = data[i];
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const figcaption = document.createElement('figcaption');
            img.src = work.imageUrl;
            figure.appendChild(img);
            figcaption.textContent = work.title;
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        }
    })
    .catch(error => console.log(error))
    ;


// Affichages des categories au chargement de la page
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        const buttonToutesCategories = document.createElement('div');
        buttonToutesCategories.textContent = 'Tous';
        buttonToutesCategories.classList.add("active")
        buttonToutesCategories.addEventListener('click', () => {
            desactiveFilters();
            buttonToutesCategories.classList.add("active");
            gallery.innerHTML = '';
            for (let i = 0; i < works.length; i++) {
                const work = works[i];
                const figure = createWorkHtml(work);
                gallery.appendChild(figure);
            }
        })
        categories.appendChild(buttonToutesCategories);
        for (let i = 0; i < data.length; i++) {
            const category = data[i];
            const button = document.createElement('div');
            button.textContent = category.name;
            categories.appendChild(button);
            button.addEventListener('click', () => {
                desactiveFilters();
                button.classList.add("active");
                gallery.innerHTML = '';
                const filteredWorks = works.filter(w => w.categoryId === category.id);
                for (let i = 0; i < filteredWorks.length; i++) {
                    const work = filteredWorks[i];
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    const figcaption = document.createElement('figcaption');
                    img.src = work.imageUrl;
                    figure.appendChild(img);
                    figcaption.textContent = work.title;
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                }
            })
        }
    })


function createWorkHtml(work) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figcaption = document.createElement('figcaption');
    img.src = work.imageUrl;
    figure.appendChild(img);
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);
    return figure;
}

function desactiveFilters() {
    const buttonFilters = document.querySelectorAll('div.categories div');
    for (let i = 0; i < buttonFilters.length; i++) {
        buttonFilters[i].classList.remove("active");
    }
}

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
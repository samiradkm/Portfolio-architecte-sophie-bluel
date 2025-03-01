console.log("bonjour samira");

// sophie.bluel@test.tld
// S0phie


let loginToken = null;
let works = [];
let categoriesList = [];
const gallery = document.querySelector('section#portfolio div.gallery');
const categories = document.querySelector('section#portfolio div.categories');

// Affichages des travaux au chargement de la page
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        works = data; // Stockage de la liste des traveaux dans une variable globale
        loadGallery();
    })
    .catch(error => console.log(error))
    ;


// Affichages des categories au chargement de la page
fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
    .then(data => {
        categoriesList = data;
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
                const filteredWorks = works.filter(w => w.categoryId == category.id);
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

document.getElementById("edit-button").addEventListener("click", function () {
    document.getElementById("modal").style.display = "block";
    const listeGalerie = document.getElementById("liste-galerie");
    listeGalerie.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
        const work = works[i];

        const img = document.createElement('img');
        img.src = work.imageUrl;

        const icone = document.createElement('i');
        icone.className = 'fa-solid fa-trash';

        const divImage = document.createElement('div');
        divImage.appendChild(img);
        divImage.appendChild(icone);
        divImage.classList.add('imagemodal');

        icone.addEventListener('click', function () {
            const token = window.localStorage.getItem('token');
            if (token != null) {
                console.log(work.id);
                fetch('http://localhost:5678/api/works/' + work.id, {
                    method: 'DELETE', headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                }).then((response) => {
                    if (response.status !== 204) {
                        document.querySelector('.error').textContent = response.statusText;
                    } else {
                        works.splice(i, 1);
                        divImage.remove();
                        loadGallery();
                    }
                });
            }
        })

        listeGalerie.appendChild(divImage);
    }

});



// Fermer en cliquant sur la croix
document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Fermer en cliquant en dehors du modal
window.addEventListener("click", function (event) {
    if (event.target == document.getElementById("modal")) {
        document.getElementById("modal").style.display = "none";
    }
});

if (localStorage.getItem('token')) {
    document.getElementById('edit-button').style.display = 'block';
}

function loadGallery() {
    gallery.innerHTML = '';
    for (let i = 0; i < works.length; i++) {
        const work = works[i];
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');
        img.src = work.imageUrl;
        figure.appendChild(img);
        figcaption.textContent = work.title;
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

document.getElementById('addPhotoButton').addEventListener("click", function () {
    document.getElementById("edit-modal").style.display = "none";
    document.getElementById('create-modal').style.display = "block";
    const select = document.querySelector('#create-modal select');
    for (let i = 0; i < categoriesList.length; i++) {
        const category = categoriesList[i];
        console.log(category);
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    }
})

document.getElementById("image").addEventListener("change", function (event) {
    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let preview = document.getElementById("preview");
            preview.src = e.target.result;
            let inputField = document.querySelector('.file-field');
            inputField.style.display = "none";
            preview.style.display = "block"; // Affiche l'aperçu
        };
        reader.readAsDataURL(file);
    }
});

const form = document.querySelector('#create-modal form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const token = window.localStorage.getItem('token');
    let formData = new FormData(form);
    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(function (response) {
        if (response.status !== 201) {
            document.querySelector('.error').textContent = response.statusText;
        } else {
            response.json().then(work => {
                console.log(work);
                works.push(work);
                loadGallery();
                document.getElementById('modal').style.display = 'none';
            });
        }
    })

})


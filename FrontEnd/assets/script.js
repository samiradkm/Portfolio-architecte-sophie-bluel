console.log("bonjour samira");

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
        const buttonToutesCategories = document.createElement('button');
        buttonToutesCategories.textContent = 'Toutes les catégories';
        buttonToutesCategories.addEventListener('click', () => {
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
        })
        categories.appendChild(buttonToutesCategories);
        for (let i = 0; i < data.length; i++) {
            const category = data[i];
            const button = document.createElement('button');
            button.textContent = category.name;
            categories.appendChild(button);
            button.addEventListener('click', () => {
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

document.addEventListener("DOMContentLoaded", function() {
    fetchEtListerTaches();
});

const bouton = document.createElement("button"); // Ajoutez ici si ce n'était pas défini
const options = ["Toutes", "Actives", "Terminées"];
let toDoList = [];

async function myJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json();
    if (data.taches) {
        toDoList = data.taches.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return data;
}

function fetchEtListerTaches() {
    myJson('todolist.json')
        .then(() => lancement())
        .catch(error => console.error("L'opération fetch a rencontré un problème:", error));
}

function lancement() {
    document.getElementById("lancement").addEventListener("click", function(e) {
        document.getElementById("lancement").style.display = "none";
        document.getElementById("container").style.display = "block";
        e.preventDefault();
    });
    afficherMenu();
}

function afficherMenu() {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";
        
    const titre = document.createElement("h1");
    titre.textContent = "Gestionnaire de Tâches";
    titre.style.color = "#B22430";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    creerCheckbox();
    
    const ul = document.createElement("section");
    toDoList.forEach(tache => {
        const li = document.createElement("p");
        li.textContent = `${tache.nom} ${tache.description} - ${tache.date}`;
        ul.appendChild(li);
    });
    menuDiv.appendChild(ul);

    bouton.textContent = "Créer une nouvelle tâche";
    bouton.style.cursor = "pointer";
    menuDiv.appendChild(bouton);

    bouton.addEventListener('click', function(e) {
        e.preventDefault();
        ajouterTache();
    });
}

function creerCheckbox() {
    const container = document.getElementById('container');
    options.forEach(option => {
        const label = document.createElement('label');
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option;
        checkbox.name = 'options';

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(option));
        container.appendChild(label);
    });
}

function ajouterTache() {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";

    const titre = document.createElement("h1");
    titre.textContent = "Quelle tâche voulez vous ajouter";
    titre.style.color = "#B22430";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const form = document.createElement("form");

    const labelNom = document.createElement("label");
    labelNom.textContent = "Quel nom voulez vous donner à votre nouvelle tâche :";
    form.appendChild(labelNom);

    const nomInput = document.createElement("input");
    nomInput.placeholder = "Nom de la tâche";
    nomInput.style.marginTop = "5%";
    nomInput.required = true;
    form.appendChild(nomInput);

    form.appendChild(document.createElement("br"));

    const labelDescription = document.createElement("label");
    labelDescription.textContent = "Décrivez votre tâche :";
    form.appendChild(labelDescription);

    const descriptionInput = document.createElement("textarea");
    descriptionInput.placeholder = "Description de la tâche";
    descriptionInput.style.marginTop = "5%";
    descriptionInput.required = true;
    form.appendChild(descriptionInput);

    form.appendChild(document.createElement("br"));

    const labelDate = document.createElement("label");
    labelDate.textContent = "Quelle est la date limite :";
    form.appendChild(labelDate);

    const dateInput = document.createElement("input");
    dateInput.placeholder = "jj/mm/aaaa";
    dateInput.required = true;
    form.appendChild(dateInput);

    form.appendChild(document.createElement("br"));

    menuDiv.appendChild(form);

    const boutonAjout = document.createElement("button");
    boutonAjout.style.cursor = "pointer";
    boutonAjout.textContent = "Ajouter la tâche";
    menuDiv.appendChild(boutonAjout);

    boutonAjout.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = nomInput.value;
        const description = descriptionInput.value;
        const date = dateInput.value;

        if (nom && description && date && form.checkValidity()) {
            const newTache = {
                nom: nom,
                description: description,
                date: date,
            };

            ecrireJSON("ajouter", newTache)
                .then(() => {
                    console.log("Tâche ajoutée et affichage mis à jour.");
                })
                .catch(error => {
                    console.error("Erreur lors de l'ajout de la tâche :", error);
                });
        } else {
            alert("Respectez le format imposé!! (on a pas galéré pour rien)");
        }
    });
}

async function ecrireJSON(action, tache, id = null) {
    const url = 'http://localhost:3000/gestion-tache';
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, tache, id }),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error("Erreur lors de l'écriture des données");
        
        const message = await response.text();
        console.log("Réponse du serveur :", message);
        setTimeout(() => fetchEtListerTaches(), 500);
        alert(`Tâche ${action} avec succès`);
    } catch (error) {
        console.error(error);
        alert("Erreur lors de l'opération sur la tâche");
    }
}
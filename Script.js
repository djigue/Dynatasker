document.addEventListener("DOMContentLoaded", function() {
    fetchEtListerTaches();
});

const bouton = document.createElement("button"); 
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
    afficherTaches(toDoList);
    
    bouton.textContent = "Créer une nouvelle tâche";
    bouton.style.cursor = "pointer";
    menuDiv.appendChild(bouton);

    bouton.addEventListener('click', function(e) {
        e.preventDefault();
        ajouterTache();
    });

    // const boutonSupp = document.createElement("button");
    // boutonSupp.style.cursor = "pointer";
    // boutonSupp.textContent = "Supprimer une tâche";
    // menuDiv.appendChild(boutonSupp);

    // boutonSupp.addEventListener("click", function(e) {
    //     e.preventDefault();
    //     supprimerTache();
    // });

 
}

function createForm(champs) {
    
    const formContainer = document.createElement('form');
    formContainer.className = 'custom-form';
  
   
    champs.forEach(champ => {
      const fieldContainer = document.createElement('div');
      fieldContainer.className = 'form-field';
  
     
      if (champ.label) {
        const label = document.createElement('label');
        label.innerText = champ.label;
        label.htmlFor = champ.name;
        fieldContainer.appendChild(label);
      }
  
      
      const input = document.createElement(champ.type === 'textarea' ? 'textarea' : 'input');
      input.type = champ.type || 'text'; 
      input.name = champ.name;
      input.id = champ.name;
      input.placeholder = champ.placeholder || '';
      if (champ.value) input.value = champ.value;
      
      fieldContainer.appendChild(input);
      formContainer.appendChild(fieldContainer);
    });
  
    return formContainer;
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

    const champs = [
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache' },
        { name: 'description', type: 'textarea', label: 'Decrivez la tâche :', placeholder: '50 charactères' },
        { name: 'date', type: 'date', label: 'Pour Quand :', placeholder: 'jj/mm/aaaa' }
    ]

    const form = createForm(champs);
    menuDiv.appendChild(form);
 
    const boutonAjout = document.createElement("button");
    boutonAjout.style.cursor = "pointer";
    boutonAjout.textContent = "Ajouter la tâche";
    menuDiv.appendChild(boutonAjout);

    boutonAjout.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        if (description.length > 50) {
            alert("La description ne doit pas dépasser 50 caractères !");
            return;
        }

        if (nom && description && date && form.checkValidity()) {

            const dateParts = date.split('-'); 
            const formatDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            const newTache = {
                nom: nom,
                description: description,
                date: formatDate,
            };

            ecrireJSON("ajouter", newTache)
                .then(() => {
                    console.log("Tâche ajoutée");
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

    if (action === 'supprimer' && (!tache.nom || !tache.date)) {
        console.error("Erreur : Tâche mal formatée", tache);
        alert("Erreur : Tâche mal formatée, nom et date requis !");
        return; 
    }

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, tache, id }),
    };
    console.log("Données envoyées :", { action, tache, id });
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

function supprimerTache(nom, date) {

        if (!nom || !date) {
            alert("Nom et date de la tâche sont requis pour la suppression !");
            return;
        }

            const suppTache = {
                nom: nom,
                date: date,
            };

            ecrireJSON("supprimer", suppTache)
                .then(() => {
                    console.log("Tâche supprimée");
                })
                .catch(error => {
                    console.error("Erreur lors de la suppression de la tâche :", error);
                });
}

function modifierTache() {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";

    const titre = document.createElement("h1");
    titre.textContent = "Quelle tâche voulez vous modifier";
    titre.style.color = "#B22430";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const champs = [
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache' },
        { name: 'description', type: 'textarea', label: 'Decrivez la tâche :', placeholder: '50 charactères' },
        { name: 'date', type: 'date', label: 'Pour Quand :', placeholder: 'jj/mm/aaaa' }
    ]

    const form = createForm(champs);
    menuDiv.appendChild(form);
 
    const boutonMod = document.createElement("button");
    boutonMod.style.cursor = "pointer";
    boutonMod.textContent = "modifier la tâche";
    menuDiv.appendChild(boutonMod);

    boutonMod.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const date = document.getElementById('date').value;


        if (nom && date && form.checkValidity()) {

            const dateParts = date.split('-'); 
            const formatDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

            const newTache = {
                nom: nom,
                date: formatDate,
            };

            ecrireJSON("modifier", newTache)
                .then(() => {
                    console.log("Tâche modifiée");
                })
                .catch(error => {
                    console.error("Erreur lors de la modification de la tâche :", error);
                });
        } else {
            alert("Respectez le format imposé!! (on a pas galéré pour rien)");
        }
    });
}

function afficherTaches(taches) {
    const menuDiv = document.getElementById("container");
    const ul = document.createElement("section"); 

    taches.forEach(tache => {
        const tacheDiv = document.createElement("div"); 
        tacheDiv.classList.add("tache"); 
        tacheDiv.style.border = "2px solid black";

        const  nomTache= document.createElement("p");
        nomTache.textContent = `Nom : ${tache.nom}`;
        
        const descTache = document.createElement("p");
        descTache.textContent = `Description : ${tache.description}`;
        
        const dateTache = document.createElement("p");
        dateTache.textContent = `Date : ${tache.date}`;

        const boutonSupp = document.createElement("button");
        boutonSupp.textContent = "Supprimer";
        boutonSupp.style.cursor = "pointer";
        boutonSupp.addEventListener("click", function() {

            supprimerTache(tache.nom, tache.date);
        });

        
        const boutonMod = document.createElement("button");
        boutonMod.textContent = "Modifier";
        boutonMod.style.cursor = "pointer";
        boutonMod.addEventListener("click", function() {
            
            modifierTache(tache);
        });

       
        tacheDiv.appendChild(nomTache);
        tacheDiv.appendChild(descTache);
        tacheDiv.appendChild(dateTache);
        tacheDiv.appendChild(boutonSupp); 
        tacheDiv.appendChild(boutonMod);

        
        ul.appendChild(tacheDiv);
    });

    
    menuDiv.appendChild(ul);
}
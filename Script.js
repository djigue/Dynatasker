let toDoList = [];
const options = ["Toutes", "Actives", "Terminées"];
const bouton = document.createElement("button");
bouton.style.cursor = "pointer";

document.addEventListener("DOMContentLoaded", function() {
    fetchEtListerTaches();
});

async function myJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json();
    console.log("Données fetchées:", data);

    if (data.taches) {
        toDoList = data.taches.sort((a, b) => {
            const dateA = new Date(a.date.split("/").reverse().join("-"));
            const dateB = new Date(b.date.split("/").reverse().join("-"));
            return dateA - dateB;
        });
    }
    console.log("Taches chargés:", toDoList);
    return data;
}

function fetchEtListerTaches() {
    myJson('todolist.json')
        .then(() => {
            lancement(); 
        })
        .catch(error => {
            console.error("L'opération fetch a rencontré un problème:", error);
        });
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
    

    menuDiv.appendChild(bouton);

    bouton.addEventListener('click', function(e) {
       ajouterTache();
    })
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

function ajouterTache () {

    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";

    const titre = document.createElement("h1");
    titre.textContent = "Quelle tâche voulez vous ajouter";
    titre.style.color = "#B22430";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const form = document.createElement("form");

    const labelNom = document.createElement("label");
    labelNom.textContent = "Quel nom voulez vous donner à votre nouvelle tâche :"
    form.appendChild(labelNom);

    const nom = document.createElement("input");
    nom.placeholder = "Nom de la tâche";
    form.appendChild(nom);
    nom.style.marginTop = "5%";
    nom.setAttribute('required', '');
    form.appendChild(nom);

    const brInput = document.createElement("br");
    form.appendChild(brInput);

    const labelDescription = document.createElement("label");
    labelDescription.textContent = "Décrivez votre tâche :";
    form.appendChild(labelDescription);

    const description = document.createElement("textarea");
    description.placeholder = "Description de la tâche";
    form.appendChild(description);
    description.style.marginTop = "5%";
    description.setAttribute('required', '');
    form.appendChild(description);

    const brInput1 = document.createElement("br");
    form.appendChild(brInput1);

    const labelDate = document.createElement("label");
    labelDate.textContent = "Quelle est la date limite :"
    form.appendChild(labelDate);

    const date = document.createElement("input");
    date.setAttribute('type','tel');
    date.placeholder = "jj/mm/aaaa";
    date.setAttribute('required', '');
    form.appendChild(date);

    form.appendChild(date);
    date.style.marginTop = "5%";
    
    const brInput2 = document.createElement("br");
    form.appendChild(brInput2);

    menuDiv.appendChild(form);

    bouton.textContent = "Ajouter la tâche";

    menuDiv.appendChild(bouton);

    bouton.addEventListener("click", function(e) {
        e.preventDefault();
        const nom = nom.value;
        const description = description.value;
        const date = date.value;

        if (nom && description && date && form.checkValidity()) {
            const newTache = {
                nom: nom,
                description: description,
                date: date,
            };
            
            // Envoie des données au serveur
            fetch('http://localhost:3000/ajouter-tache', {

                //method atendue par le serveur (voir server.js l14)
                method: 'POST',
                //information importante pour que le server notament le type de fichier
                headers: {
                    'Content-Type': 'application/json',
                },
                //contenu de la requete 
                body: JSON.stringify(newTache),
            })

            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de l\'ajout de la tâche');
                }
                return response.text();//transforme la reponse en chaine de charactère
    
            })

            //message = responsetext()
            .then(message => {
                console.log("message :" + message);
                contacts.push(newTache); 
                fetchEtListerTaches(toDoList); 
                alert("Nouvelle tâche ajoutée avec succès");

            })
            .catch(error => {
                console.error(error);
                alert("Erreur lors de l'ajout de la tâche");
            });
        } else {
            alert("Respectez le format imposé!! (on a pas galerer pour rien)");
        }
    }); 
}


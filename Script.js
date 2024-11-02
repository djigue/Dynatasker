document.addEventListener("DOMContentLoaded", function() {
    fetchEtListerTaches();
});

const bouton = document.createElement("button"); 
let toDoList = [];

async function myJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json();
    if (data.taches) {
        toDoList = data.taches.sort((a, b) => {
            const [jourA, moisA, anneeA] = a.date.split("/");
            const [jourB, moisB, anneeB] = b.date.split("/");
            const dateA = new Date(`${anneeA}-${moisA}-${jourA}`);
            const dateB = new Date(`${anneeB}-${moisB}-${jourB}`);
            return dateA - dateB;
        })
    return data;
}
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
    titre.classList.add("text-6xl", "font-bold","p-8","text-shadow", "shadow-gray-900","text-teal-900");
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    bouton.textContent = "Créer une nouvelle tâche";
    bouton.style.cursor = "pointer";
    bouton.classList.add("w-56","h-10","rounded-lg","bg-cyan-600","hover:bg-cyan-900","ring-4","ring-cyan-800","text-cyan-200",
        "shadow-lg","shadow-gray-900");
    menuDiv.appendChild(bouton);

    bouton.addEventListener('click', function(e) {
        e.preventDefault();
        ajouterTache();
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex","flex-row","justify-center","gap-5","p-8", "my-5");
    
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Toutes";
    boutonTous.classList.add("rounded-lg","bg-cyan-600","w-40","hover:bg-cyan-900","ring-4","ring-cyan-800","text-cyan-200",
        "shadow-lg","shadow-gray-900");
    boutonTous.addEventListener('click', () => afficherTaches(toDoList));
    
    const boutonTermines = document.createElement("buton");
    boutonTermines.textContent = "Terminées";
    boutonTermines.classList.add("rounded-lg","bg-cyan-600","w-40","hover:bg-cyan-900","ring-4","ring-cyan-800","text-cyan-200",
        "shadow-lg","shadow-gray-900"
    );
    boutonTermines.addEventListener('click', () => afficherTaches(toDoList.filter(t => t.terminee)));

    const boutonNonTermines = document.createElement("button");
    boutonNonTermines.textContent = "Non terminées";
    boutonNonTermines.classList.add("rounded-lg","bg-cyan-600","w-40","hover:bg-cyan-900","ring-4","ring-cyan-800","text-cyan-200",
        "shadow-lg","shadow-gray-900");
    boutonNonTermines.addEventListener('click', () => afficherTaches(toDoList.filter(t => !t.terminee)));

    buttonContainer.appendChild(boutonTous);
    buttonContainer.appendChild(boutonTermines);
    buttonContainer.appendChild(boutonNonTermines);
    
    menuDiv.appendChild(buttonContainer);

    afficherTaches(toDoList);   

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

            const  [annee, mois, jour] = date.split("-");
            const formatDate = `${jour}/${mois}/${annee}`;

            const newTache = {
                id: generateUniqueId(),
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

function supprimerTache(tache) {


            const suppTache = {
                id: tache.id,
            };

            ecrireJSON("supprimer", suppTache)
                .then(() => {
                    console.log("Tâche supprimée");
                })
                .catch(error => {
                    console.error("Erreur lors de la suppression de la tâche :", error);
                });
}

function modifierTache(tache) {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";

    const titre = document.createElement("h1");
    titre.textContent = "Quelles modification voulez vous apporter";
    titre.style.color = "#B22430";
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const champs = [
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache', value: tache.nom },
        { name: 'description', type: 'textarea', label: 'Decrivez la tâche :', placeholder: '50 charactères', value: tache.description },
        { name: 'date', type: 'date', label: 'Pour Quand :', placeholder: 'jj/mm/aaaa', value: tache.date }
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
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value; 

        if (description.length > 50) {
            alert("La description ne doit pas dépasser 50 caractères !");
            return;
        }

        if (nom && description && date && form.checkValidity()) {

            const  [annee, mois, jour] = date.split("-");
            const formatDate = `${jour}/${mois}/${annee}`;


            const newTache = {
                id: tache.id,
                nom: nom,
                description: description,
                date: formatDate,
            };

            console.log("Données envoyées pour modification :", JSON.stringify(newTache, null, 2)); 

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
    menuDiv.classList.add("flex","justify-center", "bg-cyan-500/50")

    let ul = menuDiv.querySelector("section"); 
    if (!ul) {
        ul = document.createElement("section"); 
        ul.classList.add("grid","grid-cols-3","w-4/5", "bg-cyan-400/50", "ml-40","flex","justify-items-center","rounded-lg","gap-y-2",);
        menuDiv.appendChild(ul);
    } else {
        ul.innerHTML = ""; 
    }
    taches.forEach(tache => {
        const tacheDiv = document.createElement("div"); 
        tacheDiv.classList.add("tache","border","border-4","bg-cyan-200","flex","flex-col","justify-around","h-96","w-11/12","rounded-lg","m-5",
            "shadow-lg","shadow-gray-900"); 

        const nomDate = document.createElement("div");

        const dateTache = document.createElement("p");
        dateTache.textContent = `Date : ${tache.date}`;
        dateTache.classList.add("text-lg", "font-bold")

        const  nomTache= document.createElement("p");
        nomTache.textContent = `${tache.nom}`;

        nomDate.appendChild(dateTache);
        nomDate.appendChild(nomTache);

        const boutons = document.createElement("div");
        boutons.classList.add("flex","gap-5");

        const boutonSupp = document.createElement("button");
        const imgSup = document.createElement("img");
        imgSup.src = "supp.png";
        imgSup.alt = "supprimer";
        imgSup
        boutonSupp.appendChild(imgSup);
        boutonSupp.style.cursor = "pointer";
        boutonSupp.addEventListener("click", function() {

            supprimerTache({
                id: tache.id,
            });
        });

        
        const boutonMod = document.createElement("button");
        const imgMod = document.createElement("img");
        imgMod.src = "modif.png";
        imgMod.alt = "modifier";
        boutonMod.appendChild(imgMod);
        boutonMod.style.cursor = "pointer";
        boutonMod.addEventListener("click", function() {
            
            modifierTache({
                id: tache.id,
                nom: tache.nom,
                description: tache.description,
                date: tache.date
            });
        });

        boutons.appendChild(boutonSupp); 
        boutons.appendChild(boutonMod);

        const nomDateBoutons = document.createElement("div");
        nomDateBoutons.classList.add("flex","justify-around");

        nomDateBoutons.appendChild(nomDate);
        nomDateBoutons.appendChild(boutons);

        const descTache = document.createElement("p");
        descTache.textContent = `${tache.description}`;
        descTache.classList.add("h-72","bg-purple-100","rounded-lg","m-2")

        const label = document.createElement("label");
        label.innerText = "tache terminée :";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tache.terminee || false; 

    
        checkbox.addEventListener("change", function() {
        tache.terminee = checkbox.checked; 
        if (checkbox.checked) {
            tacheDiv.classList.add("terminee"); 
        } else {
            tacheDiv.classList.remove("terminee");
        }

        const tacheData = {
            id: tache.id,
            terminee: tache.terminee
        };
    
        ecrireJSON("modifier", tacheData)
            .then(() => {
                console.log("État de la tâche mis à jour");
            })
            .catch(error => {
                console.error("Erreur lors de la mise à jour de l'état de la tâche :", error);
            });
    });

        tacheDiv.appendChild(nomDateBoutons);
        tacheDiv.appendChild(descTache);
        tacheDiv.appendChild(label);
        tacheDiv.appendChild(checkbox);

        
        ul.appendChild(tacheDiv);
    });

    
    menuDiv.appendChild(ul);
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).slice(2, 9); 
}
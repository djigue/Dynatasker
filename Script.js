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
        .then(() => afficherMenu())
        .catch(error => console.error("L'opération fetch a rencontré un problème:", error));
}

function afficherMenu() {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";
    menuDiv.classList.add("flex","justify-center", "bg-zinc-600/20");
    
    const titreBoutonAj = document.createElement("div");
    titreBoutonAj.classList.add("flex","flex-col","items-center",)
    
    const titre = document.createElement("img");
    titre.src = "logoDynatasker.png";
    titre.classList.add("p-1","mb-0","w-3/4");
    titreBoutonAj.appendChild(titre);
    

    bouton.textContent = "Créer une nouvelle tâche";
    bouton.style.cursor = "pointer";
    bouton.classList.add("w-1/6","h-10","rounded-lg","bg-emerald-400","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","mt-2","max-sm:w-1/2");
    titreBoutonAj.appendChild(bouton);

    menuDiv.appendChild(titreBoutonAj);

    bouton.addEventListener('click', function(e) {
        e.preventDefault();
        ajouterTache();
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex","flex-row","justify-center","gap-5","p-8",);
    
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Toutes";
    boutonTous.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","max-sm:w-1/3");
    boutonTous.addEventListener('click', () => afficherTaches(toDoList));
    
    const boutonTermines = document.createElement("buton");
    boutonTermines.textContent = "Terminées";
    boutonTermines.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "text-center","shadow-lg","shadow-gray-900","max-sm:w-1/3","flex","justify-center","items-center");
    boutonTermines.addEventListener('click', () => afficherTaches(toDoList.filter(t => t.terminee)));

    const boutonNonTermines = document.createElement("button");
    boutonNonTermines.textContent = "Non Terminées";
    boutonNonTermines.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","max-sm:w-1/3");
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
      fieldContainer.classList.add("flex","flex-col","items-center","m-2");
  
     
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

      if (champ.name === 'date') {
        input.classList.add("rounded-lg","bg-zinc-100","text-gray-700","shadow-md","shadow-gray-900");
    }

    if (champ.name === 'nom') {
        input.classList.add("rounded-lg","bg-zinc-100","text-gray-700","w3/4","text-center","shadow-md","shadow-gray-900");
    }

      if (champ.type === 'textarea') {
        input.classList.add("p-4","rounded-lg","bg-zinc-100","text-gray-700","w-5/6","h-72","shadow-md","shadow-gray-900","mb-2");
    }
      
      fieldContainer.appendChild(input);
      formContainer.appendChild(fieldContainer);
    });
  
    return formContainer;
  }


function ajouterTache() {
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";
    menuDiv.classList.add("flex","flex-col","justify-center","items-center","bg-[url('fondEcran.webp')]","bg-cover","bg-center","w-screen","h-screen");

    const titre = document.createElement("h1");
    titre.textContent = "Quelle tâche voulez vous ajouter ?";
    titre.classList.add("text-emerald-500","text-5xl","p-8","font-bold");
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const formBouton = document.createElement("div");
    formBouton.classList.add("flex","flex-col","items-center","h-screen","mt-1",);
    const champs = [
        { name: 'date', type: 'date', label: 'Pour Quand :', placeholder: 'jj/mm/aaaa' },
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache' },
        { name: 'description', type: 'textarea', label: 'Décrivez la tâche :', placeholder: '50 caractères' }
    ]

    const form = createForm(champs);
    form.classList.add("border","border-4","bg-emerald-400","flex","flex-col","justify-around","w-1/4","h-2/3","rounded-lg","m-5",
            "shadow-xl","shadow-gray-900","max-sm:w-11/12","max-sm:h-1/2");
    formBouton.appendChild(form);
 
    const boutonAjout = document.createElement("button");
    boutonAjout.style.cursor = "pointer";
    boutonAjout.textContent = "Ajouter la tâche";
    boutonAjout.classList.add("w-1/4","h-10","rounded-lg","bg-emerald-400","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","mt-2","mb-4","max-sm:flex","max-sm:justify-center","max-sm:items-center");
    formBouton.appendChild(boutonAjout);

    menuDiv.appendChild(formBouton);

    boutonAjout.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const [jourA, moisA, anneeA] = date.split("/");
        const dateVerif = new Date(`${anneeA}-${moisA}-${jourA}`);
        const dateJour = new Date(); 
        dateJour.setHours(0, 0, 0, 0); 
        dateVerif.setHours(0, 0, 0, 0);  
    
        if (dateVerif < dateJour) {

            alert("La date n'est pas valide");
            return; 

        }else if (nom && description && date && form.checkValidity()) {

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

            alert("Veuillez remplir tous les champs");
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
    menuDiv.classList.add("flex","flex-col","justify-center","items-center","bg-[url('fondEcran.webp')]","bg-cover","bg-center","w-screen","h-screen");

    const titre = document.createElement("h1");
    titre.textContent = "Quelles modifications voulez vous apporter ?";
    titre.classList.add("text-emerald-600","text-5xl","p-8","font-bold");
    menuDiv.style.textAlign = "center";
    menuDiv.appendChild(titre);

    const formBouton = document.createElement("div");
    formBouton.classList.add("flex","flex-col","items-center","h-screen","mt-1");

    const champs = [
        { name: 'date', type: 'date', label: 'Pour quand ?', placeholder: 'jj/mm/aaaa', value: tache.date },
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache', value: tache.nom },
        { name: 'description', type: 'textarea', label: 'Décrivez la tâche :', placeholder: '50 caractères', value: tache.description }
    ]

    const form = createForm(champs);
    form.classList.add("border","border-4","bg-emerald-400","flex","flex-col","justify-around","w-1/4","h-fit","h-2/3","rounded-lg","m-5",
        "shadow-xl","shadow-gray-900","max-sm:w-11/12","max-sm:h-1/2");
    formBouton.appendChild(form);
 
    const boutonMod = document.createElement("button");
    boutonMod.style.cursor = "pointer";
    boutonMod.textContent = "modifier la tâche";
    boutonMod.classList.add("w-56","h-10","rounded-lg","bg-emerald-400","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","mt-2","max-sm:flex","max-sm:justify-center","max-sm:items-center");
    formBouton.appendChild(boutonMod);

    menuDiv.appendChild(formBouton);

    boutonMod.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value; 
        const [jourA, moisA, anneeA] = date.split("/");
    

    const dateVerif = new Date(`${anneeA}-${moisA}-${jourA}`);
    const dateJour = new Date(); 
    dateJour.setHours(0, 0, 0, 0); 
    dateVerif.setHours(0, 0, 0, 0); 

    console.log("Date vérifiée:", dateVerif); 
    console.log("Date d'aujourd'hui:", dateJour); 

    if (dateVerif < dateJour) {
        alert("La date n'est pas valide");
        return; 
    }
        else if (nom && description && date && form.checkValidity()) {

            const formatDate = `${jourA}/${moisA}/${anneeA}`;


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
            alert("Veuillez remplir tous les champs");
        }
    });
}

function afficherTaches(taches) {
    const menuDiv = document.getElementById("container");
    menuDiv.classList.add("flex","justify-center", "bg-[url('fondEcran.webp')]","bg-cover","bg-center");

    let ul = menuDiv.querySelector("section"); 
    if (!ul) {
        ul = document.createElement("section"); 
        ul.classList.add("grid","grid-cols-3","w-4/5", "ml-40","flex","justify-items-center",
            "rounded-lg","gap-y-2","max-sm:flex","max-sm:flex-col","max-sm:ml-8");
        menuDiv.appendChild(ul);
    } else {
        ul.innerHTML = ""; 
    }
    taches.forEach(tache => {
        const tacheDiv = document.createElement("div"); 
        tacheDiv.classList.add("border","border-4","bg-emerald-400","flex","flex-col","justify-around","h-11/12","w-11/12","rounded-lg","m-5",
            "shadow-xl","shadow-gray-900"); 

        const nomDate = document.createElement("div");

        const dateTache = document.createElement("p");
        dateTache.textContent = `Date : ${tache.date}`;
        dateTache.classList.add("text-lg", "font-bold");

        const  nomTache= document.createElement("p");
        nomTache.textContent = `${tache.nom}`;

        const descTache = document.createElement("p");
        descTache.textContent = `${tache.description}`;
        descTache.classList.add("h-72","bg-zinc-100","rounded-lg","m-2")


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

        const labelCheckbox = document.createElement("div");
        labelCheckbox.classList.add("flex", "justify-center","font-bold","mb-2");

        const label = document.createElement("label");
        label.innerText = "Tâche terminée :";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tache.terminee || false; 

        labelCheckbox.appendChild(label);
        labelCheckbox.appendChild(checkbox);

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
        tacheDiv.appendChild(labelCheckbox);
        

        
        ul.appendChild(tacheDiv);
    });

    
    menuDiv.appendChild(ul);
}

function generateUniqueId() {
    return '_' + Math.random().toString(36).slice(2, 9); 
}
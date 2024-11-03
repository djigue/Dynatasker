//des que le html estchargé on lance la récupération du tableauJson
document.addEventListener("DOMContentLoaded", function() {  
    fetchEtListerTaches();
});

const bouton = document.createElement("button"); // pour tout les boutons du code
let toDoList = []; // tableau où les taches seront enregistrées après lecture du json

async function myJson(url) {

    const response = await fetch(url); //on attend la reponse du fichier json

    //si pas de rponse
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json(); //constante crée dès que le fichier json est lu en entier

    if (data.taches) {
        toDoList = data.taches.sort((a, b) => {//.sort() fais le tri a bulle avec dateA-dateB

            //change le format date pour la comparaison
            const [jourA, moisA, anneeA] = a.date.split("/"); //divise en trois paries, entre les slash
            const [jourB, moisB, anneeB] = b.date.split("/");

            const dateA = new Date(`${anneeA}-${moisA}-${jourA}`); //création nouvel objet pour pouvoir comparer
            const dateB = new Date(`${anneeB}-${moisB}-${jourB}`);
            return dateA - dateB;
        })
    return data; //on renvoie le tableau trié
}
}

function fetchEtListerTaches() {
    myJson('todolist.json')  // on lit le fichier todolist.json
        .then(() => afficherMenu()) //une fois que c'est fait on appelle afficheMenu()
        .catch(error => console.error("L'opération fetch a rencontré un problème:", error));  //si porblème
}

//fonction pour communiquer avec le serveur node
async function ecrireJSON(action, tache, id = null) {
    const url = 'http://localhost:3000/gestion-tache';//constante avec l'adresse du serveur

    // traduction du message en json pour comunication node
    const options = {
        method: 'POST', //methode attendue par le serveur
        headers: { 'Content-Type': 'application/json' }, // infos sue le message
        body: JSON.stringify({ action, tache, id }), //message
    };
    
    try {
        const response = await fetch(url, options);// constante creer qu'une foit fetch terminée
        if (!response.ok) throw new Error("Erreur lors de l'écriture des données");// si pb com
        
        const message = await response.text();// si pb traduction de la reponse
        console.log("Réponse du serveur :", message);// si pb
        setTimeout(() => fetchEtListerTaches(), 500); // impose un delais d'attentr avant de recharger.  en ms
        alert(`Tâche ${action} avec succès`);
    } catch (error) {
        console.error(error);
        alert("Erreur lors de l'opération sur la tâche");
    }
}

function afficherMenu() {
    //on récupère et on vide menuDiv
    const menuDiv = document.getElementById("container");
    menuDiv.innerHTML = "";
    menuDiv.classList.add("flex","justify-center",);//css pour positionner au centre
    
    //div pour contenir le titre et le bouton ajouter
    const titreBoutonAj = document.createElement("div");
    titreBoutonAj.classList.add("flex","flex-col","items-center",)//css colonne
    
    //création et style titre
    const titre = document.createElement("img");
    titre.src = "logoDynatasker.png";
    titre.classList.add("p-1","mb-0","w-3/4");
    titreBoutonAj.appendChild(titre);
    
    //création et style bouton ajouter
    bouton.textContent = "Créer une nouvelle tâche";
    bouton.style.cursor = "pointer";
    bouton.classList.add("w-1/6","h-10","rounded-lg","bg-emerald-400","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","mt-2","max-sm:w-1/2");
    titreBoutonAj.appendChild(bouton);

    menuDiv.appendChild(titreBoutonAj);//incruste le boton et le titre dans la div titreBoutonAj

    //on appelle ajouter tâche tout en empechant le refresh de la page au click du bouton
    bouton.addEventListener('click', function(e) {
        e.preventDefault();
        ajouterTache();
    });

    //cration et style div pour les 3 boutons affichage
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex","flex-row","justify-center","gap-5","p-8",);
    
    //creation et style bouton tous
    const boutonTous = document.createElement("button");
    boutonTous.textContent = "Toutes";
    boutonTous.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","max-sm:w-1/3");
    boutonTous.addEventListener('click', () => afficherTaches(toDoList));

    //creation et style bouton terminées
    const boutonTermines = document.createElement("buton");
    boutonTermines.textContent = "Terminées";
    boutonTermines.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "text-center","shadow-lg","shadow-gray-900","max-sm:w-1/3","flex","justify-center","items-center");
    boutonTermines.addEventListener('click', () => afficherTaches(toDoList.filter(t => t.terminee)));//tri en fonction de l'état

    //creatiion et style bouton non terminées
    const boutonNonTermines = document.createElement("button");
    boutonNonTermines.textContent = "Non Terminées";
    boutonNonTermines.classList.add("rounded-lg","bg-emerald-400","w-1/12","hover:bg-emerald-600","ring-4","ring-zinc-600","text-zinc-600",
        "shadow-lg","shadow-gray-900","max-sm:w-1/3");
    boutonNonTermines.addEventListener('click', () => afficherTaches(toDoList.filter(t => !t.terminee)));//tri en fonction de l'état

    //incruste des boutons dans buttonContainer
    buttonContainer.appendChild(boutonTous);
    buttonContainer.appendChild(boutonTermines);
    buttonContainer.appendChild(boutonNonTermines);
    
    menuDiv.appendChild(buttonContainer);//incruste buttonContainer

    afficherTaches(toDoList);   // appelle afficherTaches

}

function generateUniqueId() {
    return '_' + Math.random().toString(36).slice(2, 9); //Math cree un chiffre entre 1 et 2, toString le convertie en une chaîne
                                                        // de caractères en base 36 et slice prend entre les index 2 et 9
                                                        // '_' bonne pratique pour le rendre pluse lisible
}

function afficherTaches(taches) {

    //on récupère et style menuDiv
    const menuDiv = document.getElementById("container");
    menuDiv.classList.add("flex","justify-center", "bg-[url('fondEcran.webp')]","bg-cover","bg-center",);

    // creation d'une liste pour afficher les tâches
    let ul = menuDiv.querySelector("section");//regarde si une section existe déja indispensable pour le tri par état
    if (!ul) {
        //craction section 
        ul = document.createElement("section"); 
        ul.classList.add("grid","grid-cols-3","w-4/5", "ml-40","flex","justify-items-center",
            "rounded-lg","gap-y-2","max-sm:flex","max-sm:flex-col","max-sm:ml-8");
        menuDiv.appendChild(ul);
    } else {
        ul.innerHTML = ""; //vide la section existante
    }

    //boucle pour creer et style tous les éléments de la liste
    taches.forEach(tache => {


        const tacheDiv = document.createElement("div"); 
        tacheDiv.classList.add("border","border-4","bg-emerald-400","flex","flex-col","justify-around","h-11/12","w-11/12","rounded-lg","m-5",
            "shadow-xl","shadow-gray-900"); 

        const nomDate = document.createElement("div");

        const dateTache = document.createElement("p");
        dateTache.textContent = `Date : ${tache.date}`;//afiche la date du fichier json
        dateTache.classList.add("text-lg", "font-bold");

        const  nomTache= document.createElement("p");
        nomTache.textContent = `${tache.nom}`; // affiche la date du fichier json

        const descTache = document.createElement("p"); 
        descTache.textContent = `${tache.description}`; //affiche la date du fichier json
        descTache.classList.add("h-72","bg-zinc-100","rounded-lg","m-2")


        nomDate.appendChild(dateTache);
        nomDate.appendChild(nomTache);

        const boutons = document.createElement("div");
        boutons.classList.add("flex","gap-5");

        const boutonSupp = document.createElement("button");
        const imgSup = document.createElement("img");
        imgSup.src = "supp.png";
        imgSup.alt = "supprimer";
        boutonSupp.appendChild(imgSup);
        boutonSupp.style.cursor = "pointer";
        boutonSupp.addEventListener("click", function() {

            supprimerTache({   // on appelle supprimerTache avec juste l'id en argument
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
            
            modifierTache({   // on appelle modifierTache avec 4 paramètres
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

        // change l'etat de terminé dans le tableau js
        checkbox.addEventListener("change", function() {
        tache.terminee = checkbox.checked; 
        if (checkbox.checked) {
            tacheDiv.classList.add("terminee"); 
        } else {
            tacheDiv.classList.remove("terminee");
        }

        // on appelle ecrirejSON avec modifier pour changer la valeur de terminée dans le json
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

function createForm(champs) {
    
    const formContainer = document.createElement('form');
    formContainer.className = 'custom-form';
  
    // boucle pour chaque element
    champs.forEach(champ => {
      const fieldContainer = document.createElement('div');
      fieldContainer.classList.add("flex","flex-col","items-center","m-2");
  
     
      if (champ.label) {
        const label = document.createElement('label');
        label.innerText = champ.label;
        label.htmlFor = champ.name;
        fieldContainer.appendChild(label);
      }
  
      // creation d'un element pur chaque clef de l'objet champ crée dans chaque fonction
      const input = document.createElement(champ.type === 'textarea' ? 'textarea' : 'input');
      input.type = champ.type || 'text'; 
      input.name = champ.name;
      input.id = champ.name;
      input.placeholder = champ.placeholder || '';
      if (champ.value) input.value = champ.value;

      if (champ.name === 'date') { //style date
        input.classList.add("rounded-lg","bg-zinc-100","text-gray-700","shadow-md","shadow-gray-900");
    }

    if (champ.name === 'nom') {  //style nom
        input.classList.add("rounded-lg","bg-zinc-100","text-gray-700","w3/4","text-center","shadow-md","shadow-gray-900");
    }

      if (champ.type === 'textarea') { //style textarea
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

    //cration objet pour formulaire 
    const champs = [
        { name: 'date', type: 'date', label: 'Pour Quand :', placeholder: 'jj/mm/aaaa' },
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache' },
        { name: 'description', type: 'textarea', label: 'Décrivez la tâche :'}
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

    //envoi du formulaire au serveur
    boutonAjout.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        //traduction date
        const [jourA, moisA, anneeA] = date.split("/");
        const dateVerif = new Date(`${anneeA}-${moisA}-${jourA}`);
        const dateJour = new Date(); 
        dateJour.setHours(0, 0, 0, 0); 
        dateVerif.setHours(0, 0, 0, 0);  
    
        if (dateVerif < dateJour) {// verif date

            alert("La date n'est pas valide");
            return; 

        }else if (nom && description && date && form.checkValidity()) { //si tout est rempli
            // re traduction de la date
            const  [annee, mois, jour] = date.split("-");
            const formatDate = `${jour}/${mois}/${annee}`;

            const newTache = {
                id: generateUniqueId(),//creation de l'id
                nom: nom,
                description: description,
                date: formatDate,
            };

            ecrireJSON("ajouter", newTache)// envoi de ajouter pour dire au server quoi faire avec newTache
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

function supprimerTache(tache) {


            const suppTache = {
                id: tache.id,
            };

            ecrireJSON("supprimer", suppTache)// envoi de supprimer pour que le server sache quoi faire de suppTache
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

    //creation objet pour creer formulaire
    const champs = [
        { name: 'date', type: 'date', label: 'Pour quand ?', placeholder: 'jj/mm/aaaa', value: tache.date },
        { name: 'nom', type: 'text', label: 'Nom de la tâche :', placeholder: 'nom de la tache', value: tache.nom },
        { name: 'description', type: 'textarea', label: 'Décrivez la tâche :', value: tache.description }
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

    //envoi de la requete au click
    boutonMod.addEventListener("click", function(e) {
        e.preventDefault();

        const nom = document.getElementById('nom').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value; 
        const [jourA, moisA, anneeA] = date.split("/");
    
     //convertion de la date
    const dateVerif = new Date(`${anneeA}-${moisA}-${jourA}`);
    const dateJour = new Date(); 
    dateJour.setHours(0, 0, 0, 0); 
    dateVerif.setHours(0, 0, 0, 0); 

    console.log("Date vérifiée:", dateVerif); 
    console.log("Date d'aujourd'hui:", dateJour); 
    
    //verif de la date
    if (dateVerif < dateJour) {
        alert("La date n'est pas valide");
        return; 
    }
    //si tout va bien on envoie la requete au server
        else if (nom && description && date && form.checkValidity()) {

            const formatDate = `${jourA}/${moisA}/${anneeA}`;

           //objet a envoyer
            const newTache = {
                id: tache.id,
                nom: nom,
                description: description,
                date: formatDate,
            };

            console.log("Données envoyées pour modification :", JSON.stringify(newTache, null, 2)); 

            ecrireJSON("modifier", newTache)// envoi de modifier pour donner ordre au server
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




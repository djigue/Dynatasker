let toDoList = [];
const options = ["Toutes", "Actives", "Terminées"];

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
        toDoList = data.taches; 
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

    //lancement();

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

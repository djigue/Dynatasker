let toDoList = [];

async function myJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Le fichier n'a pas pu être trouvé");
    }
    const data = await response.json();
    console.log("Données fetchées:", data);

    if (data.contacts) {
        contacts = data.contacts; 
    }
    console.log("Contacts chargés:", contacts);
    return data;
}

function fetchEtListerContacts() {
    myJson('todolist.json')
        .then(() => {
            listerTaches(toDoList); 
        })
        .catch(error => {
            console.error("L'opération fetch a rencontré un problème:", error);
        });
}
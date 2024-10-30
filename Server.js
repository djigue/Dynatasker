//recureration des modules indispensables
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

//creation d'une variable qui executera les modules, et d'un port pour communiquer
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

//fonction qui récupérer le fichier json qui ajoute le nouveau contact et qui réecrit le fichier json 
app.post('/ajouter-tache', (req, res) => { //req = requete  res = reponse

    //on récupere le contenu de la requete (voir requete sur gdc.js l93)
    const newTache = req.body;
    
    // Lire le fichier existant
    fs.readFile('todolist.json', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur de lecture du fichier');
        }
  
       //stoque les données localement dans un tableau
        let toDoList = [];
        try {
            toDoList = JSON.parse(data).taches;//convertit json en fichier js
        } catch (error) {
            return res.status(500).send('Erreur lors de la lecture des contacts');
        }

        // Ajoute le nouveau contact
        toDoList.push(newTache);

        // ecrit tableau contacts dans gdc.json  stringify convertit fichier js en json
        fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList },null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erreur d\'écriture dans le fichier');
            }
            res.status(200).send('Tâche ajoutée avec succès');
        });
    });
});


//fonction pour que le server soit pret a ecouter les requetes
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});


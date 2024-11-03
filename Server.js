//import de module
const express = require('express');//pour la com
const bodyParser = require('body-parser');//pour traduire 
const fs = require('fs'); //pour ecrire
const cors = require('cors');//sécu

//creation constante avec modules
const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

//des qu'une requete post arrive
app.post('/gestion-tache', (req, res) => {
    const { action, tache, id } = req.body; //recupère l'objet envoyé

    //on recupere le fichier json
    fs.readFile('todolist.json', (err, data) => {
        if (err) return res.status(500).send('Erreur de lecture du fichier');
        
        //creation tableau
        let toDoList = [];
        try {
            toDoList = JSON.parse(data).taches;//ajout des objet json au tableau
        } catch (error) {
            return res.status(500).send('Erreur lors de la lecture des tâches');//si pb
        }

        // boucle en fonction des ordres
        switch (action) {

            // ordre reçu 
            case 'ajouter':
                
            //regarde si la tache existe
                const existeDeja = toDoList.some(testTache => //some renvoi true si 
                    testTache.nom === tache.nom && testTache.date === tache.date
                );

                if (existeDeja) {
                    return res.status(400).send('Cette tâche existe déjà');
                }

                toDoList.push(tache);//ajoute l'objet au tableau

                //reecrit le tableau dans le fichier json
                fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
                    if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
                    res.status(200).send('Tâche ajoutée avec succès');
                });
                break;

            // ordre reçu 
            case 'supprimer':
                
                const tacheASupprimer = toDoList.filter(testTache => //cree tableau avec id demandé
                    testTache.id === tache.id
                );

                if (tacheASupprimer.length === 0) { // si tableau vide
                    return res.status(404).send('Tâche non trouvée');
                }

                toDoList = toDoList.filter(testTache => //cree tableau sans l'id demandé
                    testTache.id !== tache.id
                );
 
                //reecrit le tableau dans le fichier json
                fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
                    if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
                    res.status(200).send('Tâche supprimée avec succès');
                });
                break;

            // ordre reçu
            case 'modifier': 
                
                const tacheAModifier = toDoList.findIndex(testTache => //cherche index grâce à l'id
                    testTache.id === tache.id
                );
          
                if (tacheAModifier === -1) { // si pas trouvé id
                    return res.status(404).send('Tâche non trouvée');
                }
                //ecrase l'objet à l'index par le nouvel obet
                toDoList[tacheAModifier] = { ...toDoList[tacheAModifier], ...tache }; // commence par decomposer et remplace ensuite

                //recrit le fichier json
                fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
                    if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
                    res.status(200).send('Tâche modifié avec succès');
                });
                break;


            default:
                res.status(400).send('Action non reconnue');
                break;
        }
    });
});

//obligatire pour que le port écoute
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post('/gestion-tache', (req, res) => {
    const { action, tache, id } = req.body;

    fs.readFile('todolist.json', (err, data) => {
        if (err) return res.status(500).send('Erreur de lecture du fichier');

        let toDoList = [];
        try {
            toDoList = JSON.parse(data).taches;
        } catch (error) {
            return res.status(500).send('Erreur lors de la lecture des tâches');
        }

        switch (action) {
            case 'ajouter':
                
                const existeDeja = toDoList.some(testTache => 
                    testTache.nom === tache.nom && testTache.date === tache.date
                );

                if (existeDeja) {
                    return res.status(400).send('Cette tâche existe déjà');
                }

                toDoList.push(tache);

                fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
                    if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
                    res.status(200).send('Tâche ajoutée avec succès');
                });
                break;

            case 'supprimer':
                
                const tacheASupprimer = toDoList.filter(testTache => 
                    testTache.nom === tache.nom && testTache.date === tache.date
                );

                if (tacheASupprimer.length === 0) {
                    return res.status(404).send('Tâche non trouvée');
                }

                toDoList = toDoList.filter(testTache => 
                    !(testTache.nom === tache.nom && testTache.date === tache.date)
                );

                fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
                    if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
                    res.status(200).send('Tâche supprimée avec succès');
                });
                break;

            default:
                res.status(400).send('Action non reconnue');
                break;
        }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
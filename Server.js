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

        if (action === 'ajouter') {
            toDoList.push(tache);
        }
        
        fs.writeFile('todolist.json', JSON.stringify({ taches: toDoList }, null, 2), (err) => {
            if (err) return res.status(500).send('Erreur d\'écriture dans le fichier');
            res.status(200).send('Tâche ajoutée avec succès');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
const fs = require('fs');

// Charger les données des fichiers JSON
const competitionsData = JSON.parse(fs.readFileSync('../src/data/competitions.json', 'utf8'));
const backupData = JSON.parse(fs.readFileSync('../src/data/competitions_backup_2024-02-20T08-29-50.230Z.json', 'utf8'));

// Extraire les ID des deux ensembles de données
const competitionsIds = new Set(competitionsData.map(item => item.id));
const backupIds = new Set(backupData.map(item => item.id));

// Trouver les ID présents dans le fichier de sauvegarde mais absents dans competitions.json
const missingIds = [...backupIds].filter(id => !competitionsIds.has(id));

console.log("ID présents dans la sauvegarde mais absents dans competitions.json :");
console.log(missingIds);

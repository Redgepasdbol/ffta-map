const fs = require('fs');
const crypto = require('crypto');

// Fonction pour générer un identifiant unique
const generateId = (title, discipline, startDate, endDate, detailLink) => {
    const data = `${detailLink}-${startDate}-${endDate}-${discipline}-${title}`;
    return Buffer.from(data).toString('base64');
};


const formatDetailLink = (detailLink) => {
    // Extraire le numéro d'épreuve de l'URL actuelle
    const match = detailLink.match(/\/(\d+)$/);
    if (match && match[1]) {

        const numeroEpreuve = match[1];
        //console.log(`https://www.ffta.fr/epreuve/${numeroEpreuve}`)
        // Concaténer le numéro d'épreuve à la nouvelle URL
        return "" + numeroEpreuve;
    } else {
        // Retourner l'URL originale si le numéro d'épreuve n'est pas trouvé        
        return "NOID";
    }
};

// Lecture du fichier competitions.json
fs.readFile('../src/data/competitions.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Analyse du contenu JSON
        const competitions = JSON.parse(data);

        // Modification des compétitions
        const modifiedCompetitions = competitions.map(competition => ({
            ...competition,
            id: formatDetailLink(competition.detailLink) // generateId(competition.title, competition.discipline, competition.startDate, competition.endDate, competition.detailLink)
        }));

        // Écriture du fichier modifié
        fs.writeFile('competitions_modified.json', JSON.stringify(modifiedCompetitions, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File competitions_modified.json has been saved.');
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});
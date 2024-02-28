// scraper.js



const axios = require('axios');
const cheerio = require('cheerio');
const { log } = require('console');
const fs = require('fs');

const https = require('https');
const crypto = require('crypto');



const baseUrl = 'https://www.ffta.fr/competitions';
const disciplines = [103, 107, 108, 102, 109, 115, 111,];
//const disciplines = [103];
const startDate = '2024-01-01';
const endDate = '2024-09-01';

const currentDate = new Date().toISOString()
const agentOptions = {
    ca: fs.readFileSync('certificat.pem'),
    maxVersion: 'TLSv1.2',
    minVersion: 'TLSv1.2',


    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
    rejectUnauthorized: false,
    ////////rejectUnauthorized: true, // Rejeter les certificats non autorisés
    ////////secureProtocol: 'TLSv1_2_method', // Utiliser le protocole TLS 1.2
};


// Fonction pour générer un ID unique basé sur le titre, la discipline et la date de début
const generateId = (title, discipline, startDate, endDate, detailLink) => {
    // const hash = crypto.createHash('sha256');
    // hash.update(`${title}-${discipline}-${startDate}-${endDate}-${detailLink}`);
    // return hash.digest('hex');

    //const data = `${detailLink}`;
    const data = `${detailLink}-${startDate}-${endDate}-${discipline}-${title}`;
    return Buffer.from(data).toString('base64');
};

const agent = new https.Agent(agentOptions);

//process.exit();

const fetchData = async (url) => {
    try {
        const response = await axios.get(url, { httpsAgent: agent });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const formatDetailLink = (detailLink) => {
    // Extraire le numéro d'épreuve de l'URL actuelle
    const match = detailLink.match(/\/(\d+)$/);
    if (match && match[1]) {

        const numeroEpreuve = match[1];
        //console.log(`https://www.ffta.fr/epreuve/${numeroEpreuve}`)
        // Concaténer le numéro d'épreuve à la nouvelle URL
        return '' + numeroEpreuve
    } else {
        // Retourner l'URL originale si le numéro d'épreuve n'est pas trouvé        
        return "NOID";
    }
};


const parseLocation = (html) => {
    const $ = cheerio.load(html);

    const mainLocationParagraph = $('p:contains("Lieu :")');
    const mainLocationStrong = mainLocationParagraph.find('strong');
    let mainLocation = mainLocationStrong.text().trim();
    //console.log(mainLocation)

    const locationParagraphs = $('p:contains("Lieu :")').nextUntil('br');
    let location = '';
    locationParagraphs.each((index, element) => {
        location += $(element).text().trim() + ' ';
    });
    //console.log(location)

    const postalCodeRegex = /\b\d{5}\b/;
    const match = location.match(postalCodeRegex);
    if (match) {
        // Si un code postal est trouvé, découpez le texte et recombinez-le
        const postalCodeIndex = location.indexOf(match[0]);
        const beforePostalCode = location.substring(0, postalCodeIndex).trim();
        const afterPostalCode = location.substring(postalCodeIndex + match[0].length).trim();
        location = `${mainLocation}, ${match[0]} ${afterPostalCode}, ${beforePostalCode}`;
    }
    else {
        location = `${mainLocation}, ${location}`
    }

    return location.trim();
};


function convertDate(dateString) {
    const parts = dateString.split('/');
    if (parts.length !== 3) {
        throw new Error('Invalid date format. Expected format: dd/mm/yyyy');
    }
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Fonction pour mettre à jour les liens avec la date de dernière mise à jour
const updateLinks = (link) => {
    return {
        link,
        lastUpdateDate: currentDate
    };
};

// Fonction pour mettre à jour l'adresse avec les coordonnées lat et lon
const updateAddress = (address) => {
    return {
        address,
        lastUpdateDate: currentDate
    };
};


const scrapeData = (html) => {
    const competitions = [];

    const $ = cheerio.load(html);
    $('.competition_item').each((index, element) => {
        const competition = {};

        const dateText = $(element).find('.competition_item__dates').text().trim();
        //console.log(dateText);
        const [startDate, endDate] = parseDateText(dateText);

        competition.startDate = convertDate(startDate);
        competition.endDate = convertDate(endDate);




        //competition.date = $(element).find('.competition_item__dates').text().trim();
        competition.title = $(element).find('.competition_item__title .field__item').text().trim();
        competition.discipline = $(element).find('.field--name-field-discipline').text().trim();
        competition.type = $(element).find('.field--name-field-type-championnat').text().trim();



        const locationSpan = $(element).find('small').text();
        const location = locationSpan.substring(1, locationSpan.length - 1)
        competition.location = location;

        competition.email = $(element).find('.btn[href^="mailto:"]').attr('href') || '';
        competition.website = $(element).find('.btn[href^="http"]').attr('href') || '';
        competition.mandatLink = $(element).find('.btn.competition_item__mandat_btn').attr('href') || '';
        competition.detailLink = $(element).find('.btn.competition_item__infos_btn').attr('href') || '';


        // Récupérer les liens Détail, Résultats et Mandat s'ils existent
        const actions = $(element).find('.competition_item__actions');
        const detailLink = actions.find('.competition_item__infos_btn').attr('href');
        const resultsLink = actions.find('.competition_item__results_btn').attr('href');
        const mandatLink = actions.find('.competition_item__mandat_btn').attr('href');
        // if (detailLink === "/index.php/epreuve/3564"){
        //     console.log("trouvé")
        //     process.exit()
        // }
        competition.detailLink = detailLink ? formatDetailLink(detailLink) : '';
        competition.resultsLink = updateLinks(resultsLink || '');
        competition.mandatLink = updateLinks(mandatLink || '');

        competition.id = competition.detailLink;




        // if (detailLink === "16071"){
        //     console.log(competition)
        //     process.exit()
        // }


        competitions.push(competition);
    });

    return competitions;
};

const parseDateText = (dateText) => {
    const dateArray = dateText.match(/(Du (\d{1,2} .* \d{4}) au (\d{1,2} .* \d{4}))|(Le (\d{1,2} .* \d{4}))|(Du (\d{1,2}) au (\d{1,2} .* \d{4}))|(Du (\d{1,2} .*) au (\d{1,2} .* \d{4}))/g);
    let start
    let end
    if (dateArray) {
        if (dateArray.length === 1) {
            const startDD = dateArray[0].match(/Le (\d{1,2} .* \d{4})/);
            if (startDD) {
                start = formatDateString(startDD[1])
                end = start
                //console.log(formatDateString(startDD[1]));

            }
            const startDL = dateArray[0].match(/Du (\d{1,2}) au (\d{1,2}) (.*) (\d{4})/);
            if (startDL) {
                start = formatDateString(`${startDL[1]} ${startDL[3]} ${startDL[4]}`)
                end = formatDateString(`${startDL[2]} ${startDL[3]} ${startDL[4]}`)
                //console.log(`${start[1]} - ${startDL[2]} - ${startDL[3]} - ${startDL[4]}`);
            }
            const startDLL = dateArray[0].match(/Du (\d{1,2}) (.*) au (\d{1,2}) (.*) (\d{4})/);
            if (startDLL) {
                start = formatDateString(`${startDLL[1]} ${startDLL[2]} ${startDLL[5]}`)
                end = formatDateString(`${startDLL[3]} ${startDLL[4]} ${startDLL[5]}`)
                //console.log(`${start[1]} - ${startDL[2]} - ${startDL[3]} - ${startDL[4]}`);
            }


            return [start, end];
        }
    }

    return [null, null]; // Default values if dateArray is undefined
};

const formatDateString = (dateString) => {
    //console.log(dateString);
    const [day, month, year] = dateString.split(' ');
    return `${day}/${getMonthNumber(month)}/${year}`;
};

const getMonthNumber = (month) => {
    const months = {
        janvier: '01', février: '02', mars: '03', avril: '04', mai: '05', juin: '06',
        juillet: '07', août: '08', septembre: '09', octobre: '10', novembre: '11', décembre: '12'
    };

    return months[month];
};

const eliminateDuplicates = (data) => {
    const uniqueIds = new Set();
    const uniqueData = [];
    data.forEach((item) => {
        if (!uniqueIds.has(item.id)) {
            uniqueIds.add(item.id);
            uniqueData.push(item);
        }
    });
    return uniqueData;
};



const cleanAddress = (address) => {
    // Supprimer les accents et mettre en minuscule
    address = address.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    // Enlever les transformations HTML et les remplacer par un espace
    address = address.replace(/&[^;]+;/g, ' ');
    // Remplacer les caractères spéciaux par des espaces
    address = address.replace(/[^\w\s]/g, ' ');
    // Supprimer les espaces en double
    address = address.replace(/\s+/g, ' ').trim();

    address = address.replace(/\s/g, '+').replace(/[^a-zA-Z0-9+]/g, '');
    return address;
};



const getLatLonFromAddress = async (address) => {
    try {
        await sleep(100);
        const formattedAddress = cleanAddress(address)
        //console.log(formattedAddress);
        const apiUrl = `https://nominatim.openstreetmap.org/search?q=${formattedAddress}&format=json&polygon=1&addressdetails=1`;
        const response = await axios.get(apiUrl, { httpsAgent: agent });
        const data = response.data;
        if (data.length > 0) {
            const result = data[0];
            const lat = result.lat;
            const lon = result.lon;
            // console.log('Latitude:', lat);
            // console.log('Longitude:', lon);
            return [lat, lon]
        } else {
            //console.error('No data found for the provided address.');
            return undefined
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const getPathDataToAddress = async (origin, target) => {
    try {
        await sleep(100);
        //console.log(origin);
        const apiUrl = `https://router.project-osrm.org/route/v1/driving/${origin[1]},${origin[0]};${target[1]},${target[0]}?overview=false`;
        const response = await axios.get(apiUrl, { httpsAgent: agent });
        const data = response.data;
        if (data) {
            const duration = data.routes[0].duration / 60;
            const distance = data.routes[0].distance / 1000;
            return [duration, distance]
        } else {
            return undefined
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const generateAddresses = (address) => {
    // Séparer l'adresse par la virgule
    const parts = address.split(',');

    let address1 = '';
    let address2 = '';
    let address3 = '';

    if (parts.length >= 2) {
        const lastPart = parts[parts.length - 1].trim();

        // Vérifier si la dernière partie contient un code postal
        const postalCodeMatch = address.match(/\d{5}/);
        if (postalCodeMatch) {

            // Étape 1 : Prendre tout ce qu'il y a après "FRANCE,"
            const afterFrance = address.slice(address.indexOf('FRANCE,') + 7).trim();
            const beforeFrance = address.slice(0, address.indexOf('FRANCE,')).trim();
            const cleanCity = beforeFrance.slice(address.indexOf(postalCodeMatch[0])).trim();

            // Étape 4 : Mettre le résultat du point 1 puis tout ce qui n'a pas été supprimé
            address1 = `${afterFrance} ${cleanCity}`;

            // Générer la deuxième adresse en conservant uniquement le code postal et la ville
            address2 = cleanCity;

            // Générer la troisième adresse en conservant uniquement la ville jusqu'à la virgule
            address3 = parts[0].trim();
        } else {
            // Si la dernière partie ne contient pas de code postal, alors c'est une seule adresse
            address1 = parts[0].trim();
        }
    }

    return [address1, address2, address3];
};


const scrapeSite = async () => {
    try {
        const allCompetitions = [];

        for (const discipline of disciplines) {
            let page = 0;
            let hasNextPage = true;
            console.log(discipline);
            while (hasNextPage) {

                const url = `${baseUrl}?search=&start=${startDate}&end=${endDate}&discipline=${discipline}&univers=All&inter=All&sort_by=start&sort_order=DESC&page=${page}`;

                console.log(`${url}`);
                const html = await fetchData(url);


                //if (page > 10){
                //  hasNextPage = false;
                //  break;
                //}
                if (!html) {
                    hasNextPage = false;
                    break;
                }

                const newCompetitions = scrapeData(html);
                if (newCompetitions.length === 0) {
                    hasNextPage = false;
                    break;
                }

                // Retrieve address for each competition
                // for (const competition of newCompetitions) {
                //     if (competition.detailLink) {
                //         await sleep(100);
                //         const detailHtml = await fetchData(competition.detailLink);
                //         if (detailHtml) {
                //             const address = parseLocation(detailHtml);
                //             competition.address = address;
                //             console.log(address);
                //         }
                //     }
                // }
                console.log("Nb compétitions : " + newCompetitions.length)
                allCompetitions.push(...newCompetitions);
                console.log("Nb compétitions all : " + allCompetitions.length)

                //break;
                page++;
            }
        }

        console.log("TOTAL AVANT SUPPRESSION DOUBLONS : " + allCompetitions.length)
        const uniqueFirstCompetitions = eliminateDuplicates(allCompetitions);
        console.log("TOTAL APRES SUPPRESSION DOUBLONS : " + uniqueFirstCompetitions.length)


        const backupFileName = `../src/data/competitions_backup_${new Date().toISOString().replace(/:/g, '-')}.json`;
        fs.copyFileSync('../src/data/competitions.json', backupFileName);

        const oldCompetitions = require('../src/data/competitions.json');

        const competitionsMerged = [];
        //competitionsMerged.push(...oldCompetitions);

        console.log("--------------------------------------------------------")
        console.log("DEBUT RECHERCHE ADRESSES")
        console.log("--------------------------------------------------------")
        for (const newCompetition of uniqueFirstCompetitions) {
            let updated = false
            // if (newCompetition.id ==="3564")
            // {
            //     console.log("TROUVEE")
            //     process.exit()
            // }
            // console.log("[" + newCompetition.id +"]")
            const existingCompetition = oldCompetitions.find((oldCompetition) => '' + oldCompetition.id === '' + newCompetition.id);

            if (!existingCompetition) {
                //GET ADRESSE
                console.log(newCompetition.id + " - n existe pas")
                newCompetition.creationDate = currentDate
                newCompetition.lastUpdateDate = currentDate
                if (newCompetition.detailLink) {
                    await sleep(100);
                    const detailHtml = await fetchData("https://www.ffta.fr/epreuve/" + newCompetition.detailLink);
                    if (detailHtml) {
                        const address = parseLocation(detailHtml);
                        newCompetition.address = updateAddress(address);
                        console.log(address);
                    }
                }
                // Nouvelle compétition à scraper car elle n'existe pas dans l'ancien fichier
                competitionsMerged.push(newCompetition);
            } else {
                newCompetition.creationDate = existingCompetition.creationDate
                newCompetition.lastUpdateDate = existingCompetition.lastUpdateDate

                if (existingCompetition.address && existingCompetition.address.address) {
                    newCompetition.address = existingCompetition.address
                }
                if (newCompetition.resultsLink.link === existingCompetition.resultsLink.link) {
                    newCompetition.resultsLink.lastUpdateDate = existingCompetition.resultsLink.lastUpdateDate
                } else {
                    updated = true
                    newCompetition.resultsLink.lastUpdateDate = currentDate
                }
                if (newCompetition.mandatLink.link === existingCompetition.mandatLink.link) {
                    newCompetition.mandatLink.lastUpdateDate = existingCompetition.mandatLink.lastUpdateDate
                } else {
                    updated = true
                    newCompetition.mandatLink.lastUpdateDate = currentDate
                }


                if (!existingCompetition.address) {
                    updated = true
                    if (newCompetition.detailLink) {
                        await sleep(100);
                        const detailHtml = await fetchData("https://www.ffta.fr/epreuve/" + newCompetition.detailLink);
                        if (detailHtml) {
                            const address = parseLocation(detailHtml);
                            newCompetition.address = updateAddress(address);
                            //newCompetition.address.lastUpdateDate = new Date().toISOString()
                            console.log(newCompetition.id + " - existe sans adresse 1")
                            //console.log(address);
                        }

                    }
                } else {
                    if (!existingCompetition.address.address) {
                        updated = true
                        if (newCompetition.detailLink) {
                            await sleep(100);
                            const detailHtml = await fetchData("https://www.ffta.fr/epreuve/" + newCompetition.detailLink);
                            if (detailHtml) {
                                const address = parseLocation(detailHtml);
                                newCompetition.address = updateAddress(address);
                                // newCompetition.address.lastUpdateDate = new Date().toISOString()
                                console.log(newCompetition.id + " - existe sans adresse 2")
                            }
                        }
                    }
                }





                if (!updated) {
                    newCompetition.lastUpdateDate = existingCompetition.lastUpdateDate
                } else {
                    newCompetition.lastUpdateDate = currentDate
                }
                if (!newCompetition.creationDate) {
                    newCompetition.creationDate = currentDate
                }
                if (!newCompetition.lastUpdateDate) {
                    newCompetition.lastUpdateDate = currentDate
                }
                // } else {
                //     if (existingCompetition.address.lon) {
                //         newCompetition.address.lon = existingCompetition.address.lon
                //     }
                //     if (existingCompetition.address.lat) {
                //         newCompetition.address.lat = existingCompetition.address.lat
                //     }
                //     if (existingCompetition.address.duration) {
                //         newCompetition.address.duration = existingCompetition.address.duration
                //     }
                //     if (existingCompetition.address.distance) {
                //         newCompetition.address.distance = existingCompetition.address.distance
                //     }
                // }

                competitionsMerged.push(newCompetition);
            }
        }
        console.log("--------------------------------------------------------")
        console.log("DEBUT RECHERCHE LATITUDE LONGITUDE")
        console.log("--------------------------------------------------------")



        for (const competition of competitionsMerged) {
            // if (competition.detailLink ==="https://www.ffta.fr/epreuve/3564")
            // {
            //     console.log("TROUVEE")
            //     process.exit()
            // }
            if (competition.address) {
                if (competition.address.lat && competition.address.duration) {
                    //console.log("Coordonnées existantes")
                    continue;
                }
            }
            //console.log(competition.id)
            let address = generateAddresses(competition.address.address)
            let latLon = await getLatLonFromAddress(address[0]);
            if (!latLon && address[1]) {
                latLon = await getLatLonFromAddress(address[1]);
                if (!latLon && address[2]) {
                    latLon = await getLatLonFromAddress(address[2]);
                }
            }


            if (latLon) {
                competition.address.lat = latLon[0];
                competition.address.lon = latLon[1];
                competition.address.lastUpdateDate = currentDate

                const pathData = await getPathDataToAddress(latLon, [45.8130, 3.1876])
                if (pathData) {
                    competition.address.duration = pathData[0];
                    competition.address.distance = pathData[1];
                    console.log(" OK -" + competition.address.address + " - " + latLon + " - " + pathData);
                } else {
                    console.log(" OK -" + competition.address.address + " - " + latLon);
                }
            } else {
                console.log(" KO -" + competition.address.address);
            }

            // break;
        }

        console.log("TOTAL AVANT MANQUANT : " + competitionsMerged.length)
        fs.writeFileSync('../src/data/competitions.json', JSON.stringify(competitionsMerged, null, 2));


        // Charger les données des fichiers JSON
        let competitionsData = JSON.parse(fs.readFileSync('../src/data/competitions.json', 'utf8'));
        const backupData = JSON.parse(fs.readFileSync(backupFileName, 'utf8'));

        // Extraire les ID des deux ensembles de données
        const competitionsIds = new Set(competitionsData.map(item => item.id));
        const backupIds = new Set(backupData.map(item => item.id));

        // Trouver les ID présents dans le fichier de sauvegarde mais absents dans competitions.json
        const missingIds = [...backupIds].filter(id => !competitionsIds.has(id));

        // Ajouter les ID manquants à competitions.json
        competitionsData = competitionsData.concat(backupData.filter(item => missingIds.includes(item.id)));
        console.log(missingIds)

        console.log("TOTAL AVANT SUPPRESSION DOUBLONS : " + competitionsData.length)
        const uniqueCompetitions = eliminateDuplicates(competitionsData);
        console.log("TOTAL APRES SUPPRESSION DOUBLONS : " + uniqueCompetitions.length)

        // Écrire les données mises à jour dans competitions.json
        fs.writeFileSync('../src/data/competitions.json', JSON.stringify(uniqueCompetitions, null, 2));




    } catch (error) {
        console.error('Error scraping site:', error);
    }

    //saveToJSON(allCompetitions);
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

scrapeSite();



//INVERSER LONG LAT : https://router.project-osrm.org/route/v1/driving/3.1876,45.8130;3.0106,45.9423?overview=false
//https://nominatim.openstreetmap.org/search?q=3+rue+sous+le+chateau+63510+malintrat&format=json&polygon=1&addressdetails=1
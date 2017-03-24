/* ******************** */
/* ***  Les données *** */
/* ******************** */

// Liste des années
var annee = [1990,2000,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016];

// Liste des pays
/*$.getJSON('pib_pays.json', function(data) {
    // Création de la table contenant les objets des Pays (PIB/DATE)
    var pibPays = [];
    $.each(data, function(key,val){
        // On enlève les lignes vide
        if(val["Country Name"] != ""){
            //Création de la liste contenant les objets avec attributs Date / PIB
            var datePIB = [];
            // On rempli la liste avec totue les dates
            $.each(val,function(key2,val2){
                if(key2[0] == 1 || key2[0] == 2){
                    datePIB.push({date:key2,pib:val2});
                }
            });
            //On ajoute les données dans notre liste (une par une ofc)
            pibPays.push({nomPays: val["Country Name"], valeur: datePIB})
        }
    });

});*/




/* ******************** */
/* ** Initialisation ** */
/* ******************** */

// Implémentation BD
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

// Si le navigateur n'est pas compatible avec la BD
if (!window.indexedDB) {
    window.alert("Votre navigateur n'est pas compatible avec IndexedDB. Merci d'en utiliser un autre...")
}

var db; // La base de données

// On ouvre la base, la nomme et on lui donne un n° de version. 
var request = window.indexedDB.open("Database", 1);

// Cas d'échec
request.onerror = function(event) {
    console.log("Echéc de la connexion !");
};

// Cas de succès
request.onsuccess = function(event) {
    db = request.result;    // On enregistre le resultat de la requête dans la base
    console.log("Connexion réussi : " + db);
};


// Création ou "rechargement" de la BD
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    
    // Création des tables et définitions des clés primaires
    var db = event.target.result;
    //var paysTable = db.createObjectStore("Pays", {keyPath: "nomPays"});
    var anneeTable = db.createObjectStore("Annee", {keyPath: "annee"});
    //var continentTable = db.createObjectStore("Continent", {keyPath: "nomContinent"});
    //var pibTable = db.createObjectStore("PIB", {keyPath: ["nomPaysPIB","anneePIB"]});
    
    // On ajoute les données dans la BD
    /* *** TODO *** */
    /* ***
    for (var i in annee) {
        anneeTable.add({annee: annee[i]});
    }
    *** */
}




/* ******************** */
/* **** Opérations **** */
/* ******************** */

/**
 * Lit une ligne d'une table.
 * SELECT * FROM table WHERE id = :id
 * @param {type} table  - La table sur laquelle on fait la recherche
 * @param {type} id     - L'identifiant de la ligne recherchée
 * @return {undefined}  - L'objet recherché
 */
function select(table, id) {
    // Tables nécéssaires
    var transaction = db.transaction([table]);
    
    // La table utilisé
    var objectStore = transaction.objectStore(table);
    
    // Clé recherchée
    var request = objectStore.get(id);
    
    request.onerror = function(event) {
        console.log("Données non trouvée !");
    };
    
    request.onsuccess = function(event) {
        // Si on trouve l'élément recherchés, on renvoie les valeurs voulus.
        if(request.result) {
            console.log(request.result);
        } else {
            console.log("Elèment non présent dans la BD...");
        }
    };
}

/**
 * Lit toutes les lignes d'une table
 * SELECT * FROM table
 * @param {type} table  - La table sur laquelle on fait la recherche
 * @return {undefined}  - Les objets recherchés
 */
function selectAll(table) {
    // Choix de la table
    var objectStore = db.transaction(table).objectStore(table);
    
    // Curseur pour parcouri chaque élément de la table
    objectStore.openCursor().onsuccess = function(event) {
        // Lit la première ligne
        var cursor = event.target.result;
        
        // Tant qu'il reste des lignes à lire
        if (cursor) {
            // Retourne l'objet
            console.log(cursor.value);
            
            // On continue la lecture
            cursor.continue();
        } else {
            console.log("Fin de la table");
        }
    };
}

/**
 * Ajout une ligne dans la table.
 * INSERT INTO table VALUES (aAjouter[0], aAjouter[1], ...)
 * @param {type} table      - La table sur laquelle on fait la recherche
 * @param {type} aAjouter   - La ligne à ajouter
 * @return {undefined}      - Message informatif
 */
function insert(table, aAjouter) {
    var request = db.transaction([table], "readwrite")
            .objectStore(table)
            .add(aAjouter);
    
    request.onsuccess = function(event) {
        console.log("Ajout réussi !");
    };
    
    request.onerror = function(event) {
        console.log("Echec de l'ajout...");
    }
}

/**
 * Supprime une ligne d'une table.
 * DELETE FROM table WHERE id = :id
 * @param {type} table  - La table sur laquelle on fait la suppression
 * @param {type} id     - L'identifiant de la ligne à supprimer
 * @return {undefined}  - Message informatif
 */
function supprimer(table, id) {
    var request = db.transaction([table], "readwrite")
            .objectStore(table)
            .delete(id);
    
    request.onsuccess = function(event) {
        console.log("Suppresion réussi !");
    };
}
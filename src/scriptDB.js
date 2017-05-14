/* ******************** */
/* ***  Les données *** */
/* ******************** */

// Création des variables globales pour remplissage de base
var annee = ["1990","2000","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016"];
var pays = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas, The', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Dem. Rep.', 'Congo, Rep.', 'Costa Rica', "Cote d'Ivoire", 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt, Arab Rep.', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Polynesia', 'Gabon', 'Gambia, The', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran, Islamic Rep.', 'Iraq', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, Dem. Peopleâ€™s Rep.', 'Korea, Rep.', 'Kosovo', 'Kuwait', 'Kyrgyz Republic', 'Lao PDR', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia, FYR', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia, Fed. Sts.', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania', 'Russian Federation', 'Rwanda', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovak Republic', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Sudan', 'Spain', 'Sri Lanka', 'St. Kitts and Nevis', 'St. Lucia', 'St. Vincent and the Grenadines', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syrian Arab Republic', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela, RB', 'Vietnam', 'Virgin Islands (U.S.)', 'West Bank and Gaza', 'Yemen, Rep.', 'Zambia', 'Zimbabwe'];
var pibPays = {};
var birthPays = [];
var deathPays = [];
$.getJSON('pib_pays.json', function(data) {
    // Création de la table contenant les objets des Pays (PIB/DATE)
    $.each(data, function(key,val){
        // On enlève les lignes vide
        if(val["Country Name"] != ""){
            //Création de la liste contenant les objets avec attributs Date / PIB
            var datePIB = [];
            // On rempli la liste avec totue les dates
            $.each(val,function(key2,val2){
                if(key2[0] == 1 || key2[0] == 2 ){
                    datePIB.push({date:key2,pib:val2});
                }
            });
            //On ajoute les données dans notre liste (une par une ofc)
		pibPays[val["Country Name"]]= [val["Country Code"],datePIB]
        }

    });

});

// On fait avec les taux de natalité
$.getJSON('birth_per_countries.json', function(data) {
	$.each(data, function(key,val){
		if (val["Country Name"] in pibPays){
			var dateBirth = [];
			$.each(val,function(key2,val2){
                if(annee.indexOf(key2) !== -1){
                    dateBirth.push({date:key2,birth:val2});
                }
            });
			pibPays[val["Country Name"]].push(dateBirth);
	


        }
		
	});
	
});

// On fait avec le taux de mortalité
$.getJSON('death_per_countries.json', function(data) {
	$.each(data, function(key,val){
		if (val["Country Name"] != ""){
			var dateDeath = [];
			$.each(val,function(key2,val2){
                if(annee.indexOf(key2) !== -1){
                    dateDeath.push({date:key2,death:val2});
                }
            });
			//Pour les morts on doit vérifier si ils sont dedans sinon il y a des pays en trop et ça bug. lol.
			if(val["Country Name"] in pibPays){
				pibPays[val["Country Name"]].push(dateDeath);
			}


        }		
	});
	
});

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

// On supprime la base pour les tests
var req = indexedDB.deleteDatabase("Database");
// On ouvre la base, la nomme et on lui donne un n° de version.
var request = indexedDB.open("Database", 1);

// Cas d'échec
request.onerror = function(event) {
    console.log("Echéc de la connexion !");
};

// Cas de succès
request.onsuccess = function(event) {
    db = request.result;    // On enregistre le resultat de la requête dans la base
    console.log("Connexion réussi : " + db);
};


// Création ou "rechargement" de la BD lorsque la version de la db est superieur
request.onupgradeneeded = function(event) {
    var db = event.target.result;
    
    // Création des tables et définitions des clés primaires
    var db = event.target.result;
    //var paysTable = db.createObjectStore("Pays", {keyPath: "nomPays"});
    //var anneeTable = db.createObjectStore("Annee", {keyPath: "annee"});
    //var continentTable = db.createObjectStore("Continent", {keyPath: "nomContinent"});
    var pibTable = db.createObjectStore("PIB", {keyPath: ["idPays","annee"]});
	//var test = db.createObjectStore("test", {keyPath: ["pays","annee"]});
    // On ajoute les données dans la BD
	var j = 0;
    for(var nom in Object.keys(pibPays)){
		//Boucle de parcours de date
		for(var i=0;i <11;i++){
			var date = pibPays[Object.keys(pibPays)[nom]][2][i]["date"];
			//On prend PIB, birth et death pour une date donnée
			var pibvar = pibPays[Object.keys(pibPays)[nom]][1][i]["pib"];
			var birth = pibPays[Object.keys(pibPays)[nom]][2][i]["birth"];
			var death = pibPays[Object.keys(pibPays)[nom]][3][i]["death"];
			pibTable.add({idPays : Object.keys(pibPays)[nom],annee : date ,code :pibPays[Object.keys(pibPays)[nom]][0].substring(0,2),pib : pibvar,  nbNaissance : birth, nbDeces : death });
		
		}
	}
	//test.add({pays : "France", annee: "2010", autre : "test"});
	
}




/* ******************** */
/* **** Opérations **** */
/* ******************** */

/**
 * Lit toute la table
 * SELECT * FROM pibTable
 * @return {undefined}   - L'objet recherché
 */
function selectAll() {
    var transaction = db.transaction("PIB");
	var objectStore = transaction.objectStore("PIB");
    objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
	if(cursor) {
            console.log(cursor);
			cursor.continue();
        } else {
            console.log("No more entries");
        }
    };
}

function allYearsCountries(nomPays,btn){
	var transaction = db.transaction("PIB");
	var objectStore = transaction.objectStore("PIB");
	console.log(nomPays);
    for(var i =0; i<annee.length;i++){
		objectStore.get([nomPays,annee[i]]).onsuccess = function(event){
		 $("tbody").append("<tr id='P'><td class='annee'>" + event.target.result["annee"] + "</td><td class='pib'>" + event.target.result["pib"] + "</td><td class='taux'>" + event.target.result["nbNaissance"]+"/"+event.target.result["nbDeces"]+btn);
		};
	}
}


/**
 * Lit une ligne d'une table.
 * SELECT * FROM pibTable WHERE nomPays = :nomPays and annee = :annee
 * @param {string} nomPays - L'identifiant de la ligne recherchée
 * @param {string} annee   - annee recherché
 * @return {undefined}   - L'objet recherché
 */
function select(nomPays,annee) {
    db.transaction("PIB").objectStore("PIB").get([nomPays,annee]).onsuccess = function(event) {
  var obj = event.target.result;
  console.log(obj);
};
}

/**
 * Supprime une ligne d'un objectStore
 * @param {string} nomPays - L'identifiant de la ligne recherchée
 * @return {undefined}   - //
 */
function removePays(nomPays) {
	var os = db.transaction("PIB","readwrite").objectStore("PIB");
	for(var i =0;i<annee.length;i++){
		os.delete([nomPays,annee[i]]).onsuccess = function(event){
			console.log("année supprimée");
		};
	}
	
}

/**
 * Ajoute une ligne d'un objectStore
 * @param {string} nomPays - L'identifiant de la ligne recherchée
 * @param {string} years - Année 
 * @param {string} pibvar - PIB du pays pour l'année
 * @param {string} natalite - Taux de natalité du pays pour l'année
 * @param {string} mortalite - Taux de mortalité du pays pour l'année
 * @return {undefined}   - //
 */
function addPays(nomPays,years,pibvar,natalite,mortalite) {
	var os = db.transaction("PIB","readwrite").objectStore("PIB");
	os.add({idPays : nomPays,annee : years,pib : pibvar, nbNaissance : natalite, nbDeces : mortalite}).onsuccess = function(event){
		console.log("pays ajouté");
	};
}


function allName(){
	var defer = $.Deferred();
	var L = new Set();
	var transaction = db.transaction("PIB");
	var objectStore = transaction.objectStore("PIB");
    objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if(cursor) {
				L.add(cursor.key[0]);
				//console.log(cursor.key);
				cursor.continue();
        }else{defer.resolve([...L]); return;}
		
    };
	return defer.promise();


}
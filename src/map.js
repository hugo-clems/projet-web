/**
 * Projet Web - GeoStats
 * CLEMENT, O'ROURKE & FUZIER © 2017
 */

var map;
var albi = {lat: 43.919367, lng: 2.138310};     // Par défaut la carte ce centre sur Albi :)
var listeName=[];
var world_geometry= null;

/**
 * Initilisation de la map et des fonctions liées à la map
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: albi,
        zoom: 4,
	zoomControl: true,
	maxZoom : 9,
	minZoom : 3,
	mapTypeControl: false,
	scaleControl: false,
	streetViewControl: false,
	rotateControl: false,
	locale : 'en'
    });
    
    // Lors du clic sur la map , place un marker avec sa position
    google.maps.event.addListener(map, 'click', function(event) {
	// lorsque l'on reclic sur un pays selectionné, il devient déselectionné et est retiré de la liste
        onClickCountry(event.latLng);
    }); 
} 

/**
 * Récupère le nom(long) du pays et son nom(court) (ex : FR ou UK)
 * et ajoute son nom(long) à la liste des pays ainsi que surligne le pays sur la carte grâce à son nom court
 * @param location - la localisation du pays sélectionné
 */
function onClickCountry (location) {
    var lat = location.lat();
    var lng = location.lng();
    var adresseAPI = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false';
    
    var countryName;
    var countryCode;
    
    $.getJSON(adresseAPI).done(function(location) {
        var i = 2;
        if ((location.results).length != 0) {
            var country = location.results[location.results.length-1].address_components[0];
            countryName = country.long_name;
            countryCode = country.short_name;
            addCountryOnMap(countryName,countryCode);
        }
    });
}

/**
 * Affiche les polygones des pays placés en paramètre (liste de la forme 'UK','FR','DE' etc )
 * Doc sur l'objet fusiontablelayer :
 *  https://www.touraineverte.fr/google-maps-api-version-3/reference/FusionTablesStyle.html#propriete-polygonOptions
 *  https://developers.google.com/maps/documentation/javascript/fusiontableslayer?hl=fr
 *  https://www.touraineverte.fr/google-maps-api-version-3/reference/FusionTablesLayerOptions.html#FusionTablesLayerOptions
 * Tuto
 *  http://stackoverflow.com/questions/8670859/highlight-whole-countries-in-google-maps
 * KML utilisé
 *  https://fusiontables.google.com/data?docid=1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk&pli=1#rows:id=1
 * @param {String} countryName - nom du pays sélectionné
 * @param {String} countryCode - code du pays sélectionné
 */
function addCountryOnMap(countryName,countryCode){
    // On affiche le reste de la page (liste pays selects / charts)
    $("#listeDesPaysSelect").show();
    afficherCharts(true);
    
    // Si le pays est déjà dans la liste
    if(selected(countryName)){
        // On le supprime de la liste des pays, et de la sélection de carte
        deleteFrom(listeName,countryCode);
        
        // On met à jour les charts
        getDataFromList(listeName);
        
        // Suppression dans la liste html
        $('li').each(function () {
            if($(this).text() == countryName){
                $(this).closest('li').remove();
            }
        });
    } else {
        // Ajout du pays à la liste
        listeName.push(countryCode);
                
        // On affiche les charts
        afficherCharts(true);
        getDataFromList(listeName);
        
        // Ajout du pays sur la liste visuel (pour l'utilisateur)
        $('#myliste').append('<li class="list-group-item">'+countryName+'</li>');
    }
    
    if(listeName != '') {
        // Format de la string pour le fusion tables layer
        var strList = JSON.stringify(listeName);
        var param = strList.substr(1, strList.length-2).replace(/\"/g,'\'');
        
        if (world_geometry != null) world_geometry.setMap(null);
        
        // Objet à superposer à la carte
        world_geometry = new google.maps.FusionTablesLayer({
            query: {
                select: 'geometry',
                from: '1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk',
                where: "ISO_2DIGIT IN ("+param+")"
                //where: "Name IN ("+param+")"
            },
            clickable : false,
            styles : [{polygonOptions : {fillColor : "#FFFFFF",
                        strokeWeight : 1}}],
            suppressInfoWindows: true,
        });
        world_geometry.setMap(map);
    } else { // si il y a aucun pays
        // On cache le reste de la page (liste pays selects / charts)
        $("#listeDesPaysSelect").hide();
        afficherCharts(false);
        console.log("1");
        
        world_geometry.setMap(null);
    }
}

/**
 * Vérifier si un pays est selectionné ou pas, c'est à dire si il est dans la liste des pays
 * @param {String} nompays
 * @return {Boolean}
 */
function selected(nompays){
    var ok = false;
    $('li').each( function(){
        var pays = $(this).text();
        if (pays == nompays) {
            ok = true;
        } 
    });
    return ok;	
}
	
/**
 * Permet de supprimer un element de la liste via son nom
 * @param {[String]} liste - liste des pays sélectionnés
 * @param {String} name - le pays à supprimé
 */
function deleteFrom(liste,name) {
    for(var i = 0;i< liste.length; i++){
        if (liste[i] == name){
            liste.splice(i,1);
        }
    }
}

/**
 * Déselectionne tous les pays
 */
function deleteAll() {
    for (var i = 0; i < listeName.length; i++) {
        console.log(i);
        listeName.splice(i, 1);
    }
    getDataFromList(listeName);
    // suppression dans la liste html
    $('li').each(function (){
        $(this).closest('li').remove();
    });
    world_geometry.setMap(null);
    
    // On cache le reste de la page (liste pays selects / charts)
    $("#listeDesPaysSelect").hide();
    afficherCharts(false);
}
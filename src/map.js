/**
 * Projet Web - GeoStats
 * CLEMENT, O'ROURKE & FUZIER © 2017
 */

var map;
var albi = {lat: 43.919367, lng: 2.138310};
var listeName=[];
var world_geometry= null;

// Initilisation de la map et des fonctions liées à la map
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


// Récupère le nom(long) du pays et son nom(court) (ex : FR ou UK)
// et ajoute son nom(long) à la liste des pays ainsi que surligne le pays sur la carte grâce à son nom court
function onClickCountry (location) {
	var lat = location.lat();
	var lng = location.lng();
	var countryName;
	var countryCode;
 	jQuery_3_1_1.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false')
			.done (function(location)
			{
			var i = 2;
		console.log(location.results);
      if ((location.results).length != 0) {
        var country = location.results[location.results.length-1].address_components[0];
        countryName = country.long_name;
		countryCode = country.short_name;
		addCountryOnMap(countryName,countryCode);
	  }
	});
}
//-- Affiche les polygones des pays placés en paramètre (liste de la forme 'UK','FR','DE' etc ) 
// TODO résoudre problème : Ne passe pas plusieurs fois dans le world geometry , peut etre un pb de call back encore -->
// doc sur l'objet fusiontablelayer : https://www.touraineverte.fr/google-maps-api-version-3/reference/FusionTablesStyle.html#propriete-polygonOptions -->
// https://developers.google.com/maps/documentation/javascript/fusiontableslayer?hl=fr -->
// https://www.touraineverte.fr/google-maps-api-version-3/reference/FusionTablesLayerOptions.html#FusionTablesLayerOptions -->
// tuto que j'ai utilisé : http://stackoverflow.com/questions/8670859/highlight-whole-countries-in-google-maps -->
// .kml utilisé : https://fusiontables.google.com/data?docid=1N2LBk4JHwWpOY4d9fobIn27lfnZ5MDy-NoqqRpk&pli=1#rows:id=1
function addCountryOnMap(countryName,countryCode){
	// si le pays est déjà dans la liste
	  if(selected(countryName)){
		// on le supprime de la liste des pays, et du world_geometry
		deleteFrom(listeName,countryCode);
		// suppression dans la liste html
		jQuery_3_1_1('li').each(function (){
			if(jQuery_3_1_1(this).text() == countryName){
				jQuery_3_1_1(this).closest('li').remove();
			}
		});
	  } else {
		// ajout du pays à la liste
		listeName.push(countryCode);
		jQuery_3_1_1('#myliste').append('<li>'+countryName+'</li>');
	  }
	  if(listeName != ''){
	  
		// format de la string pour le fusion tables layer
		 var strList = JSON.stringify(listeName);
		 var param = strList.substr(1, strList.length-2).replace(/\"/g,'\'');
		 if (world_geometry != null) world_geometry.setMap(null);
		console.log(param);
		 // objet à superposer à la carte
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
		world_geometry.setMap(null);
	  }
}

// Ajoute un pays à la liste des pays
function addCountryList(country) {
		var ma_liste = document.getElementById("myliste");
		var li = document.createElement("li");
		var pays = document.createTextNode(country); 
		li.appendChild(pays);  
		ma_liste.appendChild(li);
}	



// Verifier si un pays est selectionné ou pas, c'est à dire si il est dans la liste des pays
function selected(nompays){
	var ok= false;
	var ma_liste = document.getElementById("myliste");
	jQuery_3_1_1('li').each( function(){
		var pays = jQuery_3_1_1(this).text();
		if(pays == nompays){
			ok = true;
		} 
	});
	return ok;	
}

	
// Permet de supprimer un element de la liste via son nom
function deleteFrom(liste,name) {
	for(var i = 0;i< liste.length; i++){
		if (liste[i] == name){
			liste.splice(i,1);
		}
	}
}


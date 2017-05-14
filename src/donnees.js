/**
 * Projet Web - GeoStats
 * CLEMENT, FUZIER & O'ROURKE © 2017
 */

var PAYS_SELECTED = "NON DEFINI";   // Pays actuel

/**
 * Une fois qu'on à sélectionné un pays
 * On charge ses données (PIB & Taux / année)
 * @param {type} nomPays - le nom du pays sélectionné
 */
function chargerPays(nomPays) {
    // On supprime les lignes éventuellement déjà présentes dans la table (sauf la première)
    var rowCount = $('#corpsTab tr').length;
    for (i = 0; i < rowCount-1; i++) {
        $("tr").remove("#P"+annee[i]);
    }
    
    // On affiche chaque année (avec ses données)
    allYearsCountries(nomPays);
    
    PAYS_SELECTED = nomPays;
}

/**
 * Si tous les champs sont renseignés on ajoute une année à ce pays
 */
function addAnnee() {
    var creerAnnee  = $("#creerAnnee").val();
    var creerPib  = $("#creerPIB").val();
    var creerTauxNat = $("#creerTauxNat").val();
    var creerTauxDeath = $("#creerTauxDeath").val();
    
    if (creerAnnee == "" || creerPib == "" || creerTauxNat == ""|| creerTauxDeath == "") {
        $("#modalErrAjout").modal('show');
    } else {
        $("#addPays").html(PAYS_SELECTED);
        $("#modalAjout").modal('show');
        
        addPays(PAYS_SELECTED, creerAnnee, creerPib, creerTauxNat, creerTauxDeath);
        annee.push(creerAnnee);
        annee = annee.sort();
        
        chargerPays(PAYS_SELECTED);
    }
}

/**
 * Affiche le modal pour modifier une année
 * @param {int} id - identifiant de la ligne concernée
 */
function showSuppr(id) {
    $("#supprAnnee").html(id);
    $("#supprPays").html(PAYS_SELECTED);
    $("#modalSuppr").modal('show');
}

/**
 * Supprime une année - Accès BD
 */
function supprimerAnnee() {
    var anneeDeleted = $("#supprAnnee").html();
    
    removeAnnee(PAYS_SELECTED, anneeDeleted);
    annee.sort();
    
    chargerPays(PAYS_SELECTED);
}

/**
 * Affiche le modal pour modifier une année
 * @param {int} id - identifiant de la ligne concernée
 */
function showEdit(id) {
    var anneeToEdit = $("#P"+id).children(".annee").html();
    var pibToEdit = $("#P"+id).children(".pib").html();
    var tauxToEdit = $("#P"+id).children(".taux").html();
    
    $("#editAnnee").val(anneeToEdit);
    $("#editPIB").val(pibToEdit);
    $("#editTaux").val(tauxToEdit);
    
    $("#modalModif").modal('show');
}

/**
 * Modifie une année - Accès BD
 */
function modifierAnnee() {
    var paysEdited = PAYS_SELECTED;
    var anneeEdited = $("#editAnnee").val();
    var pibEdited = $("#editPIB").val();
    var tauxEdited = $("#editTaux").val();
    
    // TODO : Fonction BD pour maj l'année
    // TODO : Rafraîchir ?
}
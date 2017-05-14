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
    var rowCount = jQuery_3_1_1('#corpsTab tr').length;
    for (i = 0; i < rowCount-1; i++) {
        jQuery_3_1_1("tr").remove("#P");
    }
    
    // On affiche chaque année (avec ses données)
    var btn = "<td class='text-right'><button type='button' class='btn btn-danger' onclick='showSuppr(" + i + ");'>Supprimer</button> <button type='button' class='btn btn-info' onclick='showEdit(" + i + ");'>Modifier</button></td>";
    allYearsCountries(nomPays, btn);
    
    PAYS_SELECTED = nomPays;
}

/**
 * Si tous les champs sont renseignés on ajoute une année à ce pays
 */
function addAnnee() {
    var creerAnnee  = jQuery_3_1_1("#creerAnnee").val();
    var creerPib  = jQuery_3_1_1("#creerPIB").val();
    var creerTaux = jQuery_3_1_1("#creerTaux").val();
    
    if (creerAnnee == "" || creerPib == "" || creerTaux == "") {
        jQuery_3_1_1("#modalErrAjout").modal('show');
    } else {
        // TODO : Appel fonction BD pour ajouter (avec vérif !!)
        jQuery_3_1_1("#addPays").html(PAYS_SELECTED);
        jQuery_3_1_1("#modalAjout").modal('show');
    }
}

/**
 * Affiche le modal pour modifier une année
 * @param {int} id - identifiant de la ligne concernée
 */
function showSuppr(id) {
    var anneeToSuppr = jQuery_3_1_1("#P"+id).children(".annee").html();
    jQuery_3_1_1("#supprAnnee").html(anneeToSuppr);
    jQuery_3_1_1("#supprPays").html(PAYS_SELECTED);
    jQuery_3_1_1("#modalSuppr").modal('show');
}

/**
 * Supprime une année - Accès BD
 */
function supprimerAnnee() {
    var paysEdited = PAYS_SELECTED;
    var anneeEdited = jQuery_3_1_1("#supprAnnee").html();
    
    // TODO : Fonction BD pour suppr l'année
    // TODO : Rafraîchir ?
}

/**
 * Affiche le modal pour modifier une année
 * @param {int} id - identifiant de la ligne concernée
 */
function showEdit(id) {
    var anneeToEdit = jQuery_3_1_1("#P"+id).children(".annee").html();
    var pibToEdit = jQuery_3_1_1("#P"+id).children(".pib").html();
    var tauxToEdit = jQuery_3_1_1("#P"+id).children(".taux").html();
    
    jQuery_3_1_1("#editAnnee").val(anneeToEdit);
    jQuery_3_1_1("#editPIB").val(pibToEdit);
    jQuery_3_1_1("#editTaux").val(tauxToEdit);
    
    jQuery_3_1_1("#modalModif").modal('show');
}

/**
 * Modifie une année - Accès BD
 */
function modifierAnnee() {
    var paysEdited = PAYS_SELECTED;
    var anneeEdited = jQuery_3_1_1("#editAnnee").val();
    var pibEdited = jQuery_3_1_1("#editPIB").val();
    var tauxEdited = jQuery_3_1_1("#editTaux").val();
    
    // TODO : Fonction BD pour maj l'année
    // TODO : Rafraîchir ?
}
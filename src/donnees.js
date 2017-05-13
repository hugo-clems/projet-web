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
        $("tr").remove("#P"+i);
    }
    
    // TODO : Appel fonction BD (selectAll) - pour remplir data
    var data = [["2012","24","15"], ["2011","687","39"], ["2010","78","67"]];
    
    for (i = 0; i < data.length; i++) {
        var annee = data[i][0];
        var pib  = data[i][1];
        var taux = data[i][2];
        var btn = "<td class='text-right'><button type='button' class='btn btn-danger' onclick='showSuppr(" + i + ");'>Supprimer</button> <button type='button' class='btn btn-info' onclick='showEdit(" + i + ");'>Modifier</button></td>";
        
        // On ajoute la ligne
        $("tbody").append("<tr id='P"+ i +"'><td class='annee'>" + annee + "</td><td class='pib'>" + pib + "</td><td class='taux'>" + taux + "</td>" + btn + "</tr>");
    }
    
    PAYS_SELECTED = nomPays;
}

/**
 * Si tous les champs sont renseignés on ajoute une année à ce pays
 */
function addAnnee() {
    var creerAnnee  = $("#creerAnnee").val();
    var creerPib  = $("#creerPIB").val();
    var creerTaux = $("#creerTaux").val();
    
    if (creerAnnee == "" || creerPib == "" || creerTaux == "") {
        $("#modalErrAjout").modal('show');
    } else {
        // TODO : Appel fonction BD pour ajouter (avec vérif !!)
        $("#addPays").html(PAYS_SELECTED);
        $("#modalAjout").modal('show');
    }
}

/**
 * Affiche le modal pour modifier une année
 * @param {int} id - identifiant de la ligne concernée
 */
function showSuppr(id) {
    var anneeToSuppr = $("#P"+id).children(".annee").html();
    $("#supprAnnee").html(anneeToSuppr);
    $("#supprPays").html(PAYS_SELECTED);
    $("#modalSuppr").modal('show');
}

/**
 * Supprime une année - Accès BD
 */
function supprimerAnnee() {
    var paysEdited = PAYS_SELECTED;
    var anneeEdited = $("#supprAnnee").html();
    
    // TODO : Fonction BD pour suppr l'année
    // TODO : Rafraîchir ?
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
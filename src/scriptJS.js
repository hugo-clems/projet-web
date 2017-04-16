/**
 * Créer un chart
 * @param {String} target       - le <div> où sera affiché le chart
 * @param {String} chartTitle   - le titre du chart
 * @param {boolean} isAnimate   - active ou non l'animation au lancement du chart
 * @param {[['a;'b]]} data      - les données pour construire le chart
 */
function createChart(target, chartTitle, isAnimate, chartData) {
    var chart = new CanvasJS.Chart(target, {
        theme: "theme2",
        title:{
            text: chartTitle
        },
        animationEnabled: isAnimate,
        data: chartData,
        legend: {
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                chart.render();
            }
        }
    });
    chart.render();
}


/**
 * Créer une ligne de données
 * @param {String} title        - légende de la ligne de donnée
 * @param {boolean} show        - affiche ou non la légende
 * @param {String} chartType    - le type du chart : bar, column, area, spline, pie, ...
 * @param {['a;'b]} chartData   - les données
 * @return {String, ['a;'b]}    - une ligne de données
 */
function createData(title, show, chartType, chartData) {
    return {legendText: title, showInLegend: show, type: chartType, dataPoints: chartData};
}


/**
 * Fonction principale
 * Lance la création du chart et l'active
 */
function afficherChart() {
    var p1 = [{ label: "2000",  y: 10  },
        { label: "2010", y: 15  },
        { label: "2011", y: 25  },
        { label: "2012",  y: 30  },
        { label: "2013",  y: 28  }];
    var p2 = [{ label: "2000",  y: 20  },
        { label: "2010", y: 25  },
        { label: "2011", y: 35  },
        { label: "2012",  y: 40  },
        { label: "2013",  y: 38  }];
    var p3 = [{ label: "2000",  y: 10  },
        { label: "2010", y: 20  },
        { label: "2011", y: 30  },
        { label: "2012",  y: 40  },
        { label: "2013",  y: 50  }];
    
    var data1 = [createData("PIB", true, "area", p3), createData("France", true, "spline", p1)
        , createData("Allemagne", true, "spline", p2)];
    
    createChart("chart1", "Le taux de natalité influe-t-il sur le PIB ?", true, data1);
}
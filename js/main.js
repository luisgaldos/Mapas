function cargarSelectEscalas() {

    let option;
    for(let i = 0; i < ESCALAS_RECOMENDADAS.length; i++) {
        option = document.createElement('option');
        option.value = ESCALAS_RECOMENDADAS[i];
        option.innerHTML = ESCALAS_RECOMENDADAS[i];
        SELECT_ESCALAS.appendChild(option);
    }
    
}

function zoom( delta ) {
    
    if (delta > 0) {
        
        if (escalaActual < ESCALAS_RECOMENDADAS.length-1) {
            console.log('aumentar escala');
            escalaActual++;
            setEscala(escalaActual);
        }      
    } else {
        if (escalaActual > 0) {
            console.log('disminuir escala');
            escalaActual--;    
            setEscala(escalaActual);  
        }
    }
}


function setEscala(indice) {

    app.activeView.scale = ESCALAS_RECOMENDADAS[indice];
    SELECT_ESCALAS.selectedIndex = indice;
    escalaActual = indice;
}
    

function cargarSelectCapasBase() {

    let option, value;
    SELECT_ORTOFOTOS.style.fontSize = "1.4em";

    for (let i = 0; i < serviciosOrtofotos.length; i++) {

        option = document.createElement('option');
        value =  getNumbersInString(serviciosOrtofotos[i]);
        option.innerHTML = value;
        option.value = i; // El valor será la posición en el array
        SELECT_ORTOFOTOS.appendChild(option);

    }

    SELECT_ORTOFOTOS.selectedIndex = serviciosOrtofotos.length-1;
}

// Cargamos los títulos de las ortofotos de la URL, lo cual es más óptimo que cargar todos los mapas.
function getNumbersInString(string) {
    var tmp = string.split("");
    var map = tmp.map(function (current) {
        if (!isNaN(parseInt(current))) {
            return current;
        }
    });

    var numbers = map.filter(function (value) {
        return value != undefined;
    });

    return numbers.join("");
}



// Set view padding for widgets based on navbar position
function setViewPadding(layout) {
    let padding, uiPadding;
    // Top
    if (layout === "calcite-nav-top") {
        padding = {
            padding: {
                top: 50,
                bottom: 0
            }
        };
        uiPadding = {
            padding: {
                top: 15,
                right: 15,
                bottom: 30,
                left: 15
            }
        };
    } else { // Bottom
        padding = {
            padding: {
                top: 0,
                bottom: 50
            }
        };
        uiPadding = {
            padding: {
                top: 30,
                right: 15,
                bottom: 15,
                left: 15
            }
        };
    }
    app.mapView.set(padding);
    app.mapView.ui.set(uiPadding);
    app.sceneView.set(padding);
    app.sceneView.ui.set(uiPadding);
    // Reset popup
    if (app.activeView.popup.visible && app.activeView.popup.dockEnabled) {
        app.activeView.popup.visible = false;
        app.activeView.popup.visible = true;
    }
}

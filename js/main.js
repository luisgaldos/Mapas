// Extra funcionalities added for this template.

function appInitialize() {

    app = {
        center: [INITIAL_LONGITUDE, INITIAL_LATITUDE],
        scale: INITIAL_SCALE,
        basemap: "streets",
        viewPadding: {
            top: 50,
            bottom: 0
        },
        uiComponents: ["zoom", "compass", "attribution"],
        mapView: null,
        sceneView: null,
        containerMap: MAP_CONTAINER,
        containerScene: SCENE_CONTAINER,
        activeView: null,
        searchWidget: null
    };
}

function loadLayers(KMLLayer) {

    createLayer(KMLLayer, "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedRoja.kmz");
    createLayer(KMLLayer, "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedVerde.kmz");
    createLayer(KMLLayer, "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedNaranja.kmz");
    createLayer(KMLLayer, "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/Municipios.kmz");

    loadLayersPanel();

}

function loadLayersPanel() {
    ul = "";
    ul = "<ul class='list-group'>";
    
    arrayLayers.forEach(el => {
        ul += "<li>"+el.title+"<input type='checkbox' onchange='showHideLayer(this,el)'></li>";
    })
    ul += "</ul>"
    document.getElementById(LAYER_PANEL).innerHTML = ul;
}

function createLayer(KMLLayer, url) {

    var layer = new KMLLayer({
        // major earthquakes for latest 30 days from USGS
        url: url
    });
    
    // console.log("%o", layer);
    arrayLayers.push(layer);

}

function createMap(Map) {
    // Map
    map = new Map({
        basemap: app.basemap,
        layers: arrayLayers
    });
}

function createViews(MapView, SceneView) {

    // 2D view
    app.mapView = new MapView({
        container: app.containerMap,
        map: map,
        center: app.center,
        scale: app.scale,
        padding: app.viewPadding,
        ui: {
            components: app.uiComponents
        }
    });

    // Popup and panel sync
    app.mapView.when(function () {
        CalciteMapsArcGIS.setPopupPanelSync(app.mapView);
    });

    // 3D view
    app.sceneView = new SceneView({
        container: app.containerScene,
        map: map,
        center: app.center,
        scale: app.scale,
        padding: app.viewPadding,
        ui: {
            components: app.uiComponents
        }
    });

    // Popup and panel sync
    app.mapView.when(function () {
        CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);
    });

}

function createUIComponent(Type, position) {

    // Track UI component
    var widget = new Type({
        view: app.activeView
    });

    // Add widget to the top left corner of the view
    app.activeView.ui.add(widget, position);
}

function showHideLayer(cb, el) {

    console.log(cb.checked);
    console.log("%o", cb);
    if (cb.checked) {
        //el.visible = false;
    }
}


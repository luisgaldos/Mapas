
require([
  "esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/views/SceneView",

  // Widgets
  "esri/widgets/Search",
  "esri/widgets/ScaleBar",
  "esri/widgets/Locate",
  "esri/widgets/Sketch",        // For Draw
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/AreaMeasurement2D",
  "esri/widgets/DirectLineMeasurement3D",
  "esri/widgets/AreaMeasurement3D",

  //Layers
  "esri/layers/KMLLayer",
  "esri/layers/WMSLayer",
  "esri/layers/GraphicsLayer",  // For Draw
  "esri/layers/FeatureLayer",
  "esri/layers/MapImageLayer",
  "esri/layers/TileLayer",
  "esri/layers/TileLayer",

  "esri/core/watchUtils",
  // Calcite Maps
  "calcite-maps/calcitemaps-v0.8",

  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.8",

  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  "bootstrap/Tab",
  // Can use @dojo shim for Array.from for IE11
  "@dojo/framework/shim/array"
], function (
  Map,
  Basemap,
  MapView,
  SceneView,
  Search,
  ScaleBar,
  Locate,
  Sketch,
  DistanceMeasurement2D,
  AreaMeasurement2D,
  DirectLineMeasurement3D,
  AreaMeasurement3D,
  KMLLayer,
  WMSLayer,
  GraphicsLayer,
  FeatureLayer,
  MapImageLayer,
  TileLayer,
  watchUtils,
  CalciteMaps,
  CalciteMapsArcGIS,
  Collapse,
  Dropdown,
  Tab) {

    /******************************************************************
     *
     * App settings
     *
     ******************************************************************/

    inicializarApp();


    /******************************************************************
     *
     * Create the map and scene view and ui components
     *
     ******************************************************************/

    // Crear capa para poder dibujar sobre el mapa
    graphicsLayer = new GraphicsLayer();

    // Crear el map y añadir el mapa base
    map = new Map({
      basemap: basemap
    });

    cargarOrtofotosEnPanel();
    function cargarOrtoFoto(indice) {
      // Crear un mapa base con la ortofoto seleccionada
      URLortoActual = serviciosOrtofotos[indice];
      basemap = new Basemap({
        baseLayers: [
          new TileLayer(URLortoActual)
        ]
      });
  
      map.basemap = basemap;
  
    }
    
    cargarOrtoFoto(serviciosOrtofotos.length-1);

    // Cargar las capas KML
    let layer;
    for (let i = 0; i < serviciosKML.length; i++) {
      layer = new KMLLayer({
        url: serviciosKML[i]  // url to the service
      });
      kmlLayers.push(layer);
    }

    // Cargar en el menú los KML leídos
    loadKMLLayersPanel();

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

    app.mapView.when(function () {
      CalciteMapsArcGIS.setPopupPanelSync(app.mapView);
      sketchWidget = new Sketch({
        layer: graphicsLayer,
        view: app.mapView,
        container: DRAW_PANEL
      });
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

    app.mapView.when(function () {
      CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);
    });

    // 2D Distance Measure Panel
    distance2DmeasureWidget = new DistanceMeasurement2D({
      view: app.mapView,
      container: DISTANCE_2D_MEASURE_PANEL
    });

    document.querySelector("#distanceMeasure2DPanelDiv > div > div > button").innerHTML = "Medir Distancia";

    // 3D Distance Measure Panel
    distance3DmeasureWidget = new DirectLineMeasurement3D({
      view: app.sceneView,
      container: DISTANCE_3D_MEASURE_PANEL
    });

    document.querySelector("#distanceMeasure3DPanelDiv > div > div > button").innerHTML = "Medir Distancia";

    // 2D Area Measure Panel
    area2DmeasureWidget = new AreaMeasurement2D({
      view: app.mapView,
      container: AREA_2D_MEASURE_PANEL
    });

    document.querySelector("#areaMeasure2DPanelDiv > div > div > button").innerHTML = "Medir área";

    // 3D Area Measure Panel
    area2DmeasureWidget = new AreaMeasurement3D({
      view: app.sceneView,
      container: AREA_3D_MEASURE_PANEL
    });

    document.querySelector("#areaMeasure3DPanelDiv > div > div > button").innerHTML = "Medir área";

    // Set the active view to scene
    setActiveView(app.mapView);

    // Create the scale bar and add it to the bottom left corner of the view
    scaleBar = new ScaleBar({
      view: app.mapView
    });
    app.mapView.ui.add(scaleBar, {
      position: "bottom-left"
    });

    // Create the location widget and add it to the top left corner of the view
    locateWidget = new Locate({
      view: app.activeView  // Attaches the Locate button to the view
    });
    app.activeView.ui.add(locateWidget, "top-left");

    // Create the search widget and add it to the navbar instead of view
    app.searchWidget = new Search({
      view: app.activeView
    }, SEARCHER_CONTAINER);

    app.mapView.when(function () {
      CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);
    });
    app.sceneView.when(function () {
      CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);
    });



    /******************************************************************
     *
     * Synchronize the view, search and popup
     *
     ******************************************************************/

    function syncViews(fromView, toView) {
      const viewPt = fromView.viewpoint.clone();
      fromView.container = null;
      if (fromView.type === "3d") {
        toView.container = app.containerMap;
      } else {
        toView.container = app.containerScene;
      }
      toView.padding = app.viewPadding;
      toView.viewpoint = viewPt;
    }

    // Search Widget
    function syncSearch(view) {
      watchUtils.whenTrueOnce(view, "ready", function () {
        app.searchWidget.view = view;
        if (app.searchWidget.selectedResult) {
          app.searchWidget.search(app.searchWidget.selectedResult.name)
        }
      });
    }

    // Tab - toggle between map and scene view
    const tabs = Array.from(document.querySelectorAll(
      ".calcite-navbar li a[data-toggle='tab']"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function (event) {
        if (event.target.text.indexOf("Map") > -1) {
          syncViews(app.sceneView, app.mapView);
          setActiveView(app.mapView);
        } else {
          syncViews(app.mapView, app.sceneView);
          setActiveView(app.sceneView);
        }
        syncSearch(app.activeView);
      });
    });

  });


function inicializarApp() {
  app = {
    center: [INITIAL_LONGITUDE, INITIAL_LATITUDE],  // Longitud, latitud
    scale: INITIAL_SCALE,
    basemap: null,
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

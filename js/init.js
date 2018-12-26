
inicializarApp();

require(["esri/Map"], function (Map) {

  crearMapa(Map);

});

require(["esri/geometry/Extent", "esri/geometry/SpatialReference"], function (Extent, SpatialReference) {

  crearExtensionMapa(Extent, SpatialReference);

});

require(["esri/layers/GraphicsLayer"], function (GraphicsLayer) {

  // Crear capa para poder dibujar sobre el mapa
  graphicsLayer = new GraphicsLayer();

});


require(["esri/Basemap", "esri/layers/TileLayer"], function (Basemap, TileLayer) {


  cargarSelectCapasBase();  // Cargar ortofotos
  cargarCapaBase(serviciosOrtofotos.length - 1, Basemap, TileLayer);

  SELECT_ORTOFOTOS.addEventListener('change', function () {

    cargarCapaBase(this.selectedIndex, Basemap, TileLayer);

  });

});

require(["esri/layers/KMLLayer"], function (KMLLayer) {

  addCapaKML(KMLLayer, serviciosKML[5]);
});

require(["esri/layers/WMSLayer"], function (WMSLayer, WMSLayerInfo) {

  addCapaWMS(WMSLayer, serviciosWMS[0]);

});

require([
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/geometry/support/webMercatorUtils",
  // Bootstrap
  "bootstrap/Collapse",
  "bootstrap/Dropdown",
  // Calcite Maps
  "calcite-maps/calcitemaps-v0.9",
  // Calcite Maps ArcGIS Support
  "calcite-maps/calcitemaps-arcgis-support-v0.9"], function (MapView, SceneView, webMercatorUtils, CalciteMaps, CalciteMapArcGISSupport) {

    crearVista2D(MapView);
    crearVista3D(SceneView);

    activarVista(app.mapView);

    app.mapView.when(function () {
      CalciteMapsArcGIS.setPopupPanelSync(app.mapView);
      CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);
    });

    app.sceneView.when(function () {
      CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);
      CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);
    });

    app.mapView.on("mouse-wheel", function (event) {
      event.stopPropagation();
    });

    DIV_MAPA.addEventListener('wheel', function () {

      var evt = window.event || e //equalize event object
      var delta = evt.detail ? evt.detail * (-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
      zoom(delta);
    });

    DIV_MAPA.addEventListener('click', function () {
      console.log('Click');
      //e.preventDefault();
    });

    DIV_MAPA.addEventListener('dblclick', function () {
      zoom(120);
    });

    DIV_MAPA.addEventListener('mousemove', function () {
      mostrarCoordenadas(event, webMercatorUtils);
    });

  });

// Cargar los widgets
require([
  "esri/widgets/Search",
  "esri/widgets/ScaleBar",
  "esri/widgets/Locate",
  "esri/widgets/Sketch",
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/AreaMeasurement2D",
  "esri/widgets/DirectLineMeasurement3D",
  "esri/widgets/AreaMeasurement3D"], function (Search, ScaleBar, Locate, Sketch, DistanceMeasurement2D, AreaMeasurement2D, DirectLineMeasurement3D, AreaMeasurement3D) {

    crearPanelMedidas2D(DistanceMeasurement2D, AreaMeasurement2D);
    crearPanelMedidas3D(DirectLineMeasurement3D, AreaMeasurement3D);
    crearWidgetEscala(ScaleBar);
    crearWidgetBusqueda(Search);
    crearWidgetDibujo(Sketch);
    crearWidgetUbicacion(Locate);

    cargarSelectEscalas();

    SELECT_ESCALAS.addEventListener('change', function () {

      setEscala(this.selectedIndex);

    });
  });


function mostrarCoordenadas(evt, webMercatorUtils) {
  var point = app.mapView.toMap({x: evt.x, y: evt.y});
  //the map is in web mercator but display coordinates in geographic (lat, long)
  var mp = webMercatorUtils.webMercatorToGeographic(point);
  //display mouse coordinates

  DIV_POS_X.innerHTML = mp.x.toFixed(3);
  DIV_POS_Y.innerHTML = mp.y.toFixed(3);

}


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
    minScale: ESCALAS_RECOMENDADAS[ESCALAS_RECOMENDADAS.length - 1],
    maxScale: ESCALAS_RECOMENDADAS[0],
    containerMap: DIV_MAPA,
    containerScene: SCENE_CONTAINER,
    activeView: null,
    searchWidget: null
  };
}

function crearMapa(Map) {
  map = new Map({
    basemap: basemap,
    extent: extent
  });
}

function crearExtensionMapa(Extent, SpatialReference) {
  extent = new Extent({
    xmin: 463007.343155309,
    ymin: 4749769.80390383,
    xmax: 548340.971062945,
    ymax: 4821769.4696159,
    spatialReference: new SpatialReference({
      wkid: 25830
    })
  });
}

// ----- Funciones que crean vistas -----//
// --------------------------------------//
function crearVista2D(MapView) {
  // 2D view
  app.mapView = new MapView({
    container: app.containerMap,
    map: map,
    center: app.center,
    scale: app.scale,
    padding: app.viewPadding,
    ui: {
      components: app.uiComponents
    },
    minScale: app.minScale,
    maxScale: app.maxScale
  });
}

function crearVista3D(SceneView) {
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
}

function activarVista(view) {

  if (view == app.mapView) {  // Vista 2D

    map.layers.add(graphicsLayer);
    map.layers.addMany(kmlLayers);

    MEASURE_3D_PANEL.style.display = "none";   // Hide 3D measure panel
    MEASURE_2D_PANEL.style.display = "block";  // Show 2D measure panel

  } else {    // Vista 3D

    map.layers.removeAll()

    MEASURE_2D_PANEL.style.display = "none";   // Hide 2D measure panel
    MEASURE_3D_PANEL.style.display = "block";   // Show 3D measure panel
  }

  app.activeView = view;
}



// ----- Funciones que crean widgets -----//
// --------------------------------------//
// Herramientas de dibujp
function crearWidgetDibujo(Sketch) {

  sketchWidget = new Sketch({
    layer: graphicsLayer,
    view: app.mapView,
    container: DRAW_PANEL
  });

}

// Medidas 2D
function crearPanelMedidas2D(DistanceMeasurement2D, AreaMeasurement2D) {

  distance2DmeasureWidget = new DistanceMeasurement2D({ // Widget medición de distancias 2D
    view: app.mapView,
    container: DISTANCE_2D_MEASURE_PANEL
  });
  document.querySelector("#distanceMeasure2DPanelDiv > div > div > button").innerHTML = "Medir Distancia";  // Cambiar texto botón widget

  area2DmeasureWidget = new AreaMeasurement2D({ // Widget medición de distancias 2D
    view: app.mapView,
    container: AREA_2D_MEASURE_PANEL
  });

  document.querySelector("#areaMeasure2DPanelDiv > div > div > button").innerHTML = "Medir área"; // Cambiar texto botón widget
}

// Medidas 3D
function crearPanelMedidas3D(DirectLineMeasurement3D, AreaMeasurement3D) {
  distance3DmeasureWidget = new DirectLineMeasurement3D({ // Widget medición de distancias 3D
    view: app.sceneView,
    container: DISTANCE_3D_MEASURE_PANEL
  });

  document.querySelector("#distanceMeasure3DPanelDiv > div > div > button").innerHTML = "Medir Distancia";  // Cambiar texto botón widget

  area2DmeasureWidget = new AreaMeasurement3D({ // Widget medición de distancias 3D
    view: app.sceneView,
    container: AREA_3D_MEASURE_PANEL
  });

  document.querySelector("#areaMeasure3DPanelDiv > div > div > button").innerHTML = "Medir área"; // Cambiar texto botón widget
}

// Escala
function crearWidgetEscala(ScaleBar) {
  scaleBar = new ScaleBar({
    view: app.mapView,
    container: CONTENDOR_ESCALA.id
  });
}

// Busqueda
function crearWidgetBusqueda(Search) {
  app.searchWidget = new Search({
    view: app.activeView
  }, DIV_BUSCADOR);
}

function crearWidgetUbicacion(Locate) {
  locateWidget = new Locate({
    view: app.activeView
  });
  app.activeView.ui.add(locateWidget, "top-left");
}

// Capa base (ortofoto)
function cargarCapaBase(indice, Basemap, TileLayer) {

  // Crear un mapa base con la ortofoto seleccionada
  URLortoActual = serviciosOrtofotos[indice];
  basemap = new Basemap({
    baseLayers: [
      new TileLayer(URLortoActual)
    ]
  });

  map.basemap = basemap;
}

function addCapaKML(KMLLayer, url) {
  let layer;
  layer = new KMLLayer({
    url: url
  }) // url to the service
  map.layers.add(layer);
}

function addCapaWMS(WMSLayer, WMSLayerInfo, url) {
  //Se añaden las capas WMS
 
	pWMSLayer = WMSLayer('http://bizkaia.fototeca.eu:8082');
	pWMSLayer.id = 'layerWMS';
	//pWMSLayer.setVisibleLayers(['Bizkaia_1965']);
	//pWMSLayer.setImageFormat('png');

  map.layers.add(pWMSLayer);
}

// Funciones de sincronización de vistas (2D/3D)
require(["esri/core/watchUtils"], function (watchUtils) {

  habilitarCambioVista();

  function habilitarCambioVista() {

    const tabs = Array.from(document.querySelectorAll(
      ".calcite-navbar li a[data-toggle='tab']"));
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function (event) {
        if (event.target.text.indexOf("Map") > -1) {
          sincronizarVistas(app.sceneView, app.mapView);
          activarVista(app.mapView);
        } else {
          sincronizarVistas(app.mapView, app.sceneView);
          activarVista(app.sceneView);
        }
        sincronizarWidgetBusqueda(app.activeView);
      });
    });

  }

  // Sincronizar widget búsqueda
  function sincronizarWidgetBusqueda(view) {
    watchUtils.whenTrueOnce(view, "ready", function () {
      app.searchWidget.view = view;
      if (app.searchWidget.selectedResult) {
        app.searchWidget.search(app.searchWidget.selectedResult.name)
      }
    });
  }

  function sincronizarVistas(fromView, toView) {
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

});



// Constants for init
const INITIAL_LONGITUDE = -2.930842;
const INITIAL_LATITUDE = 43.250414;
const INITIAL_SCALE = 5000;
const INITIAL_ZOOM = 14;

// DOM elements
const MAP_CONTAINER = "mapViewDiv"; // 2D container
const SCENE_CONTAINER = "sceneViewDiv"; // 3D container
const SEARCHER_CONTAINER = "searchWidgetDiv";
const LAYER_PANEL = "layerPanelDiv";

const URLServicioCartografiaBasica = "http://www.geo.euskadi.eus/WMS_KARTOGRAFIA";

var app;
var map;
var mapView; // 2D view
var sceneView; // 3D view

// Layers
var wmsLayer;

var dojoConfig = {
    packages: [{
      name: "bootstrap",
      location: "https://esri.github.io/calcite-maps/dist/vendor/dojo-bootstrap"
    },
    {
      name: "calcite-maps",
      location: "https://esri.github.io/calcite-maps/dist/js/dojo"
    }]
  };


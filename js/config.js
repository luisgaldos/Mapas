// Constants for init
const INITIAL_LONGITUDE = -2.930842;
const INITIAL_LATITUDE = 43.250414;
const INITIAL_SCALE = 150000;
const INITIAL_ZOOM = 5;

// DOM elements
const MAP_CONTAINER = "mapViewDiv"; // 2D container
const SCENE_CONTAINER = "sceneViewDiv"; // 3D container
const SEARCHER_CONTAINER =  document.getElementById("searchWidgetDiv"); // Search container

const LAYER_PANEL =  document.getElementById("layerPanelDiv");
const MEASURE_2D_PANEL =  document.getElementById("measure2DPanelDiv");
const DISTANCE_2D_MEASURE_PANEL =  document.getElementById("distanceMeasure2DPanelDiv");
const AREA_2D_MEASURE_PANEL =  document.getElementById("areaMeasure2DPanelDiv");

const MEASURE_3D_PANEL =  document.getElementById("measure3DPanelDiv");
const DISTANCE_3D_MEASURE_PANEL =  document.getElementById("distanceMeasure3DPanelDiv");
const AREA_3D_MEASURE_PANEL =  document.getElementById("areaMeasure3DPanelDiv");

const KML_LAYERS_PANEL = document.getElementById('KMLLayersPanelDiv');
const BASEMAPS_PANEL = document.getElementById('basemapPanelDiv');
const DRAW_PANEL =  document.getElementById("drawPanelDiv");

const DISTANCE_MEASURE_BTN = document.getElementById("distanceButton");
const AREA_MEASURE_BTN = document.getElementById("areaButton");

/*Definicion de servicios KML*/
var serviciosKML = [];
serviciosKML[0] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedRoja.kmz";
serviciosKML[1] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedVerde.kmz";
serviciosKML[2] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedNaranja.kmz";
serviciosKML[3] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedAzul.kmz";
serviciosKML[4] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedAmarilla.kmz";
serviciosKML[5] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/Municipios.kmz";
serviciosKML[6] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/Cesiones.kmz";

/*Definicion de servicios Feature*/
var serviciosFeature = [];

serviciosFeature[0] = "http://arcgis.bizkaia.net/arcgis/rest/services/OBRASPUBLICAS/GH_Carreteras_Mobile/MapServer/1";
serviciosFeature[1] = "http://arcgis.bizkaia.net/arcgis/rest/services/OBRASPUBLICAS/GH_Carreteras_Mobile/MapServer/2";
serviciosFeature[2] = "http://arcgis.bizkaia.net/arcgis/rest/services/OBRASPUBLICAS/GH_Carreteras_Mobile/MapServer/3";

/*Definicion de servicios de ortofotos*/
/*Nombre servicio|visible|escala minima|escala maxima|id del check de la orto*/
var serviciosOrtofotos = new Array()

serviciosOrtofotos[0] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1945/MapServer";
serviciosOrtofotos[1] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1956/MapServer";
serviciosOrtofotos[2] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/URBANISMO_1965/MapServer";
serviciosOrtofotos[3] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1977/MapServer";
serviciosOrtofotos[4] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/URBANISMO_1983/MapServer";
serviciosOrtofotos[5] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1984/MapServer";
serviciosOrtofotos[6] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/URBANISMO_1990/MapServer";
serviciosOrtofotos[7] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1990/MapServer";
serviciosOrtofotos[8] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/URBANISMO_1995/MapServer";
serviciosOrtofotos[9] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2000/MapServer";
serviciosOrtofotos[10] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2002/MapServer";
serviciosOrtofotos[11] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2004/MapServer";
serviciosOrtofotos[12] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2005/MapServer";
serviciosOrtofotos[13] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2006/MapServer";
serviciosOrtofotos[14] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2007/MapServer";
serviciosOrtofotos[15] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2008/MapServer";
serviciosOrtofotos[16] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2009/MapServer";
serviciosOrtofotos[17] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2010/MapServer";
serviciosOrtofotos[18] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2011/MapServer";
serviciosOrtofotos[19] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2012_AMPLIADO/MapServer";
serviciosOrtofotos[20] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2013_AMPLIADO/MapServer";
serviciosOrtofotos[21] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2014_AMPLIADO/MapServer";
serviciosOrtofotos[22] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2015_AMPLIADO/MapServer";
serviciosOrtofotos[23] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2016_AMPLIADO/MapServer";
serviciosOrtofotos[24] = "http://arcgis.bizkaia.net/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2017_AMPLIADO/MapServer";


/* Variables comunes */
var app;
var map;  // Map
var basemap; // Mapa base
var draw;
var mapView; // 2D view
var sceneView; // 3D view


// Widgets
var activeWidget = null;
var distance2DmeasureWidget;
var distance3DmeasureWidget;

var area2DmeasureWidget;
var area3DmeasureWidget;

var scaleBar;
var locateWidget;
var sketchWidget;

// Layers
var wmsLayer;
var graphicsLayer;

var kmlLayers = [];
var tileLayers = [];
var featureLayers = [];


var URLortoActual = serviciosOrtofotos[serviciosOrtofotos.length-1];


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


// Constants for init
const INITIAL_LONGITUDE = -2.930842;
const INITIAL_LATITUDE = 43.250414;
const INITIAL_SCALE = 5000;
const INITIAL_ZOOM = 14;

// DOM elements
const MAP_CONTAINER = "mapViewDiv"; // 2D container
const SCENE_CONTAINER = "sceneViewDiv"; // 3D container
const SEARCHER_CONTAINER = "searchWidgetDiv"; // Search container

const LAYER_PANEL = "layerPanelDiv";
const MEASURE_2D_PANEL = "measure2DPanelDiv";
const DISTANCE_2D_MEASURE_PANEL = "distanceMeasure2DPanelDiv";
const AREA_2D_MEASURE_PANEL = "areaMeasure2DPanelDiv";

const MEASURE_3D_PANEL = "measure3DPanelDiv";
const DISTANCE_3D_MEASURE_PANEL = "distanceMeasure3DPanelDiv";
const AREA_3D_MEASURE_PANEL = "areaMeasure3DPanelDiv";

const KML_LAYERS_PANEL = document.getElementById('KMLLayersPanelDiv');
const DRAW_PANEL = "drawPanelDiv";

const DISTANCE_MEASURE_BTN = document.getElementById("distanceButton");
const AREA_MEASURE_BTN = document.getElementById("areaButton");

/*Definicion de servicios KML*/
var serviciosKML = [];
serviciosKML[1] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedRoja.kmz";
serviciosKML[2] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedVerde.kmz";
serviciosKML[3] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedNaranja.kmz";
serviciosKML[4] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedAzul.kmz";
serviciosKML[5] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/RedAmarilla.kmz";
serviciosKML[6] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/Municipios.kmz";
serviciosKML[7] = "http://apli.bizkaia.net/APPS/DANOK/GHCA/TRAMOS/Cesiones.kmz";

/*Definicion de servicios de ortofotos*/
/*Nombre servicio|visible|escala minima|escala maxima|id del check de la orto*/
var serviciosOrtofotos = new Array()


serviciosOrtofotos[0] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1945_AMPLIADO/MapServer|false|1|10000000|ortos1945";
serviciosOrtofotos[1] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1956_AMPLIADO/MapServer|false|1|10000000|ortos1956";
serviciosOrtofotos[2] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/URBANISMO_1965_AMPLIADO/MapServer|false|1|10000000|ortos1965";
serviciosOrtofotos[3] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1977_AMPLIADO/MapServer|false|1|10000000|ortos1977";
serviciosOrtofotos[4] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/URBANISMO_1983_AMPLIADO/MapServer|false|1|10000000|ortos1983";
serviciosOrtofotos[5] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1984_AMPLIADO/MapServer|false|1|10000000|ortos1984";
serviciosOrtofotos[6] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/URBANISMO_1990_AMPLIADO/MapServer|false|1|10000000|ortos_urbanismo_1990";
serviciosOrtofotos[7] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_1990_AMPLIADO/MapServer|false|1|10000000|ortos1990";
serviciosOrtofotos[8] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/URBANISMO_1995_AMPLIADO/MapServer|false|1|10000000|ortos1995";
serviciosOrtofotos[9] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2000_AMPLIADO/MapServer|false|1|10000000|ortos2000";
serviciosOrtofotos[10] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2002_AMPLIADO/MapServer|false|1|10000000|ortos2002";
serviciosOrtofotos[11] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2004_AMPLIADO/MapServer|false|1|10000000|ortos2004";
serviciosOrtofotos[12] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2005_AMPLIADO/MapServer|false|1|10000000|ortos2005";
serviciosOrtofotos[13] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2006_AMPLIADO/MapServer|false|1|10000000|ortos2006";
serviciosOrtofotos[14] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2007_AMPLIADO/MapServer|false|1|10000000|ortos2007";
serviciosOrtofotos[15] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2008_AMPLIADO/MapServer|false|1|10000000|ortos2008";
serviciosOrtofotos[16] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2009_AMPLIADO/MapServer|false|1|10000000|ortos2009";
serviciosOrtofotos[17] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2010_AMPLIADO/MapServer|false|1|10000000|ortos2010";
serviciosOrtofotos[18] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2011_AMPLIADO/MapServer|false|1|10000000|ortos2011";
serviciosOrtofotos[19] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2012_AMPLIADO/MapServer|false|1|10000000|ortos2012";
serviciosOrtofotos[20] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2013_AMPLIADO/MapServer|false|1|10000000|ortos2013";
serviciosOrtofotos[21] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2014_AMPLIADO/MapServer|false|1|10000000|ortos2014";
serviciosOrtofotos[22] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2015_FINAL_AMPLIADO/MapServer|false|1|10000000|ortos2015";
serviciosOrtofotos[23] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2016_AMPLIADO/MapServer|true|1|10000000|ortos2016";
serviciosOrtofotos[24] = "http://arcgis.aldundia.bfa/arcgis/rest/services/ORTOFOTOS/GOBIERNO_VASCO_2017_AMPLIADO/MapServer|true|1|10000000|ortos2017";

/* Variables comunes */
var app;
var map;  // Map
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


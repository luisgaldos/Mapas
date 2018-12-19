var app;

require(["esri/Map",
    "esri/Basemap",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Search",
    "esri/core/watchUtils",
    "dojo/query",

    // Calcite-maps
    "calcite-maps/calcitemaps-v0.9",
    "calcite-maps/calcitemaps-arcgis-support-v0.9",

    // Bootstrap
    "bootstrap/Collapse",
    "bootstrap/Dropdown",
    "bootstrap/Tab",

    "dojo/domReady!"
], function (Map, Basemap, MapView, SceneView, Search, watchUtils, query, CalciteMaps, CalciteMapsArcGIS) {

    // App
    app = {
        zoom: INITIAL_ZOOM,
        center: [INITIAL_LONGITUDE, INITIAL_LATITUDE],
        basemap: "satellite",
        viewPadding: {
            top: 50, bottom: 0
        },
        uiPadding: {
            top: 15, bottom: 15
        },
        map: null,
        mapView: null,
        sceneView: null,
        activeView: null,
        searchWidgetNav: null,
        containerMap: MAP_CONTAINER,
        containerScene: SCENE_CONTAINER
    };

    // Map 
    app.map = new Map({
        basemap: app.basemap,
        ground: "world-elevation"
    });

    // 2D View
    app.mapView = new MapView({
        container: null, // deactivate
        map: app.map,
        zooom: app.zoom,
        center: app.center,
        padding: app.viewPadding,
        ui: {
            components: ["zoom", "compass", "attribution"],
            padding: app.uiPadding
        }
    });

    // 3D View
    app.sceneView = new SceneView({
        container: app.containerScene, // activate
        map: app.map,
        zoom: app.zoom,
        center: app.center,
        padding: app.viewPadding,
        ui: {
            padding: app.uiPadding
        }
    });

    // Active view is scene
    setActiveView(app.sceneView);

    // Create search widget
    app.searchWidgetNav = new Search({
        container: "searchNavDiv",
        view: app.activeView
    });

    // Wire-up expand events
    CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidgetNav);
    CalciteMapsArcGIS.setPopupPanelSync(app.mapView);
    CalciteMapsArcGIS.setPopupPanelSync(app.sceneView);

    // Menu UI - ArcGIS change Basemaps
    query("#arcGISSelectBasemapPanel").on("change", function (e) {
        app.mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
        app.sceneView.map.basemap = e.target.value;
    });

    // Menu UI - Eusko Jaurlaritza change Basemaps
    query("#EJSelectBasemapPanel").on("change", function (e) {
        app.mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
        app.sceneView.map.basemap = e.target.value;
    });

    // Tab UI - Switch views
    query(".calcite-navbar li a[data-toggle='tab']").on("click", function (e) {
        if (e.target.text.indexOf("Map") > -1) {
            syncViews(app.sceneView, app.mapView);
            setActiveView(app.mapView);
        } else {
            syncViews(app.mapView, app.sceneView);
            setActiveView(app.sceneView);
        }
        syncSearch(app.activeView);
    });

    // Views
    function syncViews(fromView, toView) {
        var viewPt = fromView.viewpoint.clone();
        fromView.container = null;
        if (fromView.type === "3d") {
            toView.container = app.containerMap;
        } else {
            toView.container = app.containerScene;
        }
        toView.viewpoint = viewPt;
        toView.padding = app.viewPadding;
    }

    // Search Widget
    function syncSearch(view) {
        app.searchWidgetNav.view = view;
        if (app.searchWidgetNav.selectedResult) {
            watchUtils.whenTrueOnce(view, "ready", function () {
                app.searchWidgetNav.autoSelect = false;
                app.searchWidgetNav.search(app.searchWidgetNav.selectedResult.name);
                app.searchWidgetNav.autoSelect = true;
            });
        }
    }

    // Active view
    function setActiveView(view) {
        app.activeView = view;
    }


});
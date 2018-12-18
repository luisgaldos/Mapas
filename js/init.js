require([
    "esri/Map",

    // Views
    "esri/views/MapView",
    "esri/views/SceneView",

    // Layers
    "esri/layers/KMLLayer",
    "esri/layers/FeatureLayer",

    // Widgets 
    "esri/widgets/ScaleBar",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Track",
    "esri/widgets/Legend",

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
    "@dojo/framework/shim/array",

    "esri/geometry/support/webMercatorUtils",
    "dojo/dom",
    "dojo/domReady!"
], function (
    Map, MapView, SceneView, KMLLayer, Legend, ScaleBar, Search, Basemaps, Track, watchUtils, CalciteMaps, CalciteMapsArcGIS, webMercatorUtils, dom) {



        /******************************************************************
         *
         * App settings
         *
         ******************************************************************/

        appInitialize();


        /******************************************************************
         *
         * Create the map, views and ui components
         *
         ******************************************************************/

        loadLayers(KMLLayer);
        createMap(Map);

        createViews(MapView, SceneView);

        // Set the active view to scene
        setActiveView(app.mapView);

        // Create UI components
        createUIComponent(Track, "top-left");
        createUIComponent(ScaleBar, "bottom-left");

        // Create the search widget and add it to the navbar instead of view
        app.searchWidget = new Search({
            view: app.activeView
        }, "searchWidgetDiv");

        // Popup and panel sync
        app.mapView.when(function () {
            CalciteMapsArcGIS.setSearchExpandEvents(app.searchWidget);
        });

        // Create basemap widget
        app.basemapWidget = new Basemaps({
            view: app.activeView,
            container: "basemapPanelDiv"
        });

        /******************************************************************
         *
         * Synchronize the view, search and popup
         *
         ******************************************************************/

        // Views
        function setActiveView(view) {
            app.activeView = view;
        }

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

        /******************************************************************
         *
         * Apply Calcite Maps CSS classes to change application on the fly
         *
         * For more information about the CSS styles or Sass build visit:
         * http://github.com/esri/calcite-maps
         *
         ******************************************************************/

        const cssSelectorUi = [document.querySelector(".calcite-navbar"),
        document.querySelector(".calcite-panels")
        ];
        const cssSelectorMap = document.querySelector(".calcite-map");

        // Theme - light (default) or dark theme
        buildThemesPanel();

        // Color - custom color
        buildColorPanel();

        // Widgets - light (default) or dark theme
        setWidgetsTheme();

        // Layout - top or bottom nav position
        setNavPosition();

        // Set view padding for widgets based on navbar position


    });

function buildThemesPanel() {

    const settingsTheme = document.getElementById("settingsTheme");
    const settingsColor = document.getElementById("settingsColor");
    settingsTheme.addEventListener("change", function (event) {
        const textColor = event.target.options[event.target.selectedIndex]
            .dataset.textcolor;
        const bgColor = event.target.options[event.target.selectedIndex]
            .dataset.bgcolor;

        cssSelectorUi.forEach(function (element) {
            element.classList.remove(
                "calcite-text-dark", "calcite-text-light",
                "calcite-bg-dark", "calcite-bg-light",
                "calcite-bg-custom"
            );
            element.classList.add(textColor, bgColor);
            element.classList.remove(
                "calcite-bgcolor-dark-blue",
                "calcite-bgcolor-blue-75",
                "calcite-bgcolor-dark-green",
                "calcite-bgcolor-dark-brown",
                "calcite-bgcolor-darkest-grey",
                "calcite-bgcolor-lightest-grey",
                "calcite-bgcolor-black-75",
                "calcite-bgcolor-dark-red"
            );
            element.classList.add(bgColor);
        });
        settingsColor.value = "";
    });

}

function buildColorPanel() {
    settingsColor.addEventListener("change", function (event) {
        const customColor = event.target.value
        const textColor = event.target.options[event.target.selectedIndex]
            .dataset.textcolor;
        const bgColor = event.target.options[event.target.selectedIndex]
            .dataset.bgcolor;

        cssSelectorUi.forEach(function (element) {
            element.classList.remove(
                "calcite-text-dark", "calcite-text-light",
                "calcite-bg-dark", "calcite-bg-light",
                "calcite-bg-custom"
            );
            element.classList.add(textColor, bgColor);
            element.classList.remove(
                "calcite-bgcolor-dark-blue",
                "calcite-bgcolor-blue-75",
                "calcite-bgcolor-dark-green",
                "calcite-bgcolor-dark-brown",
                "calcite-bgcolor-darkest-grey",
                "calcite-bgcolor-lightest-grey",
                "calcite-bgcolor-black-75",
                "calcite-bgcolor-dark-red"
            );
            element.classList.add(customColor);
            if (!customColor) {
                settingsTheme.dispatchEvent(new Event("change"));
            }
        });
    });
}

function setWidgetsTheme() {
    const settingsWidgets = document.getElementById("settingsWidgets");
    settingsWidgets.addEventListener("change", function (event) {
        const theme = event.target.value;
        cssSelectorMap.classList.remove("calcite-widgets-dark",
            "calcite-widgets-light");
        cssSelectorMap.classList.add(theme);
    });
}

function setNavPosition() {
    const settingsLayout = document.getElementById("settingsLayout");
    settingsLayout.addEventListener("change", function (event) {
        const layout = event.target.value;
        const layoutNav = event.target.options[event.target.selectedIndex]
            .dataset.nav;

        document.body.classList.remove("calcite-nav-bottom",
            "calcite-nav-top");
        document.body.classList.add(layout);

        const nav = document.querySelector("nav");
        nav.classList.remove("navbar-fixed-bottom", "navbar-fixed-top");
        nav.classList.add(layoutNav);
        setViewPadding(layout);
    });
}

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
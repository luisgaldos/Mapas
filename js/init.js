
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",

  // Widgets
  "esri/widgets/Search",
  "esri/widgets/BasemapGallery",
  "esri/widgets/ScaleBar",
  "esri/widgets/DistanceMeasurement2D",
  "esri/widgets/AreaMeasurement2D",
  "esri/widgets/AreaMeasurement3D",

  //Layers
  "esri/layers/KMLLayer",

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
  MapView,
  SceneView,
  Search,
  Basemaps,
  ScaleBar,
  DistanceMeasurement2D,
  AreaMeasurement2D,
  AreaMeasurement3D,
  KMLLayer,
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

    app = {
      center: [INITIAL_LONGITUDE, INITIAL_LATITUDE],  // Longitud, latitud
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

    /******************************************************************
     *
     * Create the map and scene view and ui components
     *
     ******************************************************************/

    // KML Layers
    var layer1 = new KMLLayer({
      url: URLKMZTest1// url to the service
    });
    var layer2 = new KMLLayer({
      url: URLKMZTest2// url to the service
    });
    var layer3 = new KMLLayer({
      url: URLKMZTest3// url to the service
    });
    var layer4 = new KMLLayer({
      url: URLKMZTest4// url to the service
    });

    kmlLayers.push(layer1);
    kmlLayers.push(layer2);
    kmlLayers.push(layer3);
    kmlLayers.push(layer4);

    // Add layers to Panel
    var panel = document.getElementById('KMLLayersPanelDiv');

    var ul = document.createElement('ul');
    panel.appendChild(ul);

    kmlLayers.forEach(function (item) {
      var li = document.createElement('li');
      li.innerHTML = item.title;
      li.style.fontSize = "1.4em";
      ul.appendChild(li);

      ul.style.listStyle = "none";
      
      var checkbox = document.createElement("INPUT");
      checkbox.setAttribute("type", "checkbox");
      checkbox.addEventListener('change', function () {
        if (this.checked) {
          item.visible = true;
        } else {
          item.visible = false;
        }
      });
      li.appendChild(checkbox);
      checkbox.checked = true;
      checkbox.style.cssFloat = "right";

    });

    // Map
    var map = new Map({
      basemap: app.basemap,
      layers: [layer1, layer2, layer3, layer4]
    });

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

    // 2D measure
    var measurementWidget = new AreaMeasurement2D({
      view: app.mapView
    });
    app.mapView.ui.add(measurementWidget, "top-right");

    var btnClose = document.createElement("button");
    btnClose.innerHTML = "Exit";
    //document.getElementsByClassName('esri-area-measurement-3d__container').appendChild(btnClose);

    //  3D measure
    var measurementWidget = new AreaMeasurement3D({
      view: app.sceneView
    });

    // Set the active view to scene
    setActiveView(app.mapView);

    // Create the scale bar and add it to the bottom left corner of the view
    var scaleBar = new ScaleBar({
      view: app.mapView
    });
    app.mapView.ui.add(scaleBar, {
      position: "bottom-left"
    });

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

      if (view == app.mapView) {
        kmlLayers.map(e => e.visible = true);

      } else {
        kmlLayers = [];

        app.sceneView.ui.add(measurementWidget, "top-right");
      }

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

    // Color - custom color
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

    // Widgets - light (default) or dark theme
    const settingsWidgets = document.getElementById("settingsWidgets");
    settingsWidgets.addEventListener("change", function (event) {
      const theme = event.target.value;
      cssSelectorMap.classList.remove("calcite-widgets-dark",
        "calcite-widgets-light");
      cssSelectorMap.classList.add(theme);
    });

    // Layout - top or bottom nav position
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

  });
function loadKMLLayersPanel() {

    // Add layers to Panel
    let ul, li, label, checkbox;

    // Create a list and add to the view
    ul = document.createElement('ul');
    ul.style.listStyle = "none";
    KML_LAYERS_PANEL.appendChild(ul);

    // Creates the element of the list, one label and one checkbox per layer
    kmlLayers.forEach(function (item) {

        li = document.createElement('li');
        label = document.createElement('label');

        // Separates a string ex: ThisIsATextExample -> This is a text example
        let s = item.title.split(/(?=[A-Z])/);
        let titulo = s.toString().replace(/,/g, " ");
        label.innerHTML = titulo;
        li.style.fontSize = "1.4em";

        ul.appendChild(li);
        li.appendChild(label);

        checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.id = "ck" + item.id;
        checkbox.style.cssFloat = "right";
        checkbox.checked = true;

        label.htmlFor = "ck" + item.id;

        li.appendChild(checkbox);

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                item.visible = true;
            } else {
                item.visible = false;
            }
        });

    });
}

function setActiveView(view) {

    if (view == app.mapView) {
        map.layers.add(graphicsLayer);
        map.layers.addMany(kmlLayers);
        document.getElementById(MEASURE_3D_PANEL).style.display = "none";   // Hide 3D measure panel
        document.getElementById(MEASURE_2D_PANEL).style.display = "block";  // Show 2D measure panel
    } else {
        map.layers.removeAll()
        document.getElementById(MEASURE_2D_PANEL).style.display = "none";   // Hide 2D measure panel
        document.getElementById(MEASURE_3D_PANEL).style.display = "block";   // Show 3D measure panel
    }

    app.activeView = view;
}

function showHideDrawWidget() {

    if (sketchWidget.visible == true ) {
        sketchWidget.visible = false;
    } else {
        sketchWidget.visible = true;
    }
}

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

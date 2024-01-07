let myMap = L.map("map", {center: [37.7749, -122.4194],zoom: 5});                               // declaring map object centering abouts the western United States
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);                 // map base
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";     // Load earthquake data from USGS GeoJSON feed
d3.json(queryUrl).then(data => {                                                                // THEN request to the query URL
    console.log(data);                                                                              // Print the data to the console
    const earthquakeLayer = L.geoJSON(data.features, {                                              // Create a GeoJSON layer with the retrieved data
        pointToLayer: (feature, latlng) => {                                                            // Declare important constants
            const size = feature.properties.mag * 5;                                                        // Calculate the size based on magnitude
            const depth = feature.geometry.coordinates[2];                                                  // depth is the third coordinate.  used for darkness per depth
            const normalizedDepth = (depth+10)/100;                                                         // normalizing depth to get colors in the right slots
            const color = d3.interpolateRgb("green", "red")(normalizedDepth);                               // Interpolate color from red to green based on depth
            const circle = L.circleMarker(latlng, {                                                         // Create circles with various sizes and colors
                radius: size,                                                                                   //radius
                fillColor: color,                                                                               //fillcolor
                color: color,                                                                                   //color
                fillOpacity: 1,                                                                                 //fully opaque
                fill: true                                                                                      //filled circles
            });                                                                                             // Created circles
            circle.bindPopup(                                                                               // Add a popup with information about location, magnitude, and depth
                `<strong>Location:</strong> ${feature.properties.place}<br>` +                                  //popup to include location
                `<strong>Magnitude:</strong> ${feature.properties.mag}<br>` +                                   //popup to include magnitude
                `<strong>Depth:</strong> ${depth} km`                                                           //popup to include depth
            );                                                                                              // Created popup
            return circle;                                                                                  // Return Circles
        }                                                                                               // Declared important variables
    }).addTo(myMap);                                                                                // Added earthquake circles layer to map from website

    let legend = L.control({ position: "bottomright" });                                            // adding earthquake depth legend to map
    legend.onAdd = function() {                                                                     // important variables to declare to return
        let div = L.DomUtil.create("div", "info legend");                                               // ...?
        let depthLabels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];                        // legend labels
        for (let i = 0; i < depthLabels.length; i++) {                                                  // legend colors (6 colors between red and green)
            const normalizedDepth = i / (depthLabels.length - 1);                                           // evenly distributes colors
            const legendColor = d3.interpolateRgb("green", "red")(normalizedDepth);                         // evenly distributes colors
            div.innerHTML += '<span style="background:' + legendColor + '">&nbsp;&nbsp;&nbsp;&nbsp;</span> ' +  depthLabels[i] + '<br>';   // adds color and label to legend
        }                                                                                               // finish legend colors and labels
        return div;                                                                                     // return div
    };                                                                                              // finish legend
    legend.addTo(myMap);                                                                            // add legend to map
});                                                                                             // end THEN request
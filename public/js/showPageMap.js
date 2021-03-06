mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/light-v10",
    center: loc,
    zoom: 10,
});
map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(loc)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${title}</h3><p>${campLoc}</p>`
        )
    )
    .addTo(map);

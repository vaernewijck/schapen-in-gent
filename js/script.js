const URL = 'https://data.stad.gent/api/explore/v2.1/catalog/datasets/sheep-tracking-gent/records?limit=20';
const ZOOM_LEVEL = 12;

const getSheep = async () => {
  const response = await fetch(URL);
  const { results } = await response.json();
  const { location, status, lastaddress } = results[0];
  return { location, status, lastaddress };
}

const calculateIconSizeBasedOnZoom = (zoomLevel) => {
  const baseSize = 200;
  let size = baseSize * (1 + (zoomLevel - 12) * 0.3);
  size = Math.max(50, Math.min(size, 400));  // Cap size between 50 and 400 for example
  return [size, size];
}


const handleZoomEnd = (map, marker, icon) => {
  const currentZoom = map.getZoom();
  const newIconSize = calculateIconSizeBasedOnZoom(currentZoom);
  const newIcon = L.icon({
    iconUrl: icon.options.iconUrl,
    iconSize: newIconSize,
    iconAnchor: [newIconSize[0] / 2, newIconSize[1] / 2],
  });

  marker.setIcon(newIcon);

}

const init = async () => {
  try {
    const { location } = await getSheep();
    const map = L.map('map').setView([location.lat, location.lon], ZOOM_LEVEL);
    map.on('zoomend', () => handleZoomEnd(map, marker, icon));

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 })

    tileLayer.addTo(map);
    tileLayer.getContainer().style.filter = "grayscale(90%)";

    // Change marker on desktop 
    const icon = L.icon({
      iconUrl: 'assets/sheep.gif',
      iconSize: [100, 100],
      iconAnchor: [100, 100],
    });

    const marker = L.marker([location.lat, location.lon], { icon }).addTo(map);

    // Locate & show current location
    map.locate();
    map.on('locationfound', (e) => {
      L.marker(e.latlng).addTo(map);
      map.setView(e.latlng, ZOOM_LEVEL);
    });

  } catch (error) {
    console.error('Failed to initialize the map:', error);
  }
};

init();
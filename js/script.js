const URL = 'https://data.stad.gent/api/explore/v2.1/catalog/datasets/sheep-tracking-gent/records?limit=20';

const getSheep = async () => {
  const response = await fetch(URL);
  const { results } = await response.json();
  const { location, status, lastaddress } = results[0];
  return { location, status, lastaddress };
}

const calculateIconSizeBasedOnZoom = (zoomLevel) => {
  const baseSize = 120; // Starting size to match initial icon size
  const size = baseSize * (1 + (zoomLevel - 13) * 0.3); // Example scaling, adjust as needed
  return [size, size];
}

const handleZoomEnd = (map, marker, icon) => {
  const currentZoom = map.getZoom();
  const newIconSize = calculateIconSizeBasedOnZoom(currentZoom);
  const newIcon = L.icon({
    iconUrl: icon.options.iconUrl,
    iconSize: newIconSize,
    iconAnchor: [newIconSize[0] / 2, newIconSize[1] / 2], // Adjusted anchor positioning
  });

  marker.setIcon(newIcon);

}

const init = async () => {
  try {
    const { location } = await getSheep(); // Assuming getSheep() is correctly defined elsewhere
    const map = L.map('map').setView([location.lat, location.lon], 13);

    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 })

    tileLayer.addTo(map);

    tileLayer.getContainer().style.filter = "grayscale(80%)";

    // TODO: Change marker on desktop 
    const icon = L.icon({
      iconUrl: 'assets/sheep.gif',
      iconSize: [200, 200], // Ensure this aligns with your scaling strategy
      iconAnchor: [50, 50],
    });

    const marker = L.marker([location.lat, location.lon], { icon }).addTo(map);

    map.on('zoomend', () => handleZoomEnd(map, marker, icon));


  } catch (error) {
    console.error('Failed to initialize the map:', error);
  }
};


init();
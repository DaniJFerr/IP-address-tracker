

document.addEventListener('DOMContentLoaded', function () {
  const { VITE_API_KEY, VITE_MAPBOX_TOKEN} = import.meta.env;
  const searchButton = document.getElementById('search-button');
  const ipAddressInput = document.getElementById('search-bar');
  const ipContainer = document.getElementById('ip');
  const locationContainer = document.getElementById('local');
  const timezoneContainer = document.getElementById('time');
  const ispContainer = document.getElementById('isp');
  const mapDiv = document.getElementById('map');
  const toggleButton = document.querySelector('.description-bar');
  const descripContainers = document.querySelectorAll('.container-item');
  let marker;

   function toggleDescripContainer() {
      descripContainers.forEach(function(container){
        container.classList.toggle('active');
      })
    }
  
    // Add event listener to the button
    toggleButton.addEventListener('click', toggleDescripContainer);

  if (!VITE_MAPBOX_TOKEN) {
    throw new Error("An API access token is required to use Mapbox GL.");
  }
  // Initialize Mapbox map
  mapboxgl.accessToken = VITE_MAPBOX_TOKEN;
  const mapboxMap = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-74.0066, 40.7135],
    zoom: 20.5,
    pitch: 45,
    bearing: -17.6,
    container: 'map',
    antialias: true
  });

  mapboxMap.on('style.load', () => {
    const layers = mapboxMap.getStyle().layers;
    const labelLayerId = layers.find(layer => layer.type === 'symbol' && layer.layout['text-field']).id;

    mapboxMap.addLayer({
      id: 'add-3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
        'fill-extrusion-opacity': 0.6
      }
    }, labelLayerId);
  });

  const updateUI = (data) => {
    ipContainer.innerHTML = `<p>IP Address</p><h1>${data.ip}</h1>`;
    locationContainer.innerHTML = `<p>Location</p><h1>${data.country_name ? data.country_name + ' ' : ''}${data.zipcode || ''}</h1>`;
    timezoneContainer.innerHTML = `<p>Timezone</p><h1>UTC ${data.time_zone.offset}</h1>`;
    ispContainer.innerHTML = `<p>ISP</p><h1>${data.isp}</h1>`;
  };

  const fetchData = async (ipAddress) => {
    try {
      const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${VITE_API_KEY}&ip=${ipAddress}`);
      const data = await response.json();

      updateUI(data);

      if (marker) {
        marker.remove();
      }

      mapboxMap.flyTo({ center: [data.longitude, data.latitude], zoom: 13 });
      marker = new mapboxgl.Marker()
        .setLngLat([data.longitude, data.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<b>${data.city}, ${data.country_name} ${data.zipcode}</b>`))
        .addTo(mapboxMap);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch initial location on page load
  fetchData('');

  searchButton.addEventListener('click', () => {
    const ipAddress = ipAddressInput.value.trim();
    if (ipAddress) {
      fetchData(ipAddress);
    } else {
      ipAddressInput.placeholder = 'Please enter an IP address';
    }
  });

  // Initialize Leaflet map centered at current location
  const leafletMap = L.map(mapDiv).setView([0, 0], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);

  leafletMap.locate({ setView: true, maxZoom: 13 });

  // Add marker at current location
  leafletMap.on('locationfound', (e) => {
    marker = L.marker([e.latitude, e.longitude]).addTo(leafletMap)
      .bindPopup("You are here!").openPopup();
  });

  map.addControl(new mapboxgl.NavigationControl());
});


document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const ipAddressInput = document.getElementById('search-bar');
    const ipContainer = document.getElementById('ip');
    const locationContainer = document.getElementById('local');
    const timezoneContainer = document.getElementById('time');
    const ispContainer = document.getElementById('isp');
    const API_KEY = 'at_UcExkLMsteeelpcckDqXrtBwZExkg';
    const mapDiv = document.getElementById('map');
    let map;
    let marker;
  
    const fetchData = (ipAddress) => {
      fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`)
        .then(response => response.json())
        .then(data => {
          ipContainer.innerHTML = `<p>IP Address</p><h1>${data.ip}</h1>`;
          locationContainer.innerHTML = `<p>Location</p><h1>${data.location.city ? data.location.city + ',' : ''} ${data.location.region ? data.location.region + ' ' : ''}${data.location.postalCode || ''}</h1>`;
          timezoneContainer.innerHTML = `<p>Timezone</p><h1>UTC ${data.location.timezone}</h1>`;
          ispContainer.innerHTML = `<p>ISP</p><h1>${data.isp}</h1>`;
  
          if (marker) {
            map.removeLayer(marker);
          }
  
          map.flyTo([data.location.lat, data.location.lng], 13);
          marker = L.marker([data.location.lat, data.location.lng]).addTo(map)
            .bindPopup(`<b>${data.location.city}, ${data.location.region} ${data.location.postalCode}</b>`).openPopup();
        })
        .catch(error => console.log(error));
    };
  
    // Fetch initial location on page load
    fetchData('');
  
    const handleClick = () => {
      const ipAddress = ipAddressInput.value;
  
      if (ipAddress !== '') {
        fetchData(ipAddress);
      } else {
        ipAddressInput.placeholder='Please enter an IP address';
      }
    };
  
    searchButton.addEventListener('click', handleClick);
  
    // Initialize map centered at current location
    map = L.map(mapDiv).setView([0, 0], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19}).addTo(map);
  
    // Get current location and set map view
    map.locate({ setView: true, maxZoom: 13 });
  
    // Add marker at current location
    map.on('locationfound', function(e){
      marker = L.marker([e.latitude, e.longitude]).addTo(map)
        .bindPopup("You are here!").openPopup();
    });
  });
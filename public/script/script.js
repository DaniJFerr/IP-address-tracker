document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const ipAddressInput = document.getElementById('search-bar');
    const ipContainer = document.getElementById('ip');
    const locationContainer = document.getElementById('local');
    const timezoneContainer = document.getElementById('time');
    const ispContainer = document.getElementById('isp');
    const API_KEY = '341cba93fc5c4e4da7f7fb08a85608c7';
    const mapDiv = document.getElementById('map');
    let toggleButton = document.querySelector('.description-bar');
    let descripContainer = document.querySelectorAll('.container-item');
    let map;
    let marker;

    
    function toggleDescripContainer() {
      descripContainer.forEach(function(container){
        container.classList.toggle('active');
      })
    }
  
    // Add event listener to the button
    toggleButton.addEventListener('click', toggleDescripContainer);
  
    const fetchData = (ipAddress) => {
      // fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`)
         fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ipAddress} `)
        .then(response => response.json())
        .then(data => {
          ipContainer.innerHTML = `<p>IP Address</p><h1>${data.ip}</h1>`;
          locationContainer.innerHTML = `<p>Location</p><h1>${data.country_name ? data.country_name + ' ' : ''}${data.zipcode || ''}</h1>`;
          timezoneContainer.innerHTML = `<p>Timezone</p><h1>UTC ${data.time_zone.offset}</h1>`;
          ispContainer.innerHTML = `<p>ISP</p><h1>${data.isp}</h1>`;
  
          if (marker) {
            map.removeLayer(marker);
          }
  
          map.flyTo([data.latitude, data.longitude], 13);
          marker = L.marker([data.latitude, data.longitude]).addTo(map)
            .bindPopup(`<b>${data.city}, ${data.country_name } ${data.zipcode}</b>`).openPopup();
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

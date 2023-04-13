

document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const ipAddressInput = document.getElementById('search-bar');
    const ipContainer = document.getElementById('ip');
    const locationContainer = document.getElementById('local');
    const timezoneContainer = document.getElementById('time');
    const ispContainer = document.getElementById('isp');
    const API_KEY = 'at_UcExkLMsteeelpcckDqXrtBwZExkg';
    const mapDiv = document.getElementById('map'); 
    
    const fetchData = (ipAddress) => {
      fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ipAddress}`)  
        .then(response => response.json())  
        .then(data => { 
          ipContainer.innerHTML = `<p>IP Address</p><h1>${data.ip}</h1>`; 
          locationContainer.innerHTML = `<p>Location</p><h1>${data.location.city ? data.location.city + ',' : ''} ${data.location.region ? data.location.region + ' ' : ''}${data.location.postalCode || ''}</h1>`;
          timezoneContainer.innerHTML = `<p>Timezone</p><h1>UTC ${data.location.timezone}</h1>`;
          ispContainer.innerHTML = `<p>ISP</p><h1>${data.isp}</h1>`;
          const map = L.map('map').setView([data.location.lat, data.location.lng], 13);
          const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19}).addTo(map);
          const marker = L.marker([data.location.lat, data.location.lng]).addTo(map) // Add a marker at the location coordinates
          .bindPopup(`<b>${data.location.city}, ${data.location.region} ${data.location.postalCode}</b>`).openPopup(); // Display location info in the popup
          mapDiv.appendChild(map._container);  
          
        })
        .catch(error => console.log(error));
    };
  
    const handleClick = () => {
      const ipAddress = ipAddressInput.value;
      
      
      if (ipAddress !== '') {
        fetchData(ipAddress);
        
        
      } else {
        ipAddressInput.placeholder='Please enter an IP address';
      }
    };
  
    searchButton.addEventListener('click', handleClick); 
  });
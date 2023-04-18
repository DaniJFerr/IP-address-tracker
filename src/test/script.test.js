describe('fetchData', () => {
    it('should fetch data from API and update DOM elements', async () => {
      const mockResponse = {
        ip: '192.0.2.1',
        location: {
          city: 'New York City',
          region: 'New York',
          postalCode: '10001',
          timezone: '-05:00',
          lat: 40.7128,
          lng: -74.006
        },
        isp: 'Acme Inc.'
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      );
  
      document.body.innerHTML = `
       <div id="ip"></div>
       <div id="local"></div>
       <div id="time"></div>
       <div id="isp"></div>
      `;
  
      await fetchData('192.0.2.1');
  
      expect(fetch).toHaveBeenCalledWith(
        'https://geo.ipify.org/api/v2/country,city?apiKey=at_UcExkLMsteeelpcckDqXrtBwZExkg&ipAddress=192.0.2.1'
      );
      expect(document.getElementById('ip').innerHTML).toEqual(
        '<p>IP Address</p><h1>192.0.2.1</h1>'
      );
      expect(document.getElementById('local').innerHTML).toEqual(
        '<p>Location</p><h1>New York City, New York 10001</h1>'
      );
      expect(document.getElementById('time').innerHTML).toEqual(
        '<p>Timezone</p><h1>UTC -05:00</h1>'
      );
      expect(document.getElementById('isp').innerHTML).toEqual(
        '<p>ISP</p><h1>Acme Inc.</h1>'
      );
    });
  
    it('should remove existing marker and add new marker to map', async () => {
      const mockResponse = {
        ip: '192.0.2.1',
        location: {
          city: 'New York City',
          region: 'New York',
          postalCode: '10001',
          timezone: '-05:00',
          lat: 40.7128,
          lng: -74.006
        },
        isp: 'Acme Inc.'
      };
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockResponse)
        })
      );
  
      document.body.innerHTML = `
       <div id="ip"></div>
       <div id="local"></div>
       <div id="time"></div>
       <div id="isp"></div>
       <div id="map"></div>
      `;
    
      // Mock Leaflet library's L.map, L.tileLayer and map.flyTo functions
      const markerMock = { setLatLng: jest.fn(), addTo: jest.fn(), bindPopup: jest.fn() };
      const tileLayerMock = { addTo: jest.fn() };
      const flyToMock = jest.fn();
      jest.spyOn(L, 'map').mockReturnValue({
        setView: jest.fn(),
        locate: jest.fn(),
        on: jest.fn(),
        removeLayer: jest.fn(),
        flyTo: flyToMock
      });
      jest.spyOn(L, 'tileLayer').mockReturnValue(tileLayerMock);
      jest.spyOn(L, 'marker').mockReturnValue(markerMock);
  
      await fetchData('192.0.2.1');
  
      expect(L.map).toHaveBeenCalledWith(document.getElementById('map'));
      expect(L.tileLayer).toHaveBeenCalledWith(
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        { maxZoom: 19 }
      );
      expect(L.marker).toHaveBeenCalledWith([40.7128, -74.006]);
    
      // Call fetchData again with a different IP address
      await fetchData('198.51.100.1');
  
      expect(document.getElementById('ip').innerHTML).toEqual(
        '<p>IP Address</p><h1>192.0.2.1</h1>'
      );
      expect(document.getElementById('local').innerHTML).toEqual(
        '<p>Location</p><h1>New York City, New York 10001</h1>'
      );
      expect(document.getElementById('time').innerHTML).toEqual(
        '<p>Timezone</p><h1>UTC -05:00</h1>'
      );
      expect(document.getElementById('isp').innerHTML).toEqual(
        '<p>ISP</p><h1>Acme Inc.</h1>'
      );
  
      expect(flyToMock).toHaveBeenCalledWith([47.2343, -120.8767], 13);
      expect(markerMock.setLatLng).toHaveBeenCalledWith([47.2343, -120.8767]);
      expect(markerMock.addTo).toHaveBeenCalled();
      expect(markerMock.bindPopup).toHaveBeenCalledWith(
        '<b>Moses Lake, Washington 98837</b>'
      );
      expect(tileLayerMock.addTo).toHaveBeenCalled();
    });
  
    it('should handle empty input', () => {
      document.body.innerHTML = `
       <input id="search-bar" value="" />
       <button id="search-button">Search</button>
      `;
  
      const handleClick = jest.fn();
      document.getElementById('search-button').addEventListener('click', handleClick);
  
      handleClick();
  
      expect(document.getElementById('search-bar').getAttribute('placeholder')).toEqual(
        'Please enter an IP address'
      );
    });
  });
  

function initMap() 
{
    const clientId = 'aed1d37eab2043c0973e1fbd81f6aec2';
    const clientSecret = '02225197ebe24b5dbc46cbae56a40ef9';

    const australia = { lat: -25.344, lng: 131.036 };
    
    var playlists = [];
    var locations = [
    
        ['Australia', -25, 133],
        ['Sweden', 60, 15],
        ['Albania', 41, 20],
        ['Austria', 47.5, 14.5],
        ['Belgien', 50.5, 4.4],
        ['Bolivia', -16.3, -63.5],
        ['Brazil', -14.2, -51.9],
        ['Bulgaria', 42.7, 25.5],
        ['Chile', -35.6, -71.5],
        ['Colombia', 4.5, -74.3],
        ['Costa Rica', 9.7, -83.7],
        ['Denmark', 56.2, 9.5],
        ['Ecuador', -1.8, -78],
        ['El Salvador', 13.8, -88.9],
        ['Estonia', 58.6, 25],
        ['Finland', 61.9, 25.7],
        ['France', 46.2, 2.2],
        ['Georgia', 42.3, 43.3],
        ['Germany', 51.1, 10.4],
        ['Greece', 39, 21.8],
        ['Guatemala', 15.7, -90.2],
        ['Honduras', 15.2, -86.2],
        ['Iceland', 64.9, -19],
        ['Indonesia', -0.78, 113.9],
        ['India', 20.6, 78.9],
        ['Ireland', 53.1, -7.7],
        ['Israel', 31, 34.8],
        ['Italy', 41.8, 12.5],
        ['Japan', 36.2, 138.2],
        ['Latvia', 56.8, 24.6],
        ['Malaysia', 4.2, 101.9],
        ['Mexico', 23.6, -102.5],
        ['Netherlands', 52.1, 5.3],
        ['New Zealand', -40.9, 174.8],
        ['Norway', 60.4, 8.4],
        ['Panama', 8.5, -80.7],
        ['Paraguay', -23.4, -58.4],
        ['Peru', -9.1, -75],
        ['Poland', 51.9, 19.1],
        ['Portugal', 39.4, -8.2],
        ['Romania', 45.9, 24.9],
        ['Russia', 61.5, 105],
        ['Switzerland', 46.8, 8.2],
        ['Singapore', 1.3, 103.8],
        ['Slovakia', 48.6, 19.7],
        ['Spain', 40.4, -3.7],
        ['United Kingdom', 55.3, -3.4],
        ['South Africa', -30.5, 22.9],
        ['Taiwan', 23.7, 120.9],
        ['Thailand', 15.8, 100.9],
        ['Czechia', 49.8, 15.4],
        ['Turkey', 38.9, 35.2],
        ['Ukraine', 48.3, 31.1],
        ['Hungary', 47.1, 19.5],
        ['Uruguay', -32.5, -55.7],
        ['United States', 37, -95.7],
        ['Vietnam', 14, 108.2],
        ['Dominican Republic', 18.7, -70.1],
        ['Philippines', 12.8, 121.7],
        ['Hong Kong', 22.3, 114.1],
        ['Canada', 56.1, -106.3],
        ['Luxembourg', 49.8, 6.1],
        ['Nicaragua', 12.8, -85.2],
        ['Argentina', -34.6, -63.3]
    
      ];

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: australia,
    });

    init = async () => {

        const token = await getToken();           

        var infowindow = new google.maps.InfoWindow();

        var marker, i;
    
        for (i = 0; i < locations.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });
          const playlist = await getPlaylistByCountry(token, locations[i][0]);
          const wiki = await getWikitext(locations[i][0])
        // add playlists into an array
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(`
              <img src="${wiki.thumbnail.source}" alt="alternatetext">
              <div>
              ${wiki.extract}
              </div>
              <div>
              <iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" 
              //width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
              </div>`);
               
              infowindow.open(map, marker);
            }
          })(marker, i));
      }
    }

    const getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }
    
    const getPlaylistByCountry = async (token, country) => { 
        const result = await fetch(`https://api.spotify.com/v1/search?q="Top%2050%20${country}&type=playlist&limit=1&owner=spotifycharts`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        console.log(data.playlists.items[0]);
        return data.playlists.items[0];
    }    

    const getWikitext = async (country) => { 
        const result = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${country}`, {
            method: 'GET',
        });
        const data = await result.json();
        console.log(data);
        return data;
    }    
    init();
}

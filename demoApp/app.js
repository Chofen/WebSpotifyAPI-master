
function initMap() 
{
    const clientId = 'aed1d37eab2043c0973e1fbd81f6aec2';
    const clientSecret = '02225197ebe24b5dbc46cbae56a40ef9';

    const australia = { lat: -25.344, lng: 131.036 };
    const sweden = { lat: 60, lng: 18};
    var playlists = [];
    var locations = [
        ['Australia', -25, 131, 4],
        ['Sweden', 60, 18, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
      ];
      const DOMElements = {
          // ADD HTML ELEMENTS HERE
        hfToken: '#hidden_token',
       
    };

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: australia,
    });

    init = async () => {

        const token = await getToken();           
        storeToken(token);

        var infowindow = new google.maps.InfoWindow();

        var marker, i;
    
        for (i = 0; i < locations.length; i++) {  
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
          });
          var playlist = getPlaylistByCountry(token, locations[i][0]);
        // add playlists into an array
        //const tracks = await(getTracks(token, playlist.href + "/tracks"));
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(`<iframe src="https://open.spotify.com/embed/playlist/${playlist.id}" 
              width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`);
               
              //infowindow.setContent(locations[i][0])
              infowindow.open(map, marker);
            }
          })(marker, i));
      }
    }

    // private methods
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
        return data.playlists.items[0];
    }    

    const getTracks = async (token, tracksEndPoint) => {

        const limit = 5;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const getTrack = async (token, trackEndPoint) => {
            console.log("endpoint:" + trackEndPoint);
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    const getWikipedia = async(endpoint) => {
        const result = await fetch(`${endpoint}`, {
            method: 'GET',
        });

        const data = await result.json();
        return data;
    }
    
    function storeToken(value) 
    {
        document.querySelector(DOMElements.hfToken).value = value;
    }

    function getStoredToken() 
    {
        return {
            token: document.querySelector(DOMElements.hfToken).value
        }
    }
    init();
}

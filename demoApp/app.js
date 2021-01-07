const APIController = (function() {
    
    const clientId = 'aed1d37eab2043c0973e1fbd81f6aec2';
    const clientSecret = '02225197ebe24b5dbc46cbae56a40ef9';


    // private methods
    const _getToken = async () => {

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
    
    const _getPlaylistByCountry = async (token, country) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q="Top%2050%20${country}&type=playlist&limit=1&owner=spotifycharts`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items[0];
    }

    

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = 5;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
            console.log("endpoint:" + trackEndPoint);
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
    }

    const _getWikipedia = async(endpoint) => {
        const result = await fetch(`${endpoint}`, {
            method: 'GET',
        });

        const data = await result.json();
        return data;
    }

    return {
        getToken() {
            return _getToken();
        },
       
        getPlaylistByCountry(token, country) {
            return _getPlaylistByCountry(token, country);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
    }
})();


// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        inputCountry: '#country',
        spotifyPlayer: '#spotifyPlayer',
        map: '#map'
    };

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                country: document.querySelector(DOMElements.inputCountry),
                spotifyPlayer: document.querySelector(DOMElements.spotifyPlayer),
                mapView: document.querySelector(DOMElements.map)
            }
        },

        createPlaylist(playlistID) {
            //const html = `<option value="${value}">${text}</option>`;
            //document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
            const spotifyPrew = document.querySelector(DOMElements.spotifyPlayer)
            spotifyPrew.innerHTML = ''; // reset
            // create a inbedded spotify player and open the playlist
            const html = `<iframe src="https://open.spotify.com/embed/playlist/${playlistID}" width="300" height="380"
             frameborder="0"allowtransparency="true"
              allow="encrypted-media"></iframe>`;
            
            spotifyPrew.insertAdjacentHTML('beforeend',html);
        },

        createTracks(tracks, length){
            const spotifyPrew = document.querySelector(DOMElements.spotifyPlayer)
            spotifyPrew.innerHTML = ''; // reset    
            for (i = 0; i < 5; i++) {
                const html = `<iframe src="https://open.spotify.com/embed/track/${tracks[i]}"
                 width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
                 spotifyPrew.insertAdjacentHTML('beforeend', html)
            }
        },

        // need method to create a track list group item 
        createTrack(trackID) {
            const spotifyPrew = document.querySelector(DOMElements.spotifyPlayer);
            const html = `<iframe src="https://open.spotify.com/embed/track/${trackID}"
                 width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
                spotifyPrew.insertAdjacentHTML('beforeend', html)
        },

        clearTracks()
        {
            const spotifyPrew = document.querySelector(DOMElements.spotifyPlayer);
            spotifyPrew.innerHTML = '';
        },

        // need method to create the song detail
        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;
            detailDiv.insertAdjacentHTML('beforeend', html)

        },
        // creates the Google Maps
        createMap(countryName) 
        {

        const map = document.querySelector(DOMElements.map);
        map.innerHTML = '';
        const html =               
            `<iframe
            width="600"
            height="450"
            frameborder="0" style="border:0"
            src="https://www.google.com/maps/embed/v1/place?key=
            AIzaSyDOM4UOXcIRRErjQuoaZqmiYZ7lsvDstig  
            &q=${countryName}" allowfullscreen>
            </iframe>`
            map.insertAdjacentHTML('beforeend', html);

        },

        createWikipedia()
        {

        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
            this.inputField().spotifyPlayer.innerHTML = '';
        },

        resetCountry(){
            
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().spotifyPlayer.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        },
        getCountry() {
            console.log(document.querySelector(DOMElements.inputCountry).value);
            return document.querySelector(DOMElements.inputCountry).value
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();
    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        UICtrl.storeToken(token);
        UICtrl.resetPlaylist();
        UICtrl.resetCountry();
       
    }

    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token; 
        const countryName = UICtrl.getCountry();
     
        // get the playlist based on a genre
        const playlist = await(APICtrl.getPlaylistByCountry(token, countryName));  
        console.log(playlist.href + "/tracks");
       const tracks = await(APICtrl.getTracks(token, playlist.href + "/tracks"));

        UICtrl.resetTracks();
        for (i = 0; i < 5; i++) {
            var track = tracks[i].track;
            UICtrl.createTrack(track.id);
        }

        // Add an embedded google map with the selected country
        UICtrl.createMap(countryName);
        
    });

    return {
        init() {
            console.log('App is starting');
            loadGenres();
        }
    }

})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();








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
        return data.playlists.items;
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
        inputCountry: '#tf_country',
        spotifyPlayer: '#spotifyPlayer'
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
                inputCountry: document.querySelector(DOMElements.tf_country),
                spotifyPlayer: document.querySelector(DOMElements.spotifyPlayer)
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
        createTrack(id) {
            const spotifyPrew = document.querySelector(DOMElements.spotifyPlayer);
            spotifyPrew.innerHTML = '';
            console.log("ID= " + id);
            const html = `<iframe src="https://open.spotify.com/embed/track/${id}"
                 width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
                spotifyPrew.insertAdjacentHTML('beforeend', html)
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

        createWikipedia()
        {

        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
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
        },

        linkWikipedia()
        {
            // code
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get genres on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the genres
         UICtrl.resetPlaylist();
        //get the token that's stored on the page   
        // get the genre id associated with the selected genre
    }

    // create genre change event listener


    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        const token = UICtrl.getStoredToken().token; 
        const countryName = UICtrl.getCountry();
     
        // ge the playlist based on a genre
        const playlist = await(APICtrl.getPlaylistByCountry(token, countryName));  
        console.log(playlist)     
        // create a playlist list item for every playlist returned
        //playlist.forEach(p => UICtrl.createPlaylist(p.id)); // create spotify playlist
        console.log("href= " + playlist[0].tracks.href);
        
        for (i = 0; i < 5; i++) {
            const track = APICtrl.getTrack(token, playlist[0].tracks.href);
            UICtrl.createTrack(track.id);
        }
    
        //get the token
        // get the playlist field
        //const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        //const tracksEndPoint = APICtrl.getListOfTracks();
        // get the list of tracks
        //const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        //tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
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





import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "react-spotify-web-playback";
import "./App.css";
import Login from "./component/Login";

function App() {
  const [token, setToken] = useState(null);
  const [searchTrack, setSearchTrack] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [uriLecteur, setUriLecteur] = useState("");
  const [booleanPlayer, setBooleanPlayer] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [dataTrackPlaylist, setDataTrackPlaylist] = useState([]);
  const [togglePlaylistSearch, settogglePlaylistSearch] = useState(false);

  const clientId = "c116f2f89bb64ccebd9dcf647b261fbd";
  const clientSecret = "c116f2f89bb64ccebd9dcf647b261fbd";
  const redirectUri = "http://localhost:3000/succes";

  // autorization api
  const scope = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "streaming",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-library-read",
    "playlist-read-collaborative",
  ];

  useEffect(() => {
    var accessToken = getAccessToken();
    if (accessToken) {
      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(accessToken);
      if (token) {
        getPlaylist();
      }
    }
  }, [token]);

  var getAccessToken = async () => {
    var accessToken = window.location.href.match(/access_token=([^&]*)/);
    var expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken && expiresIn) {
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      setToken(accessToken[1]);
      // window.history.pushState("Access Token", null, "/");
      // getPlaylist();
      return accessToken[1];
    } else {
      return null;
    }
  };

  const login = () => {
    var stateKey = "spotify_auth_state";

    localStorage.setItem(stateKey, "djfndhsksoekdlfm");

    var url = "https://accounts.spotify.com/authorize";
    url += "?response_type=token";
    url += "&client_id=" + encodeURIComponent(clientId);
    url += "&scope=" + encodeURIComponent(scope);
    url += "&redirect_uri=" + encodeURIComponent(redirectUri);
    url += "&state=" + encodeURIComponent("gfdfdh");

    window.location = url;
  };

  const search = async () => {
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    await spotifyApi.searchTracks(searchTrack).then(
      function (data) {
        console.log("Search by " + searchTrack, data.body);
        setDataSearch(data.body.tracks.items);
        settogglePlaylistSearch(true);
      },
      function (err) {
        console.error(err);
      }
    );
  };

  const play = async (uri) => {
    if (uri !== uriLecteur) {
      setUriLecteur(uri);
      if (booleanPlayer === false) {
        setBooleanPlayer(true);
      } else {
        setBooleanPlayer(false);
      }
      console.log("player status" + booleanPlayer);
      console.log(uriLecteur);
    }
  };

  // require playlist user spotify
  const getPlaylist = async () => {
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    await spotifyApi.getUserPlaylists().then(
      function (data) {
        console.log("Retrieved playlists", data.body);
        setPlaylist(data.body.items);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };

  // get track playli
  const getTrackPlaylist = async (id) => {
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    await spotifyApi.getPlaylistTracks(id).then(
      function (data) {
        console.log("Retrieved tracks", data.body);
        setDataTrackPlaylist(data.body.items);
        settogglePlaylistSearch(false);
      },
      function (err) {
        console.log("Something went wrong!", err);
      }
    );
  };

  return (
    <div className="container-first-spotify">
      {token ? (
        <>
          <div className="container-spotify">
            <div className="header-spotify">
              <img
                className="spotify-img"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
              />
              <input
                type="text"
                placeholder="search"
                className="input-spotify"
                onChange={(e) => {
                  setSearchTrack(e.target.value);
                  search();
                }}
              />
            </div>
          </div>
          <div className="container-playlist-and-track">
            <div className="container-playlist">
              <h1>Playlist</h1>
              {playlist.map((item, index) => (
                <div
                  key={index}
                  className="playlist"
                  onClick={() => getTrackPlaylist(item.id)}
                >
                  {/* <img src={item.images[0].url} /> */}
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            {togglePlaylistSearch ? (
              <div className="container-track">
                <h1>Search</h1>
                {dataSearch.map((item, index) => (
                  <div
                    onClick={() => play(item.uri)}
                    key={index}
                    className="track"
                  >
                    <img className="track-img" src={item.album.images[0].url} />
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="container-track">
                <h1>Track</h1>
                {dataTrackPlaylist.map((item, index) => (
                  <div
                    key={index}
                    className="track"
                    onClick={() => play(item.track.uri)}
                  >
                    <img
                      className="track-img"
                      src={item.track.album.images[0].url}
                    />
                    <p>{item.track.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="player-spotify">
            <SpotifyPlayer
              token={token}
              uris={uriLecteur}
              autoPlay={booleanPlayer}
              play={booleanPlayer}
              // callback={(state) => {
              //   if (!state.isPlaying) setBooleanPlayer(false);
              // }}
              styles={{
                activeColor: "#fff",
                bgColor: "#333",
                color: "#fff",
                loaderColor: "#fff",
                sliderColor: "#1cb954",
                trackArtistColor: "#ccc",
                trackNameColor: "#fff",
              }}
            />
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

//   return (
//     <>
//       {token ? (

//       ) : null}
//       <div className="container-spotify">
//         {token ? (
//           <></>
//         ) : (
//           <div className="login-spotify">
//             <img
//               className="spotify-img"
//               src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
//             />
//             <button className="button-spotify" onClick={login}>
//               Se connecter à spotify
//             </button>
//           </div>
//         )}

//         {token ? (
//           <>
//             <div className="player-spotify">
//               <SpotifyPlayer
//                 token={token}
//                 uris={uriLecteur}
//                 autoPlay={booleanPlayer}
//                 play={booleanPlayer}
//                 callback={(state) => {
//                   if (!state.isPlaying) setBooleanPlayer(false);
//                 }}
//                 styles={{
//                   activeColor: "#fff",
//                   bgColor: "#333",
//                   color: "#fff",
//                   loaderColor: "#fff",
//                   sliderColor: "#1cb954",
//                   trackArtistColor: "#ccc",
//                   trackNameColor: "#fff",
//                 }}
//               />
//             </div>
//           </>
//         ) : null}

//         <div className="container-track">
//           {dataSearch.map((item) => (
//             <div
//               onClick={() => {
//                 play(item.uri);
//               }}
//               className="track"
//               key={item.uri}
//             >
//               {/* <img className="track-img" src={item.album.images[0].url} /> */}
//               <p>
//                 {item.name} - {item.artists[0].name}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

export default App;

import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [searchTrack, setSearchTrack] = useState("");
  const [dataSearch, setDataSearch] = useState([]);

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
  ];

  useEffect(() => {
    var accessToken = getAccessToken();
    if (accessToken) {
      const spotify = new SpotifyWebApi();
      spotify.setAccessToken(accessToken);
      spotify.getMe().then((user) => {
        console.log(user);
      });
    }
  }, []);

  var getAccessToken = () => {
    var accessToken = window.location.href.match(/access_token=([^&]*)/);
    var expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken && expiresIn) {
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      setToken(accessToken[1]);
      // window.history.pushState("Access Token", null, "/");
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
      },
      function (err) {
        console.error(err);
      }
    );
  };

  const play = async (uri) => {
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    //play uri song spotify
    await spotifyApi
      .play({
        uris: [uri],
      })
      .then(
        function (data) {
          console.log("Playing something!");
          // console log name song playing
          // console.log(data.body);
          console.log(data);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  };

  return (
    <div className="App">
      {token ? (
        <>
          Vous êtes connecté à spotify<br></br>
        </>
      ) : (
        <button onClick={login}>Login</button>
      )}

      {token ? (
        <>
          <input
            type="text"
            placeholder="search"
            onChange={(e) => setSearchTrack(e.target.value)}
          />
          <button onClick={() => search()}>Search</button>
        </>
      ) : null}

      {dataSearch ? (
        <>
          {dataSearch.map((item) => (
            <div key={item.uri}>
              <img src={item.album.images[0].url} />
              <p>{item.name}</p>
              <p>{item.artists[0].name}</p>

              <button
                onClick={() => {
                  play(item.uri);
                }}
              >
                Play
              </button>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
}

export default App;

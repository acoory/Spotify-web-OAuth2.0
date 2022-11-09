import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import SpotifyPlayer from "react-spotify-web-playback";
import "./App.css";
import Login from "./component/Login";

function App() {
  const [token, setToken] = useState(null);

  //data search
  const [searchTrack, setSearchTrack] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [dataSearchAlbum, setDataSearchAlbum] = useState([]);
  const [dataSearchArtist, setDataSearchArtist] = useState([]);

  const [category, setCategory] = useState("Track");

  const [uriLecteur, setUriLecteur] = useState("");
  const [booleanPlayer, setBooleanPlayer] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [dataTrackPlaylist, setDataTrackPlaylist] = useState([]);
  const [togglePlaylistSearch, settogglePlaylistSearch] = useState(false);
  const [offset, setOffset] = useState(1);
  const [uriPlaylist, seturiPlaylist] = useState("");

  const clientId = process.env.clientId;
  const clientSecret = process.env.clientSecret;
  const redirectUri = process.env.redirectUri;

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
    "playlist-read-collaborative",
    "user-library-read",
    "user-library-modify",
    "user-read-recently-played",
    "user-follow-read",
    "user-follow-modify",
    "user-read-playback-position",
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
  }, [token, uriLecteur, booleanPlayer]);

  const getAccessToken = async () => {
    var accessToken = window.location.href.match(/access_token=([^&]*)/);
    var expiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (accessToken && expiresIn) {
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      setToken(accessToken[1]);
      return accessToken[1];
    } else return null;
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
    await spotifyApi
      .searchTracks(searchTrack)
      .then((data) => {
        console.log("Search by " + searchTrack, data.body);
        setDataSearch(data.body.tracks.items);
        settogglePlaylistSearch(true);
      })
      .catch((err) => {
        console.log(err);
      });

    await spotifyApi.searchAlbums(searchTrack).then((data) => {
      console.log("Search by " + searchTrack, data.body);
      setDataSearchAlbum(data.body.albums.items);
      settogglePlaylistSearch(true);
    });

    await spotifyApi.searchArtists(searchTrack).then((data) => {
      console.log("Search by " + searchTrack, data.body);
      setDataSearchArtist(data.body.artists.items);
      settogglePlaylistSearch(true);
    });
  };

  const play = async (uri) => {
    if (uri !== uriLecteur) {
      setUriLecteur(uri);
      setTimeout(() => {
        if (booleanPlayer === false) setBooleanPlayer(true);
        else setBooleanPlayer(false);
      }, 2);
    }
  };

  const getPlaylist = async () => {
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    await spotifyApi
      .getUserPlaylists({
        limit: 50,
      })
      .then(
        function (data) {
          console.log("Retrieved playlists", data.body);
          setPlaylist(data.body.items);
        },
        function (err) {
          console.log("Something went wrong!", err);
        }
      );
  };

  const getTrackPlaylist = async (id) => {
    seturiPlaylist(id);
    console.log("id playlist" + id);
    var spotifyApi = new SpotifyWebApi({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUri: redirectUri,
    });
    spotifyApi.setAccessToken(token);
    await spotifyApi
      .getPlaylistTracks(id, {
        limit: 10,
        offset: offset,
      })
      .then((data) => {
        if (id === uriPlaylist) {
          setOffset(10 + offset);
          setDataTrackPlaylist(
            dataTrackPlaylist.length > 0
              ? dataTrackPlaylist.concat(data.body.items)
              : data.body.items
          );
        } else {
          setOffset(0);
          setDataTrackPlaylist(data.body.items);
        }

        settogglePlaylistSearch(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const selectCategory = ["Track", "Album", "Artist"];

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
                <div className="container-select">
                  {selectCategory.map((item, index) => (
                    <div
                      onClick={() => setCategory(item)}
                      key={index}
                      className="select-category"
                      style={{
                        backgroundColor:
                          category === item
                            ? "rgb(0, 0, 0)"
                            : "rgb(255, 255, 255)",
                        color:
                          category === item
                            ? "rgb(255, 255, 255)"
                            : "rgb(0, 0, 0)",
                      }}
                    >
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
                {category === "Track" ? (
                  <div className="container-track-search">
                    {dataSearch.map((item, index) => (
                      <div
                        key={index}
                        className="track"
                        onClick={() => play(item.uri)}
                      >
                        <img
                          className="track-img "
                          src={item.album.images[0].url}
                        />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {category === "Album" ? (
                  <div className="container-track-search-album">
                    {dataSearchAlbum.map((item, index) => (
                      <div
                        key={index}
                        className="track-search"
                        onClick={() => play(item.uri)}
                      >
                        <img className="album-img" src={item.images[0].url} />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {category === "Artist" ? (
                  <div className="container-track-search">
                    {dataSearchArtist.map((item, index) => (
                      <div
                        key={index}
                        className="track-search"
                        onClick={() => play(item.uri)}
                      >
                        <img src={item.images[0].url} />
                        <p>{item.name}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                {/* 
                <div className="container-album-search">
                  {dataSearchAlbum.map((item, index) => (
                    <div key={index} className="album-search">
                      <img className="img-album" src={item.images[0].url} />
                      <p>{item.name}</p>
                    </div>
                  ))}
                </div>

                {dataSearch.map((item, index) => (
                  <div
                    onClick={() => play(item.uri)}
                    key={index}
                    className="track"
                  >
                    <img className="track-img" src={item.album.images[0].url} />
                    <p>{item.artists.map((item) => item.name)}</p>
                    <p>{item.name} </p>
                  </div>
                ))} */}
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
                    {item.track.album.images[0] ? (
                      <img
                        className="track-img"
                        src={item.track.album.images[0].url}
                      />
                    ) : (
                      <img
                        className="track-img"
                        src="https://www.lesinrocks.com/wp-content/uploads/2019/11/spotify.jpg"
                      />
                    )}
                    <p>{item.track.name}</p>
                  </div>
                ))}
                {uriPlaylist.length > 0 ? (
                  <button
                    className="next-offset-button"
                    onClick={() => getTrackPlaylist(uriPlaylist)}
                  >
                    Suivant
                  </button>
                ) : null}
              </div>
            )}
          </div>
          <div className="player-spotify">
            <SpotifyPlayer
              token={token}
              uris={uriLecteur}
              autoPlay={booleanPlayer}
              play={booleanPlayer}
              showSaveIcon={true}
              syncExternalDevice={5}
              callback={(state) => {
                if (!state.isPlaying) {
                  setBooleanPlayer(() => false);
                }
              }}
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

export default App;

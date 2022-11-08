import React from "react";

export default function Login() {
  const clientId = "c116f2f89bb64ccebd9dcf647b261fbd";
  const clientSecret = "c116f2f89bb64ccebd9dcf647b261fbd";
  const redirectUri = "http://localhost:3000/succes";

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
  ];

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
  return (
    <div className="login-spotify">
      <img
        className="spotify-img"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
      />
      <button className="button-spotify" onClick={login}>
        Se connecter à spotify
      </button>
    </div>
  );
}

import React from "react";

export default function Header() {
  return (
    <div className="header-spotify">
      <img
        className="spotify-img"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png"
      />
      <input
        type="text"
        placeholder="search"
        className="input-spotify"
        onChange={(e) => setSearchTrack(e.target.value)}
      />
      <button onClick={() => search()}>Search</button>
    </div>
  );
}

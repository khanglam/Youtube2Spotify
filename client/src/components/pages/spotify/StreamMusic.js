import { React, useState, useEffect, useContext } from "react";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import Axios from "../../Axios";
import { TokenInfo } from "./TokenInfo";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";

const spotifyApi = new SpotifyWebApi({
  // clientId: "2acabd8b4233495ebcd8c55daeb602f0",
});

function StreamMusic() {
  const tokenInfo = useContext(TokenInfo);
  const accessToken = tokenInfo["access_token"];
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  // Fetch Lyrics
  useEffect(() => {
    (async () => {
      try {
        if (!playingTrack) return;
        const response = await Axios.get("spotifyLyrics", {
          params: {
            track: playingTrack.title,
            artist: playingTrack.artist
          }
        });
        setLyrics(response.data.lyrics);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Update Search Results
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    let cancel = false;
    // reduce - a function in js that basically works like for loops.
    // it loops through each item and collapse into 1 item. Reduce takes in 2 param:
    // 1st - accumulator (what we are reducing our value down to).
    // 2nd - individual item we're looping through.

    // map - a function to "selectively" add certain items to the array.
    // In this case we are doing this because we don't need all the elements in
    // track array. mapping is used to only select artist, title, uri and albumUrl.
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest; // whatever is returned will be the new accumulator for next iteration (reduce)
            },
            track.album.images[0] // starting point (reduce)
          );
          return {
            // return for map
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url
          };
        })
      );
    });

    // cleanup return. If you are typing in the search, it will trigger this cleanup, thus canceling the request.
    // The request will only be made once the user stops typing because that's the only time cancel is false.
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container className='d-flex flex-column' style={{ height: "90vh" }}>
      <Form.Control
        type='search'
        placeholder='Search Songs/Artists'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className='flex-grow-1 my-2' style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div
            className='text-center'
            style={{
              whiteSpace: "pre",
              fontFamily: "Comic Sans",
              fontSize: "25px"
            }}
          >
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}

export default StreamMusic;

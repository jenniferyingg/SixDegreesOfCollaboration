import { access } from "fs";
import querystring from "querystring";

let access_token = "";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();
};

const callProtectedSpotifyAPI = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(response.statusText);
    }
    access_token = (await getAccessToken()).access_token;
    return callProtectedSpotifyAPI(url);
  }
  return response.json();
}

export const searchArtists = async (name: string) => {
  var search = name.split(" ").join("+");
  return callProtectedSpotifyAPI(`https://api.spotify.com/v1/search?q=${search}&type=artist&limit=5`);
};

export const fetchArtistAlbums = async (id: string, offset: number) => {
  const albumsEndpoint = `https://api.spotify.com/v1/artists/${id}/albums`;
  const albumsParams = `include_groups=album,single,appears_on&limit=50&market=US&locale=en-US&offset=`;
  return callProtectedSpotifyAPI(albumsEndpoint + "?" + albumsParams + offset);
};

export const getArtist = async (id: string) => {
  return callProtectedSpotifyAPI(`https://api.spotify.com/v1/artists/${id}`);
};

export const getAlbum = async (id: string) => {
  return callProtectedSpotifyAPI(`https://api.spotify.com/v1/albums/${id}`);
};

export const getAlbums = async (ids: string[]) => {
  const albumsEndpoint = `https://api.spotify.com/v1/albums/`;
  const albumsParams = `ids=${ids.join(",")}`;
  return callProtectedSpotifyAPI(albumsEndpoint + "?" + albumsParams);
};

export const getTracks = async (id: string, offset: number) => {
  const tracksEndpoint = `https://api.spotify.com/v1/albums/${id}/tracks`;
  const tracksParams = `limit=50&market=US&locale=en-US&offset=`;
  return callProtectedSpotifyAPI(tracksEndpoint + "?" + tracksParams + offset);
};

export const getTopArtists = async () => {
  return callProtectedSpotifyAPI(`https://api.spotify.com/v1/search?q=year%3A2023&type=artist&market=US&limit=50`);
};


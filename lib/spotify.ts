import querystring from "querystring";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
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

export const searchArtists = async (name: string) => {
  var search = name.split(" ").join("+");
  const searchArtistEndpoint = `https://api.spotify.com/v1/search?q=${search}&type=artist&limit=5`;
  const { access_token } = await getAccessToken();
  const response = await fetch(searchArtistEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const fetchArtistAlbums = async (id: string, offset: number) => {
  const albumsEndpoint = `https://api.spotify.com/v1/artists/${id}/albums`;
  const albumsParams = `include_groups=album,single,appears_on&limit=50&market=US&locale=en-US&offset=`;
  const { access_token } = await getAccessToken();
  const response = await fetch(albumsEndpoint + "?" + albumsParams + offset, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const getArtist = async (id: string) => {
  const albumEndpoint = `https://api.spotify.com/v1/artists/${id}`;
  const { access_token } = await getAccessToken();
  const response = await fetch(albumEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const getAlbum = async (id: string) => {
  const albumEndpoint = `https://api.spotify.com/v1/albums/${id}`;
  const { access_token } = await getAccessToken();
  const response = await fetch(albumEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const getAlbums = async (ids: string[]) => {
  const albumsEndpoint = `https://api.spotify.com/v1/albums/`;
  const albumsParams = `ids=${ids.join(",")}`;
  const { access_token } = await getAccessToken();
  const response = await fetch(albumsEndpoint + "?" + albumsParams, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const getTracks = async (id: string, offset: number) => {
  const tracksEndpoint = `https://api.spotify.com/v1/albums/${id}/tracks`;
  const tracksParams = `limit=50&market=US&locale=en-US&offset=`;
  const { access_token } = await getAccessToken();
  const response = await fetch(tracksEndpoint + "?" + tracksParams + offset, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

export const getTopArtists = async () => {
  const artistEndpoint = `https://api.spotify.com/v1/search?q=year%3A2023&type=artist&market=US&limit=50`;
  const { access_token } = await getAccessToken();
  const response = await fetch(artistEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};

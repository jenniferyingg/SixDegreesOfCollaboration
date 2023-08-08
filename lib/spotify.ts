import querystring from 'querystring';
 
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
 
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
 
const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });
  return response.json();
};
 
export const searchArtists = async (name: string) => {
  var search = name.split(' ').join('+');
  const searchArtistEndpoint = `https://api.spotify.com/v1/search?q=${search}&type=artist&limit=5`;
  const { access_token } = await getAccessToken();
  const response = await fetch(searchArtistEndpoint, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return response.json();
};
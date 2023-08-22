import {
  getTopArtists,
  getAlbums,
  fetchArtistAlbums,
  getArtist,
} from "../lib/spotify";
import neo4j, { Driver } from "neo4j-driver";
import Artist from "../components/types/Artist";
import Collaboration from "../components/types/Collaboration";
const uri = process.env.NEO4J_URI + "";
const username = process.env.NEO4J_USERNAME + "";
const password = process.env.NEO4J_PASSWORD + "";
const driver: Driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

let artist_album_call_time = 0;
let album_call_time = 0;
let artist_album_calls: number = 0;
let album_calls: number = 0;

export async function populate(): Promise<void> {
  const session = driver.session();

  try {
    const response = await getTopArtists();
    const topArtists = response.artists.items;
    for (const artist of topArtists) {
      const collaborations = await getCollaborations(artist.id);
      console.log(collaborations.length, artist.id, artist.name);
      // Create the artist node
      await session.run("MERGE (artist:Artist { id: $id, name: $name })", {
        id: artist.id,
        name: artist.name,
      });

      for (const collaborator of collaborations) {
        // Create the collaborator node
        await session.run("MERGE (artist:Artist { id: $id, name: $name })", {
          id: collaborator.artist2.id,
          name: collaborator.artist2.name,
        });

        // Create the song node
        await session.run("MERGE (song:Song { id: $id, name: $name })", {
          id: collaborator.track.id,
          name: collaborator.track.name,
        });

        // Create relationship between artist1 and song
        await session.run(
          "MATCH (artist:Artist { id: $artistId }), (song:Song { id: $songId }) MERGE (artist)-[:PERFORMED]->(song)",
          {
            artistId: artist.id,
            songId: collaborator.track.id,
          }
        );

        // Create relationship between artist2 and song
        await session.run(
          "MATCH (artist:Artist { id: $artistId }), (song:Song { id: $songId }) MERGE (artist)-[:PERFORMED]->(song)",
          {
            artistId: collaborator.artist2.id,
            songId: collaborator.track.id,
          }
        );
      }
    }
  } finally {
    await session.close();
  }

  driver.close();
}

async function getCollaborations(artistId: string): Promise<Collaboration[]> {
  let time = new Date().getTime();
  const collaborations = new Set<Collaboration>();
  const albums = await getAlbumsFromArtist(artistId);
  const artistResponse = await getArtist(artistId);
  const artist: Artist = {
    name: artistResponse.name,
    id: artistId,
  };
  await getCollaborationsFromAlbums(albums, artist, collaborations);

  return Array.from(collaborations.values());
}

async function getAlbumsFromArtist(artistId: string): Promise<string[]> {
  const albumIds: string[] = [];
  for (let albumOffset = 0; ; albumOffset += 50) {
    let time = new Date().getTime();
    const albums = await fetchArtistAlbums(artistId, albumOffset);
    time = new Date().getTime() - time;
    artist_album_calls++;
    artist_album_call_time += time;
    if (Object.keys(albums.items).length === 0) break;
    for (const album of albums.items) {
      albumIds.push(album.id);
    }
  }
  return albumIds;
}

async function getCollaborationsFromAlbums(
  albumIds: string[],
  artist1: Artist,
  collabs: Set<Collaboration>
) {
  for (let i = 0; i < albumIds.length; i += 20) {
    let time = new Date().getTime();
    const fullAlbums = await getAlbums(albumIds.slice(i, i + 20));
    time = new Date().getTime() - time;
    album_calls++;
    album_call_time += time;
    for (const album of fullAlbums.albums) {
      if (album.album_type === `compilation`) {
        continue;
      }
      for (const track of album.tracks.items) {
        addTrackIfValid(track, artist1, collabs);
      }
    }
  }
}

async function addTrackIfValid(
  track: any,
  artist1: Artist,
  collabs: Set<Collaboration>
) {
  if (Object.keys(track.artists).length <= 1) {
    return;
  }
  let containsArtist: boolean = false;
  for (const collaborator of track.artists) {
    if (collaborator.id == artist1.id) {
      containsArtist = true;
      break;
    }
  }
  if (containsArtist) {
    for (const collaborator of track.artists) {
      if (collaborator.id != artist1.id) {
        const newCollaboration: Collaboration = {
          track: {
            name: track.name,
            id: track.id,
          },
          artist1: artist1,
          artist2: {
            name: collaborator.name,
            id: collaborator.id,
          },
        };
        collabs.add(newCollaboration);
      }
    }
  }
}

populate()
  .then(() => {
    console.log("Data populated into Neo4j");
  })
  .catch((error) => {
    console.error("Error populating Neo4j:", error);
  });

import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchArtistAlbums, getAlbums, getArtist } from '../../lib/spotify';
import Collaboration from '../../components/types/Collaboration';
import Artist from '../../components/types/Artist';
import Track from '../../components/types/Track';
import { findShortestPath, doesArtistExist } from '../../lib/neo4j'
import { time } from 'console';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string[]>) {
    if (req.method === 'POST') {
        try {
            const { artistId1, artistId2 } = JSON.parse(req.body);
            const path = await getCollabPath(artistId1, artistId2);
            res.status(200).json(path);
        } catch (error) {
            console.log(error.message)
            res.status(400).json([]);
        }
    } else {
        res.status(405).json([]);
    }
}

async function getCollabPath(artistId1: string, artistId2: string): Promise<(Artist | Track)[]> {
    const artist1Exists = await doesArtistExist(artistId1);
    const artist2Exists = await doesArtistExist(artistId2);
    
    if (!artist1Exists && !artist2Exists) {
        const collaborations = await getCollaborations(artistId1);
        for (const collab of collaborations) {
            if (collab.artist2.id === artistId2) {
                return [collab.artist1, collab.track, collab.artist2];
            }
        }
    }

    const path = await getCollabPathNeo4j(artistId1, artistId2);
    for (let i = 0; i < path.length; i += 2) {
        console.log(i)
        const fullArtist = await getArtist(path[i].id);
        (<Artist>path[i]).image = fullArtist.images.length > 0 ? fullArtist.images[0].url : undefined

    }
    console.log(path)

    return path;
}

async function getCollabPathNeo4j(artistId1: string, artistId2: string): Promise<(Artist | Track)[]> {
    const artistFull1 = await getArtist(artistId1);
    const artist1: Artist = {
        name: artistFull1.name,
        id: artistFull1.id,
        popularity: artistFull1.popularity
    }
    const forwardPath = await artistPathToNeo4jDFS([artist1], new Set<string>([artist1.id]));
    const lastForwardPathArist = forwardPath.pop();

    const artistFull2 = await getArtist(artistId2);
    const artist2: Artist = {
        name: artistFull2.name,
        id: artistFull2.id,
        popularity: artistFull2.popularity
    }
    const backPath = await artistPathToNeo4jDFS([artist2], new Set<string>([artist2.id]));
    const lastBackPathArist = backPath.pop();
    backPath.reverse();

    const midPath = await findShortestPath(lastForwardPathArist.id, lastBackPathArist.id);
    return [...forwardPath, ...midPath, ...backPath];

}

async function artistPathToNeo4jDFS(path: (Artist | Track)[], visitedIds: Set<string>): Promise<(Artist | Track)[]> {
    const curArtist = path[path.length - 1];
    const exists = await doesArtistExist(curArtist.id);
    if (exists) {
        return path;
    }
    const collaborations = await getCollaborations(curArtist.id);
    collaborations.sort((collab1, collab2) => collab2.artist2.popularity - collab1.artist2.popularity);

    for (const collab of collaborations) {
        if (! visitedIds.has(collab.artist2.id)) {
            const exists = await doesArtistExist(collab.artist2.id);
            if (exists) {
                path.push(collab.track);
                path.push(collab.artist2);
                const newPath = await artistPathToNeo4jDFS(path, visitedIds);
                if (newPath.length > 0) return newPath;
                path.pop();
                path.pop();
            }    
        }
    }

    for (const collab of collaborations) {
        if (! visitedIds.has(collab.artist2.id)) {
            visitedIds.add(collab.artist2.id)
            path.push(collab.track);
            path.push(collab.artist2);
            const newPath = await artistPathToNeo4jDFS(path, visitedIds);
            if (newPath.length > 0) return newPath;
            path.pop();
            path.pop();
        }
    }
    return [];
}

async function getCollaborations(artistId: string): Promise<Collaboration[]> {
    let time = new Date().getTime();
    const collaborations = new Set<Collaboration>();
    const albums = await getAlbumsFromArtist(artistId);
    const artistResponse = await getArtist(artistId);
    const artist: Artist = {
        name: artistResponse.name,
        id: artistId,
        popularity: artistResponse.popularity
    }
    await getCollaborationsFromAlbums(albums, artist, collaborations);
    return Array.from(collaborations.values());
}

async function getAlbumsFromArtist(artistId: string): Promise<string[]> {
    const albumIds: string[] = [];
    for (let albumOffset = 0 ; ; albumOffset += 50) {
        const albums = await fetchArtistAlbums(artistId, albumOffset);
        if (Object.keys(albums.items).length === 0) break;
        for (const album of albums.items) {
            albumIds.push(album.id);
        }
    }
    return albumIds;
}

async function getCollaborationsFromAlbums(albumIds: string[], artist1: Artist, collabs: Set<Collaboration>) {
    for (let i = 0; i < albumIds.length; i+=20) {
        const fullAlbums = await getAlbums(albumIds.slice(i, i+20));
        for (const album of fullAlbums.albums) {
            if (album.album_type === `compilation`) {
                continue;
            }
            for (const track of album.tracks.items) {
                addTrackIfValid(track, artist1, collabs)
            }
        }
    }
}

async function addTrackIfValid(track, artist1: Artist, collabs: Set<Collaboration>) {
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
                        popularity: (await getArtist(collaborator.id)).popularity
                    }
                }
                collabs.add(newCollaboration);
            }
        }
    }
}
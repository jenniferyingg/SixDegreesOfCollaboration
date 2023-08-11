import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchArtistAlbums, getAlbums, getArtist } from '../../lib/spotify';
import Collaboration from '../../components/interfaces/Collaboration';
import Artist from '../../components/interfaces/Artist';
import Queue from '../../utils/Queue';

let artist_album_call_time = 0;
let album_call_time = 0;
let artist_album_calls: number = 0;
let album_calls: number = 0;

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

async function getCollabPath(artistId1: string, artistId2: string): Promise<Collaboration[]> {
    return getCollabPathBFS(artistId1, artistId2, new Queue<Collaboration[]>(), new Set<string>());
}

function printPath(collabs: Collaboration[]) {
    console.log("--CURRENT PATH--")
    let i : number = 0;
    for (const collab of collabs) {
        console.log(i + ". Artist1: " + collab.artist1.name + ", Artist2: " + collab.artist2.name)
    }
    console.log("------END------")
}

async function getCollabPathBFS(artistId1: string, artistId2: string, queue: Queue<Collaboration[]>, visitedArtistIds: Set<string>): Promise<Collaboration[]> {
    const curPath = queue.peek() === undefined ? [] : queue.peek();     
    if (curPath.length != 0) {
        artistId1 = curPath[curPath.length - 1].artist2.id;
    }
    console.log("queue size: "+ queue.array.length);
    printPath(curPath);

    if (artistId1 === artistId2) {
        return curPath;
    }
    visitedArtistIds.add(artistId1);
    const thisCollabs = await getCollaborations(artistId1);

    for (const collab of thisCollabs) {
        if (! visitedArtistIds.has(collab.artist2.id)) {
            if (collab.artist2.id === artistId2) {
                return curPath.concat(collab);
            }
            queue.append(curPath.concat(collab));
            visitedArtistIds.add(collab.artist2.id);
        }
    } 
    queue.pop();
    return getCollabPathBFS(artistId1, artistId2, queue, visitedArtistIds);
}


async function getCollaborations(artistId: string): Promise<Collaboration[]> {
    let time = new Date().getTime();
    const collaborations = new Set<Collaboration>();
    const albums = await getAlbumsFromArtist(artistId);
    const artistResponse = await getArtist(artistId);
    const artist: Artist = {
        name: artistResponse.name,
        id: artistId
    }
    await getCollaborationsFromAlbums(albums, artist, collaborations);
    
    return Array.from(collaborations.values());
}

async function getAlbumsFromArtist(artistId: string): Promise<string[]> {
    const albumIds: string[] = [];
    for (let albumOffset = 0 ; ; albumOffset += 50) {
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

async function getCollaborationsFromAlbums(albumIds: string[], artist1: Artist, collabs: Set<Collaboration>) {
    for (let i = 0; i < albumIds.length; i+=20) {
        let time = new Date().getTime();
        const fullAlbums = await getAlbums(albumIds.slice(i, i+20));
        time = new Date().getTime() - time;
        album_calls++;
        album_call_time += time;
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
                        uri: track.uri,
                    },
                    artist1: artist1,
                    artist2: {
                        name: collaborator.name, 
                        id: collaborator.id, 
                    }
                }
                collabs.add(newCollaboration);
            }
        }
    }
}
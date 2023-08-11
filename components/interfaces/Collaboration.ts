import Artist from './Artist';

interface Track {
    name: string,
    id: string,
    uri: string
}

interface Collaboration {
    track: Track,
    artist1: Artist,
    artist2: Artist
}

export default Collaboration;
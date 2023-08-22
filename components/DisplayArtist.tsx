import React from 'react';
import ArtistImage from './ArtistImage';
import Artist from './types/Artist';

interface ArtistProps {
    artist: Artist;
}

const DisplayArtist: React.FC<ArtistProps> = ({ artist }) => {
    return (
        <div className=".boxed">
            <ArtistImage imageUrl={artist.image} />
        </div>
    );
};

export default DisplayArtist;
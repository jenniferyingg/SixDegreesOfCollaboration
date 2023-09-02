import React from 'react';
import ArtistImage from './ArtistImage';
import Artist from './types/Artist';

interface ArtistProps {
    artist: Artist;
}

const DisplayArtist: React.FC<ArtistProps> = ({ artist }) => {
    let image : string = artist.image!; 
    return (
        <div className='artist-image-container'>
            <ArtistImage imageUrl={image} />
        </div>
    );
};

export default DisplayArtist;
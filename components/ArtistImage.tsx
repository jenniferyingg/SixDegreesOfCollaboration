import React from 'react';

interface ArtistImageProps {
    imageUrl: string;
}

const ArtistImage: React.FC<ArtistImageProps> = ({ imageUrl }) => {
    return (
        <img src={imageUrl} className='artist-image'/>
    );
};

export default ArtistImage;



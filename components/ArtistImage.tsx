import React from 'react';

interface ArtistImageProps {
    imageUrl: string;
}

const ArtistImage: React.FC<ArtistImageProps> = ({ imageUrl }) => {
    return (
        <img src={imageUrl} style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginRight: '500px',
          }}/>
    );
};

export default ArtistImage;



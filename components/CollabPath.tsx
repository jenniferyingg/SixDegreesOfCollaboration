import React from 'react';
import DisplayArtist from './DisplayArtist';
import DisplayTrack from './DisplayTrack';
import Artist from './types/Artist';
import Track from './types/Track';

interface CollabPathProps {
    items: (Artist | Track)[];
}

const CollabPath: React.FC<CollabPathProps> = ({ items }) => {
    return (
        <div className="centre">
            {items.map((item, index) => (
                index % 2 === 0 ? (
                    <DisplayArtist key={index} artist={item as Artist} />
                ) : (
                    <DisplayTrack key={index} track={item as Track} />
                )
            ))}
        </div>
    );
};

export default CollabPath;

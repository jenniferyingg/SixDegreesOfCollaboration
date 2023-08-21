import React from 'react';
import SingleCollab from './SingleCollab';
import Collaboration from './interfaces/Collaboration'
import SpotifyObject from './interfaces/SpotifyObject';

interface CollabPathProps {
    collaborations: SpotifyObject[];
}

const CollabPath: React.FC<CollabPathProps> = ({ collaborations }) => {
    return (
        <div className="centre">
            {collaborations.map((collaboration, index) => (
                <SingleCollab key={index} collaboration={collaboration} />
            ))}
        </div>
    );
};

export default CollabPath;

import React from 'react';
import SingleCollab from './SingleCollab';
import Collaboration from './interfaces/Collaboration'

interface CollabPathProps {
    collaborations: Collaboration[];
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

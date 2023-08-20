import Collaboration from './interfaces/Collaboration';
import React from 'react';
import SongPreview from './SongPreview';
import SpotifyObject from './interfaces/SpotifyObject';

interface SingleCollabProps {
    collaboration: SpotifyObject;
}

const SingleCollab: React.FC<SingleCollabProps> = ({ collaboration }) => {
    return (
        <div className=".boxed">
            <div> {collaboration.name} </div>
        </div>
    );
};

export default SingleCollab;
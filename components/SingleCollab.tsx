import Collaboration from './interfaces/Collaboration';
import React from 'react';
import SongPreview from './SongPreview';

interface SingleCollabProps {
    collaboration: Collaboration;
}

const SingleCollab: React.FC<SingleCollabProps> = ({ collaboration }) => {
    return (
        <div className=".boxed">
            <div> {collaboration.artist1.name} and {collaboration.artist2.name} were both on: </div>
            <div> {collaboration.track.name} </div>
            <SongPreview trackId={collaboration.track.id}/>
        </div>
    );
};

export default SingleCollab;
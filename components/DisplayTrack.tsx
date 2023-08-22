import Collaboration from './types/Collaboration';
import React from 'react';
import SongPreview from './SongPreview';
import Artist from './types/Artist';
import Track from './types/Track';

interface TrackProps {
    track: Track;
}

const DisplayTrack: React.FC<TrackProps> = ({ track }) => {
    return (
        <div className=".boxed">
            <SongPreview trackId = {track.id} />
        </div>
    );
};

export default DisplayTrack;
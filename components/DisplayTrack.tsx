import Collaboration from './types/Collaboration';
import React from 'react';
import SongPreview from './SongPreview';
import Collaboration from './types/Collaboration';
import Track from './types/Track';

interface TrackProps {
    collab: Collaboration;
}

const DisplayTrack: React.FC<TrackProps> = ({ collab  }) => {
    return (
        <div className="track-container">
            <div className="track-header-artists">
                <span className='track-header-accent'>{collab.artist1.name}</span> and{' '}
                <span className='track-header-accent'>{collab.artist2.name}</span>
            </div>
            <div className="track-header-song">
                Appear on "
                <span className='track-header-accent'>{collab.track.name}</span>" together
            </div>
            <SongPreview trackId = {collab.track.id} />
        </div>
    );
};

export default DisplayTrack;
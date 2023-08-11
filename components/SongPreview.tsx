import React from 'react';

interface SongPreviewProps {
    trackId: string;
}

const SongPreview: React.FC<SongPreviewProps> = ({ trackId }) => {
    return (
        <iframe src={`https://open.spotify.com/embed/track/${trackId}`} width="100%" height="150" frameBorder="0" allow="encrypted-media"></iframe>
    );
};

export default SongPreview;
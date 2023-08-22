import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CollabPath from '../components/CollabPath';
import Artist from '../components/types/Artist';
import Track from '../components/types/Track';

const PathPage = () => {
    const router = useRouter();

    const [path, setPath] = useState<(Artist | Track)[]>([]);

    useEffect(() => {
        const { artistId1, artistName1, artistId2 , artistName2 } = router.query;
        const getPath = async () => {
        const response = await fetch ('/api/connections', {
            method: 'POST',
            body: JSON.stringify({artistId1: artistId1, artistId2: artistId2})
        });
        const data = await response.json();
        setPath(data);
    };

    if (artistId1 && artistId2) {
        getPath();
      }

    }, [router.query.artistId1, router.query.artistId2]);

    return (
        <div>
            {path.length > 0 
            ? (<CollabPath items = {path}></CollabPath>) 
            // ? (<CollabPath collaborations = {path}></CollabPath>) 
            : (<div>Loading...</div>)}
        </div>
    );
};
    
    export default PathPage;
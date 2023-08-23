import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DisplayTrack from '../components/DisplayTrack';
import DisplayArtist from '../components/DisplayArtist';
import Collaboration from '../components/types/Collaboration';
import Artist from '../components/types/Artist';
import Track from '../components/types/Track';


const ETHEL : Artist = {
    name: "Ethel Cain",
    id: '1233',
    image: "https://i.scdn.co/image/ab6761610000e5ebd1e68fe27f0b9d187b070b56"
};

const GUNN : Artist = {
    name: "Westside Gunn",
    id: '12253',
    image: "https://i.scdn.co/image/ab6761610000e5ebe6cf8cc2f715a02513826594"
};

const PANCHIKO : Artist = {
    name: "Panchiko",
    id: '1255423',
    image: "https://i.scdn.co/image/ab6761610000e5eb0104812b982485b2fa8b4ea5"
};

const MILK : Artist = {
    name: "Neutral Milk Hotel",
    id: '122345343',
    image: "https://i.scdn.co/image/731f5f71de27c36300d2cf71a7f9cd7f389d0bf7"
};

const HERO : Track = { 
    name: "Anti-Hero",
    id: '0V3wPSX9ygBnCm8psDIegu'
};

const LEAGUE : Track = {
    name: "Out Of Your League",
    id: "4qdbCACEpbFWIpKSMa2fZC"
};

const BABY : Track = { 
    name: "Pitch the Baby",
    id: "1DXD0wVXXHwUYo9AXbcMMI"
}

const PATH : Collaboration[] = [
    {
        artist1: ETHEL,
        artist2: GUNN,
        track: HERO
    },
    {
        artist2: PANCHIKO,
        artist1: GUNN,
        track: LEAGUE
    },
    {
        artist1: PANCHIKO,
        artist2: MILK,
        track: BABY
    }
]

const PathPage = () => {
    const router = useRouter();
    const [path, setPath] = useState<Collaboration[]>([]);
    const [controller, setController] = useState(new AbortController());

    useEffect(() => {
        setController(new AbortController());
        const { artistId1, artistName1, artistId2 , artistName2 } = router.query;
        const getPath = async () => {
            const signal = controller.signal;
            try {
                const response = await fetch ('/api/connections', {
                    method: 'POST',
                    body: JSON.stringify({artistId1: artistId1, artistId2: artistId2}),
                    signal
                });
                const data = await response.json();
                setPath(PATH);
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request canceled:', error.message);
                } else {
                    console.log('Error:', error.message);
                }
            }
        };

        if (artistId1 && artistId2) {
            getPath();
        }

        return () => controller.abort(); 

    }, [router.query.artistId1, router.query.artistId2]);

    function handleClick() {
        router.push({
            pathname: '/'
        });
    }

    return (
        <div>
            <div className='flex-container'>
                <div className='path-title'>
                    {
                        path.length === 0
                        ? <div>
                            Finding{' '}
                            <span className='path-title-accent-green'>path</span> between{' '}
                            <span className='path-title-accent'>{router.query.artistName1}</span> and{' '}
                            <span className='path-title-accent'>{router.query.artistName2}</span>
                        </div>
                        : <div>
                            <span className='path-title-accent'>{router.query.artistName1}</span> and{' '}
                            <span className='path-title-accent'>{router.query.artistName2}</span> are{' '}
                            <span className='path-title-accent-green'>
                                {
                                    path.length === 1 ? '1 collaboration' :
                                    `${path.length} collaborations`}
                            </span>
                            {' '}apart!
                        </div>
                    }
                </div>
            </div>

            {path.length === 0 ?                     
                <div>
                    <div className='loading'>
                        <span>Loading...</span>
                        <div> 
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" className="rotate" width="100" height="100"/>    
                        </div>

                    </div>
                    <div className='home-no-path'>
                        <button onClick={handleClick}>Try with new artists</button>
                    </div>
                </div>
                : 
                <div>
                    <div className='column-container'>
                        <div className='left-artists-container'>
                            {path.map((collab: Collaboration, index: number) => (
                                (index % 2 === 0) &&
                                <div>
                                    <DisplayArtist key={index*100+1} artist={collab.artist1} />
                                </div>
                            ))}
                        </div>
                        <div className='tracks-container'>
                            {path.map((collab: Collaboration, index: number) => (
                                <div>
                                    <DisplayTrack key={index*100+2} collab={collab} />
                                </div>
                            ))}
                        </div>
                        <div className='right-artists-container'>
                            {path.map((collab: Collaboration, index: number) => (
                                (index % 2 === 0) &&
                                <div>
                                    <DisplayArtist key={index*100+3} artist={collab.artist2} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='home-with-path'>
                        <button onClick={handleClick}>Try with new artists</button>
                    </div>
                </div>
            }
        </div>
    );
};
    
    export default PathPage;
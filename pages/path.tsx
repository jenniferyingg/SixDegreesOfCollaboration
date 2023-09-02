import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DisplayTrack from '../components/DisplayTrack';
import DisplayArtist from '../components/DisplayArtist';
import Collaboration from '../components/types/Collaboration';
import github from '../imgs/github.png';
import SpotifyLogo from '../imgs/spotifylogo.svg';
import topLeft from "../imgs/topleft.svg";
import topRight from "../imgs/topright.svg";
import bottomLeft from "../imgs/bottomleft.svg";
import bottomRight from "../imgs/bottomright.svg";
import { SUPPORTED_NATIVE_MODULES } from 'next/dist/build/webpack/plugins/middleware-plugin';

const PathPage = () => {
    const router = useRouter();
    const [path, setPath] = useState<Collaboration[]>([]);
    const [controller, setController] = useState(new AbortController());

    useEffect(() => {
        setController(new AbortController());
        const { artistId1, artistName1, artistId2, artistName2 } = router.query;
        const getPath = async () => {
            const signal = controller.signal;
            try {
                const response = await fetch('/api/connections', {
                    method: 'POST',
                    body: JSON.stringify({ artistId1: artistId1, artistId2: artistId2 }),
                    signal
                });
                const data = await response.json();
                console.log("heyoo")
                console.log(data)
                setPath(JSON.parse(data));
                console.log("heyoo")
                console.log(path)
            } catch (error : any) {
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
            <div className='github'>
                <a href="https://github.com/jenniferyingg/six-degrees-of-collaboration">
                    <img src={github.src} style={{ height: '70px' }} />
                </a>
            </div>

            <div className='centred-title'>
                {
                    path.length === 0
                        ? <div className='path-title'>
                            Finding{' '}
                            <span className='path-title-accent-green'>path</span> between{' '}
                            <span className='path-title-accent'>{router.query.artistName1}</span> and{' '}
                            <span className='path-title-accent'>{router.query.artistName2}</span>
                        </div>
                        : <div className='path-title'>
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
            <div className='path'>
                {path.length === 0 ?
                    <div>
                        <div className='loading'>
                            <span>Loading...</span>
                            <div>
                                <img src={SpotifyLogo.src} className="rotate" width={100} height={100} />
                            </div>

                        </div>
                        <div className='no-path'>
                            <button onClick={handleClick} className='button'>try with new artists</button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className='column-container'>
                            <div className='left-artists-container'>
                                {path.map((collab: Collaboration, index: number) => (
                                    <div key={index * 100 + 1}>
                                        {index === 0 ? (
                                            <div>
                                                <DisplayArtist artist={collab.artist1} />
                                            </div>
                                        ) : (
                                            index % 2 === 1 && (
                                                <div className='shift-left-artists'>
                                                    <DisplayArtist artist={collab.artist2} />
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                            <div className='tracks-container'>
                                {path.map((collab: Collaboration, index: number) => (
                                    <div key={index}>
                                        {index % 2 === 0 ? (
                                            <div className='display-track-container'>
                                                <img src={topLeft.src} className='top-left-image' />
                                                <DisplayTrack collab={collab} />
                                                <img src={topRight.src} className='top-right-image' />
                                            </div>
                                        ) : (
                                            <div className='display-track-container'>
                                                <img src={bottomLeft.src} className='bottom-left-image' />
                                                <DisplayTrack collab={collab} />
                                                <img src={bottomRight.src} className='bottom-right-image' />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className='right-artists-container'>
                                {path.map((collab: Collaboration, index: number) => (
                                    (index % 2 === 0) &&
                                    <div key={index * 100 + 3}>
                                        <DisplayArtist artist={collab.artist2} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='with-path'>
                            <button onClick={handleClick} className='button'>try with new artists</button>
                        </div>
                    </div>
                }
            </div>

        </div>
    );
};

export default PathPage;
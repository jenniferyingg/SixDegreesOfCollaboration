import { useEffect, useState } from 'react';
import React from 'react';


export default function Main() {

    const [artists, setArtists] = useState<string[]>([]);
    const [artist1, setArtist1] = useState<string>(artists[0]);
    const [artist2, setArtist2] = useState<string>(artists[1]);
    const [path, setPath] = useState<string[]>([]);

    useEffect(()=>{
        console.log('Calling /api/artists!');
        const getArtists = async () => {
            const response = await fetch ('/api/artists');
            const data = await response.json();
            setArtists(data);
        }
        getArtists();
    }, []);

    function handleClick() {
        console.log('Calling /api/connections!');
        const getPath = async () => {
            const response = await fetch ('/api/connections', {
                method: 'POST',
                body: JSON.stringify({artist1: {artist1}, artist2: {artist2}})
            });
            const data = await response.json();
            setPath(data);
        }
        getPath();

    }
    

    return (
        <main>
            <div className='centre'>
                <div className='boxed'>
                    <select 
                    value = {artist1}
                    onChange={(e) => {setArtist1(e.target.value);
                    }}>
                        {artists.map((name) => (
                            <option value={name}>{name}</option>
                            ))}
                    </select>
                </div>

                <div className="horizontalgap" style={{width:"50px"}}></div>

                <div className='boxed'>
                    <button onClick={handleClick}>Find path</button>
                </div>

                <div className="horizontalgap" style={{width:"50px"}}></div>

                <div className='boxed'>
                    <select 
                    value = {artist2}
                    onChange={(e) => {setArtist2(e.target.value);
                    }}>
                            {artists.map((name) => (
                            <option value={name}>{name}</option>
                            ))}
                    </select>
                </div>
            </div>
        </main>
      );
  }

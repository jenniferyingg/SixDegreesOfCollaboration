import React, { useState } from 'react';
import SearchArtists from '../components/SearchArtists';

export default function Main() {
    const [artistOne, setArtistOne] = useState<string | null>(null);
    const [artistTwo, setArtistTwo] = useState<string | null>(null);
    const selectedArtistOne = (value: string | null) => {
        setArtistOne(value);
        console.log(value);
    };
    const selectedArtistTwo = (value: string | null) => {
        setArtistTwo(value);
        console.log(value);
    };

    const [path, setPath] = useState<string[]>([]);

    function handleClick() {
        console.log('Calling /api/connections!');
        const getPath = async () => {
            const response = await fetch ('/api/connections', {
                method: 'POST',
                body: JSON.stringify({artist1: {artistOne}, artist2: {artistTwo}})
            });
            const data = await response.json();
            setPath(data);
        }
        getPath();

    }

    return (
        <main>
            <div >
                <SearchArtists onChange={selectedArtistOne}/>
                <SearchArtists onChange={selectedArtistTwo} />
                <button onClick={handleClick}>Find path</button>
               
            </div>
        </main>
      );
  }

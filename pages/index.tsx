import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SearchArtists from '../components/SearchArtists';

export default function Main() {
    const router = useRouter();

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


    function handleClick() {
        router.push({
            pathname: '/path',
            query: {
                artistId1: artistOne, 
                artistId2: artistTwo
            },
        });
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

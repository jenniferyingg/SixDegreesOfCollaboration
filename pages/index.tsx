import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SearchArtists from '../components/SearchArtists';
import { findShortestPath } from '../lib/neo4j';

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

    const handlePopulateClick = async () => {
        try {
          const response = await findShortestPath("0p4nmQO2msCgU4IF37Wi3j","5cj0lLjcoR7YOSnhnX0Po5");
          console.log(response);
        } catch (error) {
          console.error('Error populating data:', error);
        }
      };

    return (
        <main>
            <div className='centre'>
                <SearchArtists onChange={selectedArtistOne}/>
                <SearchArtists onChange={selectedArtistTwo} />
                <button onClick={handleClick} className='gradient-button'>Find path</button>
            </div>
            <div>
                <button onClick={handlePopulateClick}>Populate Neo4j</button>
            </div>
        </main>
      );
  }

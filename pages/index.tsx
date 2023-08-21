import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SearchArtists from '../components/SearchArtists';
import { findShortestPath } from '../lib/neo4j';
import github from '../imgs/github.png';

export default function Main() {
    const router = useRouter();

    const [artistOne, setArtistOne] = useState<string | null>(null);
    const [artistTwo, setArtistTwo] = useState<string | null>(null);
    const selectedArtistOne = (value: any | null) => {
        setArtistOne(value);
        console.log(value);
    };
    const selectedArtistTwo = (value: any | null) => {
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
          console.log("here");
          const response = await fetch('/api/populate');
          console.log(response);
        } catch (error) {
          console.error('Error populating data:', error);
        }
      };

    return (
        <main>
            <div className='github'>
                <a href="https://github.com/jenniferyingg/six-degrees-of-collaboration">
                    <img src={github.src} style={{height: '70px' }}/>
                </a>
            </div>
            <div className='title'>
                six degrees <br></br>of collaboration
            </div>
            <div className='centre'>
                <div className='flex-container'>
                    <SearchArtists onChange={selectedArtistOne}/>
                    <SearchArtists onChange={selectedArtistTwo} />
                    <button onClick={handleClick} className='find-button'>find path</button>
                </div>
            </div>
            {/* <button onClick={handlePopulateClick}>Populate Neo4j</button> */}
        </main>
      );
  }

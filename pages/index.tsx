import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SearchArtists from '../components/SearchArtists';
import { findShortestPath } from '../lib/neo4j';
import github from '../imgs/github.png';

export default function Main() {
    const router = useRouter();

    const [artistOne, setArtistOne] = useState<[string, string] | null>(null);
    const [artistTwo, setArtistTwo] = useState<[string, string] | null>(null);
    const selectedArtistOne = (value: [string, string] | null) => {
        setArtistOne(value);
        
    };
    const selectedArtistTwo = (value: [string, string] | null) => {
        setArtistTwo(value);
    };


    function handleClick() {
        router.push({
            pathname: '/path',
            query: {
                artistId1: artistOne[0], 
                artistName1: artistOne[1], 
                artistId2: artistTwo[0],
                artistName2: artistTwo[1]
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
            <div className='github'>
                <a href="https://github.com/jenniferyingg/six-degrees-of-collaboration">
                    <img src={github.src} style={{height: '70px' }}/>
                </a>
            </div>
            <div className='centre'>
                <div className='title'>
                    six degrees <br></br>of collaboration
                </div>
                <div className='description'>
                    connecting two spotify artists through their collaborations. try it out below.
                </div>
                    <div className='flex-container'>
                        <SearchArtists onChange={selectedArtistOne}/>
                        <SearchArtists onChange={selectedArtistTwo} />
                        <button onClick={handleClick} className='button find-button'>find path</button>
                    </div>
            </div>
            {/* <button onClick={handlePopulateClick}>Populate Neo4j</button> */}
        </main>
      );
  }

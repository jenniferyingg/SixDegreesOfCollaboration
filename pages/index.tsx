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
        if (artistOne === null || artistTwo === null) {
            return;
        }
        router.push({
            pathname: '/path',
            query: {
                artistId1: artistOne![0], 
                artistName1: artistOne![1], 
                artistId2: artistTwo![0],
                artistName2: artistTwo![1]
            },
        });
    }

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
        </main>
      );
  }

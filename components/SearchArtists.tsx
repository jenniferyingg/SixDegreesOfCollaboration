import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {debounce} from '../utils/debounce'; 
import styled from 'styled-components';

type SelectOption = {
  name: string;
  value: string;
  image: string;
};

type Props = {
  onChange: (selectedValue: [string, string] | null) => void;
};

const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    background: '#121212',
    border: `2px solid #60CA69`, 
    borderRadius: '4px',
    padding: '8px',
    width: 450,
    "&:hover": {
      border: '2px solid #60CA69',
    },
    "&:focus": {
      borderColor: "#60CA69", 
      boxShadow: "none" 
    }
  }),
  input: (provided: any) => ({
    ...provided,
    color: "white",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "white", 
    fontSize: "20px",
    fontFamily: "Gill Sans",
    fontWeight: "300"
  }),
  menu: (provided: any) => ({
    ...provided,
    background: "#1E1E1E",
  }),
  option: (provided: any, {isFocused } : any) => ({
    ...provided,
    background: isFocused? "#60CA69" : "1E1E1E",
    "&:hover": {
      background: "#60CA69", 
    },
    "&:focus": {
      background: "#60CA69",
    }
  }),
};

const customOption = (option: SelectOption) => (
  <div style={{ display: "flex" }}>
    <img src={option.image} style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        marginRight: '20px',
      }}/>
    <span style={{ alignSelf: "center", fontSize: '20px', color: 'white' }}>{option.name}</span>
  </div>
);

const SelectSearchOptions: React.FC<Props> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        //console.log(inputValue);
        const response = await fetch(`/api/artists?q=${inputValue}`);
        const data = await response.json();
        const options: SelectOption[] = data.map((artist: { name: any; id: any; images: any[]; }) => ({
                name: artist.name,
                value: artist.id,
                image: artist.images.length > 0 ? artist.images[0].url : undefined
            }));
        setOptions(options);
        console.log(options);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setIsLoading(false);
    };

    const delayedFetch = debounce(fetchOptions, 500);

    if (inputValue.trim() !== '') {
      delayedFetch();
    } else {
      setOptions([]);
    }

    return () => delayedFetch.cancel(); 
  }, [inputValue]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleOptionChange = (selected: SelectOption | null) => {
    setSelectedOption(selected);
    onChange(selected ? [selected.value, selected.name] : null);
  };

  return (
    <div>
      <Select
        options={options}
        getOptionLabel={option => option.name}
        formatOptionLabel={customOption}
        getOptionValue={option => option.value}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onChange={handleOptionChange}
        value={selectedOption}
        isClearable
        className="custom-select-menu"
        styles={selectStyles}
        placeholder="search for an artist..."
      />
    </div>
  );
};

export default SelectSearchOptions;

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {debounce} from '../utils/debounce'; 

type SelectOption = {
  name: string;
  value: string;
};

type Props = {
  onChange: (selectedValue: string | null) => void;
};

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    width: 250, 
  }),
};

const SelectSearchOptions: React.FC<Props> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/artists?q=${inputValue}`);
        const data = await response.json();
        const options: SelectOption[] = data.map((artist: { name: any; id: any; }) => ({
                name: artist.name,
                value: artist.id
            }));
        setOptions(options);
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
    onChange(selected ? selected.value : null);
  };

  return (
    <div>
      <Select
        options={options}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.value}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onChange={handleOptionChange}
        value={selectedOption}
        isClearable
        className="custom-select-menu"
        styles={customStyles}
      />
    </div>
  );
};

export default SelectSearchOptions;

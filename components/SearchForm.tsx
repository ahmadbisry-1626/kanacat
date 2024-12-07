import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Input } from './ui/input'
import { IoIosCloseCircle } from "react-icons/io";

const SearchForm = ({ query, setIsQuery }: { query: string, setIsQuery: (e: string) => void }) => {
    return (
        <div className='flex items-center gap-2 h-[50px] md:h-full w-full'>
            <div className='flex items-center gap-2 h-full w-full relative'>
                <div className='px-4 rounded-[12px] bg-black h-full md:flex items-center justify-center hidden'>
                    <FaSearch className='size-6 text-white' />
                </div>
                <input
                    id='query'
                    name='query'
                    value={query}
                    placeholder='Find cat by its breed or country'
                    className='input md:!text-[18px] font-medium h-full placeholder:md:text-[18px] placeholder:text-gray-400 border-0 max-md:border-[3px] max-md:border-gray-300 rounded-[12px] pr-16 px-4 w-full bg-transparent'
                    onChange={(e) => setIsQuery(e.target.value)}

                />

                {query && (
                    <button className='absolute right-2' onClick={() => setIsQuery('')}>
                        <IoIosCloseCircle className='size-12'/>
                    </button>
                )}
            </div>
        </div>
    )
}

export default SearchForm

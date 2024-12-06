import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Input } from './ui/input'
import Form from 'next/form'

const SearchForm = ({ query }: { query: string }) => {
    return (
        <Form action='/' className='flex items-center gap-2 h-[50px] md:h-full w-full'>
            <div className='flex items-center gap-2 h-full w-full'>
                <div className='px-4 rounded-[12px] bg-primary h-full md:flex items-center justify-center hidden'>
                    <FaSearch className='size-6 text-white' />
                </div>
                <Input
                    id='query'
                    name='query'
                    defaultValue={query}
                    placeholder='Find cat by its breed or country'
                    className='input md:!text-[18px] font-medium h-full placeholder:md:text-[18px] placeholder:text-gray-400 border-0 max-md:border-[3px] max-md:border-gray-300 rounded-[12px] max-w-md'
                />
            </div>
            <button className='md:hidden block bg-primary px-5 h-full rounded-[12px] font-medium text-white' type='submit'>
                Search
            </button>
        </Form>
    )
}

export default SearchForm

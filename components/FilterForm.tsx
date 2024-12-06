import React from 'react'
import { Checkbox } from './ui/checkbox'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaCircleInfo } from 'react-icons/fa6'
import { filterContent } from '@/constants'


const FilterForm = () => {
    return (
        <div className='grid grid-cols-2 gap-5'>
            {filterContent.map((filter) => {
                return (
                    <div className="flex items-center h-fit w-fit" key={filter.id}>
                        <Checkbox id={filter.id} className='border-2 md:size-4 border-secondary' value={filter.id} />
                        <label
                            htmlFor={filter.id}
                            className="md:text-[18px] capitalize ml-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                        >
                            {filter.name}
                        </label>
                        <HoverCard>
                            <HoverCardTrigger>
                                <FaCircleInfo className='text-gray-400 size-4 ml-1' />
                            </HoverCardTrigger>
                            <HoverCardContent className='bg-black/80 text-white border-none'>
                                {filter.desc}
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                )
            })}
        </div>
    )
}

export default FilterForm

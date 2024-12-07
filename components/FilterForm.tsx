import React from 'react'
import { Checkbox } from './ui/checkbox'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { FaCircleInfo } from 'react-icons/fa6'
import { filterContent } from '@/constants'

type filterProps = {
    indoor: boolean,
    lap: boolean,
    experimental: boolean,
    natural: boolean,
    rare: boolean,
    hairless: boolean,
    rex: boolean,
    suppressedTail: boolean,
    shortLegs: boolean,
}

const FilterForm = ({ filter, setFilter }: { filter: filterProps, setFilter: React.Dispatch<React.SetStateAction<filterProps>> }) => {
    const handleFilter = (filterKey: keyof typeof filter) => {
        setFilter((prev) => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }))
    }

    return (
        <div className='grid grid-cols-2 gap-5'>
            {filterContent.map((filterItem) => {
                return (
                    <div className="flex items-center h-fit w-fit" key={filterItem.id}>
                        <Checkbox
                            id={filterItem.id}
                            className='border-2 md:size-4 border-black'
                            value={filterItem.id}
                            onCheckedChange={() => handleFilter(filterItem.id as keyof typeof filter)}/>
                        <label
                            htmlFor={filterItem.id}
                            className="md:text-[18px] capitalize ml-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
                        >
                            {filterItem.name}
                        </label>
                        <HoverCard>
                            <HoverCardTrigger>
                                <FaCircleInfo className='text-gray-400 size-4 ml-1' />
                            </HoverCardTrigger>
                            <HoverCardContent className='bg-black/80 text-white border-none'>
                                {filterItem.desc}
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                )
            })}
        </div>
    )
}

export default FilterForm

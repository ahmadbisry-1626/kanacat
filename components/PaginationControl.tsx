"use client"

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { usePathname, useRouter } from "next/navigation"


const PaginationControl = ({ page, totalPages, hasNextPage, hasPrevPage }: { page: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean }) => {
    const router = useRouter()
    const pathname = usePathname()

    const onPageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search)

        params.set('page', page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }


    return (
        <Pagination className="mt-10">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#header" onClick={() => {
                        if (hasPrevPage) {
                            onPageChange(page - 1)
                        }
                    }} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">{page}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    {totalPages}
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#header" onClick={() => {
                        if (hasNextPage) {
                            onPageChange(page + 1)
                        }
                    }} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}

export default PaginationControl

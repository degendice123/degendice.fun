"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dispatch, SetStateAction } from "react";

export const ITEM_PER_PAGE = 5;

export default function PaginationCustom({
  total,
  page,
  setPage,
}: {
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  if (total <= ITEM_PER_PAGE) {
    return null;
  }

  const totalPage = Math.ceil(total / ITEM_PER_PAGE);

  let midPage = 0;
  if (totalPage >= 5) {
    if (page === 1 || page === 2) {
      midPage = 3;
    } else if (page === totalPage || page === totalPage - 1) {
      midPage = totalPage - 2;
    } else {
      midPage = page;
    }
  } else if (totalPage === 3) {
    midPage = 2;
  }
  return (
    <Pagination className="my-[20px]">
      <PaginationContent>
        <PaginationItem className="disabled">
          <PaginationPrevious
            onClick={() => setPage(page === 1 ? 1 : page - 1)}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink onClick={() => setPage(1)} isActive={page === 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {totalPage !== 2 &&
          totalPage !== 3 &&
          (midPage === 0 || midPage - 1 === 2 ? (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(2)} isActive={page === 2}>
                2
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ))}

        {midPage > 0 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => setPage(midPage)}
              isActive={page === midPage}
            >
              {midPage}
            </PaginationLink>
          </PaginationItem>
        )}
        {totalPage !== 2 &&
          totalPage !== 3 &&
          ((midPage === 0 && totalPage > 3) || totalPage - midPage === 2 ? (
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage(totalPage - 1)}
                isActive={page === totalPage - 1}
              >
                {totalPage - 1}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          ))}

        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(totalPage)}
            isActive={page === totalPage}
          >
            {totalPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(page === totalPage ? totalPage : page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

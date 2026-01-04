"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export default function Pagination({ meta }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { page, totalPage } = meta;

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePrevious = () => {
    if (page > 1) {
      updatePage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPage) {
      updatePage(page + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPage);
      } else if (page >= totalPage - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPage - 3; i <= totalPage; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("...");
        pages.push(totalPage);
      }
    }

    return pages;
  };

  if (totalPage <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={page === 1}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1">
        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center h-9 w-9 text-muted-foreground"
              >
                ...
              </span>
            );
          }

          return (
            <Button
              key={pageNum}
              variant={page === pageNum ? "default" : "outline"}
              size="icon"
              onClick={() => updatePage(pageNum as number)}
              className="h-9 w-9"
            >
              {pageNum}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={page === totalPage}
        className="h-9 w-9"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

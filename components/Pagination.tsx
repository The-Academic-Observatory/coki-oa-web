// Copyright 2022 Curtin University
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Author: Aniek Roelofs

import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

function paginate(page: number, nPages: number) {
  const window = 5;
  const half = Math.floor(window / 2);
  const endDistance = nPages - page - 1;
  let start = 0;
  let end: number;
  if (nPages < window) {
    // Total number of pages smaller than window
    start = 0;
    end = nPages - 1;
  } else if (page < window) {
    // Current page smaller than window
    start = 0;
    end = window - 1;
  } else if (endDistance < window) {
    // Number of remaining pages fits within windows
    start = nPages - window;
    end = nPages - 1;
  } else {
    start = page - half;
    end = page + half;
  }

  const length = end - start + 1;
  return Array.from({ length: length }, (v, k) => k + start);
}

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows: number;
  rowsPerPage: number;
}

const Pagination = ({ currentPage, setCurrentPage, totalRows, rowsPerPage }: PaginationProps) => {
  // Calculating max number of pages
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

  const [pagesArr, setPagesArr] = useState([...new Array(noOfPages)]);

  // Navigation arrows enable/disable state
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Onclick handlers for the buttons
  const onNextPage = () => setCurrentPage(currentPage + 1);
  const onPrevPage = () => setCurrentPage(currentPage - 1);
  const goToPage = (pageNo: React.SetStateAction<number>) => {
    setCurrentPage(pageNo);
  };

  // Disable previous and next buttons in the first and last page respectively
  useEffect(() => {
    if (noOfPages - 1 === currentPage) {
      setCanGoNext(false);
    } else {
      setCanGoNext(true);
    }
    if (currentPage === 0) {
      setCanGoBack(false);
    } else {
      setCanGoBack(true);
    }
  }, [noOfPages, currentPage]);

  // To set the starting index of the page
  useEffect(() => {
    setCurrentPage(currentPage);
    setPagesArr(paginate(currentPage, noOfPages));
  }, [noOfPages, currentPage]);

  return (
    <>
      {noOfPages > 1 ? (
        <Flex alignItems="center" align="center" justifyContent="space-between">
          <IconButton
            aria-label="Previous Page"
            variant="pureIconButton"
            icon={<ChevronLeftIcon />}
            onClick={onPrevPage}
            disabled={!canGoBack}
          />
          {pagesArr.map((page) => (
            <Flex key={page} layerStyle="pageButton" align="center" onClick={() => goToPage(page)}>
              <Box className={page === currentPage ? "pageBtnActive" : ""} />
            </Flex>
          ))}
          <IconButton
            aria-label="Next Page"
            variant="pureIconButton"
            icon={<ChevronRightIcon />}
            onClick={onNextPage}
            disabled={!canGoNext}
          />
        </Flex>
      ) : null}
    </>
  );
};

export default Pagination;

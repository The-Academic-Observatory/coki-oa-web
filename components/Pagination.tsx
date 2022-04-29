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

import React, { useState, useEffect } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface PaginationProps {
  pageChangeHandler: any;
  totalRows: number;
  rowsPerPage: number;
}

const Pagination = ({ pageChangeHandler, totalRows, rowsPerPage }: PaginationProps) => {
  // Calculating max number of pages
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

  // Creating an array with length equal to no.of pages
  const pagesArr = [...new Array(noOfPages)];

  // State variable to hold the current page. This value is
  // passed to the callback provided by the parent
  const [currentPage, setCurrentPage] = useState(0);

  // Navigation arrows enable/disable state
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoNext, setCanGoNext] = useState(true);

  // Onclick handlers for the butons
  const onNextPage = () => setCurrentPage(currentPage + 1);
  const onPrevPage = () => setCurrentPage(currentPage - 1);
  const onPageSelect = (pageNo: React.SetStateAction<number>) => setCurrentPage(pageNo);

  // Disable previous and next buttons in the first and last page
  // respectively
  useEffect(() => {
    if (noOfPages === currentPage) {
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
    // const skipFactor = (currentPage - 1) * rowsPerPage;
    // Some APIs require skip for pagination. If needed use that instead
    // pageChangeHandler(skipFactor);
    pageChangeHandler(currentPage);
  }, [currentPage]);

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
          {pagesArr.map((_num, index) => (
            <Flex key={index} layerStyle="pageButton" align="center" onClick={() => onPageSelect(index)}>
              <Box className={index === currentPage ? "pageBtnActive" : ""} />
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

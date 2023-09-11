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
// Author: Aniek Roelofs, James Diprose

import React, { memo, useEffect, useState } from "react";
import { Box, Flex, FlexProps, IconButton } from "@chakra-ui/react";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import NoResults from "./NoResults";

interface PaginationProps extends FlexProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalRows: number;
  rowsPerPage: number;
}

const Pagination = ({ currentPage, setCurrentPage, totalRows, rowsPerPage, ...rest }: PaginationProps) => {
  // Calculating max number of pages
  const noOfPages = Math.ceil(totalRows / rowsPerPage);

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
    if (noOfPages - 1 === currentPage || totalRows == 0) {
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

  return (
    <Flex alignItems="center" align="center" justifyContent="space-between" {...rest}>
      <IconButton
        aria-label="First Page"
        variant="pagination"
        icon={<HiOutlineChevronDoubleLeft />}
        onClick={() => goToPage(0)}
        disabled={!canGoBack}
      />
      <IconButton
        aria-label="Previous Page"
        variant="pagination"
        icon={<HiOutlineChevronLeft />}
        onClick={onPrevPage}
        disabled={!canGoBack}
      />
      {noOfPages > 0 && (
        <Box layerStyle="pageNumber">
          {" "}
          {currentPage + 1} / {noOfPages}{" "}
        </Box>
      )}

      <IconButton
        aria-label="Next Page"
        variant="pagination"
        icon={<HiOutlineChevronRight />}
        onClick={onNextPage}
        disabled={!canGoNext}
      />
      <IconButton
        aria-label="Last Page"
        variant="pagination"
        icon={<HiOutlineChevronDoubleRight />}
        onClick={() => goToPage(noOfPages - 1)}
        disabled={!canGoNext}
      />
    </Flex>
  );
};

export default memo(Pagination);

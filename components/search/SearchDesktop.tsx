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
// Author: James Diprose

import { RemoveScroll } from "react-remove-scroll";
import { Box, Popover, PopoverAnchor, PopoverBody, PopoverContent, Text, useOutsideClick } from "@chakra-ui/react";
import { Entity } from "../../lib/model";
import React, { LegacyRef, memo, useCallback, useEffect, useRef } from "react";
import { OADataAPI } from "../../lib/api";
import debounce from "lodash/debounce";
import SearchResult from "./SearchResult";
import SearchBox from "./SearchBox";
import SkeletonSearchResult from "./SkeletonSearchResult";
import NoResults from "./NoResults";

export const useEntitySearch = (
  onDataLoaded: any = null,
  searchLimit: number = 20,
  searchDebounce: number = 300,
): [
  Array<Entity>,
  string,
  (val: string) => void,
  boolean,
  (val: boolean) => void,
  LegacyRef<HTMLDivElement>,
  (e: any) => void,
  boolean,
  string,
] => {
  const client = new OADataAPI();
  const [page, setPage] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hasMore, setHasMore] = React.useState<boolean>(false);
  const [query, setQuery] = React.useState<string>("");
  const [queryFinal, setQueryFinal] = React.useState<string>("");
  const [entities, setEntities] = React.useState<Array<Entity>>([]);
  const observer = useRef<IntersectionObserver>();
  const lastEntityRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage: number) => {
            return prevPage + 1;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const searchBoxOnChange = (e: any) => {
    const query = e.target.value;
    setQuery(query);
    setPage(0);
    setHasMore(false);
  };

  const fetchData = useCallback(
    debounce((query: string, page: number, abortController: AbortController) => {
      // When query is an empty string just set no results
      if (query.trim() === "") {
        setEntities([]);
        return;
      }

      // Query
      setLoading(true);
      client
        .searchEntities(query, page, searchLimit, abortController)
        .then((response) => {
          setEntities((prevEntities) => {
            // If we are on the first page then just use new items
            if (page === 0) return response.data.items;

            // If on subsequent pages, then add previous entries and new entries together
            return [...prevEntities, ...response.data.items];
          });

          setHasMore(response.data.page + 1 < response.data.nPages);
          setQueryFinal(query); // Update this value once the query has finished
          setLoading(false);

          // Callback where behaviour can be customised after data has been loaded
          if (onDataLoaded != null) {
            onDataLoaded();
          }
        })
        .catch((e) => {
          if (abortController.signal.aborted) return;
        });
    }, searchDebounce),
    [],
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(query, page, abortController);
    return () => abortController.abort();
  }, [query, page]);

  return [entities, query, setQuery, loading, setLoading, lastEntityRef, searchBoxOnChange, hasMore, queryFinal];
};

const SearchDesktop = ({ ...rest }) => {
  // Control search popover behaviour
  // When receive a click outside search input or popover, then close
  const [isPopoverOpen, setPopoverOpen] = React.useState(false);
  const ref = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  useOutsideClick({
    ref: ref,
    handler: () => {
      // Close popover and clear text when click outside
      setPopoverOpen(false);
      setQuery("");
    },
  });

  // Search query
  const [entities, query, setQuery, loading, setLoading, lastEntityRef, searchBoxOnChange, hasMore, queryFinal] =
    useEntitySearch(() => {
      setPopoverOpen(true);
    });

  return (
    <Box {...rest} ref={ref}>
      <RemoveScroll enabled={isPopoverOpen}>
        <Popover placement="bottom-start" offset={[0, 1]} autoFocus={false} isLazy={true} isOpen={isPopoverOpen}>
          <PopoverAnchor>
            {/*div is required to prevent Function components cannot be given refs error */}
            <div>
              <SearchBox
                inputDataTest="searchInputDesktop"
                value={query}
                onChange={(e: any) => {
                  if (e.target.value === "") {
                    setPopoverOpen(false);
                  }
                  searchBoxOnChange(e);
                }}
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            borderRadius={14}
            width="386px"
            _focus={{
              boxShadow: "none",
            }}
          >
            <PopoverBody
              id="searchResultsDesktop"
              data-test="searchResultsDesktop"
              py={0}
              px="16px"
              maxHeight="500px"
              overflowY="auto"
            >
              {/* Search results */}
              {entities.map((entity: Entity) => {
                return (
                  <SearchResult
                    key={entity.id}
                    entity={entity}
                    onClick={() => {
                      // On click:
                      // - Close search results
                      // - Set search text to empty string
                      setPopoverOpen(false);
                      setQuery("");
                    }}
                  />
                );
              })}

              {/* Skeleton search item which loads more results */}
              {hasMore && <SkeletonSearchResult lastEntityRef={lastEntityRef} />}

              {/* No results helper information */}
              {entities.length === 0 && <NoResults query={queryFinal} />}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </RemoveScroll>
    </Box>
  );
};

export default memo(SearchDesktop);

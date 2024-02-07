// Copyright 2022-2024 Curtin University
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

import { OADataAPI } from "@/lib/api";
import { Entity } from "@/lib/model";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useRef } from "react";

interface UseEntitySearchReturnType {
  entities: Array<Entity>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  entityType: string | null;
  setEntityType: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  lastEntityRef: React.LegacyRef<HTMLDivElement>;
  searchBoxOnChange: (e: any) => void;
  hasMore: boolean;
  queryFinal: string;
}

const useEntitySearch = (
  onDataLoaded: any,
  defaultEntityType: string | null = null,
  defaultPage: number = 0,
  defaultLimit: number = 20,
  searchDebounce: number = 300,
): UseEntitySearchReturnType => {
  const [entityType, setEntityType] = React.useState<string | null>(defaultEntityType);
  const [page, setPage] = React.useState<number>(defaultPage);
  const [limit, setLimit] = React.useState<number>(defaultLimit);
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
    debounce(
      (query: string, entityType: string | null, page: number, limit: number, abortController: AbortController) => {
        // When query is an empty string just set no results
        if (query.trim() === "") {
          setEntities([]);
          setQueryFinal(query);
          return;
        }

        // Query
        setLoading(true);
        const client = new OADataAPI();
        client
          .searchEntities(query, entityType, page, limit, abortController)
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
      },
      searchDebounce,
    ),
    [],
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(query, entityType, page, limit, abortController);
    return () => abortController.abort();
  }, [query, entityType, page, limit, fetchData]);

  return {
    entities,
    query,
    setQuery,
    entityType,
    setEntityType,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    lastEntityRef,
    searchBoxOnChange,
    hasMore,
    queryFinal,
  };
};

export default useEntitySearch;

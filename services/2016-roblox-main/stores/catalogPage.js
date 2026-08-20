import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import getFlag from "../lib/getFlag";
import { getItemDetails, searchCatalog } from "../services/catalog";
import {useRouter} from "next/dist/client/router";

const stringToCategory = str => {
  // these are from catalog.roblox.com/v1/search/navigation-menu-items
  switch (str.toLowerCase().trim()) {
    case 'collectible':
    case 'collectibles':
      return 2;
    case 'featured':
      return 0;
    case 'accessories':
      return 11;
    case 'clothing':
      return 3;
    case 'gears':
    case 'gear':
      return 5;
    case 'bodyparts':
      return 4;
  }
  throw new Error('Invalid category "' + str + '"');
}

const stringToSubCategory = str => {
  // these are from catalog.roblox.com/v1/search/navigation-menu-items
  switch (str.toLowerCase().trim()) {
    case 'items':
    case 'hats':
      return 0; // todo: what do we put here?
    case 'all':
      return 0;
    case 'face':
    case 'faces':
      return 10;
    case 'packages':
      return 37; // todo: is this correct?
    case 'shirts':
      return 12;
    case 'tshirts':
      return 13;
    case 'pants':
      return 14;
    // gear categories
    case 'gear':
      return 0;
    case 'building':
      return 8;
    case 'explosive':
      return 3;
    case 'melee':
      return 1;
    case 'musical':
      return 6;
    case 'navigation':
      return 5;
    case 'powerup':
      return 4;
    case 'ranged':
      return 2;
    case 'social':
      return 7;
    case 'transport':
      return 9;
  }
  throw new Error('Invalid subcategory "' + str + '"');
}

const CatalogPageStore = createContainer(() => {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.keyword || '');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(getFlag('catalogPageLimit', 28));
  const [category, setCategory] = useState('Featured');
  const [subCategory, setSubCategory] = useState('');
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(null);
  const [total, setTotal] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [previousCursor, setPreviousCursor] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [sort, setSort] = useState(0);
  const [genres, setGenres] = useState([]);


  useEffect(() => {
    let cancelled = false;
    setLocked(true);

    searchCatalog({
      category,
      subCategory,
      query,
      limit,
      cursor,
      sort,
    })
      .then(async response => {
        if (!response || !Array.isArray(response.data)) {
          throw new Error('Invalid catalog response');
        }
        if (response.data.length === 0) {
          return response;
        }
        try {
          const assetDetails = await getItemDetails(response.data.map(v => v.id));
          const data = response.data.map(item => assetDetails.data.data.find(v => v.id === item.id)).filter(Boolean);
          return { ...response, data };
        } catch (error) {
          return response;
        }
      })
      .then(response => {
        if (cancelled) return;
        setResults(response);
        setNextCursor(response.nextPageCursor || null);
        setPreviousCursor(response.previousPageCursor || null);
        setTotal(typeof response._total === 'number' ? response._total : null);
      })
      .catch(() => {
        if (cancelled) return;
        setResults({ data: [] });
        setNextCursor(null);
        setPreviousCursor(null);
        setTotal(0);
      })
      .finally(() => {
        if (!cancelled) setLocked(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cursor, sort, category, subCategory, genres, query, limit]);

  const clearStatesForNewQuery = () => {
    setCursor(null);
    setPage(1);
  }

  return {
    locked,
    results,
    total,

    nextCursor,
    previousCursor,
    setCursor,

    sort,
    setSort,

    category,
    setCategory: (newCat) => {
      clearStatesForNewQuery();
      setCategory(newCat);
    },
    stringToCategory,

    subCategory,
    setSubCategory: (newSubCat) => {
      clearStatesForNewQuery();
      setSubCategory(newSubCat);
    },
    stringToSubCategory,

    genres,
    setGenres: (newGenres) => {
      clearStatesForNewQuery();
      setGenres(newGenres);
    },

    query,
    setQuery: (newQuery) => {
      clearStatesForNewQuery();
      setQuery(newQuery);
    },

    limit,
    setLimit: (newLimit) => {
      clearStatesForNewQuery();
      setLimit(newLimit);
    },

    page,
    setPage,
  }
});

export default CatalogPageStore;
import request, { getBaseUrl } from "../lib/request"
import { getFullUrl } from "../lib/request";
import getFlag from "../lib/getFlag";

const robloxCatalogBaseUrl = 'https://catalog.roblox.com';
const getRobloxCatalogUrl = (path) => robloxCatalogBaseUrl + path;

export const itemNameToEncodedName = (str) => {
  if (typeof str !== 'string') {
    str = '';
  }
  // https://stackoverflow.com/questions/987105/asp-net-mvc-routing-vs-reserved-filenames-in-windows
  var seoName = str.replace(/'/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(COM\d|LPT\d|AUX|PRT|NUL|CON|BIN)$/i, "") || "unnamed";
  return seoName;
}

const itemPageLate2016Enabled = getFlag('itemPageLate2016Enabled', false);
const csrEnabled = getFlag('clientSideRenderingEnabled', false);

export const getItemUrl = ({ assetId, name }) => {
  return `/catalog/${assetId}/${itemNameToEncodedName(name)}`;
}

const categoryIds = {
  all: 1,
  featured: 0,
  collectibles: 2,
  accessories: 11,
  clothing: 3,
  null: 3,
  bodyparts: 4,
  gear: 5,
};

const subcategoryIds = {
  all: 0,
  items: 0,
  hats: 0,
  accessories: 0,
  faces: 10,
  face: 10,
  packages: 37,
  shirts: 12,
  shirt: 12,
  teeshirt: 13,
  tshirts: 13,
  pants: 14,
  gear: 0,
  building: 8,
  explosive: 3,
  melee: 1,
  musical: 6,
  navigation: 5,
  powerup: 4,
  ranged: 2,
  social: 7,
  transport: 9,
};

const getCategoryId = (category) => {
  const value = String(category || '').toLowerCase().trim();
  return typeof categoryIds[value] === 'number' ? categoryIds[value] : category;
};

const getSubcategoryId = (subcategory) => {
  const value = String(subcategory || '').toLowerCase().trim();
  return typeof subcategoryIds[value] === 'number' ? subcategoryIds[value] : subcategory;
};

export const searchCatalog = ({ category, subCategory, query, limit, cursor, sort, creatorType, creatorId }) => {
  const categoryId = getCategoryId(category);
  const subcategoryId = getSubcategoryId(subCategory);
  let url = '/v1/search/items?category=' + categoryId + '&limit=' + limit + '&sortType=' + sort;
  if (cursor) {
    url += '&cursor=' + encodeURIComponent(cursor);
  }
  if (query) {
    url += '&keyword='+encodeURIComponent(query);
  }
  if (subCategory) {
    url += '&subcategory=' + encodeURIComponent(subcategoryId);
  }
  if (creatorType && creatorId) {
    url += '&creatorTargetId=' + creatorId +'&creatorType=' + creatorType;
  }
  return request('GET', getRobloxCatalogUrl(url)).then(d => d.data);
}

/**
 * Only use this on server-side requests.
 * @param {number} assetId 
 */
export const getProductInfoLegacy = async (assetId) => {
  return request('GET', getFullUrl('api', '/marketplace/productinfo?assetId=' + assetId)).then(d => d.data);
}

export const getItemDetails = async (assetIdArray) => {
  if (assetIdArray.length === 0) return {data:{data: []}}
  while (true) {
    try {
      const res = await request('POST', getRobloxCatalogUrl('/v1/catalog/items/details'), {
        items: assetIdArray.map(v => {
          return {
            itemType: 'Asset',
            id: v,
          }
        })
      });
      for (const item of res.data.data) {
        if (typeof item.isForSale === 'undefined') {
          item.isForSale = (item.unitsAvailableForConsumption !== 0 && typeof item.price === 'number' && typeof item.lowestPrice === 'undefined');
        }
      }
      return res;
    } catch (e) {
      // @ts-ignore
      if (e.response && e.response.status === 429 && process.browser) {
        await new Promise((res) => setTimeout(res, 2500));
        continue;
      }
      throw e;
    }
  }
}

export const getRecommendations = ({ assetId, assetTypeId, limit }) => {
  return request('GET', getFullUrl('catalog', '/v1/recommendations/asset/' + assetTypeId + '?contextAssetId=' + assetId + '&numItems=' + limit)).then(d => d.data);
}

export const getComments = async ({ assetId, offset }) => {
  return request('GET', getBaseUrl() + 'comments/get-json?assetId=' + assetId + '&startIndex=' + offset + '&thumbnailWidth=100&thumbnailHeight=100&thumbnailFormat=PNG&cachebuster=' + Math.random()).then(d => d.data);
}

export const createComment = async ({ assetId, comment }) => {
  let result = await request('POST', getBaseUrl() + 'comments/post', {
    text: comment,
    assetId: assetId,
  });
  if (typeof result.data.ErrorCode === 'string') {
    throw new Error(result.data.ErrorCode);
  }
  return result.data;
}

export const addOrRemoveFromCollections = ({ assetId, addToProfile }) => {
  return request('POST', getBaseUrl() + 'asset/toggle-profile', {
    assetId,
    addToProfile,
  })
}

export const deleteFromInventory = ({ assetId }) => {
  return request ('POST', getBaseUrl() + "apisite/inventory/v1/delete-from-inventory", {
    assetId: assetId
  })
}

export const getIsFavorited = async ({assetId, userId}) => {
  return await request('GET', getFullUrl('catalog', '/v1/favorites/users/'+userId+'/assets/'+assetId+'/favorite')).then(d => d.data);
}

export const createFavorite = async ({assetId, userId}) => {
  return await request('POST', getFullUrl('catalog', '/v1/favorites/users/'+userId+'/assets/'+assetId+'/favorite'));
}

export const deleteFavorite = async ({assetId, userId}) => {
  return await request('DELETE', getFullUrl('catalog', '/v1/favorites/users/'+userId+'/assets/'+assetId+'/favorite'));
}
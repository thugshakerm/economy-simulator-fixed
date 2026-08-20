import React, { useState } from "react";
import CatalogPageStore from "../../stores/catalogPage";
import CatalogPageCard from "../catalogPageCard";
import CatalogPagination from "../catalogPagination";

const sortOptions = [
  [0, "Relevance"],
  [100, "Most Favorited"],
  [101, "Bestselling"],
  [3, "Recently Updated"],
  [5, "Price (High to Low)"],
  [4, "Price (Low to High)"],
];

const timeOptions = [
  [0, "All Time"],
  [1, "Past Week"],
  [2, "Past Day"],
];

const CatalogSortMenu = ({ value, options, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(([key]) => key === value) || options[0];

  return (
    <div className={`input-group-btn ${className}`}>
      <button
        type="button"
        className="input-dropdown-btn"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className="rbx-selection-label">{selected[1]}</span>
        <span className="icon-down-16x16" />
      </button>
      <ul className={`dropdown-menu${open ? " show" : ""}`} role="menu">
        {options.map(([key, label]) => (
          <li key={key}>
            <a
              href="#"
              className="text-overflow"
              onClick={(event) => {
                event.preventDefault();
                onChange(key);
                setOpen(false);
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const displayCategory = (category, subCategory) => {
  if (!category || category === "Featured") return "Featured";
  if (subCategory) return `${category} - ${subCategory}`;
  return category;
};

const CatalogPageResults = () => {
  const store = CatalogPageStore.useContainer();
  const results = store.results && Array.isArray(store.results.data)
    ? store.results.data
    : [];
  const hasLoaded = store.results !== null;
  const currentCategory = displayCategory(store.category, store.subCategory);
  const showTimeSort = [100, 101, 3].includes(store.sort);
  const [timeSort, setTimeSort] = useState(0);

  return (
    <div className="catalog-results">
      <h3 className="featured-items-heading">
        <span className="line-height">
          {store.category === "Featured" ? (
            <>
              Featured Items on <span className="text-roblox">Roblox</span>
            </>
          ) : (
            currentCategory
          )}
        </span>
        <a className="btn-growth-md buy-robux" href="/upgrades/robux?ctx=catalogNew">
          Buy Robux
        </a>
      </h3>

      <div>
        <div className="breadcrumbs">
          <ul className="breadcrumb-container">
            <li>
              <a href="#" className="text-link breadcrumb-link" onClick={(event) => event.preventDefault()}>
                {store.category || "Featured"}
              </a>
            </li>
            {store.subCategory && (
              <li>
                <span className="icon-right-16x16" />
                <a href="#" className="text-link breadcrumb-link" onClick={(event) => event.preventDefault()}>
                  {store.subCategory}
                </a>
              </li>
            )}
          </ul>
          <div className="sort-menus">
            <CatalogSortMenu
              className="sort-dropdown"
              value={store.sort}
              options={sortOptions}
              onChange={(value) => store.setSort(value)}
            />
            {showTimeSort && (
              <CatalogSortMenu
                className="subsort-dropdown"
                value={timeSort}
                options={timeOptions}
                onChange={setTimeSort}
              />
            )}
          </div>
        </div>
      </div>

      <div
        id="results"
        className="results-container"
        style={store.locked ? { opacity: 0.45 } : undefined}
      >
        {!hasLoaded && <div className="spinner spinner-sm" />}
        {hasLoaded && store.unavailable && (
          <div className="section-content-off">
            Catalog temporarily unavailable. Please try again later.
          </div>
        )}
        {hasLoaded && !store.unavailable && results.length === 0 && (
          <div className="section-content-off">No items found.</div>
        )}
        {hasLoaded && results.length > 0 && (
          <ul className="hlist item-cards-stackable">
            {results.map((item) => (
              <CatalogPageCard key={item.id} {...item} />
            ))}
          </ul>
        )}
      </div>

      <div className="pager-holder">
        <CatalogPagination />
      </div>
    </div>
  );
};

export default CatalogPageResults;

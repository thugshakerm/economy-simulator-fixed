import Head from "next/head";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CatalogPageStore from "../../stores/catalogPage";
import thumbnailStore from "../../stores/thumbnailStore";
import request, { getBaseUrl } from "../../lib/request";
import { getItemUrl } from "../../services/catalog";
import Link from "../../components/link";

const referenceStylesheets = [
  "https://static.rbxcdn.com/css/leanbase___3678d89e5ec3f4d8c65d863691f31de2_m.css/fetch",
  "https://static.rbxcdn.com/css/page___939c7ccb41b37d084d6f1fc38ab7944a_m.css/fetch",
  "https://css.rbxcdn.com/9b2011aa623fd2222f11fd6c4049f6d2b65bfaa1e4fc9f0d3a92299b41f6c359.css",
  "https://css.rbxcdn.com/c9760f7bc354c469cbc935616fb00d97793aa309d155644de1b3ff2824efc5c0.css",
  "https://css.rbxcdn.com/55b250e8473888792f885d898973a13692fb22157baf61aaffa62ce4545f3408.css",
  "https://css.rbxcdn.com/3f27251ce64d1aedcaabe204116653a48c5faa3bf006fa2aa180b29f48e528c3.css",
];

const catalogCss = `
          :host { display: block; background: #fff; }
          body { margin: 0; min-width: 320px; min-height: 100vh; width: 100%; font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif; font-size: 14px; }
          .navbar-wrapper-main .navbar { min-height: 0; margin-bottom: 0; border: 0; border-radius: 0; }
          .navbar-wrapper-main .navbar > .container { width: 100%; max-width: 100% !important; padding-left: 12px; padding-right: 12px; }
          .navbar-wrapper-main .navbar .row { margin-left: -12px; margin-right: -12px; }
          .navbar-wrapper-main .navbar [class*="col-"] { position: relative; min-height: 1px; padding-left: 12px; padding-right: 12px; }
          .navbar-wrapper-main .navbar input.form-control { margin: 0; }
          .catalog-one-file-page { margin-top: 0; font-family: 'HCo Gotham SSm', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; }
          .catalog-one-file-page { min-height: 100vh; background: #fff !important; color: #393b3d; }
          .catalog-one-file-page .container-main, .catalog-one-file-page .content, .catalog-one-file-page .catalog-container, .catalog-one-file-page #catalog-container, .catalog-one-file-page .catalog-page { background: #fff !important; }
          .catalog-one-file-page .container-main { margin-top: 0; }
          .catalog-one-file-page .content { max-width: 1240px; margin: 0 auto; padding: 0 12px 40px; }
          .catalog-one-file-page .catalog-ad img { display: block; width: 100%; height: auto; margin: 0 auto; }
          .catalog-one-file-page .catalog-ad { min-height: 90px; }
          .catalog-one-file-page .search-bars { min-height: 54px; }
          .catalog-one-file-page .catalog-desktop-search .search-container { display: block; }
          .catalog-one-file-page .search-options { display: block; }
          .catalog-one-file-page .catalog-results { min-height: 500px; }
          .catalog-one-file-page .catalog-results-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
          .catalog-one-file-page .catalog-results-header .featured-items-heading { margin: 0; padding: 0 0 4px 5px; }
          .catalog-one-file-page .catalog-results-header .sort-menus { display: flex; align-items: center; float: none; margin-left: auto; }
          .catalog-one-file-page .item-card-thumb-container { overflow: hidden; }
          .catalog-one-file-page .item-card-thumb-container .placeholder-asset-container { width: 150px; height: 150px; position: relative; }
          .catalog-one-file-page .item-card-thumb-container .item-card-thumb { display: block; object-fit: contain; background: #f2f2f2; }
          .catalog-one-file-page .item-card-caption .item-card-name-link { color: #393b3d; }
          .catalog-one-file-page .item-card-price .icon-robux-16x16, .catalog-one-file-page .item-card-price .icon-robux-gray { display: inline-block; float: none; vertical-align: -3px; }
          .catalog-one-file-page .catalog-custom-price .has-input { display: block; }
          .catalog-one-file-page .catalog-custom-price .price-input { display: block; width: 126px; height: 24px; padding: 0 5px; margin: 0 2px 6px 0; }
          .catalog-one-file-page .catalog-custom-price .price-input:last-of-type { margin-bottom: 0; }
          .catalog-one-file-page .catalog-custom-price .btn-update-filter { display: block; margin-top: 6px; }
          @media (max-width: 767px) {
            .catalog-one-file-page .catalog-custom-price .price-input { display: inline-block; width: 90px; height: 38px; margin: 0; }
            .catalog-one-file-page .catalog-custom-price .btn-update-filter { display: none; }
          }
          .catalog-one-file-page .dropdown-menu.show { display: block; }
          .catalog-one-file-page .pager-holder-inner { text-align: center; }
          .catalog-one-file-page .mobile-search-options { display: none; }
          .catalog-one-file-page .catalog-category-separator { border-top: 1px solid #b8b8b8; margin: 8px 12px 8px 0; }
          @media (max-width: 767px) {
            .catalog-one-file-page .content { max-width: 100%; margin: 0; padding: 0 5px 24px; }
            .catalog-one-file-page .catalog-desktop-search { display: none; }
            .catalog-one-file-page .search-bars { min-height: 98px; }
            .catalog-one-file-page .catalog-results-header { display: block; }
            .catalog-one-file-page .catalog-results-header .sort-menus { justify-content: flex-end; margin-top: 4px; }
            .catalog-one-file-page .search-options { display: none; }
            .catalog-one-file-page .mobile-search-options.catalog-mobile-open { display: block; position: absolute; z-index: 1200; left: 5px; right: 5px; background: #fff; box-shadow: 0 3px 12px rgba(0,0,0,.28); }
            .catalog-one-file-page .catalog-results { width: 100%; float: none; margin-top: 0; }
            .catalog-one-file-page .breadcrumbs { display: block; text-align: left; }
            .catalog-one-file-page .breadcrumbs .breadcrumb-container { display: none; }
            .catalog-one-file-page .breadcrumbs .sort-menus { float: none; width: 100%; text-align: right; }
            .catalog-one-file-page .catalog-results .item-cards-stackable .item-card { width: 100%; }
          }
`;

const navigationItems = [
  {
    name: "Featured",
    clickData: "",
    children: {
      title: "Featured Types",
      children: [
        ["All Featured Items", "Featured,"],
        ["Featured Hats", "Featured,Accessories"],
        ["Featured Gear", "Featured,Gear"],
        ["Featured Faces", "Featured,Faces"],
      ],
    },
  },
  {
    name: "Collectibles",
    clickData: "",
    children: {
      title: "Collectible Types",
      children: [
        ["All Collectibles", "Collectibles,"],
        ["Collectible Faces", "Collectibles,Faces"],
        ["Collectible Hats", "Collectibles,Accessories"],
        ["Collectible Gear", "Collectibles,Gear"],
      ],
    },
  },
  { name: "separator", clickData: "" },
  { name: "All Categories", clickData: "all,all" },
  {
    name: "Clothing",
    clickData: "",
    children: {
      title: "Clothing Types",
      children: [
        ["All Clothing", "null,Clothing"],
        ["Hats", "null,Accessories"],
        ["Shirts", "null,Shirt"],
        ["T-Shirts", "null,TeeShirt"],
        ["Pants", "null,Pants"],
        ["Packages", "null,Packages"],
      ],
    },
  },
  {
    name: "Body Parts",
    clickData: "",
    children: {
      title: "Body Part Types",
      children: [
        ["All Body Parts", "bodyparts,All"],
        ["Heads", "bodyparts,Heads"],
        ["Faces", "bodyparts,Faces"],
        ["Packages", "bodyparts,Packages"],
      ],
    },
  },
  {
    name: "Gear",
    clickData: "",
    children: {
      title: "Gear Categories",
      children: [
        ["All Gear", "gear,all"],
        ["Melee Weapon", "gear,melee"],
        ["Ranged Weapon", "gear,ranged"],
        ["Explosive", "gear,explosive"],
        ["Power Up", "gear,powerup"],
        ["Navigation Enhancer", "gear,navigation"],
        ["Musical Instrument", "gear,musical"],
        ["Social Item", "gear,social"],
        ["Building Tool", "gear,building"],
        ["Personal Transport", "gear,transport"],
      ],
    },
  },
];

const genres = [
  [13, "Building"],
  [5, "Horror"],
  [1, "Town and City"],
  [11, "Military"],
  [9, "Comedy"],
  [2, "Medieval"],
  [7, "Adventure"],
  [3, "Sci-Fi"],
  [6, "Naval"],
  [14, "FPS"],
  [15, "RPG"],
  [8, "Sports"],
  [4, "Fighting"],
  [10, "Western"],
];

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

const emptyPrice = { mode: "any", min: "", max: "" };
const PriceContext = createContext({
  draft: emptyPrice,
  applied: emptyPrice,
  setDraft: () => {},
  apply: () => {},
});

const categoryLabel = (category) => {
  switch ((category || "").toLowerCase()) {
    case "all":
      return "All Categories";
    case "null":
      return "Clothing";
    case "bodyparts":
      return "Body Parts";
    case "gear":
      return "Gear";
    case "collectibles":
      return "Collectibles";
    case "featured":
      return "Featured";
    default:
      return category || "Featured";
  }
};

const CatalogSearchMenu = ({ store, open, setOpen }) => (
  <div className="input-group-btn">
    <button
      type="button"
      className="input-dropdown-btn category-options"
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <span className="text-overflow rbx-selection-label">
        {categoryLabel(store.category)}
      </span>
      <span className="icon-down-16x16" />
    </button>
    <ul className={`dropdown-menu${open ? " show" : ""}`} role="menu">
      {[
        ["All Categories", "all"],
        ["Featured", "Featured"],
        ["Collectibles", "Collectibles"],
        ["Clothing", "null"],
        ["Body Parts", "bodyparts"],
        ["Gear", "gear"],
      ].map(([label, value]) => (
        <li key={value}>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              store.setCategory(value);
              store.setSubCategory("");
              setOpen(false);
            }}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
    <button className="input-addon-btn" type="submit" aria-label="Search catalog">
      <span className="icon-search" />
    </button>
  </div>
);

const CatalogSearchForm = ({ mobile = false }) => {
  const store = CatalogPageStore.useContainer();
  const [keyword, setKeyword] = useState(store.query || "");
  const [categoryOpen, setCategoryOpen] = useState(false);

  useEffect(() => {
    setKeyword(store.query || "");
  }, [store.query]);

  const submit = (event) => {
    event.preventDefault();
    if (!store.locked) store.setQuery(keyword.trim());
  };

  if (mobile) {
    return (
      <form className="form-horizontal search-form" onSubmit={submit}>
        <div className="form-group">
          <div className="input-group">
            <input
              className="form-control input-field"
              placeholder="Search"
              type="text"
              maxLength="50"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <div className="input-group-btn">
              <button className="input-addon-btn" type="submit">
                <span className="icon-search" />
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form className="search-form" onSubmit={submit}>
      <div className="input-group">
        <input
          className="form-control input-field search-input"
          placeholder="Search"
          maxLength="50"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <CatalogSearchMenu
          store={store}
          open={categoryOpen}
          setOpen={setCategoryOpen}
        />
      </div>
    </form>
  );
};

const CatalogSearch = ({ onOpenMobile }) => (
  <>
    <div className="mobile-search-container">
      <div className="search-bar">
        <button
          id="search-options-button"
          type="button"
          className="btn-generic-menu-black-md mobile-menu-button"
          aria-label="Open catalog filters"
          onClick={() => onOpenMobile(true)}
        >
          <span className="icon-menu-black" />
        </button>
        <CatalogSearchForm mobile />
      </div>
    </div>
    <div className="clearfix catalog-desktop-search">
      <div className="search-container">
        <CatalogSearchForm />
      </div>
    </div>
  </>
);

const CatalogFilters = () => {
  const store = CatalogPageStore.useContainer();
  const { draft, setDraft, apply } = useContext(PriceContext);
  const [unavailable, setUnavailable] = useState("hide");

  const toggleGenre = (genre) => {
    const next = store.genres.includes(genre)
      ? store.genres.filter((value) => value !== genre)
      : [...store.genres, genre];
    store.setGenres(next);
  };

  const setPriceMode = (mode) => {
    const next = { ...draft, mode };
    setDraft(next);
    if (mode !== "custom") apply(next);
  };

  return (
    <div className="border-bottom filters-section">
      <div>
        <div className="font-header-2 filter-label">Genre</div>
        <div>
          <a
            href="#"
            className="small text all-genres-filter menu-link"
            onClick={(event) => {
              event.preventDefault();
              store.setGenres([]);
            }}
          >
            All Genres
          </a>
          <ul>
            {genres.map(([id, name]) => (
              <li className="checkbox top-border font-caption-body" key={id}>
                <input
                  id={`genre-${id}`}
                  type="checkbox"
                  checked={store.genres.includes(id)}
                  onChange={() => toggleGenre(id)}
                />
                <label htmlFor={`genre-${id}`}>{name}</label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="filter-label font-header-2">Price</div>
      <div>
        <ul>
          <li className="radio top-border font-caption-body">
            <input
              id="radio-price-0"
              type="radio"
              name="catalog-price"
              checked={draft.mode === "any"}
              onChange={() => setPriceMode("any")}
            />
            <label htmlFor="radio-price-0">Any Price</label>
          </li>
          <li className="radio top-border font-caption-body catalog-custom-price">
            <input
              id="radio-price-3"
              type="radio"
              name="catalog-price"
              checked={draft.mode === "custom"}
              onChange={() => setDraft({ ...draft, mode: "custom" })}
            />
            <label htmlFor="radio-price-3" className="has-input">
              <input
                className="form-control input-field input-number price-input font-caption-body"
                type="number"
                min="0"
                name="minPrice"
                placeholder="Min"
                value={draft.min}
                onChange={(event) => setDraft({ ...draft, mode: "custom", min: event.target.value })}
                onFocus={() => setDraft({ ...draft, mode: "custom" })}
              />
              <input
                className="form-control input-field input-number price-input font-caption-body"
                type="number"
                min="0"
                name="maxPrice"
                placeholder="Max"
                value={draft.max}
                onChange={(event) => setDraft({ ...draft, mode: "custom", max: event.target.value })}
                onFocus={() => setDraft({ ...draft, mode: "custom" })}
              />
              <button
                type="button"
                className="btn-secondary-xs btn-update-filter"
                disabled={draft.mode !== "custom"}
                onClick={() => apply({ ...draft, mode: "custom" })}
              >
                Go
              </button>
            </label>
          </li>
          <li className="radio top-border font-caption-body">
            <input
              id="radio-price-5"
              type="radio"
              name="catalog-price"
              checked={draft.mode === "free"}
              onChange={() => setPriceMode("free")}
            />
            <label htmlFor="radio-price-5">Free</label>
          </li>
        </ul>
      </div>
      <div className="font-header-2 filter-label">Unavailable Items</div>
      <div>
        <ul>
          <li className="radio top-border font-caption-body">
            <input
              id="radio-unavailable-hide"
              type="radio"
              name="catalog-unavailable"
              checked={unavailable === "hide"}
              onChange={() => setUnavailable("hide")}
            />
            <label htmlFor="radio-unavailable-hide">Hide</label>
          </li>
          <li className="radio top-border font-caption-body">
            <input
              id="radio-unavailable-show"
              type="radio"
              name="catalog-unavailable"
              checked={unavailable === "show"}
              onChange={() => setUnavailable("show")}
            />
            <label htmlFor="radio-unavailable-show">Show</label>
          </li>
        </ul>
      </div>
    </div>
  );
};

const CatalogSidebar = () => {
  const store = CatalogPageStore.useContainer();
  const [open, setOpen] = useState("Featured");

  const select = (clickData) => {
    if (store.locked || !clickData) return;
    const [category, subCategory] = clickData.split(",");
    if (!category) return;
    store.setCategory(category);
    store.setSubCategory(subCategory || "");
  };

  const isSelected = (clickData) => {
    if (!clickData) return false;
    const [category, subCategory] = clickData.split(",");
    return store.category === category && (store.subCategory || "") === (subCategory || "");
  };

  return (
    <div id="search-options" className="search-options">
      <form className="border-right search-options-form" role="form" noValidate>
        <div className="border-bottom category-section">
          <h3 className="font-header-1 search-options-header">Category</h3>
          <ul id="category-panel-group" className="panel-group">
            {navigationItems.map((item, index) => {
              if (item.name === "separator") {
                return <li className="top-border catalog-category-separator" key={`separator-${index}`} />;
              }

              const hasChildren = Boolean(item.children);
              const expanded = open === item.name;
              return (
                <li className="font-header-2 text-subheader panel panel-default" key={item.name}>
                  <a
                    href={`#category-${index}`}
                    className="small text menu-link text-link-secondary panel-heading"
                    role="tab"
                    aria-expanded={expanded}
                    onClick={(event) => {
                      event.preventDefault();
                      if (hasChildren) {
                        setOpen(expanded ? null : item.name);
                      } else {
                        select(item.clickData);
                      }
                    }}
                  >
                    {item.name === "All Categories" ? (
                      <span className="category-view-all">View All Items</span>
                    ) : (
                      <span className="category-name">{item.name}</span>
                    )}
                    {hasChildren && (
                      <span className={`${expanded ? "icon-minus" : "icon-plus"} toggle-submenu`} />
                    )}
                  </a>
                  {hasChildren && (
                    <div
                      id={`category-${index}`}
                      className={`panel-collapse collapse${expanded ? " in show" : ""}`}
                      role="tabpanel"
                    >
                      <ul className="subcategory-menu">
                        {item.children.children.map(([label, clickData]) => (
                          <li className="top-border" key={label}>
                            <a
                              href="#"
                              className={`small text menu-link text-link-secondary${isSelected(clickData) ? " active" : ""}`}
                              onClick={(event) => {
                                event.preventDefault();
                                select(clickData);
                              }}
                            >
                              {label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        <CatalogFilters />
      </form>
    </div>
  );
};

const CatalogMobileSearchOptions = ({ open, onClose }) => {
  const store = CatalogPageStore.useContainer();
  const { draft, apply } = useContext(PriceContext);
  const [tab, setTab] = useState("category");
  const [openCategory, setOpenCategory] = useState(null);

  const isSelected = (clickData) => {
    const [category, subCategory] = clickData.split(",");
    return store.category === category && (store.subCategory || "") === (subCategory || "");
  };

  const select = (clickData) => {
    const [category, subCategory] = clickData.split(",");
    store.setCategory(category);
    store.setSubCategory(subCategory || "");
  };

  return (
    <div
      id="mobile-search-options"
      className={`mobile-panel mobile-search-options${open ? " catalog-mobile-open" : ""}`}
    >
      <form className="search-options-form" role="form" noValidate>
        <div className="rbx-tabs-horizontal">
          <ul id="horizontal-tabs" className="nav nav-tabs" role="tablist">
            {[
              ["category", "Category"],
              ["filter", "Filter"],
              ["sorting", "Sorting"],
            ].map(([key, label]) => (
              <li className={`rbx-tab${tab === key ? " active" : ""}`} key={key}>
                <a
                  href={`#${key}-tab`}
                  className="rbx-tab-heading"
                  onClick={(event) => {
                    event.preventDefault();
                    setTab(key);
                  }}
                >
                  <span className="font-header-1">{label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="tab-content rbx-tab-content">
            {tab === "category" && (
              <div id="category-tab" className="section-content tab-pane active">
                <ul className="panel-group">
                  {navigationItems.filter((item) => item.name !== "separator").map((item) => {
                    const hasChildren = Boolean(item.children);
                    const expanded = openCategory === item.name;
                    const selected = hasChildren
                      ? item.children.children.some(([, clickData]) => isSelected(clickData))
                      : isSelected(item.clickData);
                    return (
                      <li className="panel panel-default" key={item.name}>
                        <a
                          className={`panel-heading${selected ? " font-bold" : ""}`}
                          href={`#mobile-${item.name}`}
                          onClick={(event) => {
                            event.preventDefault();
                            if (hasChildren) {
                              setOpenCategory(expanded ? null : item.name);
                            } else {
                              select(item.clickData);
                            }
                          }}
                        >
                          {selected && <span className="icon-checkmark-blue selected-icon" />}
                          {item.name === "All Categories" ? "All Categories" : item.name}
                          {hasChildren && <span className={`${expanded ? "icon-up-16x16" : "icon-down-16x16"} arrow-icon`} />}
                        </a>
                        {hasChildren && (
                          <div
                            id={`mobile-${item.name}`}
                            className={`panel-collapse collapse${expanded ? " in show" : ""}`}
                            role="tabpanel"
                          >
                            <ul>
                              {item.children.children.map(([label, clickData]) => (
                                <li className="radio top-border" key={label}>
                                  <input
                                    id={`mobile-${item.name}-${label}`.replace(/\s+/g, "-")}
                                    type="radio"
                                    name="mobile-catalog-category"
                                    checked={isSelected(clickData)}
                                    onChange={() => select(clickData)}
                                  />
                                  <label htmlFor={`mobile-${item.name}-${label}`.replace(/\s+/g, "-")}>
                                    {label}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {tab === "filter" && (
              <div id="filter-tab" className="section-content tab-pane active">
                <CatalogFilters />
              </div>
            )}
            {tab === "sorting" && (
              <div id="sorting-tab" className="section-content tab-pane active">
                <div className="font-header-2 filter-label">Sort By</div>
                <ul>
                  {sortOptions.map(([value, label]) => (
                    <li className="radio top-border" key={value}>
                      <input
                        id={`mobile-sort-${value}`}
                        type="radio"
                        name="mobile-catalog-sort"
                        checked={store.sort === value}
                        onChange={() => store.setSort(value)}
                      />
                      <label htmlFor={`mobile-sort-${value}`}>{label}</label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="button-container">
          <button type="button" id="cancel-button" className="btn-control-lg" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary-lg apply-button"
            onClick={() => {
              apply(draft);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

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

const ItemPrice = (props) => {
  const isLimited = props.itemRestrictions && (
    props.itemRestrictions.includes("Limited") || props.itemRestrictions.includes("LimitedUnique")
  );

  if (props.isForSale && props.price === 0) return <span className="text-robux">Free</span>;
  if (props.isForSale && typeof props.price === "number") {
    return (
      <>
        <span className="icon-robux-16x16" />
        <span className="text-robux">{props.price.toLocaleString()}</span>
      </>
    );
  }
  if (isLimited) {
    return (
      <>
        <span className="text-label">Was </span>
        <span className="icon-robux-gray" />
        <span className="strike-through">{(props.price || 0).toLocaleString()}</span>
      </>
    );
  }
  return <span className="text-robux">Offsale</span>;
};

const CatalogItemCard = (props) => {
  const thumbs = thumbnailStore.useContainer();
  const [image, setImage] = useState(thumbs.getPlaceholder());
  const isLimitedUnique = props.itemRestrictions && props.itemRestrictions.includes("LimitedUnique");
  const isLimited = props.itemRestrictions && props.itemRestrictions.includes("Limited");

  useEffect(() => {
    setImage(thumbs.getAssetThumbnail(props.id));
  }, [props.id, thumbs.thumbnails]);

  return (
    <li className="list-item item-card">
      <div className="item-card-container">
        <Link href={getItemUrl({ assetId: props.id, name: props.name })}>
          <a className="item-card-link">
            <div className="item-card-thumb-container">
              <div className="placeholder-asset-container">
                <img
                  className="item-card-thumb"
                  src={image}
                  alt={props.name || "Catalog item"}
                  onError={(event) => {
                    if (event.currentTarget.src !== thumbs.getPlaceholder()) {
                      setImage(thumbs.getPlaceholder());
                    }
                  }}
                />
                {isLimitedUnique && <span className="icon-limited-unique-label" />}
                {isLimited && !isLimitedUnique && <span className="icon-limited-label" />}
              </div>
            </div>
          </a>
        </Link>
        <div className="item-card-caption">
          <Link href={getItemUrl({ assetId: props.id, name: props.name })}>
            <a className="item-card-name-link">
              <div className="text-overflow item-card-name">{props.name || "Unnamed item"}</div>
            </a>
          </Link>
          <div className="text-overflow text-secondary item-card-label">
            {props.unitsAvailableForConsumption
              ? `Remaining: ${props.unitsAvailableForConsumption.toLocaleString()}`
              : "\u00a0"}
          </div>
          <div className="item-card-price margin-top-none">
            <ItemPrice {...props} />
          </div>
        </div>
      </div>
    </li>
  );
};

const CatalogPagination = () => {
  const store = CatalogPageStore.useContainer();
  const pageCount = typeof store.total === "number"
    ? Math.max(1, Math.ceil(store.total / store.limit))
    : null;
  const previousDisabled = store.page <= 1 || store.locked;
  const nextDisabled = store.locked || (pageCount !== null && store.page >= pageCount);

  const move = (direction) => (event) => {
    event.preventDefault();
    if (direction < 0) {
      if (previousDisabled) return;
      store.setPage(store.page - 1);
      store.setCursor(store.previousCursor || "");
    } else {
      if (nextDisabled) return;
      store.setPage(store.page + 1);
      store.setCursor(store.nextCursor || "");
    }
  };

  return (
    <div className="pager-holder-inner">
      <ul className="pager">
        <li className={`pager-prev${previousDisabled ? " disabled" : ""}`}>
          <a href="#" onClick={move(-1)} aria-label="Previous page"><span className="icon-back" /></a>
        </li>
        <li><span>Page {store.page}{pageCount !== null ? ` of ${pageCount.toLocaleString()}` : ""}</span></li>
        <li className={`pager-next${nextDisabled ? " disabled" : ""}`}>
          <a href="#" onClick={move(1)} aria-label="Next page"><span className="icon-next" /></a>
        </li>
      </ul>
    </div>
  );
};

const CatalogResults = () => {
  const store = CatalogPageStore.useContainer();
  const { applied } = useContext(PriceContext);
  const allResults = store.results && Array.isArray(store.results.data) ? store.results.data : [];
  const results = allResults.filter((item) => {
    if (applied.mode === "free") return item.price === 0;
    if (applied.mode !== "custom") return true;
    const price = typeof item.price === "number" ? item.price : null;
    if (price === null) return false;
    if (applied.min !== "" && price < Number(applied.min)) return false;
    if (applied.max !== "" && price > Number(applied.max)) return false;
    return true;
  });
  const loaded = store.results !== null;
  const [timeSort, setTimeSort] = useState(0);
  const showTimeSort = [100, 101, 3].includes(store.sort);
  const currentCategory = categoryLabel(store.category);
  const title = store.category === "Featured"
    ? "Featured Items on Roblox"
    : `${currentCategory}${store.subCategory ? ` - ${store.subCategory}` : ""}`;

  return (
    <div className="catalog-results">
      <div className="catalog-results-header">
        <h3 className="featured-items-heading">
          <span className="line-height">{title}</span>
        </h3>
        <div className="sort-menus">
          <CatalogSortMenu value={store.sort} options={sortOptions} onChange={store.setSort} className="sort-dropdown" />
          {showTimeSort && <CatalogSortMenu value={timeSort} options={timeOptions} onChange={setTimeSort} className="subsort-dropdown" />}
        </div>
      </div>
      <div>
        <div className="breadcrumbs">
          <ul className="breadcrumb-container">
            <li><a href="#" className="text-link breadcrumb-link" onClick={(event) => event.preventDefault()}>{currentCategory}</a></li>
            {store.subCategory && <li><span className="icon-right-16x16" /><a href="#" className="text-link breadcrumb-link" onClick={(event) => event.preventDefault()}>{store.subCategory}</a></li>}
          </ul>
        </div>
      </div>
      <div id="results" className="results-container" style={store.locked ? { opacity: 0.45 } : undefined}>
        {!loaded && <div className="spinner spinner-sm" />}
        {loaded && results.length === 0 && <div className="section-content-off">No items found.</div>}
        {loaded && results.length > 0 && (
          <ul className="hlist item-cards-stackable">
            {results.map((item) => <CatalogItemCard key={item.id} {...item} />)}
          </ul>
        )}
      </div>
      <div className="pager-holder"><CatalogPagination /></div>
    </div>
  );
};

const CatalogAd = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    request('GET', `${getBaseUrl()}/user-sponsorship/1`)
      .then(response => {
        const document = new DOMParser().parseFromString(response.data, 'text/html');
        const image = document.querySelector('img');
        const link = document.querySelector('a');
        if (!image || !link) return;
        setAd({
          image: image.getAttribute('src'),
          href: link.getAttribute('href'),
          title: link.getAttribute('title') || '',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div className="catalog-ad">
      {ad ? (
        <a href={ad.href} title={ad.title}>
          <img src={ad.image} alt={ad.title} />
        </a>
      ) : <div style={{ width: '100%', height: 90 }} />}
    </div>
  );
};

const CatalogFooter = () => (
  <footer className="footer catalog-snapshot-footer">
    <ul className="row footer-links">
      {["About Us", "Jobs", "Blog", "Parents", "Help", "Terms", "Privacy"].map((label) => (
        <li className="footer-link" key={label}><a className="text-footer-nav" href="#">{label}</a></li>
      ))}
    </ul>
    <div className="row copyright-container">
      <div className="col-sm-6 col-md-3" />
      <div className="col-sm-12">
        <p className="text-footer footer-note">©2020 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.</p>
      </div>
    </div>
  </footer>
);

const CatalogContent = () => {
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [priceDraft, setPriceDraft] = useState(emptyPrice);
  const [priceApplied, setPriceApplied] = useState(emptyPrice);
  const priceContext = {
    draft: priceDraft,
    applied: priceApplied,
    setDraft: setPriceDraft,
    apply: setPriceApplied,
  };

  return (
    <>
      {referenceStylesheets.map((href) => <link rel="stylesheet" href={href} key={href} />)}
      <style>{catalogCss}</style>
      <PriceContext.Provider value={priceContext}>
      <div id="catalog-one-file-page" className="catalog-one-file-page rbx-body light-theme gotham-font">
        <div className="container-main full-screen touch">
          <div className="content">
            <CatalogAd />
            <div className="catalog-container">
              <div id="catalog-container">
                <div className="catalog-page">
                  <div id="catalog-content" className="clearfix catalog-content catalog-full-screen">
                    <div id="main-view">
                      <div className="search-bars">
                        <h1 className="heading"><a href="/catalog">Catalog</a></h1>
                        <CatalogSearch onOpenMobile={setMobileOptionsOpen} />
                      </div>
                      <CatalogResults />
                      <CatalogMobileSearchOptions open={mobileOptionsOpen} onClose={() => setMobileOptionsOpen(false)} />
                    </div>
                    <CatalogSidebar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CatalogFooter />
      </div>
      </PriceContext.Provider>
    </>
  );
};

const CatalogPage = () => {
  const host = useRef(null);
  const [shadow, setShadow] = useState(null);

  useEffect(() => {
    if (host.current && !host.current.shadowRoot) {
      setShadow(host.current.attachShadow({ mode: "open" }));
    }
  }, []);

  return (
    <CatalogPageStore.Provider>
      <>
        <Head>
          <meta name="description" content="Browse the Roblox catalog." />
          <style>{`
            body { background: #fff !important; }
            #__next > div > .navbar-wrapper-main { margin-bottom: 0 !important; }
            #__next > div > [class^="fakeAlert-"] { display: none !important; height: 0 !important; }
            .catalog-host { display: block; min-height: 100vh; padding-top: 40px; background: #fff; }
            @media (max-width: 991px) {
              .catalog-host { padding-top: 98px; }
            }
          `}</style>
        </Head>
        <div ref={host} className="catalog-host">
          {shadow && createPortal(<CatalogContent />, shadow)}
        </div>
      </>
    </CatalogPageStore.Provider>
  );
};

CatalogPage.getInitialProps = () => ({ title: "Catalog - ROBLOX" });

export default CatalogPage;

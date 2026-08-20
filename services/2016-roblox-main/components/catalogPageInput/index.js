import React, { useEffect, useState } from "react";
import CatalogPageStore from "../../stores/catalogPage";

const searchCategories = [
  { label: "All Categories", value: "All" },
  { label: "Featured", value: "Featured" },
  { label: "Community Creations", value: "Community Creations" },
  { label: "Premium", value: "Premium" },
  { label: "Collectibles", value: "Collectibles" },
  { label: "Clothing", value: "Clothing" },
  { label: "Body Parts", value: "Body Parts" },
  { label: "Gear", value: "Gear" },
  { label: "Accessories", value: "Accessories" },
  { label: "Avatar Animations", value: "Avatar Animations" },
];

const CatalogCategoryMenu = ({ category, onSelect, open, setOpen }) => (
  <div className="input-group-btn">
    <button
      type="button"
      className="input-dropdown-btn category-options"
      aria-haspopup="true"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <span className="text-overflow rbx-selection-label">{category}</span>
      <span className="icon-down-16x16" />
    </button>
    <ul className={`dropdown-menu${open ? " show" : ""}`} role="menu">
      {searchCategories.map((item) => (
        <li key={item.value}>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onSelect(item.value);
              setOpen(false);
            }}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
    <button
      className="input-addon-btn"
      type="submit"
      aria-label="Search catalog"
    >
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
    if (!store.locked) {
      store.setQuery(keyword.trim());
    }
  };

  const selectCategory = (value) => {
    if (store.locked) return;
    store.setCategory(value);
    store.setSubCategory("");
  };

  if (mobile) {
    return (
      <form
        name="forms.keywordForm"
        className="form-horizontal search-form"
        onSubmit={submit}
      >
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
    <form
      name="forms.searchForm"
      className="search-form"
      onSubmit={submit}
    >
      <div className="input-group">
        <input
          className="form-control input-field search-input"
          placeholder="Search"
          maxLength="50"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
        <CatalogCategoryMenu
          category={store.category || "Featured"}
          onSelect={selectCategory}
          open={categoryOpen}
          setOpen={setCategoryOpen}
        />
      </div>
    </form>
  );
};

const CatalogPageInput = ({ onOpenMobileOptions = () => {} }) => (
  <>
    <div className="mobile-search-container">
      <div className="search-bar">
        <button
          id="search-options-button"
          type="button"
          className="btn-generic-menu-black-md mobile-menu-button"
          aria-label="Open catalog filters"
          onClick={() => onOpenMobileOptions(true)}
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

export default CatalogPageInput;

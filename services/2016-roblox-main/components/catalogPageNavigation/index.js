import React, { useState } from "react";
import CatalogPageStore from "../../stores/catalogPage";
import CatalogFilters from "../catalogFilters";

const categories = [
  {
    id: 1,
    name: "All Items",
    api: "All",
    children: [],
  },
  {
    id: 0,
    name: "Featured",
    api: "Featured",
    children: [
      ["All Featured Items", ""],
      ["Featured Accessories", "Accessories"],
      ["Featured Animations", "Animations"],
      ["Featured Faces", "Faces"],
      ["Featured Gear", "Gear"],
      ["Featured Bundles", "Bundles"],
      ["Featured Emotes", "Emotes"],
    ],
  },
  {
    id: 13,
    name: "Community Creations",
    api: "Community Creations",
    children: [
      ["All Creations", ""],
      ["Hats", "Hats"],
      ["Hair", "Hair"],
      ["Face", "Face"],
      ["Neck", "Neck"],
      ["Shoulder", "Shoulder"],
      ["Front", "Front"],
      ["Back", "Back"],
      ["Waist", "Waist"],
    ],
  },
  {
    id: 14,
    name: "Premium",
    api: "Premium",
    children: [
      ["All Premium Items", ""],
      ["Hats", "Hats"],
      ["Hair", "Hair"],
      ["Face", "Face"],
      ["Neck", "Neck"],
      ["Shoulder", "Shoulder"],
      ["Front", "Front"],
      ["Back", "Back"],
      ["Waist", "Waist"],
    ],
  },
  {
    id: 2,
    name: "Collectibles",
    api: "Collectibles",
    children: [
      ["All Collectibles", ""],
      ["Collectible Accessories", "Accessories"],
      ["Collectible Faces", "Faces"],
      ["Collectible Gear", "Gear"],
    ],
  },
  {
    id: 3,
    name: "Clothing",
    api: "Clothing",
    children: [
      ["All Clothing", "Clothing"],
      ["Shirts", "Shirts"],
      ["T-Shirts", "TeeShirt"],
      ["Pants", "Pants"],
      ["Bundles", "Packages"],
    ],
  },
  {
    id: 4,
    name: "Body Parts",
    api: "Body Parts",
    children: [
      ["All Body Parts", "All"],
      ["Heads", "Heads"],
      ["Faces", "Faces"],
      ["Bundles", "Packages"],
    ],
  },
  {
    id: 5,
    name: "Gear",
    api: "Gear",
    children: [
      ["All Gear", ""],
      ["Building", "Building"],
      ["Explosive", "Explosive"],
      ["Melee", "Melee"],
      ["Musical", "Musical"],
      ["Navigation", "Navigation"],
      ["Power Up", "Power Up"],
      ["Ranged", "Ranged"],
      ["Social", "Social"],
      ["Transport", "Transport"],
    ],
  },
  {
    id: 11,
    name: "Accessories",
    api: "Accessories",
    children: [
      ["All Accessories", ""],
      ["Hats", "Hats"],
      ["Hair", "Hair"],
      ["Face", "Face"],
      ["Neck", "Neck"],
      ["Shoulder", "Shoulder"],
      ["Front", "Front"],
      ["Back", "Back"],
      ["Waist", "Waist"],
    ],
  },
  {
    id: 12,
    name: "Avatar Animations",
    api: "Avatar Animations",
    children: [
      ["Bundles", "Bundles"],
      ["Emotes", "Emotes"],
    ],
  },
];

const CategoryPanel = ({ item, open, onToggle, onSelect }) => {
  const hasChildren = item.children.length > 0;
  const panelId = `category-${item.id}`;

  return (
    <li className="font-header-2 text-subheader panel panel-default">
      <a
        href={`#${panelId}`}
        className="small text menu-link text-link-secondary panel-heading"
        role="tab"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          onToggle(item.id);
        }}
      >
        {item.id === 1 ? (
          <span className="category-view-all">View All Items</span>
        ) : (
          <span className="category-name">{item.name}</span>
        )}
        {hasChildren && (
          <span className={`${open ? "icon-minus" : "icon-plus"} toggle-submenu`} />
        )}
      </a>
      <div
        id={panelId}
        className={`panel-collapse collapse${open ? " in show" : ""}`}
        role="tabpanel"
        aria-expanded={open}
      >
        {hasChildren && (
          <ul className="subcategory-menu">
            {item.children.map(([label, subcategory]) => (
              <li className="top-border" key={label}>
                <a
                  href="#"
                  className="small text menu-link text-link-secondary"
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(item.api, subcategory);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

const CatalogPageNavigation = () => {
  const store = CatalogPageStore.useContainer();
  const [openCategory, setOpenCategory] = useState(0);

  const selectCategory = (category, subcategory) => {
    if (store.locked) return;
    const selected = categories.find((item) => item.api === category);
    if (selected) setOpenCategory(selected.id);
    store.setCategory(category);
    store.setSubCategory(subcategory);
  };

  return (
    <div id="search-options" className="search-options">
      <form
        name="forms.searchOptionsForm"
        className="border-right search-options-form"
        role="form"
        noValidate
      >
        <div className="border-bottom category-section">
          <h3 className="font-header-1 search-options-header">Category</h3>
          <ul id="category-panel-group" className="panel-group">
            {categories.map((item) => (
              <CategoryPanel
                key={item.id}
                item={item}
                open={openCategory === item.id}
                onToggle={(id) => setOpenCategory(openCategory === id ? null : id)}
                onSelect={selectCategory}
              />
            ))}
          </ul>
        </div>
        <CatalogFilters />
      </form>
    </div>
  );
};

const CatalogMobileSearchOptions = ({ open, onClose }) => {
  const store = CatalogPageStore.useContainer();
  const [tab, setTab] = useState("category");
  const [openCategory, setOpenCategory] = useState(null);

  const selectCategory = (category, subcategory) => {
    if (store.locked) return;
    const selected = categories.find((item) => item.api === category);
    if (selected) setOpenCategory(selected.id);
    store.setCategory(category);
    store.setSubCategory(subcategory);
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
                <ul id="mobile-category-panel-group" className="panel-group">
                  {categories.map((item) => {
                    const panelId = `mobile-category-${item.id}`;
                    const hasChildren = item.children.length > 0;
                    const expanded = openCategory === item.id;
                    return (
                      <li className="panel panel-default" key={item.id}>
                        <a
                          href={`#${panelId}`}
                          className="panel-heading"
                          role="tab"
                          aria-expanded={expanded}
                          onClick={(event) => {
                            event.preventDefault();
                            setOpenCategory(expanded ? null : item.id);
                          }}
                        >
                          {item.id === 1 ? "All Categories" : item.name}
                          {hasChildren && <span className="icon-down-16x16 arrow-icon" />}
                        </a>
                        {hasChildren && (
                          <div
                            id={panelId}
                            className={`panel-collapse collapse${expanded ? " in show" : ""}`}
                            role="tabpanel"
                          >
                            <ul>
                              {item.children.map(([label, subcategory]) => (
                                <li className="radio top-border" key={label}>
                                  <input
                                    id={`${panelId}-${label.replace(/\s+/g, "-")}`}
                                    type="radio"
                                    name="mobile-catalog-category"
                                    onChange={() => selectCategory(item.api, subcategory)}
                                  />
                                  <label htmlFor={`${panelId}-${label.replace(/\s+/g, "-")}`}>
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
                  {[
                    [0, "Relevance"],
                    [100, "Most Favorited"],
                    [101, "Bestselling"],
                    [3, "Recently Updated"],
                    [5, "Price (High to Low)"],
                    [4, "Price (Low to High)"],
                  ].map(([value, label]) => (
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
          <button type="button" className="btn-primary-lg apply-button" onClick={onClose}>
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

export { CatalogMobileSearchOptions };
export default CatalogPageNavigation;

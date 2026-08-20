import React, { useState } from "react";
import CatalogPageStore from "../../stores/catalogPage";

const genres = [
  { id: 13, name: "Building" },
  { id: 5, name: "Horror" },
  { id: 1, name: "Town and City" },
  { id: 11, name: "Military" },
  { id: 9, name: "Comedy" },
  { id: 2, name: "Medieval" },
  { id: 7, name: "Adventure" },
  { id: 3, name: "Sci-Fi" },
  { id: 6, name: "Naval" },
  { id: 14, name: "FPS" },
  { id: 15, name: "RPG" },
  { id: 8, name: "Sports" },
  { id: 4, name: "Fighting" },
  { id: 10, name: "Western" },
];

const CatalogFilters = () => {
  const store = CatalogPageStore.useContainer();
  const [price, setPrice] = useState("any");
  const [unavailable, setUnavailable] = useState("hide");

  const toggleGenre = (genre) => {
    const next = store.genres.includes(genre)
      ? store.genres.filter((value) => value !== genre)
      : [...store.genres, genre];
    store.setGenres(next);
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
            {genres.map((genre) => {
              const inputId = `radio-genre-${genre.id}`;
              return (
                <li
                  key={genre.id}
                  className="checkbox top-border font-caption-body"
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={store.genres.includes(genre.id)}
                    onChange={() => toggleGenre(genre.id)}
                  />
                  <label htmlFor={inputId}>{genre.name}</label>
                </li>
              );
            })}
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
              value="any"
              checked={price === "any"}
              onChange={() => setPrice("any")}
            />
            <label htmlFor="radio-price-0">Any Price</label>
          </li>
          <li className="radio top-border font-caption-body catalog-custom-price">
            <input
              id="radio-price-3"
              type="radio"
              name="catalog-price"
              value="custom"
              checked={price === "custom"}
              onChange={() => setPrice("custom")}
            />
            <label htmlFor="radio-price-3" className="has-input">
              <input type="text" aria-label="Minimum price" />
              <span> - </span>
              <input type="text" aria-label="Maximum price" />
            </label>
          </li>
          <li className="radio top-border font-caption-body">
            <input
              id="radio-price-5"
              type="radio"
              name="catalog-price"
              value="free"
              checked={price === "free"}
              onChange={() => setPrice("free")}
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
              value="hide"
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
              value="show"
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

export default CatalogFilters;

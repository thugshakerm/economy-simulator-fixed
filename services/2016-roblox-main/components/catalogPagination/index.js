import React from "react";
import CatalogPageStore from "../../stores/catalogPage";

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
          <a href="#" onClick={move(-1)} aria-label="Previous page">
            <span className="icon-back" />
          </a>
        </li>
        <li>
          <span>
            Page {store.page}{pageCount !== null ? ` of ${pageCount.toLocaleString()}` : ""}
          </span>
        </li>
        <li className={`pager-next${nextDisabled ? " disabled" : ""}`}>
          <a href="#" onClick={move(1)} aria-label="Next page">
            <span className="icon-next" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CatalogPagination;

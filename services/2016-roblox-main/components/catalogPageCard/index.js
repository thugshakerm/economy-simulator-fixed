import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getItemUrl } from "../../services/catalog";
import thumbnailStore from "../../stores/thumbnailStore";
import Link from "../link";

const ItemPrice = (props) => {
  const isLimited = props.itemRestrictions && (
    props.itemRestrictions.includes("Limited") ||
    props.itemRestrictions.includes("LimitedUnique")
  );

  if (props.isForSale && props.price === 0) {
    return <span className="text-robux">Free</span>;
  }

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

const ItemSecondaryLabel = (props) => {
  if (props.unitsAvailableForConsumption) {
    return (
      <div className="text-overflow text-secondary item-card-label">
        Remaining: {props.unitsAvailableForConsumption.toLocaleString()}
      </div>
    );
  }

  if (props.isForSale && props.offsaleDeadline) {
    return (
      <div className="text-overflow text-secondary item-card-label">
        Exp: {dayjs(props.offsaleDeadline).format("D [Days] HH: mm: ss")}
      </div>
    );
  }

  if (props.itemRestrictions && props.itemRestrictions.includes("Limited") && !props.isForSale) {
    return (
      <div className="text-overflow text-secondary item-card-label">
        Was <span className="icon-robux-gray" />
        <span className="strike-through">{(props.price || 0).toLocaleString()}</span>
      </div>
    );
  }

  return <div className="text-overflow text-secondary item-card-label">&nbsp;</div>;
};

const CatalogPageCard = (props) => {
  const thumbs = thumbnailStore.useContainer();
  const [image, setImage] = useState(thumbs.getPlaceholder());
  const isLimitedUnique = props.itemRestrictions && props.itemRestrictions.includes("LimitedUnique");
  const isLimited = props.itemRestrictions && props.itemRestrictions.includes("Limited");
  const isNew = props.createdAt
    ? dayjs(props.createdAt).isAfter(dayjs().subtract(2, "days"))
    : false;
  const isTimed = Boolean(props.isForSale && props.offsaleDeadline);

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
                {isNew && (
                  <span className="asset-status-icon">
                    <span className="status-new">New</span>
                  </span>
                )}
                {isTimed && (
                  <span className="item-expire-time-label">
                    Exp: {dayjs(props.offsaleDeadline).format("D [Days] HH: mm: ss")}
                  </span>
                )}
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
                {props.serialNumber && (
                  <span className="item-serial-number">#{props.serialNumber}</span>
                )}
              </div>
            </div>
          </a>
        </Link>

        <div className="item-card-caption">
          <Link href={getItemUrl({ assetId: props.id, name: props.name })}>
            <a className="item-card-name-link">
              <div className="text-overflow item-card-name">
                {props.name || "Unnamed item"}
              </div>
            </a>
          </Link>
          <ItemSecondaryLabel {...props} />
          <div className="item-card-price margin-top-none">
            <ItemPrice {...props} />
          </div>
        </div>
      </div>
    </li>
  );
};

export default CatalogPageCard;

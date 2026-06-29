import classNames from "classnames";
import { FC, KeyboardEvent } from "react";

import styles from "./VehicleCard.module.scss";

import { VehicleType } from "@/types/vehicles-types";
import vehicleImages from "@/assets/images/vehicles";

type VehicleCardProps = {
  vehicle: VehicleType;
  isExpanded?: boolean;
  onToggle?: (vehicleId: string) => void;
};

const VehicleCard: FC<VehicleCardProps> = (props) => {
  const { vehicle, isExpanded = false, onToggle } = props;

  const handleClick = () => {
    onToggle?.(vehicle.id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onToggle?.(vehicle.id);
  };

  const renderVehiclePrice = () => {
    if (!vehicle.price) return null;

    if (!vehicle.discount) {
      return (
        <div className={styles.priceContainer}>
          <span className={styles.price}>{vehicle.price + " USD"}</span>
        </div>
      );
    }

    return (
      <div className={styles.priceContainer}>
        <span className={styles.oldPrice}>{vehicle.old_price}</span>
        <span className={styles.price}>{vehicle.price + " USD"}</span>
      </div>
    );
  };

  const renderDiscount = () => {
    if (!vehicle.discount) return null;

    return (
      <div className={styles.discountContainer}>
        <div className={styles.discountBackground}></div>
        <span className={styles.discount}>{vehicle.discount + "%"}</span>
      </div>
    );
  };

  const getImageUrl = (imageUrl: string) => {
    const splitImageUrl = imageUrl.split(".png")[0];
    return vehicleImages[splitImageUrl];
  };

  return (
    <div
      className={classNames(styles.vehicleCard, {
        [styles.expanded]: isExpanded,
      })}
      data-vehicle-card
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={vehicle.title}
    >
      <div className={styles.content}>
        <div className={styles.contentTop}>
          <h2 className={styles.title}>{vehicle.title}</h2>
          <p className={styles.description}>{vehicle.description}</p>
        </div>
        {renderVehiclePrice()}
      </div>
      <img
        src={getImageUrl(vehicle.image)}
        alt={vehicle.title}
        className={styles.image}
      />
      {renderDiscount()}
    </div>
  );
};

export default VehicleCard;

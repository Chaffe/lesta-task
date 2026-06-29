import classNames from "classnames";
import { observer } from "mobx-react";
import { NavLink } from "react-router-dom";

import styles from "./Header.module.scss";

import Icon from "@/components/Icon";
import { SHOP_TABS, SORTING_BUTTONS } from "@/consts";
import { useStores } from "@/stores/useStores";

const Header = observer(() => {
  const { vehiclesStore } = useStores();

  const handlePriceSortClick = () => {
    vehiclesStore.togglePriceSort();
  };

  const handleVehicleSortClick = (vehicleType: string) => {
    vehiclesStore.toggleVehicleType(vehicleType);
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Техника</h1>
      <div className={styles.tabs}>
        {SHOP_TABS.map((shopTab) => (
          <NavLink
            key={shopTab.id}
            aria-label={shopTab.title}
            className={({ isActive }) =>
              classNames(styles.tabButton, {
                [styles.active]: isActive,
              })
            }
            to={shopTab.route}
          >
            {shopTab.title}
          </NavLink>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.countContainer}>
          <span className={styles.countLabel}>Показано:</span>
          <span className={styles.countValue}>
            {vehiclesStore.vehicles.length}
          </span>
        </div>

        <div className={styles.sortingControlsContainer}>
          <div className={styles.sortingControls}>
            <span className={styles.sortingControlsLabel}>
              Сортировать по цене:
            </span>
            <button
              className={styles.sortingControlsButton}
              onClick={handlePriceSortClick}
              type="button"
              aria-label="sort-price"
            >
              <Icon
                active={vehiclesStore.isPriceSortHighlighted}
                icon="SortIcon"
                sortDirection={vehiclesStore.priceSortDirection}
              />
            </button>
          </div>

          <div className={styles.sortingControls}>
            <span className={styles.sortingControlsLabel}>Показать:</span>
            <div className={styles.sortingControlsButtonContainer}>
              {SORTING_BUTTONS.map((sortingButton) => (
                <button
                  key={sortingButton.id}
                  className={styles.sortingControlsButton}
                  onClick={() =>
                    handleVehicleSortClick(sortingButton.vehicle_type)
                  }
                  type="button"
                  aria-label={`sort-vehicle-type-${sortingButton.vehicle_type}`}
                  aria-pressed={vehiclesStore.isVehicleTypeSelected(
                    sortingButton.vehicle_type,
                  )}
                >
                  <Icon
                    active={vehiclesStore.isVehicleTypeSelected(
                      sortingButton.vehicle_type,
                    )}
                    icon={sortingButton.icon}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Header;

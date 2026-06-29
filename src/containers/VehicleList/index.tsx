import { useEffect } from "react";
import { observer } from "mobx-react";

import styles from "./VehicleList.module.scss";
import VehicleCard from "./VehicleCard";

import CustomScrollbar from "@/components/CustomScrollbar";
import { useStores } from "@/stores/useStores";

const VehicleList = observer(() => {
  const { vehiclesStore } = useStores();
  const {
    loadVehicles,
    vehicles,
    loading,
    expandedVehicleId,
    toggleExpandedVehicle,
    collapseExpandedVehicle,
  } = vehiclesStore;

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (!expandedVehicleId) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-vehicle-card]")) {
        return;
      }

      collapseExpandedVehicle();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [expandedVehicleId, collapseExpandedVehicle]);

  if (loading) {
    return (
      <div className={styles.vehicleListContainer}>
        <p className={styles.status}>Загрузка...</p>
      </div>
    );
  }

  if (!vehicles.length) {
    return <p className={styles.status}>Техника отсутствует</p>;
  }

  return (
    <div className={styles.vehicleListContainer}>
      <CustomScrollbar>
        <div className={styles.vehicleList}>
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              isExpanded={expandedVehicleId === vehicle.id}
              onToggle={toggleExpandedVehicle}
              vehicle={vehicle}
            />
          ))}
        </div>
      </CustomScrollbar>
    </div>
  );
});

export default VehicleList;

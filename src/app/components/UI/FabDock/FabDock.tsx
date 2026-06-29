"use client";

import BtnAndroide from "../BtnAndroide/BtnAndroide";
import BtnFloat from "../BtnFloat/BtnFloat";
import styles from "./fabDock.module.css";

const FabDock = () => {
  return (
    <div className={styles.dock} aria-label="Acciones rápidas">
      <BtnAndroide />
      <BtnFloat />
    </div>
  );
};

export default FabDock;

import { observer } from "mobx-react";

import styles from "./App.module.scss";
import images from "@/assets";

const App = observer(() => {
  return (
    <main className={styles.app} style={{ backgroundImage: `url(${images.shopBackground})` }}>
      <div className={styles.layout}>
        <h1 className={styles.title}>Техника</h1>
      </div>
    </main>
  );
});

export default App;

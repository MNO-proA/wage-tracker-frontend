import FrameComponent1 from "../components/FrameComponent1";
import FrameComponent from "../components/FrameComponent";
import Table from "../components/Table";
import styles from "./Tracker.module.css";

const Tracker = () => {
  return (
    <div className={styles.tracker}>
      <FrameComponent1 />
      <main className={styles.trackerInner}>
        <section className={styles.frameParent}>
          <FrameComponent />
          <Table />
        </section>
      </main>
    </div>
  );
};

export default Tracker;

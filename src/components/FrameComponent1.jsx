import PropTypes from "prop-types";
import styles from "./FrameComponent1.module.css";

const FrameComponent1 = ({ className = "" }) => {
  return (
    <div className={[styles.sidebarParent, className].join(" ")}>
      <div className={styles.sidebar} />
      <div className={styles.frameParent}>
        <div className={styles.technologyCompanyRetracrableWrapper}>
          <img
            className={styles.technologyCompanyRetracrable}
            loading="lazy"
            alt=""
            src="/technology-company-retracrable-banner-80-x-33-in-2@2x.png"
          />
        </div>
        <div className={styles.activeParent}>
          <div className={styles.active}>
            <div className={styles.activeChild} />
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.element3Parent}>
              <img
                className={styles.element3Icon}
                loading="lazy"
                alt=""
                src="/element3.svg"
              />
              <a className={styles.home}>Home</a>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.poweredByQodexcoreWrapper}>
        <div className={styles.poweredByQodexcoreContainer}>
          <p className={styles.poweredBy}>Powered by</p>
          <p className={styles.qodexcore}>Qodexcore</p>
        </div>
      </div>
    </div>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent1;

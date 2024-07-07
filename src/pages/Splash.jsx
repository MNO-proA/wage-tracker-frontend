import styles from "./Splash.module.css";


const Splash = () => {
 
  return (
    <div>
  <div className={styles.splash}>
    <img
      className={styles.technologyCompanyRetracrable}
      loading="lazy"
      alt=""
      src="/technology-company-retracrable-banner-80-x-33-in-1@2x.png"
    />
    <div className={styles.poweredByQodexcoreWrapper}>
      <div className={styles.poweredByQodexcoreContainer}>
        <span className={styles.poweredByQodexcoreContainer1}>
          <p className={styles.poweredBy}>Powered by</p>
          <p className={styles.qodexcore}>Qodexcore</p>
        </span>
      </div>
    </div>
  </div>
</div>
  );
};

export default Splash;

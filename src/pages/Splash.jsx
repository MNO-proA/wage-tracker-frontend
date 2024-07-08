import styles from "./Splash.module.css";


const Splash = () => {
 
  return (
  
    <div className="container-fluid">
    {/* Logo section */}
    <div className="row align-items-center justify-content-center splash">
      <div className="col text-center">
        <img
          className="img-fluid technologyCompanyRetracrable"
          loading="lazy"
          alt=""
          src="/technology-company-retracrable-banner-80-x-33-in-1@2x.png"
          width={500}
        />
      </div>
    </div>

    {/* Footer section */}
    <div className="row mt-5 mb-3">
      <div className="col text-center">
        <p className="poweredBy">Powered by</p>
        <p className="qodexcore">Qodexcore</p>
      </div>
    </div>
  </div>
      );
    }

export default Splash;

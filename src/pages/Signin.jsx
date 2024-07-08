import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Signin.module.css";
import Splash from "./Splash";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { useDispatch } from "react-redux";



const Signin = () => {
  const [showLogo, setShowLogo] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestData = {
        email: email.toLowerCase(),
        password: password,
      };
      console.log('submitting....')
      console.log(requestData)
      const userData = await login(requestData).unwrap();
      dispatch(setCredentials({ ...userData }));
      setSuccessMsg("Successful, redirecting...");
      setEmail("");
      setPassword("");
      toast.success("Login successful!");
      navigate("home");
    } catch (err) {
      if (!err?.originalStatus) {
        setErrMsg("An Error Occurred");
        if (err?.status === "FETCH_ERROR") {
          setErrMsg("Server not responding");
        } else if (err?.originalStatus === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err?.originalStatus === 401) {
          setErrMsg("Unauthorized");
        } else if (err?.originalStatus === 404) {
          setErrMsg("Login Failed");
        }
      } else {
        setErrMsg("Login Failed");
      }
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = email !== "" && password !== "";

  return (
    <div>
      {showLogo ? (
        <Splash />
      ) : (
       
        <div className={styles.signin}>
           <ToastContainer />
          <div className={styles.frameParent}>
            <div className={styles.frameWrapper}>
              <div className={styles.employeeTrackerParent}>
                <h3 className={styles.employeeTracker}>Employee Tracker</h3>
                <img
                  className={styles.technologyCompanyRetracrable}
                  loading="lazy"
                  alt=""
                  src="/technology-company-retracrable-banner-80-x-33-in-21@2x.png"
                />
              </div>
            </div>
            <form className={styles.loginFormParent} onSubmit={handleSubmit}>
              <div className={styles.loginForm}>
                <div className={styles.inputbtn}>
                  <input
                    className={styles.inputField}
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className={styles.inputbtn}>
                  <input
                    className={styles.inputField}
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className={styles.buttonWrapper}>
                <button
                  className={styles.loginButton}
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
          </div>
          <div className={styles.footer}>
           
           
                <p className={styles.poweredBy}>Powered by Qodexcore</p>
                <p className={styles.qodexcore}></p>
              
          
          </div>
        
        </div>
      )}
    </div>
  );
};

export default Signin;

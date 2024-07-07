import PropTypes from "prop-types";
import styles from "./NotificationIcon.module.css";

const NotificationIcon = ({ className = "" }) => {
  return (
    <input type="button" value="Log out" />
  );
};

NotificationIcon.propTypes = {
  className: PropTypes.string,
};

export default NotificationIcon;

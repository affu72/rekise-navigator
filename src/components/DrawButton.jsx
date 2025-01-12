import styles from "./DrawButton.module.css";

const DrawButton = ({ onClick }) => {
  return (
    <button className={styles.drawButton} onClick={onClick}>
      Draw
    </button>
  );
};

export default DrawButton;

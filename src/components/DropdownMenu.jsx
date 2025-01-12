import { useState, useRef, useEffect } from "react";
import styles from "./DropdownMenu.module.css";

const DropdownMenu = ({ onInsertBefore, onInsertAfter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdown} ref={menuRef}>
      <button
        className={styles.dropdownTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        ⋮
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <button
            onClick={() => {
              onInsertBefore();
              setIsOpen(false);
            }}
          >
            Insert Polygon Before
          </button>
          <button
            onClick={() => {
              onInsertAfter();
              setIsOpen(false);
            }}
          >
            Insert Polygon After
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

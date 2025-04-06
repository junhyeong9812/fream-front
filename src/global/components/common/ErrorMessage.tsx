import React from "react";
import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  theme?: "light" | "dark";
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  theme = "light",
}) => {
  return (
    <div
      className={`${styles.container} ${theme === "dark" ? styles.dark : ""}`}
    >
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          다시 시도
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

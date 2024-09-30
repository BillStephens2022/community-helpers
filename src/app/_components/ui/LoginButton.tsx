import React from "react";
import styles from "./loginButton.module.css";

type LoginButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function LoginButton({
  children,
  onClick,
  disabled = false,
}: LoginButtonProps) {
  return (
    <button
      className={styles.login_button}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

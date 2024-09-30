import styles from "./button.module.css";

type LoginButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function LoginButton({
  children,
  onClick,
  type,
  disabled = false,
}: LoginButtonProps) {
  return (
    <button
      className={styles.login_button}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
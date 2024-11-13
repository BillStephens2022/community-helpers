import styles from "./cardButton.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  hasIcon?: boolean;
};

export default function CardButton({
  children,
  onClick,
  type,
  disabled = false,
  hasIcon = false,
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${hasIcon ? styles.button_icon : ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}
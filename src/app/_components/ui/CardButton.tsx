import { Tooltip } from 'react-tooltip'
import styles from "./cardButton.module.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  title?: string;
  disabled?: boolean;
  hasIcon?: boolean;
  primaryColor?: string; 
  secondaryColor?: string; 
};

export default function CardButton({
  children,
  onClick,
  type,
  title,
  disabled = false,
  hasIcon = false,
  primaryColor = "rgba(70, 130, 180, 0.9)", // Default primary color
  secondaryColor = "rgba(70, 130, 180, 0.8)", // Default secondary color
}: ButtonProps) {
  return (
    <>
    <button
      className={`${styles.button} ${hasIcon ? styles.button_icon : ""}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={{
        backgroundColor: disabled
          ? "gray" // Disabled state
          : undefined,
        "--button-primary-color": primaryColor,
        "--button-secondary-color": secondaryColor,
      } as React.CSSProperties} // CSS variables for dynamic colors
      data-tooltip-id="my-tooltip"
      data-tooltip-content={title}
      data-tooltip-place="bottom"
    >
      {children}
    </button>
    <Tooltip id="my-tooltip" variant="info" style={{zIndex: 5}} />
    </>
  );
}
"use client"
import styles from './loginButton.module.css';

type buttonProps = {
  children: React.ReactNode;
};

export default function LoginButton(props: buttonProps) {
  const { children } = props;
  return <button className={styles.login_button}>{children}</button>;
}

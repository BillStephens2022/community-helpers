import styles from "./header.module.css";

export default function Header() {
    return (
        <div className={styles.header_div}>
            <h1 className={styles.header_h1}>Community Helpers</h1>
        </div>
    )
}
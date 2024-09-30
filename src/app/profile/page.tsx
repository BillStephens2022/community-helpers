
import styles from "./profile.module.css";

export default async function Profile() {

  return (
    <div className={styles.profile_page}>
     <h1 className={styles.profile_h1}>Profile</h1>
     <p className={styles.profile_p}>Name: Bob Smith</p>
     <p className={styles.profile_p}>Skillset: Handyman</p>
    </div>
  );
}
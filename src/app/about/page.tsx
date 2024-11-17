import styles from "./about.module.css";

export default function Page() {
  return (
      <div className={styles.about_page}>
        <h1 className={styles.about_header}>About Community Helpers</h1>
        <section className={styles.about_section}>
          <h2 className={styles.about_subheader}>What is Community Helpers?</h2>
          <p className={styles.about_p}>
            Community Helpers is an app designed to bring neighbors together by connecting those with skills to those in need. 
            Whether you need help with a specific task or want to offer your expertise, Community Helpers makes it easy to collaborate 
            and build a supportive local network.
          </p>
        </section>
        <section className={styles.about_section}>
          <h2 className={styles.about_subheader}>How It Works</h2>
          <ol className={styles.about_list}>
            <li>
              <strong>Search and Connect:</strong> Find neighbors with the skills you need or offer your skills to others in your community.
            </li>
            <li>
              <strong>Messaging:</strong> Communicate directly with neighbors to discuss details and terms for the task or job.
            </li>
            <li>
              <strong>Create a Contract:</strong> Agree on terms for the job and create a contract. The worker can submit the contract to the client for review.
            </li>
            <li>
              <strong>Approval:</strong> The client can accept or reject the contract terms. Feedback can be provided for adjustments if needed.
            </li>
            <li>
              <strong>Work and Payment:</strong> Once the client accepts the contract, the worker can perform the job. Payment is made securely through the client's wallet after the job is completed.
            </li>
          </ol>
        </section>
        <section className={styles.about_section}>
          <h2 className={styles.about_subheader}>Wallet System</h2>
          <p className={styles.about_p}>
            Each neighbor has a secure wallet to manage their funds. You can deposit or withdraw money from your wallet, 
            and use it to pay workers for completed jobs. This ensures a seamless and safe payment process.
          </p>
        </section>
        <section className={styles.about_section}>
          <h2 className={styles.about_subheader}>Why Community Helpers?</h2>
          <p className={styles.about_p}>
            Our mission is to foster a sense of community and mutual support among neighbors. 
            By sharing skills and resources, we can build stronger, more connected neighborhoods.
          </p>
        </section>
      </div>
  );
}
import styles from "./about.module.css";

export default function Page() {
  return (
    <div className={styles.about_page}>
      <section className={styles.about_section}>
        <h2 className={styles.about_header}>What is Community Helpers?</h2>
        <p className={styles.about_p}>
          Community Helpers is designed to bring neighbors together by
          connecting those with skills to those in need. Whether you need help
          with a specific task or want to offer your expertise, Community
          Helpers makes it easy to collaborate and build a supportive local
          network.
        </p>
      </section>
      <section className={styles.about_section}>
        <h2 className={styles.about_header}>Services Offered</h2>
        <p className={styles.about_p}>
          Discover a wide range of services provided by your neighbors,
          including:
        </p>
        <ul className={styles.about_list_1}>
          <li className={styles.about_li_1}>Handyman Services</li>
          <li className={styles.about_li_1}>Landscaping</li>
          <li className={styles.about_li_1}>Housekeeping</li>
          <li className={styles.about_li_1}>Babysitting / Senior Care</li>
          <li className={styles.about_li_1}>Technology Assistance</li>
          <li className={styles.about_li_1}>Financial Services</li>
          <li className={styles.about_li_1}>Dog Walking / Pet Sitting</li>
          <li className={styles.about_li_1}>Tutoring</li>
          <li className={styles.about_li_1}>Auto Repair</li>
        </ul>
      </section>
      <section className={styles.about_section}>
        <h2 className={styles.about_header}>How It Works</h2>
        <ul className={styles.about_list_2}>
          <li className={styles.about_li_2}>
            <span className={styles.about_li_span}>Search and Connect:</span>{" "}
            Find neighbors with the skills you need or offer your skills to
            others in your community.
          </li>
          <li className={styles.about_li_2}>
            <span className={styles.about_li_span}>Messaging:</span> Communicate
            directly with neighbors to discuss details and terms for the task or
            job.
          </li>
          <li className={styles.about_li_2}>
            <span className={styles.about_li_span}>Create a Contract:</span>{" "}
            Agree on terms for the job and create a contract. The worker can
            submit the contract to the client for review.
          </li>
          <li className={styles.about_li_2}>
            <span className={styles.about_li_span}>Approval:</span> The client
            can accept or reject the contract terms. Feedback can be provided
            for adjustments if needed.
          </li>
          <li className={styles.about_li_2}>
            <span className={styles.about_li_span}>Work and Payment:</span> Once
            the client accepts the contract, the worker performs the job.
            Payment is made securely through the client's wallet after the job
            is completed.
          </li>
        </ul>
      </section>
      <section className={styles.about_section}>
        <h2 className={styles.about_header}>Wallet System</h2>
        <p className={styles.about_p}>
          Each neighbor has a secure wallet to manage their funds. You can
          deposit or withdraw money from your wallet, and use it to pay workers
          for completed jobs. This ensures a seamless and safe payment process.
        </p>
      </section>
      <section className={styles.about_section}>
        <h2 className={styles.about_header}>Why Community Helpers?</h2>
        <p className={styles.about_p}>
          Our mission is to foster a sense of community and mutual support among
          neighbors. By sharing skills and resources, we can build stronger,
          more connected neighborhoods.
        </p>
      </section>
    </div>
  );
}

import { CSSProperties } from 'react';
import styles from './loader.module.css';

const Loader = () => {
    const spans = Array.from({ length: 20 }, (_, i) => i + 1); // Create an array for 20 spans

    return (
        <div className={styles.box}>
             <h2>Loading...</h2>
            <div>
               
                <section>
                    <div className={styles.loader}>
                        {spans.map(i => (
                            <span key={i} style={{ '--i': i } as CSSProperties}></span>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Loader;

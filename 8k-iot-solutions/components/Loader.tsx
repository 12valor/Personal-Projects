import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.loader}>
        <div className={`${styles.box} ${styles.box0}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box1}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box2}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box3}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box4}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box5}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box6}`}>
          <div />
        </div>
        <div className={`${styles.box} ${styles.box7}`}>
          <div />
        </div>
        <div className={styles.ground}>
          <div />
        </div>
      </div>
      <div className="mt-8">
        <p className="text-brand-900 font-bold tracking-[0.2em] text-sm animate-pulse">
          LOADING...
        </p>
      </div>
    </div>
  );
};

export default Loader;

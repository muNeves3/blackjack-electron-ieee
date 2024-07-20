import React from 'react';
import styles from './card.module.css';

type CardProps = {
  value: string;
  suit: string;
  hidden: boolean;
};

const Card: React.FC<CardProps> = ({ value, suit, hidden }) => {
  const getColor = () => {
    if (['♣️', '♠️'].includes(suit)) {
      return styles.black;
    }
    return styles.red;
  };

  const getCard = () => {
    if (hidden) {
      return <div className={styles.hiddenCard} />;
    }
    return (
      <div className={styles.card}>
        <div className={getColor()}>
          <h1 className={styles.value}>{value}</h1>
          <h1 className={styles.suit}>{suit}</h1>
        </div>
      </div>
    );
  };

  return <>{getCard()}</>;
};

export default Card;

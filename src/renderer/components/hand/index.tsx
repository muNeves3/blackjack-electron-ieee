import { useState } from 'react';
import Card from '../card';
import styles from './hand.module.css';
import { CardType } from '../../App';

type handProps = {
  cardsPlayer: CardType[];
  pointsPlayer: number;
};

export default function Hand({ cardsPlayer, pointsPlayer }: handProps) {
  return (
    <div className={styles.main}>
      {cardsPlayer.map((card, index) => (
        <Card key={index} value={card[1]} suit={card[0]} hidden={card[2]} />
      ))}
      <h3>{pointsPlayer > 0 ? pointsPlayer : ' '}</h3>
    </div>
  );
}

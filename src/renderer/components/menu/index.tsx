import { useState } from 'react';
import styles from './menu.module.css';

export default function Menu() {
  const [amount, setAmount] = useState(10);
  const [money, setMoney] = useState(100);

  const amountChange = (e: any) => {
    if (amount < 1) setAmount(1);
    else setAmount(e.target.value);
  };

  return (
    <div className={styles.menu}>
      <div className={styles.money}>R${money}</div>
      <div className={styles.amountContainer}>
        <h4>Quantidade: </h4>
        <input autoFocus type="number" value={amount} onChange={amountChange} />
      </div>
      <input
        className={styles.bet}
        type="button"
        name="Apostar"
        value="Apostar"
      />
    </div>
  );
}

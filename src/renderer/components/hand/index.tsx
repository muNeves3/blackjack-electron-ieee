import Card from '../card';
import styles from './hand.module.css';
export default function Hand() {
  return (
    <div className={styles.main}>
      <Card hidden={false} suit="♠" value="A" />
      <Card hidden={true} suit="♠" value="A" />
    </div>
  );
}

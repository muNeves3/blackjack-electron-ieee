import styles from './startScreen.module.css';
import logo from '../../../../assets/blackjack-logo.png';
import { useNavigate } from 'react-router-dom';

export default function StartScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.body}>
      <img src={logo} alt="Logo do blackjack" className={styles.logo} />
      <button className={styles.startButton} onClick={() => navigate('/game')}>
        <span>JOGAR</span>
      </button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import styles from './menu.module.css';
import { CardType } from '../../App';

type MenuProps = {
  playerCards: CardType[];
  dealerCards: CardType[];
  setCardsPlayer: any;
  setCardsDealer: any;
  deck: CardType[];
  setDeck: any;
};

export default function Menu({
  playerCards,
  deck,
  dealerCards,
  setCardsDealer,
  setCardsPlayer,
  setDeck,
}: MenuProps) {
  const [amount, setAmount] = useState(10);
  const [money, setMoney] = useState(100);
  const [bet, setBet] = useState(0);
  const [isDoubled, setIsDoubled] = useState(false);
  const [stand, setStand] = useState(false);

  useEffect(() => {
    if (stand == true) endTurn();
  }, [stand]);

  const amountChange = (e: any) => {
    if (amount < 1) setAmount(1);
    else setAmount(e.target.value);
  };

  function dealCard(deck: CardType[]): { card: CardType; newDeck: CardType[] } {
    const deckControl = [...deck];
    const card = deckControl.pop();
    if (!card) {
      throw new Error('Deck is empty');
    }
    return { card, newDeck: deckControl };
  }

  function dealInitialCards() {
    const playerHand: CardType[] = [];
    const dealerHand: CardType[] = [];
    let updatedDeck = [...deck];

    let dealtCard;

    dealtCard = dealCard(updatedDeck);
    playerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;

    dealtCard = dealCard(updatedDeck);
    dealerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;

    dealtCard = dealCard(updatedDeck);
    playerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;

    dealtCard = dealCard(updatedDeck);
    dealerHand.push({ ...dealtCard.card, '2': true });

    setDeck(updatedDeck);
    setCardsPlayer(playerHand);
    setCardsDealer(dealerHand);
  }

  const betAction = () => {
    if (money >= amount) {
      setBet(amount);
      setMoney(money - amount);
      dealInitialCards();
    }
  };

  const doubleDown = () => {
    const playerHand: CardType[] = [...playerCards];
    let updatedDeck = [...deck];
    let dealtCard;
    dealtCard = dealCard(updatedDeck);
    playerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;
    setCardsPlayer(playerHand);
    setDeck(updatedDeck);
    setIsDoubled(true);
  };

  const dealCardsDealer = () => {
    for (let i = 0; i < 4; i++) {
      const playerHand: CardType[] = [...dealerCards];

      let updatedDeck = [...deck];
      let dealtCard;
      dealtCard = dealCard(updatedDeck);
      playerHand.push(dealtCard.card);
      updatedDeck = dealtCard.newDeck;
      setCardsDealer(playerHand);
      setDeck(updatedDeck);
    }
  };

  const endTurn = () => {
    setStand(true);
    const playerHand: CardType[] = [...dealerCards];
    playerHand[playerHand.length - 1]['2'] = false;
    setCardsDealer(playerHand);

    dealCardsDealer();
  };

  const hit = () => {
    const playerHand: CardType[] = [...playerCards];
    let updatedDeck = [...deck];
    let dealtCard;
    dealtCard = dealCard(updatedDeck);
    playerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;
    setCardsPlayer(playerHand);
    setDeck(updatedDeck);
  };

  return (
    <div className={styles.menu}>
      <div className={styles.money}>R${money}</div>
      <div className={styles.amountContainer}>
        <h4>Quantidade: </h4>
        <input type="number" value={amount} onChange={amountChange} />
      </div>
      <input
        className={styles.bet}
        type="button"
        name="Apostar"
        value="Apostar"
        onClick={betAction}
        disabled={bet > 0}
      />
      <input
        className={styles.bet}
        type="button"
        name="Double Down"
        value="Double Down"
        style={{ display: bet > 0 ? 'inline' : 'none' }}
        disabled={isDoubled}
        onClick={doubleDown || stand}
      />
      <input
        className={styles.bet}
        type="button"
        name="Hit"
        value="Hit"
        style={{ display: bet > 0 ? 'inline' : 'none' }}
        onClick={hit}
        disabled={isDoubled || stand}
      />
      <input
        className={styles.bet}
        type="button"
        name="Stand"
        value="Stand"
        style={{ display: bet > 0 ? 'inline' : 'none' }}
        onClick={endTurn}
        disabled={isDoubled || stand}
      />
    </div>
  );
}

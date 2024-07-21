import { useEffect, useState } from 'react';
import styles from './menu.module.css';
import { CardType, createDeck, shuffleDeck } from '../../App';

type MenuProps = {
  playerCards: CardType[];
  dealerCards: CardType[];
  setCardsPlayer: any;
  setCardsDealer: any;
  deck: CardType[];
  setDeck: any;
  pointsDealer: number;
  setPointsDealer: any;
  pointsPlayer: number;
  setPointsPlayer: any;
};

export default function Menu({
  playerCards,
  deck,
  dealerCards,
  setCardsDealer,
  setCardsPlayer,
  setDeck,
  pointsDealer,
  setPointsDealer,
  pointsPlayer,
  setPointsPlayer,
}: MenuProps) {
  const [amount, setAmount] = useState(10);
  const [money, setMoney] = useState(100);
  const [bet, setBet] = useState(0);
  const [isDoubled, setIsDoubled] = useState(false);
  const [stand, setStand] = useState(false);

  const amountChange = (e: any) => {
    setAmount(Math.max(1, e.target.value));
  };

  const calculate = (cards: CardType[]) => {
    let total = 0;
    let aces = 0;
    cards.forEach((card) => {
      if (card['2']) return;
      if (card[1] === 'A') {
        aces++;
      } else if (['K', 'Q', 'J'].includes(card[1])) {
        total += 10;
      } else {
        total += Number(card[1]);
      }
    });

    for (let i = 0; i < aces; i++) {
      total += total + 11 <= 21 ? 11 : 1;
    }

    return total;
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

    setPointsPlayer(calculate(playerHand));
    setPointsDealer(calculate(dealerHand));
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

    setAmount(amount * 2);

    dealtCard = dealCard(updatedDeck);
    playerHand.push(dealtCard.card);
    updatedDeck = dealtCard.newDeck;

    setCardsPlayer(playerHand);
    setDeck(updatedDeck);
    setIsDoubled(true);

    setPointsPlayer(calculate(playerHand));

    endTurn();
  };

  const dealCardsDealer = (updatedDeck: CardType[]) => {
    const dealerHand: CardType[] = [...dealerCards];
    let points = calculate(dealerHand);

    while (points < 17) {
      let dealtCard;
      dealtCard = dealCard(updatedDeck);
      dealerHand.push(dealtCard.card);
      updatedDeck = dealtCard.newDeck;
      points = calculate(dealerHand);
    }

    setPointsDealer(points);
    setDeck(updatedDeck);
    setCardsDealer(dealerHand);
  };

  const endTurn = () => {
    const dealerHand: CardType[] = [...dealerCards];
    dealerHand[dealerHand.length - 1]['2'] = false;

    setStand(true);
    setCardsDealer(dealerHand);

    dealCardsDealer(deck);

    if (
      pointsPlayer <= 21 &&
      (pointsDealer > 21 || pointsPlayer > pointsDealer)
    ) {
      setMoney(money + bet * 2);
    }
    if (pointsPlayer <= 21 && pointsPlayer === pointsDealer) {
      setMoney(money + bet);
    }

    setTimeout(() => {
      setCardsDealer([]);
      setCardsPlayer([]);
      let deck = createDeck();
      setDeck(shuffleDeck(deck));
      setBet(0);
      setPointsPlayer(0);
      setPointsDealer(0);
      setIsDoubled(false);
      setStand(false);
    }, 2000);
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

    const points = calculate(playerHand);
    setPointsPlayer(points);

    if (points > 21) {
      endTurn();
    }
  };

  return (
    <div className={styles.menu}>
      <img
        className={styles.logoIEEE}
        src="https://upload.wikimedia.org/wikipedia/commons/2/21/IEEE_logo.svg"
        alt="iee logo"
      />
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
        onClick={doubleDown}
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

import styles from './menu.module.css';
import { useCallback, useEffect, useState } from 'react';
import { CardType, createDeck, shuffleDeck } from '../game';
import { useNavigate } from 'react-router-dom';

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
  const [turnProcessed, setTurnProcessed] = useState(false); // Nova variável de estado
  const navigate = useNavigate();

  const amountChange = (e: any) => {
    setAmount(Math.max(0, e.target.value));
  };

  const calculate = useCallback((cards: CardType[]) => {
    let total = 0;
    let aces = 0;
    cards.forEach((card) => {
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
  }, []);

  function dealCard(deck: CardType[]): { card: CardType; newDeck: CardType[] } {
    const deckControl = [...deck];
    const card = deckControl.pop();
    if (!card) {
      throw new Error('Deck is empty');
    }
    return { card, newDeck: deckControl };
  }

  const dealInitialCards = useCallback(() => {
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
  }, [
    deck,
    setDeck,
    setCardsPlayer,
    setCardsDealer,
    setPointsPlayer,
    setPointsDealer,
    calculate,
  ]);

  const betAction = useCallback(() => {
    if (money >= amount) {
      setBet(amount);
      setMoney(money - amount);
      dealInitialCards();
    }
  }, [amount, money, dealInitialCards]);

  const dealCardsDealer = useCallback(
    (updatedDeck: CardType[]) => {
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
    },
    [dealerCards, setPointsDealer, setCardsDealer, setDeck, calculate],
  );

  const endTurn = useCallback(() => {
    const dealerHand: CardType[] = [...dealerCards];
    dealerHand[dealerHand.length - 1]['2'] = false;

    setStand(true);
    dealCardsDealer(deck);
  }, [dealCardsDealer, deck, dealerCards]);

  const doubleDown = useCallback(() => {
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
  }, [
    playerCards,
    setCardsPlayer,
    pointsPlayer,
    setPointsPlayer,
    amount,
    setAmount,
    deck,
    setDeck,
    calculate,
    endTurn,
  ]);

  useEffect(() => {
    if (stand && !turnProcessed) {
      console.log('player: ' + pointsPlayer);
      console.log('dealer: ' + pointsDealer);
      let finalMoney = money;
      if (
        pointsPlayer <= 21 &&
        (pointsDealer > 21 || pointsPlayer > pointsDealer)
      ) {
        setMoney(money + bet * 2);
        finalMoney = money + bet * 2;
      } else if (pointsPlayer <= 21 && pointsPlayer === pointsDealer) {
        setMoney(money + bet);
        finalMoney = money + bet;
      }

      if (finalMoney <= 0) {
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }

      setTurnProcessed(true); // Marcar o turno como processado

      setTimeout(() => {
        setCardsDealer([]);
        setCardsPlayer([]);
        let newDeck = createDeck();
        setDeck(shuffleDeck(newDeck));
        setBet(0);
        setPointsPlayer(0);
        setPointsDealer(0);
        setIsDoubled(false);
        setStand(false);
        setTurnProcessed(false); // Resetar o estado do turno processado
      }, 2000);
    }
  }, [
    stand,
    pointsDealer,
    pointsPlayer,
    bet,
    money,
    setMoney,
    setCardsDealer,
    setCardsPlayer,
    setDeck,
    setBet,
    setPointsPlayer,
    setPointsDealer,
    setIsDoubled,
    setStand,
    turnProcessed,
  ]);

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

    if (points >= 21) {
      endTurn();
    }
  };

  useEffect(() => {
    console.log('Dealer points updated:', pointsDealer);
  }, [pointsDealer]);

  return (
    <div className={styles.menu}>
      <div className={styles.money}>R${money}</div>
      <div className={styles.amountContainer}>
        <h4>Quantidade: </h4>
        <input value={amount} onChange={amountChange} />
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

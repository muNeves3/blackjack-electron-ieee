import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Menu from './components/menu';
import Hand from './components/hand';
import { useEffect, useState } from 'react';

export type CardType = [string, string, boolean];

export function createDeck(): CardType[] {
  const suits = ['♣️', '♠️', '♥️', '♦️'];
  const ranks = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];
  const newDeck: CardType[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      newDeck.push([suit, rank, false]);
    }
  }
  return newDeck;
}

export function shuffleDeck(deck: CardType[]): CardType[] {
  const shuffledDeck = [...deck];
  for (let i = shuffledDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
  }
  return shuffledDeck;
}

function Init() {
  const [amount, setAmount] = useState(10);
  const [money, setMoney] = useState(100);
  const [pointsPlayer, setPointsPlayer] = useState(0);
  const [pointsDealer, setPointsDealer] = useState(0);

  const [cardsPlayer, setCardsPlayer] = useState<CardType[]>([]);
  const [cardsDealer, setCardsDealer] = useState<CardType[]>([]);
  const [deck, setDeck] = useState<CardType[]>([]);

  useEffect(() => {
    async function initializeDeck() {
      const newDeck = createDeck();
      const shuffledDeck = shuffleDeck(newDeck);
      setDeck(shuffledDeck);
    }

    initializeDeck();
  }, []);

  return (
    <div className={styles.body}>
      <Menu
        dealerCards={cardsDealer}
        deck={deck}
        playerCards={cardsPlayer}
        setCardsDealer={setCardsDealer}
        setCardsPlayer={setCardsPlayer}
        setDeck={setDeck}
        pointsDealer={pointsDealer}
        setPointsDealer={setPointsDealer}
        pointsPlayer={pointsPlayer}
        setPointsPlayer={setPointsPlayer}
      />
      <Hand cardsPlayer={cardsDealer} pointsPlayer={pointsDealer} />
      <Hand cardsPlayer={cardsPlayer} pointsPlayer={pointsPlayer} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Init />} />
      </Routes>
    </Router>
  );
}

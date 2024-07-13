import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import Menu from './components/menu';
import Hand from './components/hand';

function Init() {
  return (
    <div className={styles.body}>
      <Menu />
      <Hand />
      <Hand />
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

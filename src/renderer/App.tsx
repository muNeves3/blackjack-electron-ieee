import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './components/game';
import StartScreen from './components/startScreen';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StartScreen />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </>
  );
}

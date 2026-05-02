import { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getData } from './lib/dataLayer';
import Nav from './components/Nav';
import Felt from './components/Felt';
import HomePage     from './pages/HomePage';
import PlayerPage   from './pages/PlayerPage';
import EventPage    from './pages/EventPage';
import UpcomingPage from './pages/UpcomingPage';
import RulesPage    from './pages/RulesPage';
import AdminPage    from './pages/AdminPage';

export const DataContext = createContext(null);

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'rgba(200,168,90,0.5)', fontSize: 13 }}>
        Loading…
      </div>
    );
  }

  return (
    <DataContext.Provider value={{ data, setData }}>
      <Felt />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <Routes>
          <Route path="/"            element={<HomePage />} />
          <Route path="/players/:id" element={<PlayerPage />} />
          <Route path="/events/:id"  element={<EventPage />} />
          <Route path="/upcoming"    element={<UpcomingPage />} />
          <Route path="/rules"       element={<RulesPage />} />
          <Route path="/admin"       element={<AdminPage />} />
        </Routes>
      </div>
    </DataContext.Provider>
  );
}

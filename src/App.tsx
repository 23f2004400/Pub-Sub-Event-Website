import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { EventHostPage } from './pages/EventHostPage';
import { CoordinatorPage } from './pages/CoordinatorPage';
import { EventGuestsPage } from './pages/EventGuestsPage';
import { usePubSubSystem } from './hooks/usePubSubSystem';

function App() {
  const pubSubSystem = usePubSubSystem();

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage {...pubSubSystem} />} />
          <Route path="/host" element={<EventHostPage {...pubSubSystem} />} />
          <Route path="/coordinator" element={<CoordinatorPage {...pubSubSystem} />} />
          <Route path="/guests" element={<EventGuestsPage {...pubSubSystem} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
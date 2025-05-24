import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import VentPage from './pages/VentPage';
import JournalPage from './pages/JournalPage';
import SkillsPage from './pages/SkillsPage';
import MoodPage from './pages/MoodPage';
import AudioPage from './pages/AudioPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vent" element={<VentPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
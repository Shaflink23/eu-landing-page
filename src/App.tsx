
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ContactPage } from './pages/ContactPage';
import { FormPage } from './pages/FormPage';
import GuideBot from './components/ChatBot/GuideBot';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white relative">
        <main className="relative" style={{ margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/journey-form" element={<FormPage />} />
          </Routes>
        </main>
        <GuideBot />
      </div>
    </Router>
  );
}

export default App;
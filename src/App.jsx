import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import MyFiles from './pages/MyFiles.jsx';
import SharedFile from './pages/SharedFile.jsx';
import DownloadPage from './pages/DownloadPage.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Pricing from './pages/Pricing.jsx';
import Help from './pages/Help.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import { Terms, Privacy } from './pages/Legal.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="flex flex-col min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 relative">
              {/* Full-System Atmospheric Spooky Background */}
              <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
                <img
                  src="/halloween-bg.png"
                  alt="Halloween Background"
                  className="w-full h-full object-cover object-bottom"
                />
                {/* Balanced atmospheric overlay to highlight the glowing pumpkins, castle & moon while preserving text contrast */}
                <div className="absolute inset-0 bg-slate-950/35 dark:bg-slate-950/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/50" />
              </div>

              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/files" element={<MyFiles />} />
                  <Route path="/f/:token" element={<SharedFile />} />
                  <Route path="/view/:token" element={<SharedFile />} />
                  <Route path="/download/:token" element={<DownloadPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Login defaultIsRegister={true} />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

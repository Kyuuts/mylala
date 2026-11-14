import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PracticePage from './pages/PracticePage';
import ReadingPage from './pages/ReadingPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import FlashcardPage from './pages/FlashcardPage';
import CreateModulePage from './pages/CreateModulePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Main App Shell Layout */}
        <Route element={<RootLayout />}>
          {/* Public Landing Page */}
          <Route index element={<HomePage />} />

          {/* Protected Learning & Core Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="learn" element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="latihan" element={<PracticePage />} />
            <Route path="reading" element={<ReadingPage />} />
            <Route path="reading/:id" element={<ReadingPage />} />
            <Route path="bacaan" element={<ReadingPage />} />
            <Route path="bacaan/:id" element={<ReadingPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="rank" element={<LeaderboardPage />} />
            <Route path="create" element={<CreateModulePage />} />
            <Route path="module/:id" element={<ModuleDetailPage />} />
            <Route path="flashcards/:module_id" element={<FlashcardPage />} />
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

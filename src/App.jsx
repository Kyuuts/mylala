import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import FlashcardPage from './pages/FlashcardPage';
import CreateModulePage from './pages/CreateModulePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="rank" element={<LeaderboardPage />} />
        <Route path="create" element={<CreateModulePage />} />
        <Route path="module/:id" element={<ModuleDetailPage />} />
        <Route path="flashcards/:module_id" element={<FlashcardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

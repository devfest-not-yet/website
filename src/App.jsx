import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";

// Admin Layout and Pages
import AdminLayout from "@/components/layout/AdminLayout";
import MealDashboard from "@/pages/admin/MealDashboard";
import StockManagement from "@/pages/admin/StockManagement";
import CookingSchedule from "@/pages/admin/CookingSchedule";
import MenuPlanner from "@/pages/admin/MenuPlanner";
import MealDistribution from "@/pages/admin/MealDistribution";
import StudentDemands from "@/pages/admin/StudentDemands";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Panel - Meal Management System */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<MealDashboard />} />
          <Route path="stock" element={<StockManagement />} />
          <Route path="schedule" element={<CookingSchedule />} />
          <Route path="menu" element={<MenuPlanner />} />
          <Route path="distribution" element={<MealDistribution />} />
          <Route path="demands" element={<StudentDemands />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AnimatedRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;


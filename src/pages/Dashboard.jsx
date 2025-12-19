import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              SmartMeal AI Dashboard
            </h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-lg p-8 mb-8 border border-primary/20 animate-fade-in">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || "User"}! 👋
            </h2>
            <p className="text-lg text-muted-foreground">
              You&apos;re successfully logged in to your dashboard.
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Your Profile
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">
                  {user?.name}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-foreground">
                  {user?.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {user?.id}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </div>
                <div className="text-4xl">📁</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Active Tasks
                  </p>
                  <p className="text-3xl font-bold text-foreground">0</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Team Members
                  </p>
                  <p className="text-3xl font-bold text-foreground">1</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="bg-card border border-border rounded-lg p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Ready to Start Building?
            </h3>
            <p className="text-muted-foreground mb-6">
              This is a protected dashboard page. You can now integrate real API
              endpoints, add data visualizations with Recharts, and build
              amazing features!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button>Create New Project</Button>
              <Button variant="outline">View Documentation</Button>
            </div>
          </div>

          {/* Info Note */}
          {/* <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg animate-fade-in">
                        <p className="text-sm text-muted-foreground text-center">
                            💡 <strong>Note:</strong> This is a mock authentication system for development.
                            Replace the API endpoints in{" "}
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                                src/services/authService.js
                            </code>{" "}
                            with your real backend APIs.
                        </p>
                    </div> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2025 SmartMeal AI. Built with React + Vite + Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import GoogleCallback from "./pages/GoogleCallback";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-50 min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/google-callback" element={<GoogleCallback />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

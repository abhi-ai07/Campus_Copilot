import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Notices from "./pages/Notices";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";

import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <MainLayout>
              <Chat />
            </MainLayout>
          }
        />

        <Route
          path="/notices"
          element={
            <MainLayout>
              <Notices />
            </MainLayout>
          }
        />

        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
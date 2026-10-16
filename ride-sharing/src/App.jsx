import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Cancelrequest from './pages/Cancelrequest';
import Newrequest from './pages/Newrequest';
import Cancelride from './pages/Cancelride';
import Homepage from './pages/Homepage';
import './App.css';
import {BrowserRouter, Navigate, Routes, Route} from 'react-router-dom';

function ProtectedRoute({ children }) {
  if (!localStorage.getItem("userId")) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function GuestOnlyRoute({ children }) {
  if (localStorage.getItem("userId")) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <>
       <BrowserRouter>
            <Navbar/>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
              <Route path="/signup" element={<GuestOnlyRoute><Signup /></GuestOnlyRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cancel-request" element={<ProtectedRoute><Cancelrequest /></ProtectedRoute>} />
              <Route path="/new-request" element={<ProtectedRoute><Newrequest /></ProtectedRoute>} />
              <Route path="/cancel-ride" element={<ProtectedRoute><Cancelride /></ProtectedRoute>} />
            </Routes>
       </BrowserRouter>
    </>
  )
}

export default App

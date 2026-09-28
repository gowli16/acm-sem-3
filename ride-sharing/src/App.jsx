import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Cancelrequest from './pages/Cancelrequest';
import './App.css';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
function App() {


  return (
    <>
       <Navbar/>
       <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cancel-request" element={<Cancelrequest />} />
            </Routes>
       </BrowserRouter>
    </>
  )
}

export default App

import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
function App() {


  return (
    <>
       <Navbar/>
       <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
       </BrowserRouter>
    </>
  )
}

export default App

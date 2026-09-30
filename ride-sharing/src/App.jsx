import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './pages/Dashboard';
import Cancelrequest from './pages/Cancelrequest';
import Newrequest from './pages/Newrequest';
import Cancelride from './pages/Cancelride';
import './App.css';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
function App() {


  return (
    <>
       <BrowserRouter>
            <Navbar/>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cancel-request" element={<Cancelrequest />} />
              <Route path="/new-request" element={<Newrequest />} />
              <Route path="/cancel-ride" element={<Cancelride />} />
            </Routes>
       </BrowserRouter>
    </>
  )
}

export default App

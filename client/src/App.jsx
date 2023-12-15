import React from "react"
import CustomCard from "./components/custom/CustomCard"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./components/users/Signup"
import Login from "./components/users/Login";
import Timeline from "./components/posts/Timeline";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate
} from 'react-router-dom'
import UserProfile from "./components/users/UserProfile";
import Homepage from "./components/homepage/Homepage";
import Navbar from './components/navbar/Navbar'
import bg from './assets/home-bg.jpg'
import AdminPage from "./components/admin/AdminPage";
import Users from "./components/admin/sections/Users";
import Contacts from "./components/admin/sections/Contacts";
import About from "./components/about/About";
import Reports from "./components/admin/sections/Reports";

function App() {
  return (
    <CustomCard
      className="bg-cover bg-center bg-fixed h-screen w-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path='/admin/users' element={<AdminPage Component={Users} />} />
          <Route path='/admin/contacts' element={<AdminPage Component={Contacts} />} />
          <Route path='/admin/reports' element={<AdminPage Component={Reports} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </CustomCard>
  )
}

export default App

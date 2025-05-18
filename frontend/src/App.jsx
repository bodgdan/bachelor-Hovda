import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword/resetPassword'
import { Login } from './pages/Login/login'
import RecoverPassword from './pages/RecoverPassword/recoverPassword'
import SendEmail from './pages/SendEmail/sendEmail'
import Registration from './pages/Registration/registration'
import MainMenu from './pages/MainMenu/mainMenu'
import WarehouseTable from './pages/Warehouses/warehouses'
import GoodsTable from './pages/Goods/goods'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/logi" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
        <Route path="/send-email" element={<SendEmail />} />
        <Route path="/warehouses" element={<WarehouseTable />} />
        <Route path="/main-menu" element={<MainMenu />} />
        <Route path="/goods" element={<GoodsTable />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./resetPassword.css"
import frameImage from '../../assets/Frame 4362.svg'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)

    if (password !== confirmPassword) {
      toast.error("Паролі не співпадають")
      return
    }

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', {
        token,
        newPassword: password,
      })

      toast.success(response.data.message || "Пароль успішно змінено")
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      toast.error(err.response?.data?.message || "Щось пішло не так")
    }
  }

  const showError = submitted && password !== confirmPassword

  return (
    <div className="reset-password-page">
      <form className="my_block" onSubmit={handleSubmit}>
        <img className='image' src={frameImage} alt="" />
        <h2 className='form_title'>Створіть новий пароль</h2>

        <div className="input_block">
          <input
            className={`pass_input ${showError ? 'error' : ''}`}
            placeholder='Введіть пароль'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className={`pass_input ${showError ? 'error' : ''}`}
            placeholder='Підтвердіть пароль'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type='submit' className='go_back_btn'>Підтвердити</button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default ResetPassword

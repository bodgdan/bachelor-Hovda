import "./registration.css";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Registration() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const isPasswordValid = passwordRegex.test(password);

  const isDisabled =
    !name ||
    !surname ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword ||
    !isPasswordValid;

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        { email, password },
        { withCredentials: true }
      );

      toast.success("Успішний вхід!");
      console.log("Response:", response.data);
      navigate("/main-menu");
    } catch (err) {
      setError(true);
      if (err.response) {
        toast.error(err.response.data.message || "Помилка входу");
      } else {
        toast.error("Помилка мережі");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("Пароль має містити великі і малі літери, цифри та спец. символи, мінімум 8 символів.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/registration", {
        name,
        surname,
        email,
        password,
      });

      toast.success("Реєстрація успішна!");
      await handleLogin(); // 👈 Login after successful registration
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка при реєстрації.");
    }
  };

  return (
    <div className="login_page">
      <span className="reg"></span>

      <form className="login_form" onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>

        <div className="name_input_con">
          <input
            type="text"
            placeholder="Ім’я"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(false);
            }}
            className={error ? "input-error" : "reg_input"}
            required
          />
          <input
            type="text"
            placeholder="Прізвище"
            value={surname}
            onChange={(e) => {
              setSurname(e.target.value);
              setError(false);
            }}
            className={error ? "input-error" : "reg_input"}
            required
          />
        </div>

        <input
          type="email"
          placeholder="Пошта"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          className={error ? "input-error" : "input_login"}
          required
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={error || (!isPasswordValid && password) ? "input-error" : "input_login"}
          required
        />

        <input
          type="password"
          placeholder="Підтвердіть пароль"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError(false);
          }}
          className={error || (password !== confirmPassword && confirmPassword) ? "input-error" : "input_login"}
          required
        />

        <p className="forgot_password" onClick={() => navigate("/recover-password")}>
          Забули пароль?
        </p>

        <button type="submit" disabled={isDisabled}>
          Зареєструватись
        </button>
      </form>

      <span className="reg">
        Вже маєте акаунт?{" "}
        <span onClick={() => navigate("/login")} className="reg_button">
          Увійти
        </span>
      </span>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // 👈 added this
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);

        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                { email, password },
                { withCredentials: true }
            );

            toast.success("Успішний вхід!");
            console.log("Response:", response.data);
            navigate('/warehouses');

        } catch (err) {
            setError(true);
            if (err.response) {
                toast.error(err.response.data.message || "Помилка входу");
            } else {
                toast.error("Помилка мережі");
            }
        }
    };

    return (
        <div className="login_page">
            <span className="reg"></span>

            <form onSubmit={handleLogin} className="login_form">
                <h2>Логін</h2>

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

                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"} // 👈 switch type
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        className={error ? "input-error" : "input_login"}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? "🙈" : "👁️"}
                    </span>
                </div>

                <p className="forgot_password" onClick={() => navigate("/recover-password")}>Забули пароль?</p>
                <button type="submit">Увійти</button>
            </form>

            <span className="reg">Ще не маєте акаунту? <span onClick={() => navigate("/registration")} className="reg_button">Зареєструватись</span></span>

            <ToastContainer position="top-right" autoClose={4000} />
        </div>
    );
}

import "./recoverPassword.css";
import lock from "../../assets/lock.svg";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";

export default function RecoverPassword() {
    const [email, setEmail] = useState("");
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasError(false);

        try {
            const response = await axios.post("http://localhost:8000/api/resetpass", {
                email,
            });
            setEmail("");
            localStorage.setItem("email", email)
            setLoading(true)
        } catch (err) {
            setHasError(true);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Помилка під час надсилання запиту.");
            }
            setLoading(false)
        }finally{
            navigate("/send-email")
            setLoading(false)

        }
    };

    return (
        <div className="recover_page">
            <form className="recover_form" onSubmit={handleSubmit}>
                <img className='image' src={lock} alt="lock icon" />
                <h2 className='form_title'>Створіть новий пароль</h2>
                <p>
                    Введіть пошту, яка використовувалась для реєстрації, щоб ми могли
                    надіслати інструкції для відновлення паролю
                </p>


                <input
                    className={`pass_input ${hasError ? "input-error" : ""}`}
                    placeholder="Ваша пошта"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" disabled={email ==="" ? true: false}>Надіслати</button>
            </form>

            <ToastContainer position="top-right" autoClose={4000} />
        </div>
    );
}

import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./sendEmail.css";
import emailImg from '../../assets/email.svg';

export default function SendEmail() {
    const [hasError, setHasError] = useState(false);
    const email = localStorage.getItem("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasError(false);

        try {
            const response = await axios.post("http://localhost:8000/api/resetpass", {
                email,
            });

            localStorage.setItem("email", email);
            toast.success("Лист повторно надіслано!");
        } catch (err) {
            setHasError(true);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Помилка під час надсилання запиту.");
            }
        }
    };

    return (
        <div className="send_email_page">
            <div className="send_email_block">
                <img className="image" src={emailImg} alt="email icon" />
                <h2 className="form_title">Email надісланий</h2>
                <p className="instruction">
                    Інструкція була надіслана на “{email}”. Перевірте свою пошту і дотримуйтесь інструкції.
                </p>
                <p className="text">
                    Не отримали лист? <span onClick={handleSubmit} className="span">Надіслати знову</span>
                </p>
            </div>

            <ToastContainer position="top-right" autoClose={4000} />
        </div>
    );
}

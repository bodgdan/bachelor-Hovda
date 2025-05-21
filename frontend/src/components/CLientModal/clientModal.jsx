import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
// import '../WarehouseModal/modal.css'; // you can create a separate modal.css if you want

const ClientModal = ({ isOpen, onClose, onSave }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    const [formData, setFormData] = useState({
        name: '',
        contacts: '',
        address: '',
        code: '',
        head_of_office: '',
        requisites: '',  // <-- fix here
    });
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return ReactDOM.createPortal(
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
            <div className={`modal-content ${isOpen ? 'open' : ''}`}>
                <h1>Додати клієнта</h1>
                <p>Заповніть дані про клієнта</p>

                <label>Назва</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Введіть назву клієнта"
                    value={formData.name}
                    onChange={handleChange}
                />

                <label>Контакти</label>
                <input
                    type="text"
                    name="contacts"
                    placeholder="Введіть контакти"
                    value={formData.contacts}
                    onChange={handleChange}
                />

                <label>Адреса</label>
                <input
                    type="text"
                    name="address"
                    placeholder="Введіть адресу"
                    value={formData.address}
                    onChange={handleChange}
                />

                <label>Код</label>
                <input
                    type="text"
                    name="code"
                    placeholder="Введіть код"
                    value={formData.code}
                    onChange={handleChange}
                />

                <label>Керівник</label>
                <input
                    type="text"
                    name="head_of_office"
                    placeholder="Введіть керівника"
                    value={formData.head_of_office}
                    onChange={handleChange}
                />

                <label>Реквізити</label>
                <input
                    type="text"
                    name="requisites"
                    placeholder="Введіть реквізити"
                    value={formData.requisites}
                    onChange={handleChange}
                />

                <div className="modal-buttons">
                    <button className="cancel-btn" onClick={onClose}>Скасувати</button>
                    <button className="save-btn" onClick={handleSave}>Зберегти</button>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default ClientModal;

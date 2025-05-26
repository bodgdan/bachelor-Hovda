import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './goodsModal.css';

const GoodsModal = ({ isOpen, onClose, onSave, warehouses = [], clients = [] }) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    unit: '',
    quantity: '',
    arrival_date: '',
    storage_term: '',
    client_id: '',       // changed from company to client_id
    warehouse_id: '',
    section: '',
  });

  const [sectionsState, setSectionsState] = useState([]);

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

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'warehouse_id') {
      const selectedWarehouse = warehouses.find(w => w.id === Number(value));
      if (selectedWarehouse) {
        setSectionsState(selectedWarehouse.sections || []);
      } else {
        setSectionsState([]);
      }

      // Reset selected section when warehouse changes
      setFormData((prev) => ({ ...prev, section: '' }));
    }
  };

  const handleSectionSelect = (sectionValue) => {
    setFormData((prev) => ({ ...prev, section: sectionValue }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };


  console.log(clients)

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`modal-content ${isOpen ? 'open' : ''}`}>
        <h1>Додати товар</h1>
        <p>Заповніть дані про товар</p>

        <label>Назва товару</label>
        <input
          type="text"
          name="name"
          placeholder="Введіть назву"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Код товару</label>
        <input
          type="text"
          name="code"
          placeholder="Введіть код"
          value={formData.code}
          onChange={handleChange}
        />

        <label>Одиниця виміру</label>
        <input
          type="text"
          name="unit"
          placeholder="шт / кг / м"
          value={formData.unit}
          onChange={handleChange}
        />

        <label>Кількість</label>
        <input
          type="number"
          name="quantity"
          placeholder="Введіть кількість"
          value={formData.quantity}
          onChange={handleChange}
        />

        <label>Дата прибуття</label>
        <input
          type="date"
          name="arrival_date"
          value={formData.arrival_date}
          onChange={handleChange}
        />

        <label>Термін зберігання (днів)</label>
        <input
          type="number"
          name="storage_term"
          placeholder="Напр. 30"
          value={formData.storage_term}
          onChange={handleChange}
        />

        {/* Client dropdown */}
        <label>Компанія/Клієнт</label>
        <select
          name="client_id"
          value={formData.client_id}
          onChange={handleChange}
        >
          <option value="">Оберіть клієнта</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>

        <label>ID складу</label>
        <select name="warehouse_id" value={formData.warehouse_id} onChange={handleChange}>
          <option value="">Оберіть склад</option>
          {warehouses.map((wh) => (
            <option key={wh.id} value={wh.id}>
              {wh.name}
            </option>
          ))}
        </select>

        <label>Секція</label>
        <div className="section-buttons">
          {sectionsState.map((sec, idx) => (
            <button
              key={idx}
              type="button"
              className={`section-btn ${formData.section === sec ? 'active' : ''}`}
              onClick={() => handleSectionSelect(sec)}
            >
              {sec}
            </button>
          ))}
        </div>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Скасувати</button>
          <button className="save-btn" onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default GoodsModal;

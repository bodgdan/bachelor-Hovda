import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './modal.css';

const WarehouseModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState('');
  const [principle, setPrinciple] = useState('');
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const handleAddSection = () => {
    if (newSection.trim() !== '') {
      setSections([...sections, newSection.trim()]);
      setNewSection('');
    }
  };

  const handleSave = () => {
    onSave({ name, location, sections, principle });
    onClose();
  };

  return ReactDOM.createPortal(
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className={`modal-content ${isOpen ? 'open' : ''}`}>
        <h1>Створення складу</h1>
        <p>Заповніть інформацію для створення складу у системі</p>

        <label>Назва складу</label>
        <input
          type="text"
          placeholder="Введіть тут"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Локація складу</label>
        <input
          type="text"
          placeholder="Введіть тут"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <label>Секції складу</label>
        <div className="sections-container">
          {sections.map((section, index) => (
            <div key={index} className="section-badge">{section}</div>
          ))}
          <input
            type="text"
            placeholder="+ Додайте секцію"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSection();
              }
            }}
          />
        </div>

        <label>Принцип ротації вантажів</label>
        <select
          value={principle}
          onChange={(e) => setPrinciple(e.target.value)}
        >
          <option value="">Оберіть принцип</option>
          <option value="FIFO">FIFO</option>
          <option value="LIFO">LIFO</option>
        </select>

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Скасувати</button>
          <button className="save-btn" onClick={handleSave}>Зберегти</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default WarehouseModal;

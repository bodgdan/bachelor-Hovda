import WarehouseModal from "../../components/WarehouseModal/warehouseModal";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/navbar";
import axios from "axios";
import "./warehouses.css"
export default function WarehouseTable() {
    const [warehouses, setWarehouses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleSaveWarehouse = async (warehouseData) => {
        try {
            await axios.post('http://localhost:8000/api/warehouses', warehouseData, {
                withCredentials: true,
              });
            const res = await axios.get('http://localhost:8000/api/warehouses');
            setWarehouses(res.data);
        } catch (err) {
            console.error('Error saving warehouse:', err);
        }
    };

    useEffect(() => {
        axios
            .get('http://localhost:8000/api/warehouses',
                {withCredentials: true},
            )
            .then((res) => setWarehouses(res.data))
            .catch((err) => console.error('Error fetching warehouses:', err));
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className='warhouse_page'>
            <Navbar />
            <div className="table-container">
                <div className="control">
                    <h1 className='page_title'>Склади</h1>
                    <button className='create' onClick={() => setIsModalOpen(true)}>+Створити склад</button>
                </div>

                <table className="warehouses-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Назва</th>
                            <th>Кількість</th>

                            <th>Секції</th>
                            <th>Принцип</th>
                            <th>Локація</th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {warehouses.map((w, idx) => (
                            <tr key={idx}>
                                <td>{w.id}</td>
                                <td>{w.name}</td>
                                <td>{w.count}</td>

                                <td>
                                    <div className="section-list">
                                        {w.sections.map((section, i) => (
                                            <div key={i} className="section-badge">{section}</div>
                                        ))}
                                    </div>
                                </td>
                                <td>{w.principle}</td>
                                <td>{w.location}</td>

                                <td>
                                    <button className="icon-button">☰</button>
                                    <button className="icon-button">✏️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <WarehouseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveWarehouse}
            />
        </div>
    );
};

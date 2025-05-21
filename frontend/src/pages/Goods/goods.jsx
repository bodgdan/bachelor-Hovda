import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/navbar";
import axios from "axios";
import "./goods.css";
import GoodsModal from "../../components/GoodsModal/goodsModal";

export default function GoodsTable() {
  const [goods, setGoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/goods', { withCredentials: true })
      .then((res) => setGoods(res.data.goods))
      .catch((err) => console.error('Error fetching goods:', err));

    axios.get('http://localhost:8000/api/warehouses', { withCredentials: true })
      .then((res) => setWarehouses(res.data || []))
      .catch(console.error);

  }, []);

  const handleAddGood = (newGood) => {
    axios.post('http://localhost:8000/api/goods', newGood, { withCredentials: true })
      .then(res => {
        setGoods(prev => [...prev, res.data.good]);
      })
      .catch(err => console.error('Failed to add good:', err));
  };

return (
    <div className="goods_page">
      <Navbar />
      <div className="table-container">
        <div className="control">
          <h1 className="page_title">Товари</h1>
          <button className='create' onClick={() => setIsModalOpen(true)}>+Додати товар</button>
        </div>

        {goods.length === 0 ? (
          <div className="no-goods-message">
            Немає товару
          </div>
        ) : (
          <table className="goods-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Код</th>
                <th>Од. виміру</th>
                <th>К-сть</th>
                <th>Склад</th>
                <th>Секція</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {goods.map((g, idx) => (
                <tr key={idx}>
                  <td>{g?.id}</td>
                  <td>{g?.name}</td>
                  <td>{g?.code}</td>
                  <td>{g?.unit}</td>
                  <td>{g?.quantity}</td>
                  <td>{g?.warehouse_name || "-"}</td>
                  <td>{g?.section}</td>
                  <td>
                    <button className="icon-button">☰</button>
                    <button className="icon-button">✏️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <GoodsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddGood}
          warehouses={warehouses}
          users={users}
        />
      </div>
    </div>
  );
}

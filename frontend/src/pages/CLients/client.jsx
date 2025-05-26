import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/navbar";
import axios from "axios";
import "./client.css";
import ClientModal from "../../components/CLientModal/clientModal";
export default function ClientTable() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/client", { withCredentials: true })
      .then((res) => setClients(res.data || []))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  const handleAddClient = async (newClient) => {
    try {
      await axios.post("http://localhost:8000/api/client", newClient, { withCredentials: true });
      const res = await axios.get("http://localhost:8000/api/client", { withCredentials: true });
      setClients(res.data || []);
    } catch (error) {
      console.error("Error in handleAddClient:", error);
    }
  };


  return (
    <div className="client_page">
      <Navbar />
      <div className="table-container">
        <div className="control">
          <h1 className="page_title">Клієнти</h1>
          <button className="create" onClick={() => setIsModalOpen(true)}>+Додати клієнта</button>
        </div>

        {clients.length === 0 ? (
          <div className="no-clients-message">
            Немає клієнтів
          </div>
        ) : (
          <table className="client-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва</th>
                <th>Контакти</th>
                <th>Адреса</th>
                <th>Код</th>
                <th>Керівник</th>
                <th>Реквізити</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, idx) => (
                <tr key={idx}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.contacts}</td>
                  <td>{client.address}</td>
                  <td>{client.code}</td>
                  <td>{client.head_of_office}</td>
                  <td>{client.requisites}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ClientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddClient}
        />
      </div>
    </div>
  );
}

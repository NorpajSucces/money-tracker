import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
    const navigate = useNavigate();

    // state untuk menyimpan transaksi
    const [transactions, setTransactions] = useState([]);

    // state menyimpan saldo
    const [balance, setBalance] = useState(0);

    // state loading
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        title: "",
        amount: "",
        type: "income"
    });

    // state Edit
    const [editingId, setEditingId] = useState(null);

    // Fungsi untuk fetch data dari backend
    const fetchData = async () => {
        try {
            const trxResponse = await api.get("/transactions")
            const summaryResponse = await api.get("/transactions/summary")

            //  menyimpan ke state
            setTransactions(trxResponse.data.data)
            setBalance(summaryResponse.data.total_balance)
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk submit transaksi baru atau update
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Mode edit: update transaksi
                await api.put(`/transactions/${editingId}`, {
                    title: form.title,
                    amount: Number(form.amount),
                    type: form.type
                });
                setEditingId(null);
            } else {
                // Mode tambah: create transaksi baru
                await api.post('/transactions', {
                    title: form.title,
                    amount: Number(form.amount),
                    type: form.type
                });
            }

            // reset form
            setForm({
                title: "",
                amount: "",
                type: "income"
            });

            // fetch ulang data supaya tampilan terupdate
            fetchData();
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    // Fungsi untuk mengisi form dengan data transaksi yang mau di-edit
    const handleEdit = (trx) => {
        setEditingId(trx._id);
        setForm({
            title: trx.title,
            amount: trx.amount,
            type: trx.type
        });
    };

    // Fungsi untuk membatalkan edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({
            title: "",
            amount: "",
            type: "income"
        });
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            fetchData();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    }

    // Fungsi untuk logout
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate("/");
    };

    // useEffect dijalankan saat komponen pertama kali muncul
    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h3>Total Balance: Rp {balance}</h3>

            {/* Form untuk tambah/edit transaksi */}
            <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <br />
                <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <br />
                <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
                <br />
                <button type="submit">{editingId ? "Update" : "Add"}</button>
                {editingId && (
                    <button type="button" onClick={handleCancelEdit}>Cancel</button>
                )}
            </form>

            <h3>Transactions:</h3>

            {transactions.length === 0 ? (
                <p>No transactions yet</p>
            ) : (
                <ul>
                    {transactions.map((trx) => (
                        <li key={trx._id}>
                            {trx.title} - Rp {trx.amount} ({trx.type})

                            <button onClick={() => handleEdit(trx)}>Edit</button>
                            <button onClick={() => handleDelete(trx._id)}>Delete</button>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

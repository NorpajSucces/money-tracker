import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import SummaryCard from '../components/summary/SummaryCard';
import TransactionForm from '../components/transaction/TransactionForm';
import TransactionList from '../components/transaction/TransactionList';
import styles from './Dashboard.module.css';

const INITIAL_FORM = { title: '', amount: '', type: 'income' };

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, total_balance: 0 });
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingId, setEditingId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const [trxRes, summaryRes] = await Promise.all([
                api.get('/transactions'),
                api.get('/transactions/summary')
            ]);
            setTransactions(trxRes.data.data);
            setSummary(summaryRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { title: form.title, amount: Number(form.amount), type: form.type };

        try {
            if (editingId) {
                await api.put(`/transactions/${editingId}`, payload);
            } else {
                await api.post('/transactions', payload);
            }
            setForm(INITIAL_FORM);
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleEdit = (trx) => {
        setEditingId(trx._id);
        setForm({ title: trx.title, amount: trx.amount, type: trx.type });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm(INITIAL_FORM);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
        try {
            await api.delete(`/transactions/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    if (loading) return <div className={styles.loading}>Loading...</div>;

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.content}>
                <SummaryCard
                    balance={summary.total_balance}
                    income={summary.income}
                    expense={summary.expense}
                />
                <TransactionForm
                    form={form}
                    editingId={editingId}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    onCancel={handleCancelEdit}
                />
                <h3 className={styles.listTitle}>Transactions</h3>
                <TransactionList
                    transactions={transactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>
        </div>
    );
}

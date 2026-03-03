import styles from './TransactionForm.module.css';

/**
 * Form untuk menambah atau mengedit transaksi
 * @param {{ form, editingId, onChange, onSubmit, onCancel }} props
 */
export default function TransactionForm({ form, editingId, onChange, onSubmit, onCancel }) {
    return (
        <div className={styles.wrapper}>
            <h3 className={styles.title}>
                {editingId ? '✏️ Edit Transaction' : '➕ Add Transaction'}
            </h3>
            <form onSubmit={onSubmit} className={styles.form}>
                <input
                    className={styles.input}
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => onChange({ ...form, title: e.target.value })}
                    required
                />
                <input
                    className={styles.input}
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => onChange({ ...form, amount: e.target.value })}
                    min="0"
                    required
                />
                <select
                    className={styles.select}
                    value={form.type}
                    onChange={(e) => onChange({ ...form, type: e.target.value })}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <div className={styles.actions}>
                    <button type="submit" className={styles.submitBtn}>
                        {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

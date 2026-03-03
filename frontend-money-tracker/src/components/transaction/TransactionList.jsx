import { formatCurrency } from '../../utils/formatCurrency';
import styles from './TransactionList.module.css';

/**
 * Menampilkan daftar transaksi
 * @param {{ transactions: Array, onEdit: Function, onDelete: Function }} props
 */
export default function TransactionList({ transactions, onEdit, onDelete }) {
    if (transactions.length === 0) {
        return <p className={styles.empty}>No transactions yet. Add one above!</p>;
    }

    return (
        <ul className={styles.list}>
            {transactions.map((trx) => (
                <li key={trx._id} className={`${styles.item} ${styles[trx.type]}`}>
                    <div className={styles.info}>
                        <span className={styles.itemTitle}>{trx.title}</span>
                        <span className={styles.date}>
                            {new Date(trx.createdAt).toLocaleDateString('id-ID', {
                                day: '2-digit', month: 'short', year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className={styles.right}>
                        <span className={styles.amount}>
                            {trx.type === 'income' ? '+' : '-'} {formatCurrency(trx.amount)}
                        </span>
                        <div className={styles.btnGroup}>
                            <button className={styles.editBtn} onClick={() => onEdit(trx)}>Edit</button>
                            <button className={styles.deleteBtn} onClick={() => onDelete(trx._id)}>Delete</button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

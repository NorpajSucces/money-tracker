import { formatCurrency } from '../../utils/formatCurrency';
import styles from './SummaryCard.module.css';

/**
 * Menampilkan ringkasan keuangan: total balance, income, dan expense
 * @param {{ balance: number, income: number, expense: number }} props
 */
export default function SummaryCard({ balance, income, expense }) {
    return (
        <div className={styles.container}>
            <div className={`${styles.card} ${styles.balance}`}>
                <p className={styles.label}>Total Balance</p>
                <p className={styles.amount}>{formatCurrency(balance)}</p>
            </div>
            <div className={`${styles.card} ${styles.income}`}>
                <p className={styles.label}>Total Income</p>
                <p className={styles.amount}>{formatCurrency(income)}</p>
            </div>
            <div className={`${styles.card} ${styles.expense}`}>
                <p className={styles.label}>Total Expense</p>
                <p className={styles.amount}>{formatCurrency(expense)}</p>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashBanner() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);

    const message = flash?.success ?? flash?.error;
    const variant = flash?.error ? 'error' : 'success';

    useEffect(() => {
        if (message) {
            setVisible(true);
            const timeout = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timeout);
        }
    }, [message]);

    if (!message || !visible) {
        return null;
    }

    const classes =
        variant === 'error'
            ? 'border-error-200 bg-error-50 text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-400'
            : 'border-success-200 bg-success-50 text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-400';

    return (
        <div className={`mb-6 flex items-start justify-between rounded-xl border px-4 py-3 text-sm ${classes}`}>
            <span>{message}</span>
            <button
                type="button"
                onClick={() => setVisible(false)}
                className="ml-4 opacity-70 hover:opacity-100"
                aria-label="Cerrar"
            >
                &times;
            </button>
        </div>
    );
}

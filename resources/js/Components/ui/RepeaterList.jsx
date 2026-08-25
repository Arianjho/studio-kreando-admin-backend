import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { PlusIcon, TrashIcon } from '@/Icons';

export default function RepeaterList({ items, fields, onChange, addLabel = 'Agregar' }) {
    const updateField = (index, key, value) => {
        const next = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
        onChange(next);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        const empty = Object.fromEntries(fields.map((field) => [field.key, '']));
        onChange([...items, empty]);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.key} className={field.span === 'full' ? 'sm:col-span-2' : ''}>
                                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        rows={2}
                                        value={item[field.key] ?? ''}
                                        onChange={(event) => updateField(index, field.key, event.target.value)}
                                    />
                                ) : (
                                    <TextInput
                                        value={item[field.key] ?? ''}
                                        onChange={(event) => updateField(index, field.key, event.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        aria-label="Quitar"
                        className="mt-5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-500 hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400"
            >
                <PlusIcon className="h-4 w-4" />
                {addLabel}
            </button>
        </div>
    );
}

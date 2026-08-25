import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { PlusIcon, TrashIcon, UploadIcon } from '@/Icons';

export default function ServiceRepeater({ items, onChange }) {
    const updateField = (index, key, value) => {
        onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
    };

    const handleFile = (index, file) => {
        if (!file) {
            return;
        }
        onChange(
            items.map((item, i) => (i === index ? { ...item, file, url: URL.createObjectURL(file) } : item)),
        );
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([
            ...items,
            { number: String(items.length + 1).padStart(2, '0'), title: '', description: '', url: null, file: null },
        ]);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-800"
                >
                    <div className="flex-shrink-0">
                        {item.url ? (
                            <img src={item.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400 dark:bg-white/5">
                                <UploadIcon className="h-5 w-5" />
                            </div>
                        )}
                        <label className="mt-1.5 block cursor-pointer text-center text-[11px] text-brand-500 hover:underline">
                            Cambiar
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => handleFile(index, event.target.files?.[0])}
                            />
                        </label>
                    </div>

                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                Número
                            </label>
                            <TextInput
                                value={item.number ?? ''}
                                onChange={(event) => updateField(index, 'number', event.target.value)}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                Título
                            </label>
                            <TextInput
                                value={item.title ?? ''}
                                onChange={(event) => updateField(index, 'title', event.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                                Descripción
                            </label>
                            <Textarea
                                rows={2}
                                value={item.description ?? ''}
                                onChange={(event) => updateField(index, 'description', event.target.value)}
                            />
                        </div>
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
                Agregar servicio
            </button>
        </div>
    );
}

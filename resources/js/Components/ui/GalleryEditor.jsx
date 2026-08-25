import { useRef } from 'react';
import TextInput from '@/Components/TextInput';
import { PlusIcon, TrashIcon, UploadIcon } from '@/Icons';

let keySeq = 0;
function nextKey() {
    keySeq += 1;
    return `gallery-${Date.now()}-${keySeq}`;
}

export default function GalleryEditor({ items, onChange }) {
    const fileInputRef = useRef(null);

    const addFiles = (fileList) => {
        const newItems = Array.from(fileList).map((file) => ({
            key: nextKey(),
            file,
            url: URL.createObjectURL(file),
            alt: '',
        }));

        onChange([...items, ...newItems]);
    };

    const updateAlt = (key, alt) => {
        onChange(items.map((item) => (item.key === key ? { ...item, alt } : item)));
    };

    const removeItem = (key) => {
        onChange(items.filter((item) => item.key !== key));
    };

    return (
        <div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((item) => (
                    <div
                        key={item.key}
                        className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
                    >
                        <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                        <div className="space-y-1.5 p-2">
                            <TextInput
                                value={item.alt}
                                onChange={(event) => updateAlt(item.key, event.target.value)}
                                placeholder="Texto alternativo"
                                className="!h-9 text-xs"
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(item.key)}
                                className="flex w-full items-center justify-center gap-1 rounded-md bg-error-50 py-1 text-xs font-medium text-error-600 hover:bg-error-100 dark:bg-error-500/10 dark:text-error-400"
                            >
                                <TrashIcon className="h-3.5 w-3.5" />
                                Quitar
                            </button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-brand-300 hover:text-brand-500 dark:border-gray-700"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span className="text-xs">Agregar</span>
                </button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                    if (event.target.files?.length) {
                        addFiles(event.target.files);
                    }
                    event.target.value = '';
                }}
            />
        </div>
    );
}

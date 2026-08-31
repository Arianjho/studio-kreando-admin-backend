import { useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import { Button } from '@/Components/ui/button';

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
                    <div key={item.key} className="overflow-hidden rounded-lg border border-border">
                        <img src={item.url} alt="" className="aspect-square w-full object-cover" />
                        <div className="space-y-1.5 p-2">
                            <TextInput
                                value={item.alt}
                                onChange={(event) => updateAlt(item.key, event.target.value)}
                                placeholder="Texto alternativo"
                                className="!h-8 text-xs"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => removeItem(item.key)}
                            >
                                <Trash2 className="size-3.5" />
                                Quitar
                            </Button>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"
                >
                    <Plus className="size-5" />
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

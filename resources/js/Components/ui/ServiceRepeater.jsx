import { Plus, Trash2, Upload } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Button } from '@/Components/ui/button';

export default function ServiceRepeater({ items, onChange }) {
    const updateField = (index, key, value) => {
        onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
    };

    const handleFile = (index, file) => {
        if (!file) {
            return;
        }
        onChange(items.map((item, i) => (i === index ? { ...item, file, url: URL.createObjectURL(file) } : item)));
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const addItem = () => {
        onChange([...items, { number: String(items.length + 1).padStart(2, '0'), title: '', description: '', url: null, file: null }]);
    };

    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="shrink-0">
                        {item.url ? (
                            <img src={item.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                <Upload className="size-5" />
                            </div>
                        )}
                        <label className="mt-1.5 block cursor-pointer text-center text-[11px] text-primary hover:underline">
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
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Número</label>
                            <TextInput value={item.number ?? ''} onChange={(event) => updateField(index, 'number', event.target.value)} />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Título</label>
                            <TextInput value={item.title ?? ''} onChange={(event) => updateField(index, 'title', event.target.value)} />
                        </div>
                        <div className="sm:col-span-3">
                            <label className="mb-1 block text-xs font-medium text-muted-foreground">Descripción</label>
                            <Textarea rows={2} value={item.description ?? ''} onChange={(event) => updateField(index, 'description', event.target.value)} />
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar"
                        className="mt-5 shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeItem(index)}
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            ))}

            <Button type="button" variant="outline" className="border-dashed" onClick={addItem}>
                <Plus className="size-4" />
                Agregar servicio
            </Button>
        </div>
    );
}

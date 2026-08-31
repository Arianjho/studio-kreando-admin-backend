import { Plus, Trash2 } from 'lucide-react';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { Button } from '@/Components/ui/button';

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
                <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        {fields.map((field) => (
                            <div key={field.key} className={field.span === 'full' ? 'sm:col-span-2' : ''}>
                                <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
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
                {addLabel}
            </Button>
        </div>
    );
}

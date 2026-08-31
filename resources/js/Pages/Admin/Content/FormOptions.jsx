import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmModal from '@/Components/ui/ConfirmModal';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import TextInput from '@/Components/TextInput';

const GROUP_LABELS = {
    project_type: 'Tipo de proyecto',
    intervention: 'Tipo de intervención',
    service: 'Servicios',
    budget: 'Presupuesto',
    timeline: 'Plazo',
};

const GROUP_HINTS = {
    project_type: 'Obligatorio en el formulario. La primera opción no se preselecciona.',
    intervention: 'Opcional para el visitante.',
    service: 'Casillas de selección múltiple.',
    budget: 'Rangos que verá el interesado. Opcional para él.',
    timeline: 'Opcional para el visitante.',
};

function OptionRow({ option, onDelete }) {
    const [label, setLabel] = useState(option.label);
    const [saving, setSaving] = useState(false);

    const save = () => {
        const next = label.trim();
        if (!next || next === option.label) {
            setLabel(option.label);
            return;
        }
        setSaving(true);
        router.put(
            route('admin.content.form-options.update', option.id),
            { label: next },
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <div className="flex items-center gap-2">
            <TextInput
                className="flex-1"
                value={label}
                disabled={saving}
                onChange={(event) => setLabel(event.target.value)}
                onBlur={save}
                onKeyDown={(event) => event.key === 'Enter' && event.currentTarget.blur()}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Eliminar "${option.label}"`}
                className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(option)}
            >
                <Trash2 className="size-4" />
            </Button>
        </div>
    );
}

function GroupCard({ group, options, onDelete }) {
    const [newLabel, setNewLabel] = useState('');
    const [adding, setAdding] = useState(false);

    const add = (event) => {
        event.preventDefault();
        const label = newLabel.trim();
        if (!label) return;
        setAdding(true);
        router.post(
            route('admin.content.form-options.store'),
            { group, label },
            {
                preserveScroll: true,
                onSuccess: () => setNewLabel(''),
                onFinish: () => setAdding(false),
            },
        );
    };

    return (
        <Card className="p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold">{GROUP_LABELS[group] ?? group}</h3>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">{GROUP_HINTS[group]}</p>

            <div className="space-y-2">
                {options.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin opciones. Agrega la primera abajo.</p>
                )}
                {options.map((option) => (
                    <OptionRow key={option.id} option={option} onDelete={onDelete} />
                ))}
            </div>

            <form onSubmit={add} className="mt-4 flex items-center gap-2">
                <TextInput
                    className="flex-1"
                    placeholder="Nueva opción…"
                    value={newLabel}
                    disabled={adding}
                    onChange={(event) => setNewLabel(event.target.value)}
                />
                <Button type="submit" variant="outline" className="shrink-0 border-dashed" disabled={adding}>
                    <Plus className="size-4" /> Agregar
                </Button>
            </form>
        </Card>
    );
}

export default function FormOptions({ groups, options }) {
    const [deleting, setDeleting] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const byGroup = useMemo(() => {
        const map = Object.fromEntries(groups.map((group) => [group, []]));
        for (const option of options) {
            (map[option.group] ??= []).push(option);
        }
        return map;
    }, [groups, options]);

    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(route('admin.content.form-options.destroy', deleting.id), {
            preserveScroll: true,
            onFinish: () => {
                setIsDeleting(false);
                setDeleting(null);
            },
        });
    };

    return (
        <AdminLayout
            title="Formulario de contacto"
            header="Contenido: Formulario de contacto"
            description="Opciones de los desplegables del formulario de contacto del sitio público. Los mensajes ya recibidos conservan el texto que se eligió en su momento."
        >
            <div className="grid gap-6 lg:grid-cols-2">
                {groups.map((group) => (
                    <GroupCard
                        key={group}
                        group={group}
                        options={byGroup[group] ?? []}
                        onDelete={setDeleting}
                    />
                ))}
            </div>

            <ConfirmModal
                isOpen={Boolean(deleting)}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
                title="Eliminar opción"
                message={`¿Eliminar "${deleting?.label}" del formulario? Dejará de aparecer en el sitio; los mensajes que ya la usaron no cambian.`}
                confirmLabel="Eliminar"
                isLoading={isDeleting}
            />
        </AdminLayout>
    );
}

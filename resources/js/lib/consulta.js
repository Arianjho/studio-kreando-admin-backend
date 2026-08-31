export const CONSULTA_STATUS = {
    nuevo: { label: 'Nuevo', variant: 'default' },
    contactado: { label: 'Contactado', variant: 'success' },
    cerrado: { label: 'Cerrado', variant: 'secondary' },
};

export const statusOf = (consulta) => CONSULTA_STATUS[consulta?.status] ?? CONSULTA_STATUS.nuevo;

export const formatPhone = (phone) => {
    const digits = String(phone ?? '').replace(/\D/g, '');
    return digits.length === 9 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : phone;
};

export const fillTemplate = (template, consulta) =>
    String(template ?? '')
        .replaceAll('{nombre}', consulta.name ?? '')
        .replaceAll('{tipo_proyecto}', consulta.project_type ?? '')
        .replaceAll('{ubicacion}', consulta.location ?? '')
        .replaceAll('{presupuesto}', consulta.budget ?? '')
        .replaceAll('{plazo}', consulta.timeline ?? '');

<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Opciones del formulario de contacto
    |--------------------------------------------------------------------------
    |
    | Valores por defecto de cada lista desplegable del formulario público.
    | El seeder los inserta en `contact_form_options` (donde el estudio los
    | edita) y `ContactFormOption::grouped()` cae a estos si una lista queda
    | vacía en la base de datos.
    |
    */

    'options' => [
        'project_type' => ['Vivienda', 'Comercial', 'Interiorismo', 'Espacio público', 'Otro'],

        'intervention' => [
            'Obra nueva',
            'Remodelación o ampliación',
            'Solo interiorismo',
            'Aún no lo sé',
        ],

        'service' => [
            'Anteproyecto y diseño',
            'Proyecto ejecutivo',
            'Dirección de obra',
            'Interiorismo y mobiliario',
            'Aún no estoy seguro',
        ],

        'budget' => [
            'Menos de S/ 10 mil',
            'S/ 10 – 30 mil',
            'S/ 30 – 80 mil',
            'S/ 80 – 200 mil',
            'S/ 200 – 500 mil',
            'Más de S/ 500 mil',
            'Prefiero conversarlo',
        ],

        'timeline' => [
            'Lo antes posible',
            'En los próximos 6 meses',
            'En 6 – 12 meses',
            'Solo estoy explorando',
        ],
    ],
];

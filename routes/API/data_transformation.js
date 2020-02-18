const renameAttr = (object, a1, a2) => {
    if (object.hasOwnProperty(a1)){
        object[a2] = object[a1];
        delete object[a1];
    }
};

const procedimientos = [
    {
        "clave": 1,
        "valor": "CONTRATACIONES PÚBLICAS"
    },
    {
        "clave": 2,
        "valor": "CONCESIONES, LICENCIAS, PERMISOS, AUTORIZACIONES Y PRÓRROGAS"
    },
    {
        "clave": 3,
        "valor": "ENAJENACIÓN DE BIENES MUEBLES"
    },
    {
        "clave": 4,
        "valor": "ASIGNACIÓN Y EMISIÓN DE DICTÁMENES DE AVALÚOS NACIONALES"
    }
];

const nivelesResponsabilidad = [
    {
        "clave": "A",
        "valor": "ATENCIÓN"
    },
    {
        "clave": "T",
        "valor": "TRAMITACIÓN"
    },
    {
        "clave": "R",
        "valor": "RESOLUCIÓN"
    }
];


const gql = data => {
    data.results.forEach(d => {
        renameAttr(d, 'dependencia', 'institucionDependencia');
        renameAttr(d, 'tipo_procedimiento', 'tipoProcedimiento');
        renameAttr(d, 'nivel_responsabilidad', 'nivelResponsabilidad');

        d.tipoProcedimiento = [ d.tipoProcedimiento ];
        d.tipoProcedimiento = procedimientos.filter(p => d.tipoProcedimiento.includes(p.clave));
        d.nivelResponsabilidad = nivelesResponsabilidad.filter(n => d.nivelResponsabilidad.includes(n.clave));
    });

    return data;
};


const rest = data => {
    data.results.forEach(d => {
        d.tipoProcedimiento = procedimientos.filter(p => d.tipoProcedimiento.includes(p.clave));
        d.nivelResponsabilidad = nivelesResponsabilidad.filter(n => d.nivelResponsabilidad.includes(n.clave));
    });

    return data;
};

module.exports = {
    gql,
    rest
};

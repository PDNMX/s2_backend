const {procedimientos, nivelesResponsabilidad} = require('./code_lists.js');

const renameAttr = (object, a1, a2) => {
    if (object.hasOwnProperty(a1)){
        object[a2] = object[a1];
        delete object[a1];
    }
};

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

const renameAttr = (object, a1, a2) => {
    if (object.hasOwnProperty(a1)){
        object[a2] = object[a1];
        delete object[a1];
    }
};

const sfp = data => {

    data.results.forEach(d => {
        renameAttr(d, 'dependencia', 'institucionDependencia');
        renameAttr(d, 'tipo_procedimiento', 'tipoProcedimiento');
    });

    return data;
};

module.exports = {
    sfp
};

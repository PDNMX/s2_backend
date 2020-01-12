var express = require('express');
var router = express.Router();

const endpoints = require('../../endpoints');
const {fetchData, fetchEntities} = require('./rest_data');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json({
        "title": "API del Sistema 2",
        "version": '1.0'
    });
});

// busqueda general
router.post('/summary', (req, res)=> {
    const {
        nombres,
        apellido_uno,
        apellido_dos,
        procedimiento,
        institucion,
        nivel_gobierno
    } =  req.body;

    //Evalua la consulta
    //Consulta fuentes

    console.log(endpoints);
    let queries = endpoints.map( endpoint => fetchData(endpoint,{
        //query options
        pageSize: 1
    }));

    Promise.all(queries).then( data => {
        console.log(data);
        res.json(data);
    }).catch(error => {
        console.log(error);
    });
});

// busqueda en un solo proveedor de información
router.post('/search', (req, res) => {

    const {
        supplier_id,
        nombres,
        apellido_uno,
        apellido_dos,
        procedimiento,
        institucion,
        nivel_gobierno
    } =  req.body;

    let endpoint = endpoints.filter(d => d.supplier_id === supplier_id);
    endpoint = endpoint[0];

    //buscar...

    res.json({});

});

// entidades de uno o más proveedores de información
// las entidades debería traer:
// nivel de gobierno
// supplier_id

router.post('/entities', (req, res) => {

    const {nivel_gobierno} = req.body;

    let promises = endpoints.map( endpoint => fetchEntities(endpoint) );

    Promise.all(promises).then( data => {
        // asignar supplier
        let entities = [];
        const dl = data.length;

        // falta filtrar si el entity corresponde al nivel de gobierno;
        // un proveedor de información puede traer de varios niveles

        for (let i=0; i < dl; i++){
            entities = entities.concat(data[i].map(entity => {
                entity.supplier_id = i;
                return entity;
            }));
        }

        const cfn = (a, b) => {
            if(a.siglas < b.siglas) { return -1; }
            if(a.siglas > b.siglas) { return 1; }
            return 0;
        };

        res.json(entities.sort(cfn));
    }).catch(error => {
        console.log(error);
    });

});

module.exports = router;
var express = require('express');
var cors = require ('cors');

var router = express.Router();
router.use(cors());

const endpoints = require('../../endpoints');
const {fetchData, fetchEntities} = require('./rest_data');
const graphql_data = require('./graphql_data');


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
        pageSize: 1,
        page: 1,
        query: {}
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
        page,
        pageSize,
        supplier_id,
        nombres,
        primerApellido,
        segundoApellido,
        tipoProcedimiento,
        institucionDependencia
    } =  req.body;

    let endpoint = endpoints.filter(d => d.supplier_id === supplier_id);
    endpoint = endpoint[0];

    //buscar...
    let options = {
        query: {}
    };

    options.page = page;
    options.pageSize = pageSize;

    if (typeof nombres !== 'undefined' && nombres !== ''){
        options.query.nombres = nombres;
    }

    if (typeof primerApellido !== 'undefined' && primerApellido !== ''){
        options.query.primerApellido = primerApellido;
    }

    if (typeof primerApellido !== 'undefined' && primerApellido !== ''){
        options.query.segundoApellido = segundoApellido;
    }

    if (typeof tipoProcedimiento !== 'undefined'){
        options.query.tipoProcedimiento = tipoProcedimiento;
    }

    if (typeof institucionDependencia !== 'undefined' && institucionDependencia !== ''){
        options.query.institucionDependencia = institucionDependencia;
    }

    fetchData(endpoint, options).then(data => {
        res.json(data);
    });

});

// entidades de uno o más proveedores de información
// las entidades debería traer:
// nivel de gobierno
// supplier_id

router.post('/entities', (req, res) => {

    const {nivel_gobierno} = req.body;

    let endpoints_ = [];

    if (typeof nivel_gobierno !== 'undefined') {
        endpoints_ = endpoints.filter(e => e.levels.includes(nivel_gobierno));
    } else {
      endpoints_ = endpoints;
    }

    let promises = endpoints_.map( endpoint => {
        //console.log(endpoint.type);
        if (endpoint.type === 'REST') {
            return fetchEntities(endpoint);

        } else if (endpoint.type === 'GRAPHQL'){
            return graphql_data.fetchEntities(endpoint)
        }

    });

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
            if(a.nombre < b.nombre) { return -1; }
            if(a.nombre > b.nombre) { return 1; }
            return 0;
        };

        res.json(entities.sort(cfn));
    }).catch(error => {
        console.log(error);
    });

});

router.get('/test', (req, res) => {
   graphql_data.fetchData(endpoints[1], {page: 1 , pageSize: 10, query: {}}).then(data => {
      console.log(data);
      res.json(data);
   });
});

module.exports = router;
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

router.post('/search', (req, res)=> {
    const {body} = req;

    //Evalua la consulta
    //Consulta fuentes

    console.log(endpoints);
    let queries = endpoints.map( endpoint => fetchData(endpoint,{}));

    Promise.all(queries).then( data => {
        console.log(data);
        res.json(data);
    }).catch(error => {
        console.log(error);
    });
});

// entidades de uno o más proveedores de información
router.post('/entities', (req, res) => {

    let promises = endpoints.map( endpoint => fetchEntities(endpoint) );

    Promise.all(promises).then( data => {
        //console.log(data);
        res.json(data)
    }).catch(error => {
        console.log(error);
    });

});

module.exports = router;
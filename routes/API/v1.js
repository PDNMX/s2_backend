var express = require('express');
var router = express.Router();

const rp = require('request-promise');
const endpoints = require('../../endpoints');

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
    fetchData(endpoints[0]);

    res.json({})
});

// entidades de uno o más proveedores de información
router.post('/entities', (req, res) => {

    let promises = endpoints.map( endpoint => fetchEntities(endpoint) );

    Promise.all(promises).then( data => {
        console.log(data);
        res.json(data)
    }).catch(error => {
        console.log(error);
    });

});


const fetchData = endpoint => {
    getToken(endpoint).then(token_data => {
        console.log(token_data.access_token);
    });
};

const fetchEntities = endpoint => {
    return getToken(endpoint).then(token_data => {
        const {access_token} = token_data;
        const opts = {
            uri: endpoint.entities_url,
            method: 'GET',
            qs: {
                access_token: access_token,
            },
            headers: {
                Authorization: 'Bearer ' + access_token
            },
            json: true
        };
        //console.log(opts);

        return rp(opts).then( entities => entities);
    });
};

const getToken = endpoint => {
    const opts = {
        uri: endpoint.token_url,
        method: 'POST',
        contentType: 'x-www-form-urlencoded',
        form: {
            grant_type: 'password',
            username: endpoint.username,
            password: endpoint.password,
            client_id: endpoint.client_id,
            client_secret: endpoint.client_secret
        },
        json: true
    };

    return rp(opts);
};

module.exports = router;
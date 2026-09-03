const axios = require('axios');
const qs = require('qs');

const fetchEntities = endpoint => {
    return getToken(endpoint).then(response => {

        if (typeof response.error !== 'undefined') {
            return { error: true };
        }

        const { data } = response;
        const { access_token } = data;

        const opts = {
            url: endpoint.entities_url,
            method: 'GET',
            timeout: process.env.TIMEOUT_DATA || 4000,
            /*params: {
                access_token: access_token,
            },*/
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            json: true
        };

        return axios(opts).then(response => {
            const entities = response.data;
            return entities.map(e => {
                e.supplier_id = endpoint.supplier_id;
                return e;
            });
        });
    });
};

const getToken = endpoint => {

    const authMethod = endpoint.token_auth_method || 'header';

    let headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    let data = {
        grant_type: 'password',
        username: endpoint.username,
        password: endpoint.password,
        scope: endpoint.scope
    };

    if (authMethod === 'header') {
        headers['Authorization'] = "Basic " + Buffer.from(`${endpoint.client_id}:${endpoint.client_secret}`).toString('base64');
    } else if (authMethod === 'body') {
        data.client_id = endpoint.client_id;
        data.client_secret = endpoint.client_secret;
    }

    const opts = {
        url: endpoint.token_url,
        method: 'post',
        timeout: process.env.TIMEOUT_TOKEN || 2000,
        headers: headers,
        data: qs.stringify(data),
        json: true
    };

    return axios(opts).catch(e => {
        console.error({
            url: e.config?.url,
            code: e.code,
            status: e.response?.status,
            data: e.response?.data,
            message: e.message
        });
        return { error: true };
    });
};

const fetchData = (endpoint, options) => {
    return getToken(endpoint).then(response => {

        if (typeof response.error !== 'undefined') {
            return {
                supplier_name: endpoint.supplier_name,
                supplier_id: endpoint.supplier_id,
                levels: endpoint.levels,
                error: true
            };
        }

        const { data } = response;
        const { access_token } = data;

        // Nuevo log para ver exactamente qué token estamos enviando (útil para debuggear errores de JWT)
        //console.log(`[DEBUG] Supplier: ${endpoint.supplier_id} | Token a enviar:`, access_token);

        let opts = {
            url: endpoint.url,
            method: 'post',
            timeout: process.env.TIMEOUT_DATA || 4000,
            /*params: {
                access_token: access_token
            },*/
            headers: {
                'Authorization': 'Bearer ' + access_token,
                'Content-Type': 'application/json'
            },
            data: options,
            json: true
        };

        //console.log(opts);

        return axios(opts).then(request => {
            let { data } = request;
            data.supplier_name = endpoint.supplier_name;
            data.supplier_id = endpoint.supplier_id;
            data.levels = endpoint.levels;
            data.endpoint_type = endpoint.type;
            return data;
        }).catch(e => {
            console.error({
                url: e.config?.url,
                code: e.code,
                status: e.response?.status,
                data: e.response?.data,
                message: e.message
            });
            return {
                supplier_name: endpoint.supplier_name,
                supplier_id: endpoint.supplier_id,
                levels: endpoint.levels,
                error: true
            };
        });
    });
};

module.exports = {
    fetchData,
    fetchEntities
};
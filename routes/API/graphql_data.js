const rp = require('request-promise');

/*
const prueba = () => {
    const query = `
            query{
                    dependencias(sort:{
                        field:nombre
                        direction:ASC
                    }){
                        results{
                        nombre
                        }
                    }
            }`;

    const endpoint = 'https://apiuif.funcionpublica.gob.mx:8443/reniresp/graphql';

    return rp({
        uri: endpoint,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: {  },
        }),
        //json: true
    }).then( data => {
        return new Promise ((resolve, reject) => {
            try {
                const d = JSON.parse(data);
                resolve(d.data.dependencias.results);
            }
            catch(e){
                reject(e);
            }
        });

    });
};*/

const fetchEntities = endpoint => {
    const query = `
    query{
                    dependencias(sort:{
                        field:nombre
                        direction:ASC
                    }){
                        results{
                        nombre
                        }
                    }
                    }
    `;

    const opts = {
        uri: endpoint.url,
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: {  },
        })
    };

    return rp(opts).then( data => {
        return new Promise ((resolve, reject) => {
            try {
                const d = JSON.parse(data);
                resolve(d.data.dependencias.results);
            }
            catch(e){
                reject(e);
            }
        });
    });
};

module.exports = {
    //prueba,
    fetchEntities
};
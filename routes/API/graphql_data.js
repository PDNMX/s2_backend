const rp = require('request-promise');

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

fetchData = (endpoint, options) => {

};

module.exports = {
    fetchEntities,
    fetchData
};
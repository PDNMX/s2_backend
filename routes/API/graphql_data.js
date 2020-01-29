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

const fetchData = (endpoint, options) => {

    const {pageSize, page, query} = options;

    const gql_query = `
    query test($filtros: Filtros, $first: Int, $start: Int, $sort: Sort) {
              servidor_publico(filtros: $filtros, first: $first, start: $start, sort: $sort){
                totalCount
                pageInfo {
                  hasNextPage
                }
                results {
                  id
                  fecha_captura
                  ejercicio_fiscal
                  periodo_ejercicio {
                    fecha_inicial
                    fecha_final
                  }
                  id_ramo
                  ramo
                  nombrecompleto
                  nombres
                  primer_apellido
                  segundo_apellido
                  genero
                  dependencia {
                    siglas
                    nombre
                    clave
                  }
                  puesto {
                    nombre
                    nivel
                  }
                  tipo_area
                  nivel_responsabilidad
                  tipo_procedimiento
                  tipo_actos
                  superior_inmediato {
                    nombres
                    primer_apellido
                    segundo_apellido
                    
                    puesto {
                      nombre
                      nivel
                    }
                  }
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
            query: gql_query,
            variables: {
                first: pageSize,
                start : (pageSize * page),
                filtros: query // checar
            },
        })
    };

    return rp(opts).then( data => {
        return new Promise ((resolve, reject) => {
            try {
                let d = JSON.parse(data);
                d.data.supplier_name = endpoint.supplier_name;
                d.data.supplier_id = endpoint.supplier_id;
                d.data.levels = endpoint.levels;
                d.data.endpoint_type = endpoint.type;
                d.data.pagination = {};
                d.data.pagination.totalRows = d.data.servidor_publico.totalCount;
                resolve(d.data);
            }
            catch(e){
                reject(e);
            }
        });
    });

};

module.exports = {
    fetchEntities,
    fetchData
};
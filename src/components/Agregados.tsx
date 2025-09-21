import { Fragment, useEffect, useState } from 'react'
import type { JSONType } from '../types/JSONType';

const fetchData = async () => {
  const res = await fetch('https://servicodados.ibge.gov.br/api/v3/agregados?periodo=P5[202001]');
  return res.json();
}

export function AgregadosTable() {
  const [data, setData] = useState<JSONType[]>([]);
  useEffect(() => {
    fetchData().then(data => setData(data));
  }, []);

  const [selectedItem, setSelectedItem] = useState<JSONType | null>(null);
  const handleRowClick = (item: JSONType) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="col-12 mb-4">
              <h4 className="text-title mb-3">
                <i className="fa-solid fa-folder-open me-2"></i>
                Catálogo de Agregados
              </h4>
              <table className='table table-hover shadow-sm table-striped'>
                <thead style={{ backgroundColor: '#2E598E', color: 'white' }}>
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Quantidade de Agregados</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <Fragment key={item.id}>
                      <tr onClick={() => handleRowClick(item)}
                        style={
                          {
                            cursor: 'pointer',
                            backgroundColor: selectedItem?.id === item.id ? '#2063a2ff' : 'transparent',
                            color: selectedItem?.id === item.id ? '#ffffff' : 'inherit'
                          }
                        }
                      >
                        <td>{item.id}</td>
                        <td>{item.nome}</td>
                        <td>{item.agregados.length}</td>
                      </tr>
                      {selectedItem?.id === item.id && (
                        <tr key={`${item.id}-detalhes`} >
                          <td colSpan={3}>
                            <div className='card card-body mb-3'>
                              <strong>Agregados {selectedItem.id} - {selectedItem.nome}:</strong>
                              <ul className='list-group mt-2'>
                                {selectedItem.agregados.map((agregado) => (
                                  <li key={`${selectedItem.id}-${agregado.id}`} className='list-group-item'>{agregado.id} - {agregado.nome}</li>
                                ))}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
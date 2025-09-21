import { useEffect, useState, useMemo, useCallback } from 'react'
import type { XMLType } from '../types/XMLType';
import type { Filters } from '../types/Filters';


const sidraURL = 'https://apisidra.ibge.gov.br/values/t/1419/n1/all/v/all/p/all/c315/7169,7170,7445,7486,7558,7625,7660,7712,7766,7786';

const fetchXMLData = async (url: string): Promise<XMLType[]> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao carregar dados');
    return res.json();
}

const getUniqueValues = (data: XMLType[], key: keyof XMLType): string[] => {
    return Array.from(new Set(data.map(item => item[key]))).filter(value => value !== 'Valor');
}

const groupPeriodsByYear = (periods: string[]): { [year: string]: string[] } => {
    const grouped: { [year: string]: string[] } = {};

    periods.forEach(period => {
        // Extrai o ano dos últimos 4 caracteres do período
        const year = period.substring(period.length - 4, period.length);

        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(period);
    });

    return grouped;
};

export function XMLTable() {
    const [filters, setFilters] = useState<Filters>({ p: [], v: [], group: [] });
    const [allValues, setAllValues] = useState<Filters>({ p: [], v: [], group: [] });
    const [data, setData] = useState<XMLType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const loadData = async () => {
            const rawData = await fetchXMLData(sidraURL);
            const filteredData = rawData.filter((item: XMLType) => item.V !== 'Valor');

            setData(filteredData);
            setAllValues({
                p: getUniqueValues(filteredData, 'D3N'),
                v: getUniqueValues(filteredData, 'D2N'),
                group: getUniqueValues(filteredData, 'D4N')
            });
        };

        loadData();
    }, []);

    const periodsByYear = useMemo(() => {
        return groupPeriodsByYear(allValues.p);
    }, [allValues.p]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            const isPeriodoFiltered = filters.p.length === 0 || filters.p.includes(item.D3N);
            const isVariavelFiltered = filters.v.length === 0 || filters.v.includes(item.D2N);
            const isGrupoFiltered = filters.group.length === 0 || filters.group.includes(item.D4N);
            return isPeriodoFiltered && isVariavelFiltered && isGrupoFiltered;
        });
    }, [data, filters]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = useMemo(() =>
        Math.ceil(filteredData.length / itemsPerPage),
        [filteredData.length, itemsPerPage]
    );

    const handleFilterChange = useCallback((filterType: keyof Filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({ p: [], v: [], group: [] });
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    const pageNumbers = useMemo(() => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="row mb-4">
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="col-12 mb-4">
                            <h4 className="text-title mb-3">
                                <i className="fa-solid fa-hand-holding-dollar me-2"></i>
                                Índice Nacional de Preços ao Consumidor Amplo - Índices de Preços
                            </h4>

                            {/*Filtros*/}
                            <div className="card border-1 shadow-sm p-0 mb-4">
                                <div className="card-header mb-3">
                                    <h4 className="card-title mt-2 mb-2">
                                        <i className="fa-solid fa-filter me-2"></i>
                                        Filtros
                                    </h4>
                                </div>
                                <div className="card-body py-0">
                                    
                                    {/*Período*/}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="fas fa-calendar-alt me-2"></i>
                                            <h5 className="text-muted mb-0">Meses</h5>
                                        </div>

                                        {Object.keys(periodsByYear).sort().map((year) => (
                                            <div key={`year_${year}`} className="card bg-transparent mb-4 px-0 py-0">
                                                <h6 className="card-header text-muted fw-bold mb-3">
                                                    <i className="fas fa-calendar me-2"></i>
                                                    {year}
                                                </h6>
                                                <div className="d-flex flex-wrap gap-2 ms-3">
                                                    {periodsByYear[year].map((periodo) => (
                                                        <div className="form-check" key={`periodo_${periodo}`}>
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`periodo_${periodo}`}
                                                                checked={filters.p.includes(periodo)}
                                                                onChange={() => handleFilterChange('p', periodo)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`periodo_${periodo}`}>
                                                                {periodo}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/*Variáveis */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="fas fa-chart-line me-2"></i>
                                            <h5 className="text-muted mb-0">Variável</h5>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            <ul className="list-group d-flex justify-items-start bg-light">
                                                {allValues.v.map((variavel) => (
                                                    <li className="list-group-item text-start" key={`variavel_${variavel}`}>
                                                        <input
                                                            className="form-check-input me-2"
                                                            type="checkbox"
                                                            id={`variavel_${variavel}`}
                                                            checked={filters.v.includes(variavel)}
                                                            onChange={() => handleFilterChange('v', variavel)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`variavel_${variavel}`}>
                                                            {variavel}
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/*Grupos */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <i className="fas fa-layer-group me-2"></i>
                                            <h5 className="text-muted mb-0">Grupo</h5>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            <ul className="list-group d-flex justify-items-start bg-light">
                                            {allValues.group.map((grupo) => (
                                                <li className="list-group-item text-start" key={`grupo_${grupo}`}>
                                                    <input
                                                        className="form-check-input me-2"
                                                        type="checkbox"
                                                        id={`grupo_${grupo}`}
                                                        checked={filters.group.includes(grupo)}
                                                        onChange={() => handleFilterChange('group', grupo)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`grupo_${grupo}`}>
                                                        {grupo}
                                                    </label>
                                                </li>
                                            ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mb-3">
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={handleClearFilters}
                                            disabled={filters.p.length === 0 && filters.v.length === 0 && filters.group.length === 0}
                                        >
                                            <i className="fa-solid fa-trash me-2"></i>
                                            Limpar Filtros
                                        </button>
                                    </div>
                                </div>
                            </div>


                            {data.length > 0 && (filters.p.length > 0 || filters.v.length > 0 || filters.group.length > 0) && (
                                <div className="alert alert-info" role="alert">
                                    <i className="fa-solid fa-info-circle me-2"></i>
                                    <strong>Filtros aplicados:</strong>
                                    {filters.p.length > 0 && <span className="badge bg-primary ms-2">Períodos: {filters.p.length}</span>}
                                    {filters.v.length > 0 && <span className="badge bg-success ms-2">Variáveis: {filters.v.length}</span>}
                                    {filters.group.length > 0 && <span className="badge bg-warning ms-2">Grupos: {filters.group.length}</span>}
                                </div>
                            )}

                            {data.length > 0 && filters.p.length === 0 && filters.v.length === 0 && filters.group.length === 0 && (
                                <div className="alert alert-info" role="alert">
                                    <i className="fa-solid fa-circle-question me-2"></i>
                                    Escolha os filtros para selecionar os dados.
                                </div>
                            )}

                            {/*Tabela*/}
                            <div className="row">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead style={{ backgroundColor: '#2E598E', color: 'white' }}>
                                            <tr>
                                                <th scope="col">Mês</th>
                                                <th scope="col">Variável</th>
                                                <th scope="col">Geral, grupo, subgrupo, item e subitem</th>
                                                <th scope="col">Valor (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((item) => (
                                                <tr key={`${item.D3C}-${item.D2C}-${item.D4C}`}>
                                                    <td>{item.D3N}</td>
                                                    <td>{item.D2N}</td>
                                                    <td>{item.D4N}</td>
                                                    <td className="text-end">{item.V}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                                    <div className="text-muted">
                                        Mostrando {filteredData.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1} a{' '}
                                        {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
                                    </div>
                                    {totalPages > 0 && (
                                        <div className="text-muted">
                                            Página {currentPage} de {totalPages}
                                        </div>
                                    )}
                                </div>

                                {totalPages > 1 && (
                                    <nav aria-label="Navegação da tabela">
                                        <ul className="pagination justify-content-center flex-wrap">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(1)}
                                                    disabled={currentPage === 1}
                                                    aria-label="Primeira página"
                                                >
                                                    &laquo;&laquo;
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    aria-label="Página anterior"
                                                >
                                                    &laquo;
                                                </button>
                                            </li>
                                            {pageNumbers.map((page) => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(page)}
                                                        aria-label={`Página ${page}`}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    aria-label="Próxima página"
                                                >
                                                    &raquo;
                                                </button>
                                            </li>
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => handlePageChange(totalPages)}
                                                    disabled={currentPage === totalPages}
                                                    aria-label="Última página"
                                                >
                                                    &raquo;&raquo;
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}

                                {filteredData.length === 0 && data.length > 0 && (
                                    <div className="alert alert-warning" role="alert">
                                        <i className="fa-solid fa-exclamation-triangle me-2"></i>
                                        Nenhum dado encontrado com os filtros aplicados.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
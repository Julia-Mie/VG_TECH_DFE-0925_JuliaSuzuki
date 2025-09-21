import spartaLogoTitle from '../assets/SPARTA-changed.svg';

export function Home() {
    return (
        <div>
            <h1 className="display-4 mb-12" style={{ fontWeight: 'bold', letterSpacing: '2px', marginBottom: '5rem', fontSize: '5rem' }}>This is <img src={spartaLogoTitle} alt="SPARTA" style={{ height: '1em', verticalAlign: 'middle' }} /></h1>
            <div className="row mb-4">
                <div className="card border-0 shadow-sm">
                    <h2 style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>Mural</h2>
                    <div className="card-body text-start">
                        <p className="lead text-muted mb-4">
                            Bem-vindo ao Teste Técnico de Front-end da Júlia para a Sparta!
                        </p>
                        <ul className="text-start mb-4" style={{ maxWidth: '600px'}}>
                            <li>Na aba <a href="/agregados">Agregados</a>, você pode visualizar o catálogo de agregados da API do IBGE.</li>
                            <li>Na aba <a href="/ipca">IPCA</a>, você pode filtrar os dados por período, variável e grupo. Ela corresponde à pesquisa "Índice Nacional de Preços ao Consumidor Amplo" (tabela 1419 da API Sidra).</li>
                        </ul>
                        <p className="text-muted">Este sistema foi desenvolvido com muito empenho como parte do processo seletivo da Sparta. Espero que goste!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
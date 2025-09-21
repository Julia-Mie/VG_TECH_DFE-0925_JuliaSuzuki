import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { XMLTable } from './components/IPCA';
import { AgregadosTable } from './components/Agregados';
import { Home } from './components/Home';
import './styles/App.css';
import spartaLogoWhite from './assets/sparta-white.svg';

function App() {

  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('home');

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);


  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  };

  const menuItems = [
    { id: 'home', icon: "fa-solid fa-house", label: 'Home' },
    { id: 'agregados', icon: "fa-solid fa-table-columns", label: 'Agregados' },
    { id: 'ipca', icon: "fa-solid fa-line-chart", label: 'IPCA' }
  ];

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      {sidebarExpanded !== true && (
        <div
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      <div
        className="text-white h-100 position-fixed position-md-sticky"
        style={{
          width: '60px',
          minWidth: '60px',
          top: 0,
          left: 0,
          zIndex: 1042,
          backgroundColor: '#3F4D67',
          borderRight: '1px solid #495057'
        }}
      >
        <div className="d-flex flex-column h-100">
          <div className="p-2 border-bottom border-secondary">
            <div className="d-flex justify-content-center">
              <img
                src={spartaLogoWhite}
                alt="Sparta Logo"
                style={{
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer'
                }}
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              />
            </div>
          </div>

          <nav className="flex-grow-1">
            <div className="d-flex flex-column">
              {menuItems.map((item) => (
                <div key={item.id} className="p-2">
                  <button
                    className={`btn w-100 d-flex justify-content-center align-items-center ${activeItem === item.id
                      ? 'btn-primary'
                      : 'text-white'
                      }`}
                    onClick={() => handleItemClick(item.id)}
                    style={{
                      height: '40px',
                      fontSize: '1.1em'
                    }}
                    title={item.label}
                  >
                    <i className={item.icon} />
                  </button>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {sidebarExpanded && (
        <div
          className="text-white h-100 position-fixed"
          style={{
            width: '250px',
            minWidth: '250px',
            top: 0,
            left: '60px',
            zIndex: 1041,
            backgroundColor: '#3F4D67',
            borderRight: '1px solid #495057'
          }}
        >
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 d-flex align-items-center text-white">
                <img
                  src={spartaLogoWhite}
                  alt="Sparta Logo"
                  style={{
                    width: '32px',
                    height: '32px',
                    marginRight: '8px'
                  }}
                />
                Sparta
              </h5>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setSidebarExpanded(false)}
                aria-label="Close sidebar"
                title="Fechar menu"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
          <nav>
            <ul className="nav flex-column p-0">
              {menuItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link text-start w-100 border-0 d-flex align-items-center justify-content-between px-3 py-2 ${activeItem === item.id
                      ? 'bg-primary text-white'
                      : 'text-white-50 hover-bg-secondary'
                      }`}
                    onClick={() => handleItemClick(item.id)}
                    style={{
                      transition: 'all 0.2s ease',
                      backgroundColor: activeItem === item.id ? 'var(--bs-primary)' : 'transparent'
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3" style={{ fontSize: '1.1em' }}>
                        <i className={item.icon} />
                      </span>
                      <span>{item.label}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <div
        className="flex-grow-1 d-flex flex-column"
        style={{
          marginLeft: sidebarExpanded ? '260px' : '60px', // 60px for collapsed + 250px for expanded = 310px total
          transition: 'all 0.3s ease'
        }}
      >
        <nav className="navbar navbar-light border-bottom px-3">
          <div className="d-flex align-items-center">
            <span className="navbar-brand mb-0 h1">
              {menuItems.find(item => item.id === activeItem)?.label || 'Home'}
            </span>
          </div>
        </nav>

        <main className="flex-grow-1 p-4" style={{ overflowY: 'visible' }}>
          <div className="container-fluid">

            {activeItem === 'home' && (<Home />)}

            {activeItem === 'agregados' && (<AgregadosTable />)}

            {activeItem === 'ipca' && (<XMLTable />)}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App

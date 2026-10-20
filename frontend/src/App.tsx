import { NavLink, Route, Routes } from 'react-router-dom';
import { AlunosPage } from './pages/AlunosPage';
import { EmpresasPage } from './pages/EmpresasPage';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">PUC Minas · Projeto de Software</p>
          <h1>Sistema de Moeda Estudantil</h1>
        </div>
        <nav>
          <NavLink to="/" end>
            Alunos
          </NavLink>
          <NavLink to="/empresas">Empresas Parceiras</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<AlunosPage />} />
          <Route path="/empresas" element={<EmpresasPage />} />
        </Routes>
      </main>
    </div>
  );
}

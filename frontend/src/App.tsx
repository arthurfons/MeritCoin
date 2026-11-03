import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CompaniesPage } from './pages/CompaniesPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MissionsPage } from './pages/MissionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterCompanyPage } from './pages/RegisterCompanyPage';
import { RegisterStudentPage } from './pages/RegisterStudentPage';
import { RewardsPage } from './pages/RewardsPage';
import { StudentsPage } from './pages/StudentsPage';
import { WalletPage } from './pages/WalletPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro/empresa" element={<RegisterCompanyPage />} />
      <Route path="/cadastro/aluno" element={<RegisterStudentPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="alunos" element={<StudentsPage />} />
          <Route path="missoes" element={<MissionsPage />} />
          <Route path="carteira" element={<WalletPage />} />
          <Route path="vantagens" element={<RewardsPage />} />
          <Route path="empresas" element={<CompaniesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

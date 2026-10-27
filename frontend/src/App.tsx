import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CompaniesPage } from './pages/CompaniesPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { RegisterCompanyPage } from './pages/RegisterCompanyPage';
import { RegisterStudentPage } from './pages/RegisterStudentPage';
import { StudentsPage } from './pages/StudentsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro/aluno" element={<RegisterStudentPage />} />
      <Route path="/cadastro/empresa" element={<RegisterCompanyPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="alunos" element={<StudentsPage />} />
          <Route path="empresas" element={<CompaniesPage />} />
          <Route path="perfil" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

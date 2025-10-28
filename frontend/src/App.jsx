import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/Home/HomePage';
import LoansPage from './pages/Loans/LoansPage';
import LoanApplicationPage from './pages/Loans/LoanApplicationPage';
import LoanStatusPage from './pages/Loans/LoanStatusPage';
import LoanDetailPage from './pages/Loans/LoanDetailPage';
import InternshipLoginPage from './pages/Internships/InternshipLoginPage';
import InternshipsPage from './pages/Internships/InternshipsPage';
import InternshipDetailPage from './pages/Internships/InternshipDetailPage';
import InternshipApplicationPage from './pages/Internships/InternshipApplicationPage';
import SavedInternshipsPage from './pages/Internships/SavedInternshipsPage';
import AppliedInternshipsPage from './pages/Internships/AppliedInternshipsPage';
import InternshipProfilePage from './pages/Internships/InternshipProfilePage';
import CourseDetailPage from './pages/Internships/CourseDetailPage';
import TrainingPage from './pages/Training/TrainingPage';
import ModuleDetailPage from './pages/Training/ModuleDetailPage';
import TopicDetailPage from './pages/Training/TopicDetailPage';
import LegalPage from './pages/Legal/LegalPage';
import LegalServiceDetailPage from './pages/Legal/LegalServiceDetailPage';
import LegalDocumentUploadPage from './pages/Legal/LegalDocumentUploadPage';
import LegalConsultPage from './pages/Legal/LegalConsultPage';
import LegalDocumentsPage from './pages/Legal/LegalDocumentsPage';
import LegalPaymentPage from './pages/Legal/LegalPaymentPage';
import MentorCategoryPage from './pages/Mentors/MentorCategoryPage';
import MentorListingPage from './pages/Mentors/MentorListingPage';
import MentorDetailPage from './pages/Mentors/MentorDetailPage';
import MentorBookingPage from './pages/Mentors/MentorBookingPage';
import MentorDashboard from './pages/Mentors/MentorDashboard';
import BecomeMentorPage from './pages/Mentors/BecomeMentorPage';
import MentorProfilePage from './pages/Mentors/MentorProfilePage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import TermsPage from './pages/Legal/TermsPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLoansPage from './pages/Admin/AdminLoansPage';
import AdminLegalPage from './pages/Admin/AdminLegalPage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminTrainingPage from './pages/Admin/AdminTrainingPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CompanyInternshipsPage from './pages/Company/CompanyInternshipsPage';
import CompanyLoginPage from './pages/Company/CompanyLoginPage';
import AppDevelopmentPage from './pages/AppDevelopment/AppDevelopmentPage';
import MobileFirstLoginPage from './pages/MobileFirstLoginPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
          <Routes>
            <Route path="/internships/login" element={<InternshipLoginPage />} />
            <Route path="/company/internships" element={<CompanyInternshipsPage />} />
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/loans" element={<LoansPage />} />
                  <Route path="/loans/apply" element={<LoanApplicationPage />} />
                  <Route path="/loans/status" element={<LoanStatusPage />} />
                  <Route path="/loans/:schemeId" element={<LoanDetailPage />} />
                  <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/internships/saved" element={<SavedInternshipsPage />} />
          <Route path="/internships/applied" element={<AppliedInternshipsPage />} />
          <Route path="/internships/profile" element={<InternshipProfilePage />} />
          <Route path="/internships/course/:courseId" element={<CourseDetailPage />} />
          <Route path="/internships/:internshipId" element={<InternshipDetailPage />} />
          <Route path="/internships/:internshipId/apply" element={<InternshipApplicationPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/training/module/:moduleId" element={<ModuleDetailPage />} />
          <Route path="/training/module/:moduleId/topic/:topicId" element={<TopicDetailPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/legal/consult" element={<LegalConsultPage />} />
          <Route path="/legal/documents" element={<LegalDocumentsPage />} />
          <Route path="/legal/service/:serviceId" element={<LegalServiceDetailPage />} />
          <Route path="/legal/service/:serviceId/upload" element={<LegalDocumentUploadPage />} />
          <Route path="/legal/service/:serviceId/payment" element={<LegalPaymentPage />} />
          <Route path="/mentors" element={<MentorCategoryPage />} />
          <Route path="/mentors/category/:categoryId" element={<MentorListingPage />} />
          <Route path="/mentors/:mentorId" element={<MentorDetailPage />} />
          <Route path="/mentors/:mentorId/book/:slotId" element={<MentorBookingPage />} />
          <Route path="/mentors/dashboard" element={<MentorDashboard />} />
          <Route path="/mentors/become-mentor" element={<BecomeMentorPage />} />
          <Route path="/mentors/profile" element={<MentorProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/mobile-login" element={<MobileFirstLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="loans" element={<AdminLoansPage />} />
            <Route path="legal" element={<AdminLegalPage />} />
            <Route path="training" element={<AdminTrainingPage />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/company/login" element={<CompanyLoginPage />} />
          <Route path="/app-development" element={<AppDevelopmentPage />} />
          </Routes>
        </>
      } />
      </Routes>
    </div>
    </Router>
  </UserProvider>
  );
}

export default App;

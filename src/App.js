// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Admin from './components/Admin';
import AdminSubjects from './components/AdminSubjects';
import AdminSubjectDetail from './components/AdminSubjectDetail';
import AdminProjectDetail from './components/AdminProjectDetail';

function ProjectRouteWrapper() {
  const { projectName } = useParams();
  return <AdminProjectDetail projectName={projectName} />;
}

function SubjectRouteWrapper() {
  const { subjectName } = useParams();
  return <AdminSubjectDetail subjectName={subjectName} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/subjects" element={<AdminSubjects />} />
        <Route path="/admin/subject/:subjectName" element={<SubjectRouteWrapper />} />
        <Route path="/admin/:projectName" element={<ProjectRouteWrapper />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
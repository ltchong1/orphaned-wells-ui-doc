import React from 'react';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import ProjectsListPage from './views/ProjectsListPage/ProjectsListPage';
import Header from './components/Header/Header'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes> 
      <Route 
          path="/projects" 
          element={<ProjectsListPage/>} 
        />
        <Route
          path="*" 
          element={<Navigate replace to="/projects" />}
        />
      </Routes> 
    </div>
  );
}

export default App;

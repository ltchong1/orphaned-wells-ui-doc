import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import ProjectsListPage from './views/ProjectsListPage/ProjectsListPage';
import Project from './views/ProjectPage/ProjectPage';
import Record from './views/RecordPage/RecordPage';
import Header from './components/Header/Header'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes> 
      <Route 
            path="record/:id" 
            element={<Record />}
        />
        <Route 
            path="project/:id" 
            element={<Project />}
        />
        <Route 
            path="projects" 
            element={<ProjectsListPage/>} 
        />
        <Route
            path="*" 
            element={<Navigate replace to="projects" />}
        />
      </Routes> 
    </div>
  );
}

export default App;

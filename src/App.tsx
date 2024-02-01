import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import ProjectsListPage from './views/ProjectsListPage/ProjectsListPage';
import Project from './views/ProjectPage/ProjectPage';
import Record from './views/RecordPage/RecordPage';
import Header from './components/Header/Header'; 
import './App.css';

function App() {
  const [ authenticated, setAuthenticated ] = React.useState(false)

  const handleSuccessfulAuthentication = () => {
    setAuthenticated(true)
  }

  return (
    <div className="App">
      {authenticated ? 
        <>
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
        </>
        :
        <LoginPage handleSuccessfulAuthentication={handleSuccessfulAuthentication}/>
      }
      
    </div>
  );
}

export default App;

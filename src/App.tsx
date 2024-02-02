import React from 'react';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from './views/LoginPage/LoginPage';
import ProjectsListPage from './views/ProjectsListPage/ProjectsListPage';
import Project from './views/ProjectPage/ProjectPage';
import Record from './views/RecordPage/RecordPage';
import Header from './components/Header/Header'; 
import './App.css';

function App() {
  const [ authenticated, setAuthenticated ] = React.useState(false)
  const [ userCredentials, setUserCredentials ] = React.useState({})
  let navigate = useNavigate()

  React.useEffect(() => {
    // let access_token = localStorage.getItem("access_token")
    // let refresh_token = localStorage.getItem("refresh_token")
    // localStorage.removeItem("id_token")
    let id_token = localStorage.getItem("id_token")
    if (id_token !== null) {
      setUserCredentials({id_token: id_token})
      setAuthenticated(true)
    } else {
      navigate("/login")
    }
  }, [])

  const handleSuccessfulAuthentication = (access_token: string, refresh_token: string, id_token: string) => {
    // gotta store credentials so they stay logged in
    // localStorage.setItem("access_token", access_token)
    // localStorage.setItem("refresh_token", refresh_token)
    localStorage.setItem("id_token", id_token)
    setUserCredentials({
      // access_token: access_token, 
      // refresh_token: refresh_token, 
      id_token: id_token
    })
    setAuthenticated(true)
  }

  return (
    <div className="App">
          <Header authenticated={authenticated}/>
          <Routes> 
          <Route
              path="login"
              element={<LoginPage handleSuccessfulAuthentication={handleSuccessfulAuthentication} authenticated={authenticated}/>}
          />
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

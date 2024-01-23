import React from 'react';
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Home from './views/Home/Home';
import Header from './components/Header/Header'; 
import './App.css';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes> 
      <Route 
          path="/" 
          element={<Home/>} 
        />
        <Route
          path="*" 
          element={<Navigate replace to="/" />}
        />
      </Routes> 
    </div>
  );
}

export default App;

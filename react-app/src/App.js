import React from 'react';
import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import ThemSinhVien from './pages/ThemSinhVien';
function App() {
  return (
    <>
      <Router>
          <Switch>
              <Route path='/' component={ThemSinhVien}/>
          </Switch>
      </Router>
    </>
  );
}

export default App;

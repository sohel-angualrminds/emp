import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Add from "./Components/Add";
import Employees from "./Components/Employees";
import Navbar from "./Components/Navbar";
import { State, City } from 'country-state-city';
import { putDataToLocalStorage } from './Service/Service'
import Update from "./Components/Update";


function App() {

  useEffect(() => {
    async function put() {
      await putDataToLocalStorage("locationData", { states: State.getAllStates().filter(({ countryCode }) => countryCode === 'IN'), cities: City.getAllCities().filter(({ countryCode }) => countryCode === 'IN') })
    }
    put();
  }, [])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="*" element={<Navigate to="/employees" />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/add" element={<Add />} />
        <Route path="/employees/Update/:id" element={<Update />} />
      </Routes>
    </Router>
  );
}

export default App;

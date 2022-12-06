import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/home";
import Preprocessing from "./pages/preprocessing";
import Elimination from "./pages/elimination";
import Cluster from "./pages/cluster";
import { Routes, Route, Link } from "react-router-dom";
import Keyword from "./pages/keyword";
import Result from "./pages/result";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/clus-vis/" element={<Home />} />
        <Route
          exact
          path="/clus-vis/preprocessing"
          element={<Preprocessing />}
        />
        <Route exact path="/clus-vis/cluster" element={<Cluster />} />
        <Route
          exact
          path="clus-vis/preprocessing/elimination"
          element={<Elimination />}
        />
        <Route
          exact
          path="/clus-vis/preprocessing/keyword"
          element={<Keyword />}
        />
        <Route exact path="/clus-vis/cluster/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default App;

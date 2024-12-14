import * as React from "react";
import "./App.css";

import { Layout } from "./components/Layout";

import { Initial } from "./pages/Initial";
import { Guide } from "./pages/TaxGuide";
import { Alerts } from "./pages/TaxAlerts";
import { Country } from "./pages/Country";
import { Route, Routes } from "react-router-dom";

import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Initial />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/country/:countryCode" element={<Country />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  );
}

export default App;

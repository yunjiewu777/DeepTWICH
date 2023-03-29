import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Elimination from "./elimination";

function Preprocessing() {
  // const [data, setData] = useState([{}]);

  // useEffect(() => {
  //   fetch("/members")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data);
  //       console.log(data);
  //     });
  // }, []);

  return (
    <div>
      <NavBar></NavBar>

      <Elimination />
    </div>
  );
}

export default Preprocessing;

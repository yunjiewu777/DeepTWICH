import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Scatter from "../components/clus/scatter";
import Mainplot from "../components/clus/mainplot";
import Highlighter from "react-highlight-words";
import APIService from "../components/APIService";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Card from "react-bootstrap/Card";
import { select } from "d3";
import SelectInput from "@mui/material/Select/SelectInput";
import Context from "../components/clus/context";
import { TiDeleteOutline } from "react-icons/ti";

function Cluster() {
  const [keywords, setKeywords] = useState([]);
  const [contextword, setContextword] = useState(null);
  const [context, setContext] = useState([]);
  const [clus, setClus] = useState([]);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [constrains, setConstraints] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/cluster/get_keywords", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        setKeywords(resp["keyword"]);
        setClus(resp["clus"]);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/cluster/get_constraints", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        console.log(resp);
        setConstraints(resp);
      })
      .catch((error) => console.log(error));
  }, []);

  const setNewKeyword = (word) => {
    setContextword(word);

    fetch(`http://127.0.0.1:5000/cluster/get_context/${word}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        // console.log(resp);
        setContext(resp);
      })
      .catch((error) => console.log(error));

    console.log(contextword);
    console.log(context);
  };

  const recluster = () => {
    console.log("recluster");
    APIService.ReCluster()
      .then((resp) => {
        console.log(resp);
        setKeywords(resp["keyword"]);
        setClus(resp["clus"]);
      })
      .then((error) => console.log(error));
  };

  function clearSelectedPoints() {
    setSelectedPoints([]);
    console.log(selectedPoints);
  }

  function addConstraint() {
    APIService.AddConstraint({
      anchor: selectedPoints[0],
      positive: selectedPoints[1],
      negative: selectedPoints[2],
    })
      // .then((resp) => insertedReg(resp))
      .then((resp) => {
        console.log(resp);
        setConstraints([...constrains, resp]);
      })
      .then((error) => console.log(error));

    setSelectedPoints([]);
  }

  function resetConstraints() {
    APIService.ResetConstraints().then((error) => console.log(error));

    setConstraints([]);
  }

  return (
    <div>
      <NavBar></NavBar>

      {/* <Nav justify variant="tabs" defaultActiveKey="/">
        <Nav.Item>
          <LinkContainer to="/clus-vis/cluster">
            <Nav.Link>Cluster Refine</Nav.Link>
          </LinkContainer>
        </Nav.Item>
        <Nav.Item>
          <LinkContainer to="/clus-vis/cluster/result">
            <Nav.Link>Whole View</Nav.Link>
          </LinkContainer>
        </Nav.Item>
      </Nav> */}

      <Container style={{ height: "650px" }}>
        <Row>
          <div
            className="col-2 border border-primary container"
            style={{ overflowY: "scroll", height: "650px" }}
          >
            {/* <div class="border border-primary"> */}
            {clus.map((c) => (
              <Accordion key={c["cluster"]}>
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <b>Cluster {c["cluster"]}</b>
                    <p>({c["number"]} Keywords)</p>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography style={{ textAlign: "left" }}>
                    {c["keyword"].map((word) => (
                      <li key={word}>
                        {word} <TiDeleteOutline />
                      </li>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            {/* </div> */}
            {/* <Form.Select aria-label="Default select example">
              <option>Select Clustering Methods</option>
              <option value="1">KMeans</option>
              <option value="2">Affinity Propogation</option>
            </Form.Select> */}
          </div>
          <div
            className="col-6 border border-primary"
            style={{ height: "650px" }}
          >
            <Container>
              <div
                className="row"
                style={{
                  marginTop: "10px",
                }}
              >
                <div className="col-8">
                  <div className="form-group row">
                    <label htmlFor="title" className="col-sm-6 col-form-label">
                      Keyword
                    </label>
                    <div className="col-sm-6">
                      <input></input>
                    </div>
                  </div>
                </div>

                <div className="col">
                  <button className="btn btn-primary col-form-button">
                    Search
                  </button>
                </div>
              </div>
              <Mainplot
                setNewKeyword={setNewKeyword}
                keywords={keywords}
                selectedPoints={selectedPoints}
                setSelectedPoints={setSelectedPoints}
              />

              <Button variant="primary" size="sm" onClick={recluster}>
                Re-Cluster
              </Button>
              <br></br>
            </Container>
          </div>
          <div
            className="col-4 border border-primary container"
            style={{ padding: "0px" }}
          >
            <Context contextword={contextword} context={context} />

            <div className="border border-primary">
              <h4>Keyword Constraints</h4>

              {selectedPoints.length === 3 ? (
                <Button variant="primary" size="sm" onClick={addConstraint}>
                  Add
                </Button>
              ) : (
                <Button variant="primary" size="sm" disabled>
                  Add
                </Button>
              )}

              <span> </span>
              <Button variant="primary" size="sm" onClick={clearSelectedPoints}>
                Clear
              </Button>
              <span> </span>
              <Button variant="primary" size="sm" onClick={resetConstraints}>
                Reset All
              </Button>

              <Row>
                <div className="col-3">Anchor</div>
                <div className="col-3">Positive</div>
                <div className="col-3">Negative</div>
              </Row>
              <div
                style={{
                  overflowY: "scroll",
                  height: "150px",
                }}
              >
                {constrains
                  ? constrains.map((con) => (
                      <Row key={con["id"]} style={{ overflow: "visible" }}>
                        <div className="col-3">{con["anchor"]["word"]}</div>
                        <div className="col-3">{con["positive"]["word"]}</div>
                        <div className="col-3">{con["negative"]["word"]}</div>
                        <div className="col-1">
                          <TiDeleteOutline />
                        </div>
                      </Row>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default Cluster;

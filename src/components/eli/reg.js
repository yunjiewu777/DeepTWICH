import React from "react";
import APIService from "../APIService";
import Row from "react-bootstrap/Row";
// import { useState, useEffect } from "react";

function Reg(props) {
  const editReg = (reg) => {
    props.editReg(reg);
  };

  const deleteReg = (reg) => {
    APIService.DeleteReg(reg.id).then(() => props.deleteReg(reg));
  };

  const handleChange = (reg) => {
    console.log("The checkbox was toggled");

    if ("checked" in reg) {
      reg.checked = !reg.checked;
    } else {
      reg.checked = true;
    }
    console.log(reg.checked);
    props.updatedReg(reg);
  };

  return (
    <div
      className="container"
      style={{
        marginTop: "10px",
        overflowY: "scroll",
        height: "400px",
        overflowX: "auto",
      }}
    >
      {props.regs &&
        props.regs.map((reg, index) => {
          const color = props.palette[index];
          console.log(color);
          return (
            <div key={reg.id}>
              <div className="row">
                <div className="col">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={reg.id}
                      id={reg.id}
                      onChange={() => handleChange(reg)}
                      defaultChecked={reg.checked}
                    ></input>
                    <label class="form-check-label" for={reg.id}>
                      <mark
                        style={{
                          backgroundColor: `rgba(${color._rgb[0]}, ${color._rgb[1]}, ${color._rgb[2]}, 0.3)`,
                        }}
                        title={reg.reg}
                      >
                        {reg.name}
                      </mark>
                    </label>
                  </div>
                </div>
                <div className="col">
                  <button
                    onClick={() => editReg(reg)}
                    className="btn btn-primary"
                    size="sm"
                  >
                    Edit
                  </button>{" "}
                </div>
                <div className="col">
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteReg(reg)}
                    size="sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* <h2>{reg.id}</h2>
              <p>{reg.reg}</p>

              <div className="row">
                <div className="col">
                  <button
                    className="btn btn-primary"
                    onClick={() => editReg(reg)}
                  >
                    Update
                  </button>
                </div>
                <div className="col">
                  <button className="btn btn-danger">Delete</button>
                </div>
              </div> */}
              <hr />
            </div>
          );
        })}

      {/* <Form>
        {["Emoji", "URL", "Hash Tags", "@"].map((expression) => (
          <div key={`default-${"checkbox"}`} className="mb-3">
            <Row>
              <Col xs={8}>
                <Form.Check
                  type={"checkbox"}
                  id={`${expression}`}
                  label={`${expression}`}
                />
              </Col>
              <Col>
                <Button variant="primary" size="sm">
                  Edit
                </Button>{" "}
              </Col>
            </Row>
          </div>
        ))}
      </Form> */}

      <Row>
        <div className="col-1" />
        <button className="col-2 btn btn-success" onClick={props.openForm}>
          Add
        </button>
      </Row>
    </div>
  );
}

export default Reg;

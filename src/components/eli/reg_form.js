import React, { useState, useEffect } from "react";
import APIService from "../APIService";
import Row from "react-bootstrap/Row";

function RegForm(props) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [reg, setReg] = useState("");

  useEffect(() => {
    setId(props.Reg.id);
    setName(props.Reg.name);
    setReg(props.Reg.reg);
  }, [props.Reg]);

  const updateReg = () => {
    if (name.trim().length !== 0 && reg.trim().length !== 0) {
      APIService.UpdateReg(props.Reg.id, { id, name, reg })
        .then((resp) => {})
        .then((error) => console.log(error));
    }

    if ("checked" in props.Reg) {
      props.updatedReg({
        id: id,
        name: name,
        reg: reg,
        checked: props.Reg.checked,
      });
    } else {
      props.updatedReg({ id: id, name: name, reg: reg });
    }

    setId("");
    setName("");
    setReg("");
  };

  const insertReg = () => {
    if (name.trim().length !== 0 && reg.trim().length !== 0) {
      APIService.InsertReg({ name, reg })
        .then((resp) => props.insertedReg(resp))
        .then((error) => console.log(error));
    }
    setId("");
    setName("");
    setReg("");
  };

  return (
    <div>
      {props.Reg ? (
        <div className="mb-3">
          <div className="form-group row">
            <label htmlFor="title" className="col-sm-4 col-form-label">
              Expresion Name
            </label>
            <div className="col-sm-8">
              <input
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="form-control"
                value={name}
                required
              ></input>
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="body" className="col-sm-4 col-form-label">
              Regular Expression
            </label>
            <div className="col-sm-8">
              <textarea
                onChange={(e) => setReg(e.target.value)}
                value={reg}
                rows="5"
                className="form-control"
                required
              ></textarea>
            </div>
          </div>

          <Row>
            <div className="col-1" />
            {props.Reg.id ? (
              <button onClick={updateReg} className="col-2 btn btn-success">
                Update
              </button>
            ) : (
              <button onClick={insertReg} className="col-2 btn btn-success">
                Add
              </button>
            )}
          </Row>
        </div>
      ) : null}
    </div>
  );
}

export default RegForm;

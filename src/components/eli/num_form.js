import APIService from "../APIService";
import { useState } from "react";

function NumForm(props) {
  const [num, setNum] = useState(null);

  const getTweets = () => {
    if (num == null || num.trim().length === 0) {
      APIService.GetTweets(10)
        .then((resp) => props.getTweets(resp))
        .then((error) => console.log(error));
    } else {
      APIService.GetTweets(num)
        .then((resp) => props.getTweets(resp))
        .then((error) => console.log(error));
    }
  };

  return (
    <div
      className="row"
      style={{
        marginTop: "10px",
      }}
    >
      <div className="col-8">
        <div className="form-group row">
          <label htmlFor="title" className="col-sm-6 col-form-label">
            Number of tweets per time
          </label>
          <div className="col-sm-6">
            <input
              onChange={(e) => setNum(e.target.value)}
              type="number"
              className="form-control"
              placeholder="10"
              min="1"
            ></input>
          </div>
        </div>
      </div>

      <div className="col">
        <button className="btn btn-primary col-form-button" onClick={getTweets}>
          Search
        </button>
      </div>
    </div>
  );
}

export default NumForm;

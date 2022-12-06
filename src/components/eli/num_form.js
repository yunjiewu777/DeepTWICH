import APIService from "../APIService";
import { useState } from "react";

function NumForm(props) {
  const [num, setNum] = useState(null);

  const getTweets = () => {
    console.log("retriving tweets");
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
          <div class="col-sm-6">
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

      {/* <div className="col">
          <button className="btn btn-primary">Shuffle</button>
        </div> */}
    </div>
  );
}

{
  /* <label for="inputPassword" className="col-sm-6 col-form-label">
          Number of tweets per time
        </label>
        <input
          // onChange={(e) => handle(e)}
          id="inputTweetsNum"
          // value={data.tweets}
          type="text"
          className="btn col-sm-2 col-form-control"
          placeholder="Number of Tweets to show"
        /> */
}

// const NumForm = (props) => {
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");

//   const insertArticle = () => {
//     APIService.InsertArticle({ title, body })
//       .then((response) => props.insertedArticle(response))
//       .catch((error) => console.log("error", error));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     insertArticle();
//     setTitle("");
//     setBody("");
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="title" className="form-label">
//           Title
//         </label>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Enter title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />

//         <label htmlFor="body" className="form-label">
//           Body
//         </label>
//         <textarea
//           className="form-control"
//           placeholder="Enter body"
//           rows="6"
//           value={body}
//           onChange={(e) => setBody(e.target.value)}
//           required
//         ></textarea>

//         <button className="btn btn-primary mt-2">Publish article</button>
//       </form>
//     </div>
//   );
// };

export default NumForm;

import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to Home!</h1>
      <p>This the visualization project by Ruby Wu & Alexandra Li</p>
      <button>
        <LinkContainer to="preprocessing">
          <Link>Home</Link>
        </LinkContainer>
      </button>
    </div>
  );
}

export default Home;

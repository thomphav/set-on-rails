import React from "react";
import { CsrfInput } from "../components/shared/csrf_input";

const Home = () => {

  return (
    <>
      <form action="/games" method="post">
        <h1>Let's play set!</h1>
        <CsrfInput />
        <button type="submit">Play</button>
      </form>
    </>
  );
};

export default Home;
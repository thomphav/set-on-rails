import React from "react";
import { CsrfInput } from "../components/shared/csrf_input";

const Home = () => {

  return (
    <>
      <form className="flex flex-col justify-center w-full border border-green" action="/games" method="post">
        <h1>Let's play set!</h1>
        <CsrfInput />
        <button className="border w-auto" type="submit">Play</button>
      </form>
    </>
  );
};

export default Home;
import React from "react";
import { CsrfInput } from "../components/shared/csrf_input";

const Home = ({ dashboardLink }: { dashboardLink: string }) => (
  <div className="flex w-full h-screen items-center">
    <form className="flex flex-col justify-center items-center mx-auto space-y-16" action="/games" method="post">
      <h1 className="text-6xl">Let's play set!</h1>
      <CsrfInput />
      <button className="border border-gray-800 py-4 px-36 w-fit text-4xl rounded-md hover:bg-gray-50" type="submit">Play</button>
      <a href={dashboardLink} className="py-4 px-20 w-fit text-3xl hover:text-blue-600 hover:cursor-pointer">Go to Dashboard</a>
    </form>
  </div>
);

export default Home;
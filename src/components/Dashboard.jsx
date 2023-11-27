import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import Table from "./Table";
import Forecasting from "./Forecasting";
import { useSessionContext } from "../hooks/useSession";

export default function Dashboard({ children, title, user }) {
  const {session}= useSessionContext();
  const [section, setSection] = useState("Dashboard");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className="bg-slate-900 w-full text-white">
        <div className="flex justify-between px-5">
          {/* left section*/}
          <div className="inline-flex items center space-x-4">
            <h3 className="text-2x1 font-bold py-4">
              Telemática Weather station
            </h3>
            <p
              className="cursor-pointer py-4"
              onClick={() => setSection("Dashboard")}
            >
              Dashboard
            </p>

            <p
              className="cursor-pointer py-4"
              onClick={() => setSection("Forecasting")}
            >
              Forecasting
            </p>
          </div>
          {/* Right section */}
          <div className="py-2">
            <p className="inline-flex p-4 rounded-full bg-slate-100 font-bold text-black">
              Correo: {session.user.email}
            </p>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center px-4 py-2 mt-4 bg-blue-800 text-white font-bold rounded-lg"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
      {/* Title */}
      <div className="w-full">
        <div className="px-5 py-4 border-b border-black">
          <h1 className="text-4xl font-bold">{section}</h1>
        </div>
      </div>

      <div className="px-5 py-8">
        {children}
        {section === "Dashboard" && <Table />}
        {section === "Forecasting" && <Forecasting />}
      </div>
    </>
  );

  
}

import React from "react";

const Loader = ({ label = "Loading" }) => (
  <div className="loader-wrap">
    <div className="loader-ring" aria-hidden="true" />
    <p>{label}…</p>
  </div>
);

export default Loader;

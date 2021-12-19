import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

export const InspectorControls = ({ tokenId: defaultTokenId, view }) => {
  const [tokenId, setTokenId] = useState(defaultTokenId >= 0 ? defaultTokenId : "");
  const isClamView = view === "clam";

  const history = useHistory();

  const handleChange = (e) => {
    if (e.target.value < 0) {
      return;
    }
    setTokenId(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      history.push(`/saferoom/${view}/inspect/${tokenId}`);
    }
  };

  return (
    <div className="flex justify-center align-middle mb-4">
      <span className="mr-2">{`Enter ${isClamView ? "Clam" : "Pearl"} ID: #`}</span>
      <input
        type="number"
        placeholder="ID"
        className="input input-bordered input-sm mr-2"
        value={tokenId}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <Link
        className="btn btn-primary btn-sm"
        role="button"
        aria-pressed="true"
        to={`/saferoom/${view}/inspect/${tokenId}`}
      >
        Inspect
      </Link>
    </div>
  );
};

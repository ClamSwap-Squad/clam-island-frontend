import React, { useState } from "react";
import Accordion from "../../components/Accordion";
import { get } from "lodash";

import { Pearl3DView } from "../../components/pearl3DView";

export default ({ dna, dnaDecoded }) => {
  const [showTraits, setShowTraits] = useState(false);

  console.log({ dna, dnaDecoded });

  const RowStat = ({ label, value }) => (
    <div className="text-sm flex flex-row justify-between my-1">
      <div className="block">
        <p className="text-gray-500 font-semibold">{label}</p>
      </div>

      <div className="block">
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );

  const accordionData = [
    {
      title: "Traits",
      description: (
        <div>
          <RowStat label="Shape" value={get(dnaDecoded, "shape")} />
          <RowStat label="Color" value={get(dnaDecoded, "color")} />
          <RowStat label="Overtone" value={get(dnaDecoded, "overtone")} />
          <RowStat label="Rarity" value={get(dnaDecoded, "rarity").toLowerCase()} />
        </div>
      ),
    },
  ];
  return (
    <>
      <div className="flex flex-col justify-between">
        <div className="flex justify-between flex-col sm:flex-row">
          {/** 3D Pearl with react three fiber */}
          <Pearl3DView
            width={400}
            height={400}
            pearlDna={dna}
            decodedDna={dnaDecoded}
            showTraitsTable={showTraits}
          />
          {/*<Pearl3DView />*/}
          <div className="w-full md:w-1/2 px-4 md:px-6">
            <Accordion data={accordionData} />
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 space-x-14 border-t">
          <button
            disabled
            className="disabled:opacity-50 cursor-not-allowed px-4 p-3 rounded-xl shadown-xl bg-blue-500 text-white hover:bg-blue-300 font-semibold"
          >
            Stake
          </button>
          <button
            disabled
            className="disabled:opacity-50 cursor-not-allowed px-4 p-3 shadown-xl   text-red-700 font-semibold border-2 border-red-500 rounded-xl hover:text-white hover:bg-red-500 bg-transparent"
          >
            Sell
          </button>
        </div>
      </div>
    </>
  );
};
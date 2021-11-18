import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { get } from "lodash";

import { getClamIncubationTime } from "web3/clam";
import { getCurrentBlockTimestamp } from "web3/index";

import { Clam3DView } from "components/clam3DView";
import Accordion from "components/Accordion";
import { Controls3DView } from "components/controls3DView";

import { formatUnits } from "@ethersproject/units";

export default ({
  dna,
  dnaDecoded,
  pearlBoost,
  clamDataValues: { pearlProductionCapacity, pearlsProduced, birthTime },
  onClickNext,
  onClickPrev,
}) => {
  const [showTraits] = useState(false);
  const [isClamAvailableForHarvest, setIsClamAvailableForHarvest] = useState(false);

  const RowStat = ({ label, value }) => (
    <div className="flex flex-row justify-between my-1 text-sm">
      <div className="block">
        <p className="font-semibold text-gray-500">{label}</p>
      </div>

      <div className="block">
        <p className="font-bold">{value}</p>
      </div>
    </div>
  );

  const accordionData = [
    {
      title: "General Stats",
      description: (
        <div>
          <RowStat label="Rarity" value={get(dnaDecoded, "rarity")} />
          <RowStat label="Pearls remaining" value={+pearlProductionCapacity - +pearlsProduced} />
          <RowStat label="Size" value={get(dnaDecoded, "size")} />
          <RowStat label="Pearl boost" value={formatUnits(String(pearlBoost), 18)} />
        </div>
      ),
    },
    {
      title: "Body",
      description: (
        <div>
          <RowStat label="Shape" value={get(dnaDecoded, "shellShape")} />
          <RowStat label="Shell Color" value={get(dnaDecoded, "shellColor")} />
          <RowStat label="Inner Color" value={get(dnaDecoded, "innerColor")} />
          <RowStat label="Lip Color" value={get(dnaDecoded, "lipColor")} />
          <RowStat label="Pattern" value={get(dnaDecoded, "pattern")} />
        </div>
      ),
    },
    {
      title: "Tongue",
      description: (
        <div>
          <RowStat label="Shape" value={get(dnaDecoded, "tongueShape")} />
          <RowStat label="Color" value={get(dnaDecoded, "tongueColor")} />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const initClamView = async () => {
      const incubationTime = await getClamIncubationTime();
      const currentBlockTimestamp = await getCurrentBlockTimestamp();

      const isClamAvailableForHarvest =
        +pearlsProduced < +pearlProductionCapacity &&
        birthTime &&
        currentBlockTimestamp > +birthTime + +incubationTime;
      setIsClamAvailableForHarvest(isClamAvailableForHarvest);
    };

    initClamView();
  }, [birthTime, pearlsProduced, pearlProductionCapacity]);
  return (
    <>
      <div className="flex flex-col justify-between w-full">
        <div className="flex justify-between flex-col sm:flex-row">
          {/** 3D Clam with react three fiber */}
          <Clam3DView
            width={400}
            height={400}
            clamDna={dna}
            decodedDna={dnaDecoded}
            // clamTraits={clamTraits}
            showTraitsTable={showTraits}
          />
          <div className="w-full md:w-1/2 px-4 md:px-6">
            <Accordion data={accordionData} />
          </div>
        </div>

        <div className="flex justify-between mt-4 pt-4 space-x-14 border-t">
          <Link to="/farms">
            <button className="px-4 p-3 rounded-xl shadown-xl bg-blue-500 text-white hover:bg-blue-300 font-semibold">
              Stake in Farm
            </button>
          </Link>
          <Link
            className={isClamAvailableForHarvest ? "" : "cursor-not-allowed"}
            to={isClamAvailableForHarvest ? "/shop?view=harvest" : "#"}
          >
            <button
              disabled={!isClamAvailableForHarvest}
              className="disabled:opacity-50 disabled:cursor-not-allowed px-4 p-3 rounded-xl shadown-xl bg-blue-500 text-white hover:opacity-50 font-semibold"
            >
              Harvest for $SHELL
            </button>
          </Link>
          <button
            disabled
            className="disabled:opacity-50 cursor-not-allowed px-4 p-3 shadown-xl   text-red-700 font-semibold border-2 border-red-500 rounded-xl hover:text-white hover:bg-red-500 bg-transparent"
          >
            Sell
          </button>
        </div>
        <Controls3DView onClickNext={onClickNext} onClickPrev={onClickPrev} />
      </div>
    </>
  );
};

import React, { useState } from "react";
import { connect } from "redux-zero/react";
import { actions } from "store/redux";
import {
  onDepositHarvestTxn,
  onDepositHarvestError,
  onDepositHarvestSuccess,
  onPearlBoostYieldAlert,
} from "../character/OnDepositHarvest";
import { harvest, getAllPools } from "web3/bank";

import ActionButton from "./ActionButton";

// WHEN HARVEST IS CLICKED. CALLED IN ./Poolitem.js
const PoolHarvest = ({
  account: { address, chainId },
  bank: { selectedPool },
  updateBank,
  updateCharacter,
  updateAccount,
  toggleModal,
  harvestAmount,
}) => {
  const isNativePool = selectedPool && selectedPool.isNative;
  const [pearlBoostYield, setPearlBoostYield] = useState(false);
  const [inTx, setInTx] = useState(false);

  const handleHarvest = async () => {
    setInTx(true);
    if (pearlBoostYield) {
      onPearlBoostYieldAlert(updateCharacter, async () => {
        await executeHarvest();
      });
    } else {
      await executeHarvest();
    }
    setInTx(false);
  };

  const executeHarvest = async () => {
    onDepositHarvestTxn(updateCharacter);
    try {
      await harvest(selectedPool.poolId);

      const setUpPools = await getAllPools({ address, chainId });

      updateBank({
        pools: setUpPools, //update all pools
        selectedPool: {
          ...selectedPool,
          userRewardAmountInPool: 0,
        },
      });

      onDepositHarvestSuccess(updateCharacter);
    } catch (error) {
      updateAccount({ error: error.message });
      onDepositHarvestError(updateCharacter);
    }
  };

  return (
    <div className="w-full" style={{ padding: "0 2%" }}>
      <div className="flex flex-col justify-between h-full px-4 py-4 rounded-xl bg-gray-200">
        <div className="w-full flex flex-row justify-between items-center">
          <p className="font-aristotelica-bold text-2xl">Harvest</p>
          {isNativePool && (
            <button className="btn btn-info" onClick={toggleModal}>
              Boost Yield
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-6 h-6 ml-2 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flew flex-col">
          <div className="flex flex-row items-center justify-center">
            <div className="avatar">
              <div className="mx-2 rounded-full w-12 h-12">
                <img src="https://clamisland.fi/favicon/android-chrome-192x192.png" />
              </div>
            </div>

            <div className="mx-2 text-4xl">{harvestAmount}</div>
            <div className="mx-2 text-xl">GEM</div>
            {/* TODO convert GEM to dola */}
            {/* <div className="mx-2 text-xs">($12.00)</div> */}
          </div>
        </div>

        <ActionButton
          onClick={handleHarvest}
          style="btn-harvest"
          isDisabled={inTx}
          isLoading={inTx}
        >
          Harvest
        </ActionButton>
      </div>
    </div>
  );
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(PoolHarvest);

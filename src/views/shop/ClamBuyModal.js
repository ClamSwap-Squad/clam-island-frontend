import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getExplorerAddressLink, ChainId } from "@usedapp/core";
import { connect } from "redux-zero/react";
import { formatEther, parseEther } from "@ethersproject/units";
import BigNumber from "bignumber.js";
import "./index.scss";

import Card from "components/Card";
import ClamUnknown from "assets/img/clam_unknown.png";
import ClamIcon from "assets/clam-icon.png";
import ArrowDown from "assets/img/arrow-down.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

import { buyClam, getPrice, checkHasClamToCollect, buyClamWithVestedTokens } from "web3/clam";
import { zeroHash } from "constants/constants";
import { infiniteApproveSpending } from "web3/gem";
import { getMintedThisWeek, getClamsPerWeek } from "web3/clamShop";
import { clamShopAddress } from "constants/constants";
import { actions } from "store/redux";

import {
  buyClamError,
  buyClamSuccess,
  buyClamProcessing,
  buyClamWithVested,
} from "./character/BuyClam";
import { formatNumber } from "../bank/utils";
import { getVestedGem } from "web3/gemLocker";
import { renderNumber } from "utils/number";

const Divider = () => (
  <div className="w-full flex flex-col justify-center items-center my-2">
    <div className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
      <img className="h-8 mr-2" src={ArrowDown} />
    </div>
  </div>
);

const ClamBuyModal = ({
  account: { gemBalance, address, chainId, clamToCollect },
  presale: { usersPurchasedClam },
  updateCharacter,
  updateAccount,
  setModalToShow,
}) => {
  const INDIVIDUAL_CAP = 5;
  const disableButton = usersPurchasedClam >= INDIVIDUAL_CAP;

  const [isLoading, setIsLoading] = useState(false);
  const [clamPrice, setClamPrice] = useState(0);
  const [lockedGem, setLockedGem] = useState(0);
  const [canBuy, setCanBuy] = useState(false);
  const [mintedThisWeek, setMintedThisWeek] = useState("...");
  const [clamsPerWeek, setClamsPerWeek] = useState("...");

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const price = await getPrice();
      setClamPrice(price);
      const locked = await getVestedGem(chainId);
      setLockedGem(locked);

      setClamsPerWeek(await getClamsPerWeek());
      setMintedThisWeek(await getMintedThisWeek());

      if (address) {
        const clamToCollect = await checkHasClamToCollect(address);
        updateAccount({
          clamToCollect: clamToCollect === zeroHash ? null : clamToCollect,
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const balanceBN = new BigNumber(parseEther(gemBalance).toString());
    const lockedBN = new BigNumber(lockedGem * 1e18);
    const totalBN = balanceBN.plus(lockedBN);
    setCanBuy(totalBN.isGreaterThanOrEqualTo(new BigNumber(clamPrice)));

    //already has rng
    if (!!clamToCollect && clamToCollect != zeroHash) {
      setModalToShow("collect");
    }
  }, [gemBalance, clamPrice, lockedGem, clamToCollect]);

  const onSubmit = async () => {
    if (new BigNumber(lockedGem).gt(0)) {
      buyClamWithVested(
        { address, updateCharacter, gem: formatNumber(+lockedGem, 3) },
        async () => await executeBuy(true),
        async () => await executeBuy()
      );
    } else {
      await executeBuy();
    }
  };

  const executeBuy = async (withVested) => {
    setIsLoading(true);

    buyClamProcessing({ updateCharacter }); // character speaks

    await infiniteApproveSpending(address, clamShopAddress, clamPrice);

    try {
      withVested ? await buyClamWithVestedTokens(address) : await buyClam(address);

      buyClamSuccess({ updateCharacter }); // character speaks
      setIsLoading(false);
      setModalToShow("collect");
    } catch (e) {
      console.log("error", e.message);
      setIsLoading(false);
      updateAccount({ error: e.message });
      buyClamError({ updateCharacter }); // character speaks
    }
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-4">
            <h2 className="text-blue-700 text-center font-semibold text-3xl mb-2">Get Clams</h2>

            {/* <div className="alert alert-success">
              <div className="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <label>
                  You&apos;ve bought {usersPurchasedClam} out of{" "}
                  {INDIVIDUAL_CAP} Clams allowed per address
                </label>
              </div>
            </div> */}

            {address ? (
              <a
                className="text-gray-500 text-base underline text-center p-2"
                href={getExplorerAddressLink(clamShopAddress, ChainId.BSC)}
                target="_blank"
                rel="noreferrer"
              >
                <div className="truncate w-2/3 inline-block underline">{clamShopAddress}</div>
                <FontAwesomeIcon
                  className="absolute"
                  style={{ marginTop: "2px" }}
                  icon={faExternalLinkAlt}
                />
              </a>
            ) : (
              <span className="text-yellow-400 text-center">Wallet not connected</span>
            )}
          </div>

          {/* input */}
          <div className="bg-white border-2 shadow rounded-xl">
            <div className="px-2 py-2">
              <div className="flex flex-col">
                <div className="text-lg font-semibold my-2">Price of Clam</div>
                <div className="flex flex-col text-sm text-gray-600">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex">
                        <img className="w-12 mr-2" src={ClamIcon} />
                        <div className="text-center text-xl w-20 text-black p-2 font-extrabold">
                          {renderNumber(+formatEther(clamPrice), 2)}
                        </div>
                        <span className="flex items-center text-lg font-extrabold font-sans mx-1">
                          GEM
                        </span>
                      </div>
                      <div className="flex flex-col my-2 pl-4 w-1/2">
                        <div className="flex justify-between">
                          <span>Wallet:</span>
                          <span>{formatNumber(+gemBalance, 3)} GEM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vested:</span>
                          <span>{formatNumber(+lockedGem, 3)} GEM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1 CLAM =</span>
                          <span>
                            {renderNumber(+formatEther(clamPrice), 2)}
                            GEM
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-md font-semibold my-2">
                  {mintedThisWeek} of {clamsPerWeek} available Clams purchased this week
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* output */}
          <div className="flex flex-col justify-center items-center">
            <img className="w-1/3" src={ClamUnknown} />
          </div>

          <div className="py-2 flex flex-col">
            {disableButton ? (
              <button
                disabled
                type="submit"
                className="disabled cursor-not-allowed block uppercase text-center shadow bg-red-300  focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl"
              >
                Already purchased
              </button>
            ) : (
              <>
                {isLoading ? (
                  <button
                    disabled={isLoading}
                    style={{ textAlign: "center" }}
                    type="submit"
                    className="flex justify-center items-center block uppercase text-center shadow bg-yellow-200 text-yellow-600 text-xl py-3 px-10 rounded-xl cursor-not-allowed"
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-yello-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>{" "}
                    <span>Sending transaction...</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`block uppercase text-center shadow hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl
                        ${canBuy ? "bg-blue-600" : "btn-disabled bg-grey-light"}
                        `}
                  >
                    {canBuy ? "Buy Clam" : "Not enough GEM"}
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </Card>
    </>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamBuyModal);

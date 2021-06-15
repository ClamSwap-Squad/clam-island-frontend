import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getExplorerAddressLink, ChainId } from "@usedapp/core";
import { connect } from "redux-zero/react";
import "./index.scss";

import Card from "../../components/Card";
import ClamUnknown from "../../assets/img/clam_unknown.png";
import BNBLogo from "../../assets/img/binance-coin-bnb-logo.png";
import ArrowDown from "../../assets/img/arrow-down.svg";

import { buyClamPresale } from "../../web3/buyClamPresale";
import { clamPresaleAddress } from "../../web3/constants";
import { actions } from "../../store/redux";

const Divider = () => (
  <div className="w-full flex flex-col justify-center items-center my-2">
    <div className="bg-grey-light hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center">
      <img className="h-8 mr-2" src={ArrowDown} />
    </div>
  </div>
);

const ClamMintModal = ({
  account: { bnbBalance, address },
  presale: { salePrice, hasPurchasedClam },
  updateCharacter,
}) => {
  const INDIVIDUAL_CAP = 1;
  //  disableButton = hasPurchasedClam > INDIVIDUAL_CAP;

  const { register, handleSubmit, setValue, reset, formState, getValues } =
    useForm();

  const onSubmit = async (data) => {
    console.log({ data, address });

    await buyClamPresale(address)
      .then((res) => {
        updateCharacter({
          name: "diego",
          action: "clam_presale.congrats.text",
          button: {
            text: "Ok",
          },
        });
      })
      .catch((e) => {
        updateCharacter({
          name: "diego",
          action: e.message,
          button: {
            text: "Dismiss",
          },
        });
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <div className="flex flex-col mb-4">
            <h2 className="text-blue-700 text-center font-semibold text-3xl tracking-wide mb-2">
              Get Clams on BSC
            </h2>
            {address ? (
              <a
                className="text-gray-500 text-base underline"
                href={getExplorerAddressLink(clamPresaleAddress, ChainId.BSC)}
                target="_blank"
                rel="noreferrer"
              >
                {clamPresaleAddress}
              </a>
            ) : (
              <span className="text-yellow-400 text-center">
                Wallet not connected
              </span>
            )}
          </div>

          {/* input */}
          <div className="bg-white border-2 shadow rounded-xl">
            <div className="px-2 py-2">
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold my-2">Price of Clam</h4>
                <div className="flex flex-col text-sm text-gray-600">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex">
                        <img className="h-12 mr-2" src={BNBLogo} />
                        <input
                          disabled
                          value={salePrice}
                          className="bg-gray-100 text-center text-xl w-20  text-black p-2 font-normal rounded  border-none rounded-l-none font-extrabold"
                          {...register("input", { required: true })}
                          // onChange={(v) => {
                          //   const input = parseUnits(
                          //     v.currentTarget.value,
                          //     "wei"
                          //   ); // input in wei
                          //   const price = parseUnits(
                          //     presaleState.salePrice,
                          //     "ether"
                          //   ); // input in ether
                          //   const out = formatUnits(input.mul(price), 18);
                          //   setValue("output", out);
                          // }}
                        />
                        <span className="flex items-center  px-3 text-lg font-extrabold font-sans mx-1">
                          BNB
                        </span>
                      </div>
                      <span className="my-2">
                        {bnbBalance.slice(0, 4)} BNB available
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          {/* output */}
          <div className="bg-white border-2 shadow-xl rounded-xl">
            <div className="px-2 py-2">
              <div className="flex flex-col">
                <h4 className="text-lg font-semibold mb-2">Clams to buy</h4>
                <div className="flex flex-col text-sm text-gray-500">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex">
                        <img className="h-12 mr-2" src={ClamUnknown} />
                        <input
                          disabled
                          value="1"
                          className="bg-gray-100 text-center text-xl w-20  text-black p-2 font-normal rounded  border-none rounded-l-none font-extrabold"
                          {...register("output", { required: true })}
                          // onChange={(v) => {
                          //   const output = parseUnits(
                          //     v.currentTarget.value,
                          //     "ether"
                          //   ); // input in wei
                          //   const price = parseUnits(
                          //     presaleState.salePrice,
                          //     "ether"
                          //   ); // input in ether
                          //   console.log({ output, price });
                          //   const input = formatUnits(output.div(price), 18);
                          //   console.log({ output, price, input });
                          //   setValue("input", input);
                          // }}
                        />
                      </div>
                      {/* <span className="flex items-center  px-3 text-lg font-extrabold font-sans mx-1">
                        CLAM
                      </span> */}

                      <div className="mx-2">1 CLAM = {salePrice} BNB</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-2 flex flex-col">
            {hasPurchasedClam ? (
              <button
                disabled
                type="submit"
                className="disabled cursor-not-allowed block uppercase text-center shadow bg-red-300  focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl"
              >
                Already purchased
              </button>
            ) : (
              <button
                type="submit"
                className="block uppercase text-center shadow bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none text-white text-xl py-3 px-10 rounded-xl"
              >
                Buy 1 Clam
              </button>
            )}
          </div>
        </Card>
      </form>
    </>
  );
};

const mapToProps = (store) => store;
export default connect(mapToProps, actions)(ClamMintModal);

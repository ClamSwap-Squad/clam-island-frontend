import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { get } from "lodash";
import ReactTooltip from "react-tooltip";
import { useInterval } from "react-use";
import { Skeleton } from "@pancakeswap-libs/uikit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faExternalLinkAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import { Clam3DView } from "components/clam3DView";
import { Controls3DView } from "components/controls3DView";
import { Accordion2, Accordion2Item } from "components/accordion2";
import { clamNFTAddress, pearlFarmAddress, zeroHash } from "constants/constants";
import { formatNumberToLocale } from "utils/formatNumberToLocale";
import { formatShell } from "utils/clams";
import { getPearlsMaxBoostTime } from "utils/getPearlsMaxBoostTime";
import { secondsToFormattedTime } from "utils/time";
import { takeSnapshot } from "utils/takeSnapshot";
import { getClamIncubationTime } from "web3/clam";
import { getClamGradeData } from "web3/dnaDecoder";
import { getCurrentBlockTimestamp } from "web3/index";
import { getPearlDataByIds } from "web3/shared";

import { SocialMediaButtons } from "components/socialMediaButtons";

import { getRemainingPearlProductionTime } from "web3/pearlFarm";

import { pearlSize } from "./utils/pearlSizeAndGradeValues";
import PearlInfo from "../bank/utils/PearlInfo";


const CardStat = ({ label, value }) => (
  <div
    className="card card-side my-1 text-sm rounded-xl border border-secondary items-center"
    style={{ backgroundColor: "#e8f7fd" }}
  >
    <div className="card-body px-2 py-3 text-center">
      <div className="block pb-1">
        <p className="font-semibold text-xs uppercase text-blue-400">{label}</p>
      </div>
      <div className="block">
        <p className="font-bold capitalize text-base">{value}</p>
      </div>
    </div>
  </div>
);

export default ({
  dna,
  dnaDecoded,
  pearlBoost,
  clamDataValues: { pearlProductionCapacity, pearlsProduced, birthTime, grade, gemPrice, pearlProductionStart },

  clamValueInShellToken,
  pearlValueInShellToken,
  onClickNext,
  onClickPrev,
  clamId,
  producedPearlIds,
  gemPriceUSD,
  boostColor,
  boostShape,
  boostPeriodInSeconds,
  boostPeriodStart,
  view,
  owner,
  ownerAddress,
  mopenPearlDetailedInfo,
  showlists,
  onClose,
}) => {
  const [isClamAvailableForHarvest, setIsClamAvailableForHarvest] = useState(false);
  const [producedPearls, setProducedPearls] = useState([]);
  const [producedPearlsYieldTimers, setProducedPearlsYieldTimers] = useState([]);
  const [remainingPearlProductionTime, setRemainingPearlProductionTime] = useState(0);
  const [isTakingSnapshot, setIsTakingSnapshot] = useState(false);
  const remainingFormattedTime = secondsToFormattedTime(remainingPearlProductionTime);
// <<<<<<< HEAD
// =======
//   const [clamGradeData, setClamGradeData] = useState({});
//   const [roi, setROI] = useState("...");
//   useInterval(() => {
//     const updatedProducedPearlsYieldTimers = producedPearlsYieldTimers.map((time) => {
//       const remainingTime = time - 1000;
//       if (remainingTime > 0) {
//         return remainingTime;
//       }

//       return 0;
//     });
//     setProducedPearlsYieldTimers(updatedProducedPearlsYieldTimers);
//     if (remainingPearlProductionTime > 0) {
//       setRemainingPearlProductionTime(remainingPearlProductionTime - 1);
//     }
//   }, 1000);
//   const harvestableShell =
//     get(dnaDecoded, "shellShape") === "maxima"
//       ? "N/A"
//       : +clamValueInShellToken > 0
//       ? +clamValueInShellToken + +pearlsProduced * +pearlValueInShellToken
//       : "0";
//   const formattedHarvestableShell =
//     harvestableShell !== "N/A" ? formatShell(harvestableShell) : "N/A";
//   const isFarmView = view === "farm";
//   const isInspectorView = view === "inspector";

//   const handleTakeSnapshot = () => {
//     setIsTakingSnapshot(true);
//   };

//   useEffect(() => {
//     if (isTakingSnapshot) {
//       setTimeout(() => {
//         const cb = () => setIsTakingSnapshot(false);
//         takeSnapshot("clam-view", cb);
//       }, 500);
//     }
//   }, [isTakingSnapshot]);
// >>>>>>> origin/master

  
  useEffect(() => {
    const initClamView = async () => {
      setROI("...");
      const [incubationTime, currentBlockTimestamp, pearls, remainingPearlProductionTime, _clamGradeData] =
        await Promise.all([
          getClamIncubationTime(),
          getCurrentBlockTimestamp(),
          getPearlDataByIds(producedPearlIds),
          getRemainingPearlProductionTime(clamId),
          getClamGradeData(grade),
        ]);

      if(_clamGradeData.length > 0) {
        setClamGradeData({
          price: _clamGradeData[0],
          pearlPrice: _clamGradeData[1],
          minSize: _clamGradeData[2],
          maxSize: _clamGradeData[3],
          minLifespan: _clamGradeData[4],
          maxLifespan: _clamGradeData[5],
          baseShell: _clamGradeData[6]
        });

        setROI(
          formatNumberToLocale(
            +(((pearlBoost * 1.8 - 1) * +pearlProductionCapacity * +_clamGradeData[1] - +_clamGradeData[0])) /
            +(+_clamGradeData[0] + +pearlProductionCapacity * +_clamGradeData[1] ) * 100,
            2
          )
        );
      } else {
        setROI(
          formatNumberToLocale(
            (((pearlBoost * 2 - 1) * pearlProductionCapacity - 10) /
              (10 + +pearlProductionCapacity)) *
              100,
            2
          )
        );
      }


      if (isFarmView) {
        setRemainingPearlProductionTime(remainingPearlProductionTime);
      }

      const isClamAvailableForHarvest =
        +pearlsProduced < +pearlProductionCapacity &&
        birthTime &&
        currentBlockTimestamp > +birthTime + +incubationTime;
      setIsClamAvailableForHarvest(isClamAvailableForHarvest);

      setProducedPearls(pearls);

      const pearlsYieldTimers = pearls.map((pearl) =>
        getPearlsMaxBoostTime({
          shape: pearl.dnaDecoded.shape,
          colour: pearl.dnaDecoded.color,
          currentBoostColour: boostColor,
          currentBoostShape: boostShape,
          period: boostPeriodInSeconds,
          startOfWeek: boostPeriodStart,
        })
      );
      setProducedPearlsYieldTimers(pearlsYieldTimers);
    };

    initClamView();
  }, [clamId]);


  useInterval(() => {
    const updatedProducedPearlsYieldTimers = producedPearlsYieldTimers.map((time) => {
      const remainingTime = time - 1000;
      if (remainingTime > 0) {
        return remainingTime;
      }

      return 0;
    });
    setProducedPearlsYieldTimers(updatedProducedPearlsYieldTimers);
    if (remainingPearlProductionTime > 0) {
      setRemainingPearlProductionTime(remainingPearlProductionTime - 1);
    }
  }, 1000);
  const harvestableShell =
    get(dnaDecoded, "shellShape") === "maxima"
      ? "N/A"
      : +clamValueInShellToken > 0
      ? +clamValueInShellToken + +pearlsProduced * +pearlValueInShellToken
      : "0";
  const formattedHarvestableShell =
    harvestableShell !== "N/A" ? formatShell(harvestableShell) : "N/A";
  const isFarmView = view === "farm";
  const isInspectorView = view === "inspector";

  const handleTakeSnapshot = () => {
    setIsTakingSnapshot(true);
  };

  useEffect(() => {
    if (isTakingSnapshot) {
      setTimeout(() => {
        const cb = () => setIsTakingSnapshot(false);
        takeSnapshot("clam-view", cb);
      }, 500);
    }
  }, [isTakingSnapshot]);

  return (
    <>
{/* <<<<<<< HEAD */}
      <div className="div_lg">
        <ReactTooltip html={true} className="max-w-xl" />
        <div className="flex flex-col justify-between w-full relative">
          {isTakingSnapshot && (
            <div className="absolute w-full h-full z-10 min-w-[1024px]">
              <Skeleton animation="waves" variant="rect" height="100%" />
{/* =======
      <ReactTooltip html={true} className="max-w-xl" />
      <div className="flex flex-col justify-between w-full relative">
        {isTakingSnapshot && (
          <div className="absolute w-full h-full z-10 min-w-[1024px]">
            <Skeleton animation="waves" variant="rect" height="100%" />
          </div>
        )}
        <div
          id="clam-view"
          className={
            isTakingSnapshot
              ? "flex justify-between flex-row pt-4 pl-4"
              : "flex justify-between flex-col sm:flex-row"
          }
        >
          <div className="grid">
            {owner &&
              (ownerAddress != pearlFarmAddress ? (
                <div className="flex justify-center">
                  <span>
                    Owned by{" "}
                    <a
                      className=""
                      target="_blank"
                      rel="noreferrer"
                      href={`https://bscscan.com/token/${clamNFTAddress}?a=${ownerAddress}#inventory`}
                    >
                      {owner} <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
                    </a>
                  </span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <span>Currently in Clam Farm</span>
                </div>
              ))}
            <div className="w-[400px] h-[400px] relative">
              <div
                className={`absolute flex w-full h-full justify-center items-center z-20 bg-white bg-opacity-50 ${
                  owner != "N/A" ? "hidden" : ""
                }`}
              >
                <span className="text-3xl">Clam Harvested</span>
              </div>
              <Clam3DView
                width={"100%"}
                height={"100%"}
                clamDna={dna}
                decodedDna={dnaDecoded}
                // clamTraits={clamTraits}
              />
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center">
                <div className="badge badge-success mr-2">#{clamId}</div>
                {grade != "" && (
                  <div className="badge badge-info mr-2">Grade {grade.toUpperCase()}</div>
                )}
                <div className="text-green-400 text-bold">{get(dnaDecoded, "rarity")}</div>
              </div>
              <div className="flex gap-2">
                <FontAwesomeIcon
                  data-tip="Take a shareable snapshot"
                  className="cursor-pointer"
                  icon={faCamera}
                  onClick={handleTakeSnapshot}
                  size="lg"
                />
                <SocialMediaButtons assetId={clamId} assetName="Clam" />
              </div>
>>>>>>> origin/master */}
            </div>
          )}
          <div
            id="clam-view"
            className={
              isTakingSnapshot
                ? "flex justify-between flex-row pt-4 pl-4"
                : "flex justify-between flex-col sm:flex-row"
            }
          >
            <div className="grid">
              {owner &&
                (ownerAddress != pearlFarmAddress ? (
                  <div className="flex justify-center">
                    <span>
                      Owned by{" "}
                      <a
                        className=""
                        target="_blank"
                        rel="noreferrer"
                        href={`https://bscscan.com/token/${clamNFTAddress}?a=${ownerAddress}#inventory`}
                      >
                        {owner} <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
                      </a>
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <span>Currently in Clam Farm</span>
                  </div>
                ))}
              <div className="w-[400px] h-[400px] relative">
                <div
                  className={`absolute flex w-full h-full justify-center items-center z-20 bg-white bg-opacity-50 ${
                    owner != "N/A" ? "hidden" : ""
                  }`}
                >
{/* <<<<<<< HEAD */}
                  <span className="text-3xl">Clam Harvested</span>
                </div>
                <Clam3DView
                  width={"100%"}
                  height={"100%"}
                  clamDna={dna}
                  decodedDna={dnaDecoded}
                  // clamTraits={clamTraits}
                />
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="badge badge-success mr-2">#{clamId}</div>
                  <div className="text-green-400 text-bold">{get(dnaDecoded, "rarity")}</div>
                </div>
                <div className="flex gap-2">
                  <FontAwesomeIcon
                    data-tip="Take a shareable snapshot"
                    className="cursor-pointer"
                    icon={faCamera}
                    onClick={handleTakeSnapshot}
                    size="lg"
// =======
//                   <CardStat
//                     label="GEM Cost"
//                     value={
//                       gemPrice == 0 ? "Unknown" : formatNumberToLocale(gemPrice, 2, true)
//                     }
//                   />
//                   <CardStat
//                     label="Pearls remaining / Lifespan"
//                     value={
//                       (+pearlProductionCapacity - +pearlsProduced).toString() +
//                       " / " +
//                       pearlProductionCapacity.toString()
//                     }
//                   />
//                   <CardStat
//                     label={
//                       <>
//                         Clam boost&nbsp;
//                         <button data-tip="Applied as a multiplier to the GEM yield for every Pearl produced by this Clam">
//                           <FontAwesomeIcon icon={faInfoCircle} />
//                         </button>
//                       </>
//                     }
//                     value={formatNumberToLocale(pearlBoost, 2) + "x"}
// >>>>>>> origin/master
                  />
                  <SocialMediaButtons assetId={clamId} assetName="Clam" />
                </div>
              </div>
              {isFarmView && remainingFormattedTime && (
                <>
                  <div className="flex flex-row justify-between my-2" style={{ width: "400px" }}>
                    <p className="float-left">{remainingFormattedTime ? "Remaining Time" : ""}</p>
                    <p className="float-right">{remainingFormattedTime}</p>
                  </div>
                  
                    { remainingFormattedTime ? (
                      <>
{/* <<<<<<< HEAD */}
                        {/* Progress Bar */}
                        <div className="progress-bar">
                          <div className={"base-bar " + (clam.progress < 100 ? "base-bar-animated" : "")}>
                            <div style={{ width: clam.progress + "%" }} className="completion-bar"></div>
                            <span>Producing {clam.progress}%</span>
                          </div>
                        </div>
{/* =======
                        Indicative GEM ROI / APR&nbsp;
                        <button data-tip='<p class="mb-4">Indicative ROI is calculated based on an average GEM returns per Pearl without any regard for GEM price fluctuations, and assuming all Pearls are exchanged for max yield. Your actual ROI will vary.</p><p>Indicative APR represents annualised returns based on the indicative ROI and the average time it would take to farm all Pearls, exchange them for GEM and receive the 30-day stream for max yield.</p>'>
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
>>>>>>> origin/master */}
                      </>
                    ) : "" }
                </>
              )}
              
            </div>
            <div className="w-full px-4 md:px-6">
              <Accordion2 defaultTab="GeneralStats" isOpened={isTakingSnapshot}>
                <Accordion2Item title="General Stats" id="GeneralStats" scroll={true}>
                  <div
                    className={
                      isTakingSnapshot
                        ? "grid grid-cols-4 grid-rows-1 gap-3"
                        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
                    }
// <<<<<<< HEAD
                  >
                    <CardStat
                      label="Pearls remaining / Lifespan"
                      value={
                        (+pearlProductionCapacity - +pearlsProduced).toString() +
                        " / " +
                        pearlProductionCapacity.toString()
                      }
                    />
                    <CardStat
                      label={
                        <>
                          Clam boost&nbsp;
                          <button data-tip="Applied as a multiplier to the GEM yield for every Pearl produced by this Clam">
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={formatNumberToLocale(pearlBoost, 2) + "x"}
                    />
                    <CardStat
                      label={
                        <>
                          Indicative GEM ROI / APR&nbsp;
                          <button data-tip='<p class="mb-4">Indicative ROI is calculated based on an average Pearl boost of 2x, assuming Pearl production price is fixed at 1/10 Clam price and all Pearls are exchanged for max yield. Your actual ROI will vary.</p><p>Indicative APR represents annualised returns based on the indicative ROI and the average time it would take to farm all Pearls, exchange them for GEM and receive the 30-day stream for max yield.</p>'>
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={
                        formatNumberToLocale(
                          (((pearlBoost * 2 - 1) * pearlProductionCapacity - 10) /
                            (10 + +pearlProductionCapacity)) *
                            100,
                          2
                        ) +
                        "% / " +
                        formatNumberToLocale(
                          (((((pearlBoost * 2 - 1) * pearlProductionCapacity - 10) /
                            (10 + +pearlProductionCapacity)) *
                            100) /
                            ((40 * +pearlProductionCapacity) / 24 + 18 + 30)) *
                            365,
                          2
                        ) +
                        "%"
                      }
                    />
                    <CardStat
                      label={
                        <>
                          Harvestable $SHELL&nbsp;
                          <button data-tip="Amount of $SHELL you will receive if you harvest this Clam in the Shop">
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={formattedHarvestableShell}
                    />
                  </div>
                </Accordion2Item>
                <Accordion2Item title="Traits" id="Traits" scroll={true}>
                  <div
                    className={
                      isTakingSnapshot
                        ? "grid grid-cols-4 grid-rows-1 gap-3"
                        : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3"
// =======
//                     value={
//                       roi + "% / " +

//                       (!isNaN(roi) ?
//                         formatNumberToLocale(
//                           +roi / ((32 * +pearlProductionCapacity) / 24 + 18 + 30) * 365,
//                         2)
//                       :
//                         "..."
//                       ) +
//                       "%"
//                     }
//                   />
//                   <CardStat
//                     label={
//                       <>
//                         Harvestable $SHELL&nbsp;
//                         <button data-tip="Amount of $SHELL you will receive if you harvest this Clam in the Shop">
//                           <FontAwesomeIcon icon={faInfoCircle} />
//                         </button>
//                       </>
// >>>>>>> origin/master
                    }
                  >
                    <CardStat label="Shell Shape" value={get(dnaDecoded, "shellShape")} />
                    <CardStat label="Shell Colour" value={get(dnaDecoded, "shellColor")} />
                    <CardStat label="Shell Pattern" value={get(dnaDecoded, "pattern")} />
                    <CardStat label="Inner Color" value={get(dnaDecoded, "innerColor")} />
                    <CardStat label="Lip Color" value={get(dnaDecoded, "lipColor")} />
                    <CardStat label="Tongue Shape" value={get(dnaDecoded, "tongueShape")} />
                    <CardStat label="Tongue Colour" value={get(dnaDecoded, "tongueColor")} />
                    <CardStat
                      label="Size"
                      value={
                        pearlSize(get(dnaDecoded, "size")) + " (" + get(dnaDecoded, "size") + ")"
                      }
                    />
                  </div>
                </Accordion2Item>
                {!isTakingSnapshot && (
                  <Accordion2Item title="Produced pearls" id="ProducedPearls" scroll={false}>
                    <div
                      className="flex flex-col gap-2 overflow-y-auto"
                      style={{ maxHeight: "220px" }}
                    >
                      {producedPearls.length > 0
                        ? producedPearls.map((pearl, i, a) => (
                            <PearlInfo
                              key={pearl.pearlId}
                              pearl={pearl}
                              isLast={i === a.length - 1}
                              maxBoostIn={producedPearlsYieldTimers[i]}
                              gemPriceUSD={gemPriceUSD}
                              hideViewDetails={false}
                            />
                          ))
                        : "This Clam has not yet produced any Pearls."}
                    </div>
                  </Accordion2Item>
                )}
              </Accordion2>
            </div>
          </div>
          {!isFarmView &&
            (isInspectorView ? (
              <div className="flex justify-between mt-4 pt-4 space-x-14 border-t">
                <button
                  className="cursor-not-allowed opacity-50 btn btn-secondary"
                  data-tip="Coming soon..."
                >
                  Make Offer
                </button>

                <Link to="/shop">
                  <button className="disabled:opacity-50 disabled:cursor-not-allowed btn btn-secondary">
                    Clam Shop
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex justify-between mt-4 pt-4 space-x-14 border-t">
                <Link to="/farms">
                  <button className="btn btn-secondary">Stake in Farm</button>
                </Link>
                <Link
                  className={isClamAvailableForHarvest ? "" : "cursor-not-allowed"}
                  to={isClamAvailableForHarvest ? "/shop?view=harvest" : "#"}
                >
                  <button
                    disabled={!isClamAvailableForHarvest}
                    className="disabled:opacity-50 disabled:cursor-not-allowed btn btn-secondary"
                  >
                    Harvest for $SHELL
                  </button>
                </Link>
                <button disabled className="disabled:opacity-50 cursor-not-allowed btn btn-warning">
                  Sell
                </button>
              </div>
            ))}
        </div>
        <Controls3DView onClickNext={onClickNext} onClickPrev={onClickPrev} />

      </div>
      <div className="div_sm">

        <ReactTooltip html={true} className="max-w-xl" />
        <div className="flex flex-col justify-between w-full relative bg-white">
          {isTakingSnapshot && (
            <div className="absolute w-full h-full z-10 min-w-[1024px]">
              <Skeleton animation="waves" variant="rect" height="100%" />
            </div>
          )}
          <div
            id="clam-view"
            className={
              isTakingSnapshot
                ? "flex justify-between flex-row pt-4 pl-4"
                : "flex justify-between flex-col sm:flex-row"
            }
          >
            <div className="grid">
              {owner &&
                (ownerAddress != pearlFarmAddress ? (
                  <div className="flex justify-center">
                    <span>
                      Owned by{" "}
                      <a
                        className=""
                        target="_blank"
                        rel="noreferrer"
                        href={`https://bscscan.com/token/${clamNFTAddress}?a=${ownerAddress}#inventory`}
                      >
                        {owner} <FontAwesomeIcon icon={faExternalLinkAlt} className="ml-1" />
                      </a>
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <span>Currently in Clam Farm</span>
                  </div>
                ))}
              <div className="relative">
                <div
                  className={`absolute flex w-full h-full justify-center items-center z-20 bg-white bg-opacity-50 ${
                    owner != "N/A" ? "hidden" : ""
                  }`}
                >
                  <span className="text-3xl">Clam Harvested</span>
                </div>
                <Clam3DView
                  width={"100%"}
                  height={"100%"}
                  clamDna={dna}
                  decodedDna={dnaDecoded}
                  // clamTraits={clamTraits}
                />
              </div>
              {isFarmView && (
                <>
                  <div className="flex flex-row justify-between my-2" style={{ width: "100%" }}>
                    <p className="float-left">{remainingFormattedTime ? "Remaining Time" : ""}</p>
                    <p className="float-right">{remainingFormattedTime}</p>
                  </div>
                  
                </>
              )}
            </div>
            <div className="flex justify-center w-full p-4 text-center items-center text-2xl">
              <h1 className="float-left">Clam #{clamId}</h1>
              <div className="absolute right-4">
                <Link to="/saferoom/clam" onClick={showlists}>
                  &#10006;
                </Link>
              </div>
            </div>
            <div className="w-full px-4 md:px-6">
              <Accordion2 defaultTab="GeneralStats" isOpened={isTakingSnapshot}>
                <Accordion2Item title="General Stats" id="GeneralStats" scroll={true}>
                  <div
                    className={
                      isTakingSnapshot
                        ? "grid grid-cols-4 grid-rows-1 gap-3"
                        : "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-2"
                    }
                  >
                    <CardStat
                      label="Pearls remaining / Lifespan"
                      value={
                        (+pearlProductionCapacity - +pearlsProduced).toString() +
                        " / " +
                        pearlProductionCapacity.toString()
                      }
                    />
                    <CardStat
                      label={
                        <>
                          Clam boost&nbsp;
                          <button data-tip="Applied as a multiplier to the GEM yield for every Pearl produced by this Clam">
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={formatNumberToLocale(pearlBoost, 2) + "x"}
                    />
                    <CardStat
                      label={
                        <>
                          Indicative GEM ROI / APR&nbsp;
                          <button data-tip='<p class="mb-4">Indicative ROI is calculated based on an average Pearl boost of 2x, assuming Pearl production price is fixed at 1/10 Clam price and all Pearls are exchanged for max yield. Your actual ROI will vary.</p><p>Indicative APR represents annualised returns based on the indicative ROI and the average time it would take to farm all Pearls, exchange them for GEM and receive the 30-day stream for max yield.</p>'>
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={
                        formatNumberToLocale(
                          (((pearlBoost * 2 - 1) * pearlProductionCapacity - 10) /
                            (10 + +pearlProductionCapacity)) *
                            100,
                          2
                        ) +
                        "% / " +
                        formatNumberToLocale(
                          (((((pearlBoost * 2 - 1) * pearlProductionCapacity - 10) /
                            (10 + +pearlProductionCapacity)) *
                            100) /
                            ((40 * +pearlProductionCapacity) / 24 + 18 + 30)) *
                            365,
                          2
                        ) +
                        "%"
                      }
                    />
                    <CardStat
                      label={
                        <>
                          Harvestable $SHELL&nbsp;
                          <button data-tip="Amount of $SHELL you will receive if you harvest this Clam in the Shop">
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </button>
                        </>
                      }
                      value={formattedHarvestableShell}
                    />
                  </div>
                </Accordion2Item>
                <Accordion2Item title="Traits" id="Traits">
                  <div
                    className={
                      isTakingSnapshot
                        ? "grid grid-cols-4 grid-rows-1 gap-3"
                        : "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-2"
                    }
                  >
                    <CardStat label="Shell Shape" value={get(dnaDecoded, "shellShape")} />
                    <CardStat label="Shell Colour" value={get(dnaDecoded, "shellColor")} />
                    <CardStat label="Shell Pattern" value={get(dnaDecoded, "pattern")} />
                    <CardStat label="Inner Color" value={get(dnaDecoded, "innerColor")} />
                    <CardStat label="Lip Color" value={get(dnaDecoded, "lipColor")} />
                    <CardStat label="Tongue Shape" value={get(dnaDecoded, "tongueShape")} />
                    <CardStat label="Tongue Colour" value={get(dnaDecoded, "tongueColor")} />
                    <CardStat
                      label="Size"
                      value={
                        pearlSize(get(dnaDecoded, "size")) + " (" + get(dnaDecoded, "size") + ")"
                      }
                    />
                  </div>
                </Accordion2Item>
                {!isTakingSnapshot && (
                  <Accordion2Item title="Produced pearls" id="ProducedPearls" scroll={false}>
                    {
                      producedPearls.length > 0 ? (
                        <>
                        <div
                          className="grid grid-cols-2 gap-4 overflow-y-auto p-2"
                        >
                          {
                            producedPearls.map((pearl, i, a) =>  {

                              const rarity = get(pearl.dnaDecoded, "rarity");
                              let shape = get(pearl.dnaDecoded, "shape");
                              shape = shape.charAt(0).toUpperCase() + shape.slice(1);

                              return (
                                <div key={i} className="pearlitem text-center p-2">
                                  <div className="flex align-center justify-center">
                                    <img src={pearl.img} alt="" style={{ width: "60%" }}/>
                                  </div>

                                  <p className="mt-1">{pearl.pearlId}</p>
                                  <div className="flex justify-between w-100 m-auto">
                                    <div>
                                      <p className="lifeSpan">Rarity</p>
                                      <p className="lifeSpanValue">{rarity}</p>
                                    </div>
                                    <div>
                                      <p className="lifeRarity">Shape</p>
                                      <p className="lifeRarityValue">{shape}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <button className="selectBtn" onClick={() => { mopenPearlDetailedInfo(pearl) }}>Select</button>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2">
                            This Clam has not yet produced any Pearls.
                          </div>
                        </>
                      )
                    }
                  </Accordion2Item>
                )}
              </Accordion2>
            </div>
          </div>


          {!isFarmView &&
            (isInspectorView ? (
              <div className="flex flex-col items-center xs:flex-row xs:justify-between my-4 mb-5 p-4 gap-4">
                <button
                  className="cursor-not-allowed opacity-50 btn btn-secondary"
                  data-tip="Coming soon..."
                >
                  Make Offer
                </button>

                <Link to="/shop">
                  <button className="disabled:opacity-50 disabled:cursor-not-allowed btn btn-secondary mb-4">
                    Clam Shop
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center xs:flex-row xs:justify-between my-4 p-4 gap-4">
                <Link to="/farms">
                  <button className="btn btn-secondary">Stake in Farm</button>
                </Link>
                <Link
                  className={isClamAvailableForHarvest ? "" : "cursor-not-allowed"}
                  to={isClamAvailableForHarvest ? "/shop?view=harvest" : "#"}
                >
                  <button
                    disabled={!isClamAvailableForHarvest}
                    className="disabled:opacity-50 disabled:cursor-not-allowed btn btn-secondary"
                  >
                    Harvest for $SHELL
                  </button>
                </Link>
                <button disabled className="disabled:opacity-50 cursor-not-allowed btn btn-warning mb-4">
                  Sell
                </button>
              </div>
            ))}
        </div>
        {/* <Controls3DView onClickNext={onClickNext} onClickPrev={onClickPrev} /> */}

      </div>
    </>
  );
};

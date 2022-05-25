import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { approveContractForMaxUintErc721 } from "../../web3/bep20";
import { getAllowance, infiniteApproveSpending, getBalance } from "../../web3/gem";
import { exchangeClam, clamBonusData } from "../../web3/clamExchange";
import { getPriceForClamGrade, getPearlPriceForClamGrade } from "../../web3/dnaDecoder"
import { clamExchangeAddress, clamNFTAddress, pearlFarmAddress } from "../../constants/constants";
import ReactTooltip from "react-tooltip";
import {
  stakeClam,
  hasClamBeenStakedBeforeByUser,
  stakeClamAgain,
  getRemainingPearlProductionTime,
} from "../../web3/pearlFarm";
import { depositClamError, depositClamSuccess } from "./character/clamDeposit";
import { secondsToFormattedTime } from "utils/time";
import BigNumber from "bignumber.js";
import { formatNumberToLocale } from "../../utils/formatNumberToLocale";

export const clamItemAction = {
  DEPOSIT: "deposit",
  SWAP: "swap",
};

export const ClamItem = ({
  tokenId,
  clamId,
  img,
  clamDataValues,
  updateAccount,
  address,
  dnaDecoded,
  updateCharacter,
  pearlBoost,
  setRefreshClams,
  dispatchFetchAccountAssets,
  action,
  toggleModal,
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [buttonText, setButtonText] = useState(
    action === clamItemAction.DEPOSIT ? "Deposit Clam" : "Swap Clam"
  );
  const [inTx, setInTx] = useState(false);
  const [insufficentGem, setInsufficientGem] = useState(false);

  const [isClamDeposited, setIsClamDeposited] = useState(false);

  const [pearlPrice, setPearlPrice] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const remaining = await getRemainingPearlProductionTime(clamId);
        setRemainingTime(remaining);
        if (action === clamItemAction.SWAP) {
          const repayGem = await clamBonusData(clamId).then(BigNumber);
          const gemBalance = await getBalance(address).then(BigNumber);
          if (repayGem.gt(gemBalance)) {
            setButtonText(
              "Requires " + formatNumberToLocale(repayGem.toString(), 2, true) + " GEM"
            );
            setInsufficientGem(true);
          }
        }
        if(parseFloat(clamDataValues.gemPrice)) {
          const pearlPriceUSD = await getPearlPriceForClamGrade(clamDataValues.grade);
          const clamPriceUSD = await getPriceForClamGrade(clamDataValues.grade);
          console.log("pearl + clam price USD", pearlPriceUSD, clamPriceUSD);
          setPearlPrice(formatNumberToLocale(+clamDataValues.gemPrice * +pearlPriceUSD / +clamPriceUSD, 2, true));
        }

      } catch (err) {
        updateAccount({ error: err.message });
      }
    };

    init();
  }, [address, inTx]);

  const triggerClamDepositSuccess = async () => {
    toast.success("Your clam has been deposited! You can choose to deposit another clam.");
    depositClamSuccess({ updateCharacter });
    setRefreshClams(true);
    setIsClamDeposited(true);

    await dispatchFetchAccountAssets();
  };

  const executeDeposit = async () => {
    try {
      setInTx(true);
      setButtonText("Approving Clam...");
      await approveContractForMaxUintErc721(clamNFTAddress, pearlFarmAddress);

      setButtonText("Depositing Clam...");

      const hasClamBeenStakeByUserBefore = await hasClamBeenStakedBeforeByUser(clamId);
      if (hasClamBeenStakeByUserBefore) {
        await stakeClamAgain(clamId);
        await triggerClamDepositSuccess();
      } else {
        await stakeClam(clamId);
        await triggerClamDepositSuccess();
      }
    } catch (err) {
      updateAccount({ error: err.message });
      setButtonText("Approve Clam");
      setInTx(false);
      depositClamError({ updateCharacter, err }); // character speaks
    }
  };

  const executeSwap = async () => {
    try {
      setInTx(true);
      const repayGem = await clamBonusData(clamId).then(BigNumber);
      const gemBalance = await getBalance(address).then(BigNumber);
      if (repayGem.gt(gemBalance)) {
        console.log(repayGem, gemBalance);
        setButtonText("Swap Clam");
        throw new SyntaxError(
          "Insufficient GEM balance - you need to repay " +
            formatNumberToLocale(repayGem.toString(), 2, true) +
            " GEM in order to swap this Clam."
        );
      }
      if (new BigNumber(repayGem).gt(0)) {
        const gemAllowance = await getAllowance(address, clamExchangeAddress).then(BigNumber);
        if (gemAllowance.lt(repayGem)) {
          await infiniteApproveSpending(address, clamExchangeAddress, repayGem.toString());
        }
      }

      setButtonText("Approving Clam...");
      await approveContractForMaxUintErc721(clamNFTAddress, clamExchangeAddress);

      setButtonText("Swapping Clam...");

      await exchangeClam(clamId);
      toggleModal();
      await dispatchFetchAccountAssets();
    } catch (err) {
      updateAccount({ error: err.message });
      setButtonText("Swap Clam");
      setInTx(false);
    }
  };

  if (isClamDeposited) {
    return null;
  }

  return (
    <>
      <ReactTooltip className="max-w-xl" />
      <div className="card bg-white shadow-lg overflow-visible w-full border-4 border-gray-50 hover:border-4 hover:border-blue-200 ">
        <figure>
          <img className="h-64  w-full object-cover" src={img} alt="" />
        </figure>

        <div className="flex justify-between px-4 py-2">
          <div className=" badge badge-success">#{tokenId}</div>
          { clamDataValues.grade && (
            <div className=" badge badge-info">Grade {clamDataValues.grade.toUpperCase()}</div>
          )}
          <div className="text-green-400 text-bold">{dnaDecoded.rarity}</div>
        </div>

        <div className="bg-white p-2 grid sm:gap-4">
          <div className="block">
            <div className="border rounded border-gray-200">
              <dl>
                <div className="bg-gray-50 flex flex-row justify-between sm:gap-4 p-2">
                  <dt className="text-sm font-medium text-gray-500">Pearl ETA</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                    {(remainingTime > 0 ?
                      secondsToFormattedTime(remainingTime) :
                      (<span>
                        Unknown&nbsp;
                        <button type="button" data-tip="Next Pearl ETA not known until after a Clam is deposited in the Farm for the first time">
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                      </span>))}
                  </dd>
                </div>
                <div className="bg-gray-50 flex flex-row justify-between sm:gap-4 p-2">
                  <dt className="text-sm font-medium text-gray-500">Pearl Cost</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                    {parseFloat(clamDataValues.gemPrice) > 0 ? pearlPrice + " GEM" : (<span>
                      Unknown&nbsp;
                      <button type="button" data-tip="This is an older generation Clam with production price in GEM determined at the time of collecting a produced Pearl">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                    </span>)}
                  </dd>
                </div>
                <div className="bg-gray-100 flex flex-row justify-between sm:gap-4 p-2">
                  <dt className="text-sm font-medium text-gray-500">Lifespan</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                    {+clamDataValues.pearlProductionCapacity - +clamDataValues.pearlsProduced}{" "}
                    pearls remaining
                  </dd>
                </div>

                <div className="bg-gray-50 flex flex-row justify-between sm:gap-4 p-2">
                  <dt className="text-sm font-medium text-gray-500">
                    Clam boost&nbsp;
                    <button type="button" data-tip="Applied as a boost multiplier when calculating the GEM yield for each Pearl produced by this Clam.">
                      <FontAwesomeIcon icon={faInfoCircle} />
                    </button>
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0">{pearlBoost}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-col items-center justify-items-center">
            <Link
              to={`/saferoom/clam?id=${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-neutral mt-4 font-montserrat font-bold w-full"
            >
              View in saferoom&nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Link>
            {action === clamItemAction.DEPOSIT && (
              <button
                disabled={inTx}
                className="btn btn-secondary mt-4 font-montserrat font-bold w-full"
                onClick={() => executeDeposit()}
              >
                {buttonText}
              </button>
            )}
            {action === clamItemAction.SWAP && (
              <button
                disabled={inTx || insufficentGem}
                className="btn btn-secondary mt-4 font-montserrat font-bold w-full"
                onClick={() => executeSwap()}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

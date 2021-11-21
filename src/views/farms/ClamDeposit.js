import { useEffect, useState } from "react";
import { useAsync } from "react-use";
import { connect } from "redux-zero/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { actions } from "../../store/redux";
import { approveContractForMaxUintErc721 } from "../../web3/bep20";
import { clamNFTAddress, pearlFarmAddress } from "../../web3/constants";
import {
  stakeClam,
  hasClamBeenStakedBeforeByUser,
  stakeClamAgain,
  getRemainingPearlProductionTime,
} from "../../web3/pearlFarm";
import { getAllPools } from "web3/bank";
import { depositClamError, depositClamSuccess } from "./character/clamDeposit";
import { secondsToFormattedTime } from "utils/time";
import InfoTooltip from "components/Tooltip";

const ClamItem = ({
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
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [buttonText, setButtonText] = useState("Deposit Clam");
  const [inTx, setInTx] = useState(false);
  // const [gemApproved, setGemApproved] = useState(false);
  // const [pearlPrice, setPearlPrice] = useState(new BigNumber(0));

  const [isClamDeposited, setIsClamDeposited] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const remaining = await getRemainingPearlProductionTime(clamId);
        setRemainingTime(remaining);
      } catch (err) {
        updateAccount({ error: err.message });
      }
    };

    init();
  }, [address, inTx]);

  const handleDeposit = async () => {
    await executeDeposit();
  };

  const triggerClamDepositSuccess = async () => {
    toast.success("Your clam has been deposited!. You can choose to deposit another clam.");
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

  if (isClamDeposited) {
    return null;
  }

  return (
    <div className="card bg-white shadow-lg overflow-visible w-full border-4 border-gray-50 hover:border-4 hover:border-blue-200 ">
      <figure>
        <img className="h-64  w-full object-cover" src={img} alt="" />
      </figure>

      <div className="flex justify-between px-4 py-2">
        <div className=" badge badge-success">#{tokenId}</div>
        <div className="text-green-400 text-bold">{dnaDecoded.rarity}</div>
      </div>

      <div className="flex-1 bg-white p-2 flex flex-col justify-between">
        <div className="block">
          <div className="border rounded border-gray-200">
            <dl>
              <div className="bg-gray-50  sm:grid sm:grid-cols-3 sm:gap-4 p-2">
                <dt className="text-sm font-medium text-gray-500">Pearl ETA:</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {secondsToFormattedTime(remainingTime)}
                </dd>
              </div>
              <div className="bg-gray-100  sm:grid sm:grid-cols-3 sm:gap-4  p-2">
                <dt className="text-sm font-medium text-gray-500">Lifespan</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {+clamDataValues.pearlProductionCapacity - +clamDataValues.pearlsProduced} pearls
                  remaining
                </dd>
              </div>

              <div className="bg-gray-50  sm:grid sm:grid-cols-3 sm:gap-4 p-2">
                <dt className="text-sm font-medium text-gray-500">
                  Pearl boost:&nbsp;
                  <InfoTooltip text="Boost only available the first time the Clam is deposited and only if no other Clams of the same rarity tier was deposited at the time. Boost amount will otherwise show as zero.">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </InfoTooltip>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{pearlBoost}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col items-center justify-items-center">
          <Link
            to={`/saferoom/clam?id=${clamId}`}
            className="font-montserrat underline"
            style={{ color: "#757575" }}
          >
            View in saferoom
          </Link>
          <button
            disabled={inTx}
            className="btn btn-secondary mt-4 font-montserrat font-bold w-full"
            onClick={() => handleDeposit()}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

const ClamDeposit = ({
  clams,
  updateCharacter,
  dispatchFetchAccountAssets,
  toggleModal,
  updateAccount,
  account: { address, chainId },
  setRefreshClams,
}) => {
  const request = useAsync(async () => {
    const pools = await getAllPools({ address, chainId });
    return pools;
  });

  return (
    <div className="ClamDeposit max-h-160 overflow-y-auto p-2">
      {request.loading ? (
        <div> Loading... </div>
      ) : (
        <>
          {clams.length ? (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 flex-2">
              {clams.map((clam) => (
                <ClamItem
                  pools={request.value}
                  key={clam.clamId}
                  updateAccount={updateAccount}
                  address={address}
                  {...clam}
                  updateCharacter={updateCharacter}
                  toggleModal={toggleModal}
                  setRefreshClams={setRefreshClams}
                  dispatchFetchAccountAssets={dispatchFetchAccountAssets}
                />
              ))}
            </div>
          ) : (
            <div className="w-full bg-white shadow-md rounded-xl text-center text-2xl p-5 text-black">
              You&#39;ve got no more clams available to add to farm
            </div>
          )}
        </>
      )}
    </div>
  );
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(ClamDeposit);

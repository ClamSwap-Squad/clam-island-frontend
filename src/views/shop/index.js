import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import { useEthers } from "@usedapp/core";

import Character from "../../components/characters/CharacterWrapper";
import Web3Navbar from "../../components/Web3Navbar";

import { actions } from "../../store/redux";
import { checkHasClamToCollect } from "../../web3/clam";
import { zeroHash } from "../../web3/constants";

import videoImage from "../../assets/locations/Shop.jpg";
import videoMp4 from "../../assets/locations/Shop.mp4";
import videoWebM from "../../assets/locations/Shop.webm";
import VideoBackground from "../../components/VideoBackground";

import "./index.scss";
import ClamBuyModal from "./ClamBuyModal";
import ClamCollectModal from "./ClamCollectModal";
import ClamDisplayModal from "./ClamDisplayModal";
import ClamHarvestModal from "./ClamHarvestModal";
import { WelcomeUser } from "./character/WelcomeUser";

const Shop = ({ account: { address, clamToCollect }, updateCharacter, updateAccount }) => {
  const [modalToShow, setModalToShow] = useState(null);
  const [userReady, setUserReady] = useState(false);

  const { activateBrowserWallet } = useEthers();

  useEffect(() => {
    if (!userReady) {
      // character greets
      WelcomeUser({
        updateCharacter, activateBrowserWallet, address,
        setModalToShow, setUserReady, clamToCollect
      });
    }
  }, [address, userReady, clamToCollect]);

  useEffect(() => {
    if (address) {
      checkHasClamToCollect(address).then((clamToCollect) => {
        updateAccount({
          clamToCollect: clamToCollect === zeroHash ? null : clamToCollect,
        });
      });
    }
  }, [address, modalToShow]);

  return (
    <>
      <Web3Navbar />
      {/* container */}
      <VideoBackground videoImage={videoImage} videoMp4={videoMp4} videoWebM={videoWebM} />
      {/* chat character   */}
      <Character name="diego" />

      {/* wallet is connected */}
      {address && userReady && (
        <div className="flex relative z-20  justify-center items-start top-40 w-full">
          {/* step 1 */}
          {modalToShow === "buy" && <ClamBuyModal setModalToShow={setModalToShow} />}
          {/* step 2 */}
          {modalToShow === "collect" && clamToCollect && (
            <ClamCollectModal setModalToShow={setModalToShow} />
          )}
          {/* step 3 */}
          {modalToShow === "display" && <ClamDisplayModal setModalToShow={setModalToShow} />}
          {/* step 4 */}
          {modalToShow === "harvest" && <ClamHarvestModal setModalToShow={setModalToShow} />}
        </div>
      )}
    </>
  );
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(Shop);

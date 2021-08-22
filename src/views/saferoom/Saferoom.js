import React, { useState, useEffect } from "react";
import { connect } from "redux-zero/react";
import { useAsync } from "react-use";
import "./index.scss";

import { Link } from "react-router-dom";
import Character from "../../components/characters/CharacterWrapper";
import Web3Navbar from "../../components/Web3Navbar";
import clamIcon from "../../assets/clam-icon.png";
import { Modal, useModal } from "../../components/Modal";
import ClamItem from "./ClamItem";
import ClamView from "./ClamView";
import ClamUnknown from "../../assets/img/clam_unknown.png";

import videoImage from "../../assets/locations/saferoom_static.jpg";

import { actions } from "../../store/redux";
// import { PEARLS } from "../../constants";

import clamContract from "../../web3/clam";
import { getDNADecoded } from "../../web3/dnaDecoder";

const getPearlImage = (p) => require(`../../assets/img/clamjam/${p.src}`).default;

const PearlItem = ({ pearl }) => {
  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden border-b-4 border-blue-500 flex flex-col justify-between">
        <img src={getPearlImage(pearl)} alt="Pearl" className="w-full object-cover h-32 sm:h-48 md:h-64" />

        <div className="p-4 md:p-6">
          <h3 className="font-semibold mb-2 text-xl leading-tight sm:leading-normal">{pearl.title}</h3>
        </div>

        <div className="px-4 md:px-6 py-2">
          <div className="text-sm flex flex-row justify-between">
            <div className="text-sm block">
              <p className="text-gray-500 font-semibold text-xs mb-1 leading-none">Power</p>
              <p className="font-bold text-black">Boost yield by 5x</p>
            </div>

            <div className="text-sm block">
              <p className="text-gray-500 font-semibold text-xs mb-1 leading-none">Rarity</p>
              <p className="font-bold text-black">50.03</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// const TEST_CLAMS = [{
//   dna: "testing",
//   dnaDecoded: {
//     lifespan: "1",
//     rarity: "rare",
//     shellShape: "common"
//   }
// }];

const Saferoom = ({ account: { clamBalance, address }, updateCharacter }) => {
  const [clams, setClams] = useState([]);
  const [selectedClam, setSelectedClam] = useState();
  const [loading, setLoading] = useState(false);

  const { isShowing, toggle } = useModal();

  // const addClamToFarm = (clam) => {
  //   // clams.push(clam);
  //   setClams((k) => [...k, clam]);
  // };

  const getClamDna = async (account, index) => {
    // console.log("getClamDna", { index });
    const tokenId = await clamContract.getClamByIndex(account, index);
    const clamData = await clamContract.getClamData(tokenId);
    const { dna } = clamData;
    if (dna.length > 1) {
      const dnaDecoded = await getDNADecoded(dna);
      return { dna, dnaDecoded };
    }
  };

  useEffect(async () => {
    // wallet is connected and has clams
    if (address && clamBalance !== "0") {
      try {
        setLoading(true);

        let promises = [];
        for (let i = 0; i < parseInt(clamBalance); i++) {
          promises.push(getClamDna(address, i));
        }
        // parallel call to speed up
        const clams = await Promise.all(promises);
        setClams(clams);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log({ error });
      }
    }
  }, [address, clamBalance]);

  useAsync(async () => {
    updateCharacter({
      name: "tanja",
      action: "saferoom.connect.text",
      button: {
        text: undefined,
        // text: "Ok",
        // alt: {
        //   action: "cb",
        //   dismiss: true,
        //   destination: () => {
        //     setShowClams(true);
        //   },
        // },
      },
    });
  });

  useEffect(() => {
    clams.forEach((clam) => {
      const clamImg = localStorage.getItem(clam.dna);
      clam.img = clamImg || ClamUnknown;
    });
  }, [isShowing]);

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="loading-elems">
            <img src={clamIcon} />
            <p>Loading...</p>
          </div>
        </div>
      )}
      <Web3Navbar />
      {/* container */}
      <div className="saferoom-bg w-full h-screen flex items-center overflow-hidden fixed bg-gradient-to-t from-blue-400 to-green-500">
        <video autoPlay muted loop className="flex-1 h-full w-full md:flex relative z-10 object-cover object-center">
          <source src={process.env.PUBLIC_URL + "/location_vids/saferoom_animated.mp4"} type="video/mp4" />
          <source
            src={process.env.PUBLIC_URL + "/location_vids/saferoom_animated_webm.webm"}
            type='video/webm; codecs="vp8, vorbis"'
          />
          <img src={videoImage} title="Your browser does not support the video"></img>
        </video>
      </div>
      {/* <ReactPlayer
          className="flex-1 h-full w-full md:flex relative z-10 object-cover object-center"
          width='100%'
          height='100%'
          playing={true}
          muted={true}
          loop={true}
          url={process.env.PUBLIC_URL + "/location_vids/saferoom_animated.mp4"} /> */}

      {/* chat character   */}
      {!address && <Character name="tanja" />}

      <Modal isShowing={isShowing} onClose={toggle}>
        <ClamView {...selectedClam} />
      </Modal>
      {address && (
        <div className="flex-1 min-h-full min-w-full flex relative z-20  justify-center items-start">
          <div className="w-4/5 flex flex-col relative pt-24">
            {/* navbar */}
            <div className="w-full bg-white shadow-md rounded-xl mx-auto flex flex-row justify-between">
              <div className="px-3 py-2">
                <h2 className="text-blue-700 font-semibold text-4xl mb-2">My Saferoom</h2>
                <p className="text-yellow-700">All you minted NFTs</p>
              </div>

              <div className="px-3 py-2 flex justify-between">
                <button className="text-blue-700 hover:underline px-5">All</button>
                <Link
                  to="/clam-presale"
                  className="bg-blue-700 hover:bg-blue-500 text-white rounded-xl shadow-md px-5 py-6"
                >
                  Shop
                </Link>
              </div>
            </div>

            {/* clams and pears grid */}
            <div className="w-full my-4 overflow-auto" style={{ height: "50rem" }}>
              {clams && clams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-20">
                  {clams &&
                    clams.map((clam, i) => (
                      <div
                        onClick={() => {
                          setSelectedClam(clam);
                          toggle();
                        }}
                        key={i}
                      >
                        <ClamItem {...clam} />
                      </div>
                    ))}

                  {/* {PEARLS &&
                     PEARLS.map((pearl, i) => (
                       <PearlItem key={i} pearl={pearl} />
                     ))} */}
                </div>
              ) : (
                <div className="w-full bg-white shadow-md rounded-xl text-center text-2xl p-5 text-black">
                  You&#39;ve got no clams &#128542;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const mapToProps = (state) => state;
export default connect(mapToProps, actions)(Saferoom);

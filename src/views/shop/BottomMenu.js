import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import mobileClamIcon from "assets/img/clam-icon-outline.png";
import mobilePearlsIcon from "assets/img/pearls-icon-outline.png";
import mobileMapIcon from "assets/img/map.png";
import mobileSearchIcon from "assets/img/search.png";

const BottomMenu = ({setModalToShow, setUserReady}) => {

  return (
      <>
      
        <div className="bottom_menu border-t border-blue-700 py-2">
            <div className="menu_item active">
                <Link to="/">
                    <img src={mobileMapIcon} alt="" />
                    <p>Map</p>
                </Link>
            </div>
            <div className="menu_item">
                <Link to="#" onClick={(e) => { setModalToShow("buy"); setUserReady(true); } }>
                    <img src={mobileClamIcon} alt="" />
                    <p>Buy <br/>Clams</p>
                </Link>
            </div>
            <div className="menu_item">
                <Link to="#" onClick={(e) => { setModalToShow("harvest"); setUserReady(true); } }>
                    <img src={mobilePearlsIcon} alt="" />
                    <p>Harvest <br/>Clam</p>
                </Link>
            </div>
            <div className="menu_item">
                <Link to="/saferoom" >
                    <img src={mobileSearchIcon} alt="" />
                    <p>View <br/>Saferoom</p>
                </Link>
            </div>
        </div>

      </>
  );
};

export default BottomMenu;
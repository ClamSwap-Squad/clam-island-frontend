import { useEffect } from "react";
import { connect } from "redux-zero/react";

import { actions } from "../../../store/redux";

const AppDisabledSpeech = ({ updateCharacter }) => {
  useEffect(() => {
    updateCharacter({
      name: "diego",
      action: "appDisabled.text",
      button: {
        text: "More Info",
        alt: {
          action: "url",
          destination: "https://clamisland.medium.com/clam-island-bivalvia-update-d34839c679a4",
        },
      },
    });
  }, []);
  return null;
};

export default connect(undefined, actions)(AppDisabledSpeech);

import React from "react";
import { TourProvider } from "@reactour/tour";
import { useLocalStorage } from "react-use";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import { BANK_TOUR_STORAGE_KEY } from "constants/ui";
import { GuidedTourButton } from "components/three/mapGuider/GuidedTourButton";
import { BUTTONS } from "components/characters/constants";
import { CHARACTERS } from "components/characters/constants";

import { BankTour } from "./BankTour";
import { STEPS } from "./constants";
import { WelcomeUserBack } from "../character/WelcomeUserBack";

import "./bankTourStyles.scss";

const disableBody = () => disableBodyScroll(document.body);
const enableBody = () => enableBodyScroll(document.body);

const charImg = CHARACTERS.tanja.charImg;

export const BankTourProvider = (props) => {
  const { children, isPoolsLoaded, state } = props;
  const [bankTourInfo, setBankTourInfo] = useLocalStorage(BANK_TOUR_STORAGE_KEY);
  const isBankTourPassed = bankTourInfo?.isCompleted;

  const finishTour = () => {
    state.setIsCharacterVisible(true);
    setTimeout(() => {
      state.updateCharacter({
        name: "tanja",
        action: "bankTour.step13.text",
        button: {
          text: BUTTONS.bankTour.step13.next,
          alt: {
            action: "cb",
            destination: () => {
              WelcomeUserBack({
                suppressSpeechBubble: true,
                updateCharacter: state.updateCharacter,
              });
              setBankTourInfo({ isCompleted: true });
            },
          },
        },
      });
    }, 300);
  };

  const onNextClick = (currentStep, setIsOpen) => {
    if (currentStep === 14) {
      setIsOpen(false);
      finishTour();
    } else {
      setBankTourInfo({ step: `${currentStep + 1}` });
    }
  };
  const onClickHighlighted = () => {
    if (bankTourInfo?.step === "2") {
      setBankTourInfo({ step: "3" });
    }
  };

  const Content = (props) => {
    const { nextButton: NextButton, currentStep, steps } = props;

    return (
      <div className="relative">
        <div className="bank-character-container-round">
          <img src={charImg} className="character" />
        </div>
        <div>{steps[currentStep].content}</div>
        <div className="flex justify-end mt-2">
          <NextButton
            {...props}
            Button={({ onClick }) => (
              <button className="btn btn-secondary" onClick={onClick}>
                {steps[currentStep].buttonText}
              </button>
            )}
          />
        </div>
      </div>
    );
  };

  return (
    <TourProvider
      steps={STEPS}
      onClickMask={() => {}}
      scrollSmooth
      nextButton={({ Button, currentStep, stepsLength, setIsOpen, setCurrentStep }) => {
        if ([0, 2].includes(currentStep)) {
          return null;
        }
        return <Button onClick={() => onNextClick(currentStep, setIsOpen)} />;
      }}
      disableInteraction={bankTourInfo?.step !== "0"}
      highlightedMaskClassName={bankTourInfo?.step === "2" ? "cursor-pointer" : ""}
      onClickHighlighted={onClickHighlighted}
      showBadge={false}
      afterOpen={disableBody}
      beforeClose={enableBody}
      styles={{
        popover: base => ({
          ...base,
          padding: 10,
          borderRadius: 10,
        }),
      }}
      ContentComponent={Content}
    >
      {children}
      {!isBankTourPassed && isPoolsLoaded && (
        <BankTour
          info={bankTourInfo}
          setInfo={setBankTourInfo}
          state={state}
          isConnected={state.isConnected}
        />
      )}
      {isBankTourPassed && <GuidedTourButton setIsGuidedTourPassed={() => setBankTourInfo(null)} />}
    </TourProvider>
  );
};

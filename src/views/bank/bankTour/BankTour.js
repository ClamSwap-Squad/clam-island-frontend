import { useEffect } from "react";
import { useTour } from "@reactour/tour";
import { BUTTONS } from "components/characters/constants";
import { WelcomeUserBack } from "../character/WelcomeUserBack";

export const BankTour = (props) => {
  const { info, setInfo, state, isConnected } = props;
  const { isOpen, currentStep, setIsOpen, setCurrentStep } = useTour();

  const cancel = () => {
    this.updateCharacter({
      name: "tanja",
      action: "bankTour.cancel.text",
      button: {
        text: BUTTONS.bankTour.cancel.next,
        alt: {
          action: "cb",
          destination: () => {
            this.setInfo({ isCompleted: true });
            WelcomeUserBack({ suppressSpeechBubble: true, updateCharacter: this.updateCharacter });
          },
        },
      },
    });
  };

  useEffect(() => {
    const setMaskOpen = () => {
      if (!isOpen) {
        setIsOpen(true);
      }
    };

    if (info?.step === "0") {
      setMaskOpen();
      return;
    }

    if (!state.isCharacterVisible && info?.step && parseInt(info.step) !== currentStep) {
      switch (info?.step) {
        case "3": {
          if (!document.getElementById("BuyBNBTabButton")) {
            document.getElementById("TokenExchangeButton").click();
          }
          setCurrentStep(3);
          setMaskOpen();
          break;
        }
        case "4": {
          {
            if (!document.getElementById("BuyBNBTabButton")) {
              document.getElementById("TokenExchangeButton").click();
            }
            setCurrentStep(4);
            setMaskOpen();
          }
          break;
        }
        case "5": {
          if (!document.getElementById("ExchangeTabButton")) {
            document.getElementById("TokenExchangeButton").click();
          }
          setTimeout(() => {
            if (!document.getElementById("ExchangeLinksBlock")) {
              document.getElementById("ExchangeTabButton").click();
            }
            setCurrentStep(5);
            setMaskOpen();
          }, 300);
          break;
        }
        case "6": {
          if (document.getElementById("BuyBNBTabButton")) {
            document.getElementById("TokenExchangeButton").click();
          }
          setCurrentStep(6);
          setMaskOpen();
          break;
        }
        case "9": {
          if (!document.getElementById("PoolDepositTab")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(9);
          setMaskOpen();
          break;
        }
        case "10": {
          if (!document.getElementById("DepositGemButton")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(10);
          setMaskOpen();
          break;
        }
        case "11": {
          if (!document.getElementById("HarvestRewardsInfo")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(11);
          setMaskOpen();
          break;
        }
        case "12": {
          if (!document.getElementById("PoolHarvestButton")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(12);
          setMaskOpen();
          break;
        }
        case "13": {
          if (!document.getElementById("PoolHarvestButton")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(13);
          setMaskOpen();
          break;
        }
        case "14": {
          if (!document.getElementById("PoolBoostRewardsButton")) {
            document.getElementById("PoolItem-0").click();
          }
          setCurrentStep(14);
          setMaskOpen();
          break;
        }
        default: {
          setCurrentStep(parseInt(info.step));
          setMaskOpen();
        }
      }
    }
  }, [info?.step, currentStep, isOpen, state.isCharacterVisible]);

  useEffect(() => {
    if (info?.step === "0" && isConnected) {
      setInfo({ step: "1" });
    }
  }, [info, isConnected]);

  useEffect(() => {
    if (!info) {
      state.updateCharacter({
        name: "tanja",
        action: "bankTour.start.text",
        button: {
          text: BUTTONS.bankTour.start.alt,
          alt: {
            action: "cb",
            destination: () => {
              cancel();
            },
          },
        },
        buttonAlt: {
          text: BUTTONS.bankTour.start.next,
          alt: {
            action: "cb",
            destination: () => {
              setInfo({ step: "0" });
              state.setIsCharacterVisible(false);
            },
          },
        },
      });
    } else {
      if (info?.step) {
        state.updateCharacter({
          name: "tanja",
          action: "bankTour.proceed.text",
          button: {
            text: BUTTONS.bankTour.proceed.alt,
            alt: {
              action: "cb",
              destination: () => {
                cancel();
              },
            },
          },
          buttonAlt: {
            text: BUTTONS.bankTour.proceed.next,
            alt: {
              action: "cb",
              destination: () => {
                state.setIsCharacterVisible(false);
              },
            },
          },
        });
      }
    }
  }, []);
  return null;
};

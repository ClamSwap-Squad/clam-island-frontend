import React from "react";

import { BANK_SPEECH } from "components/characters/constants/speeches/bank";

export const STEPS = [
  {
    selector: "#connectWalletButton",
    content: <p>{BANK_SPEECH.bankTour.step1.text}</p>,
    buttonText: "Connect Wallet",
  },
  {
    selector: "#NavInfoBlock",
    content: <p>{BANK_SPEECH.bankTour.step2.text}</p>,
    resizeObservables: ["#NavInfoBlock"],
    buttonText: "Gotcha",
  },
  {
    selector: "#TokenExchangeButton",
    content: <p>{BANK_SPEECH.bankTour.step3.text}</p>,
    resizeObservables: ["#TokenExchangeButton"],
    buttonText: "",
  },
  {
    selector: "#BuyBNBTabButton",
    content: <p>{BANK_SPEECH.bankTour.step4.text}</p>,
    buttonText: "Cool",
  },
  {
    selector: "#ExchangeTabButton",
    content: <p>{BANK_SPEECH.bankTour.step5.text}</p>,
    buttonText: "OK",
  },
  {
    selector: "#ExchangeLinksBlock",
    content: <p>{BANK_SPEECH.bankTour.step6.text}</p>,
    buttonText: "Awesome",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step7_1.text}</p>,
    buttonText: "Great!",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step7_2.text}</p>,
    buttonText: "Cool!",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step7_3.text}</p>,
    buttonText: "Got it",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step8.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]'],
    highlightedSelectors: ["#PoolDepositTab"],
    buttonText: "Great!",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step9.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]'],
    highlightedSelectors: ["#DepositGemButton"],
    buttonText: "Cool!",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step10.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]', "#HarvestRewardsInfo"],
    highlightedSelectors: ["#HarvestRewardsInfo"],
    buttonText: "Awesome",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step11_1.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]', "#HarvestRewardsInfo"],
    highlightedSelectors: ["#PoolHarvestButton"],
    buttonText: "Gotcha",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step11_2.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]', "#HarvestRewardsInfo"],
    highlightedSelectors: ["#PoolHarvestButton"],
    buttonText: "Cool!",
  },
  {
    selector: "#PoolItem-0",
    content: <p>{BANK_SPEECH.bankTour.step12.text}</p>,
    mutationObservables: ['[data-tour="Pool-data"]'],
    resizeObservables: ['[data-tour="Pool-data"]', "#HarvestRewardsInfo"],
    highlightedSelectors: ["#PoolHarvestButton"],
    buttonText: "Understood!",
  },
];

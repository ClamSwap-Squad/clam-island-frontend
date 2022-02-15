export const BANK_SPEECH = {
  bank: {
    connect: {
      text: "Welcome to Clam Island Bank! You’ll need to connect your wallet using the button on the top right of your screen in order to invest with us.",
      next: false,
      dismiss: true,
      skip: false,
    },
    connect_no_wallet: {
      text: "Welcome to Clam Island Bank! It looks like you don’t have a blockchain wallet installed. You will need one in order to invest with us.",
      next: false,
      dismiss: true,
      skip: false,
    },
    connect_wrong_chain: {
      text: "Welcome to Clam Island Bank! In order to invest with us, you will need to switch your wallet to Binance Smart Chain.",
      next: false,
      dismiss: true,
      skip: false,
    },
    welcome: {
      text: "Welcome back to Clam Island Bank! Please let me know if you need help with anything.",
      next: false,
      dismiss: true,
      skip: true,
      hideable: true,
    },
    welcome_back: {
      text: "Hello again! Can I help you with anything?",
      next: false,
      dismiss: true,
      skip: true,
      hideable: true,
    },
    acknowledge_no_help_needed: {
      text: "No problem, happy investing! Just talk to me if you do need any help.",
      next: false,
      dismiss: true,
      skip: true,
      hideable: true,
    },
    help_needed: {
      text: "We are currently working on an explainer video, in the meantime please refer to our Visitor’s Guide. In the future the video will be part of the Visitor’s Information Centre.",
      next: false,
      dismiss: true,
      skip: false,
      hideable: true,
    },
    process_transaction: {
      text: "Please wait while we process your transaction. Please note, your wallet may ask you to approve two transactions one after the other - please approve both transactions if that occurs.",
      next: false,
      dismiss: true,
      skip: false,
    },
    transaction_error: {
      text: "We’re sorry, something went wrong and your transaction could not be processed. Funds have not been removed. Please try again later.",
      next: false,
      dismiss: true,
      skip: false,
      hideable: true,
    },
    transaction_success: {
      text: "Congratulations, your transaction was successful!",
      next: false,
      dismiss: true,
      skip: true,
      hideable: true,
    },
    deposit_fee_alert: {
      text: "Please note, this pool has a deposit fee, which is deducted on deposit and not refundable. Do you want to proceed?",
      next: false,
      dismiss: true,
      skip: false,
    },
    withdraw_pearl_rewards_alert: {
      text: "You still have pending Pearl reward boosts available. Withdrawing now will cause your boosted rewards to be reduced proportionally. Are you sure you want to withdraw?",
      next: false,
      dismiss: true,
      skip: false,
    },
    pearl_boost_yield_alert: {
      text: "This will destroy your Pearl in return for the investment boost, and is irreversible. Do you want to continue?",
      next: false,
      dismiss: true,
      skip: false,
    },
    burn_pearl_confirmation: {
      text: "This will forfeit your Pearl. This is irreversible and you will not be able to get your Pearl back. Are you sure you want to continue?",
      next: false,
      dismiss: true,
      skip: false,
    },
    burn_pearl_without_max_gem_yield_confirmation: {
      text: ({ timer }) =>
        `This Pearl is not available for max GEM Yield for another ${timer}. Exchanging it now will mean that you can only receive 50% of its max GEM Yield. Are you sure you want to proceed?`,
      next: false,
      dismiss: true,
      skip: false,
    },
    forfeit_pearl: {
      text: ({ fullReward }) =>
        `This will exchange your Pearl in return for ${fullReward} GEM Yield. You can choose to receive your full GEM Yield streamed linearly over 30 days, or you can forfeit half in order to receive your GEM Yield now. How do you want to proceed?`,
      next: false,
      dismiss: true,
      skip: false,
    },
    burn_pearl_success: {
      text: ({ forfeit }) =>
        `All done! Your Pearl has been forfeited and your $GEM boost ${
          forfeit ? "has been transferred" : "is now streaming"
        }.`,
      next: false,
      dismiss: true,
      skip: false,
    },
    stream_burn_pearl_success: {
      text: ({ fullReward }) =>
        `Your pearl has been exchanged successfully for a stream of ${fullReward} GEM over 30 days. Any streamed amount will be automatically collected when you harvest from any investment pool. You can check the vesting breakdown to see any remaining amount to be streamed.`,
      next: false,
      dismiss: true,
      skip: false,
    },
    instant_burn_pearl_success: {
      text: ({ halfReward }) =>
        `Your pearl has been exchanged successfully for ${halfReward} GEM! The amount should be available in your wallet.`,
      next: false,
      dismiss: true,
      skip: false,
    },
  },
  bankTour: {
    start: {
      text: "Welcome to Clam Island Bank! I see that this is your first time here. Would you like a tour?",
    },
    cancel: {
      text: "Ok, I’ll let you look around on your own. You can always go for the tour later by clicking the tour icon on the bottom left, next to the map icon.",
    },
    proceed: {
      text: "Welcome back, traveller! You didn’t finish your tour with me last time. Would you like to continue?",
    },
    step1: {
      text: "Great! First, let’s connect your blockchain wallet. If you don’t have one and need some guidance to set it up, please follow this guide and connect to Binance Smart Chain (BSC).",
    },
    step2: {
      text: "Great, your wallet is now connected! You can now see some stats on the top right of your screen. You can hover over or click the icons to see what they represent.",
    },
    step2Alt: {
      text: "I see that you have connected your wallet already! That means you will be able to see some stats on the top right of your screen. You can hover over or click the icons to see what they represent.",
    },
    step3: {
      text: "Ok, let’s take a look at the token exchange. Please click the button to continue.",
    },
    step4: {
      text: "This is where you can buy the Clam Island native tokens, $GEM and $SHELL, and to exchange various other tokens. But in order to do that, you will first need some BNB. If you don’t have any, you can buy BNB in this tab.",
    },
    step5: {
      text: "Once you have some BNB, you can then go to the “Exchange” Tab to then exchange BNB for other tokens on BSC, and vice versa.",
    },
    step6: {
      text: "We will soon have a fully functional integrated exchange, but until then, you can click here to exchange BNB for $GEM and $SHELL, or any other BSC tokens, through our partner Bogged Finance.",
    },
    step7_1: {
      text: "To invest in one of our yield pools, you need to first exchange BNB for the relevant token. For the tour, we will assume that you purchased some $GEM, which is the Clam Island in-game currency. If you want to buy Clams and farm Pearls, you will definitely need to get yourself some!",
    },
    step7_2: {
      text: "The information you see here will tell you the projected returns on your investment. Each pool will have different APR as well as different risk. Our native token pools are considered high volatility because we are relatively new and do not have as much liquidity as well-established blue-chip cryptocurrency tokens, but they also yield the highest projected APR!",
    },
    step7_3: {
      text: "However, please remember that the projected APR does not take into account fluctuations in the price of the assets you are depositing into a yield pool",
    },
    step8: {
      text: "To deposit the relevant asset into a yield pool, simply click here, enter the desired amount or use the percentage slider, and then click the deposit button.",
    },
    step9: {
      text: "Once you click this deposit button, your blockchain wallet will prompt you to execute a transaction. If this is the first time you are depositing, you may be prompted to execute two transactions one after the other. Simply confirm the transaction/s, wait for me to notify you that the deposit was successful, and you’re done!",
    },
    step10: {
      text: "Once you deposit into a yield pool, you will start earning yield in $GEM, which will be displayed here.",
    },
    step11_1: {
      text: "Your yield will continue accruing in the Bank until you click this button, which then transfers the yield to your wallet. Please note, every time you collect yield, you will only get 50% of your $GEM earned upfront, with the remaining 50% locked for 7 days before you can collect it to your wallet.",
    },
    step11_2: {
      text: "The locked $GEM earned can still be used to purchase a Clam over at Diego’s Clam Shop though! We definitely recommend checking it out. Not only is it a lot of fun to buy, farm and trade Clams, they actually also have higher average APR than any yield pools in the Bank!",
    },
    step12: {
      text: "If you did farm some Pearls with Diego’s Clams, you will be able to use those Pearls to redeem $GEM yield here. I won’t go through this menu in this tour, but once you have at least one Pearl, come back and click this button, and I can walk you through it.",
    },
    step13: {
      text: "And that brings us to the end of the tour! If you have any more questions about the Bank or Clam Island in general, you can try visiting Janet over at the Infocenter. Good luck and have fun!",
    },
  },
};

export const BANK_BUTTONS = {
  bank: {
    transaction_error: {
      next: "OK",
      alt: false,
    },
    deposit_fee_alert: {
      next: "OK",
      alt: false,
    },
    withdraw_pearl_rewards_alert: {
      next: "OK",
      alt: false,
    },
    pearl_boost_yield_alert: {
      next: "OK",
      alt: false,
    },
  },
  bankTour: {
    start: {
      next: "Sure!",
      alt: "No thanks",
    },
    cancel: {
      next: "OK",
    },
    proceed: {
      next: "Sure!",
      alt: "No thanks",
    },
    step1: {
      next: "Connect Wallet",
      alt: "Go to Guide",
    },
    step2: {
      next: "Gotcha",
    },
    step4: {
      next: "Cool",
    },
    step5: {
      next: "OK",
    },
    step6: {
      next: "Awesome",
    },
    step7_1: {
      next: "Great!",
    },
    step7_2: {
      next: "Cool!",
    },
    step7_3: {
      next: "Got it",
    },
    step8: {
      next: "Great!",
    },
    step9: {
      next: "Cool!",
    },
    step10: {
      next: "Awesome",
    },
    step11_1: {
      next: "Gotcha",
    },
    step11_2: {
      next: "Cool!",
    },
    step12: {
      next: "Understood!",
    },
    step13: {
      next: "Finish Tour",
    },
  },
};

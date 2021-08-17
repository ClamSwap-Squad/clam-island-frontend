module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      'not-allowed': 'not-allowed',
      grab: 'grab',
      grabbing: 'grabbing',
    },
    maxHeight: {
      159: "36em",
      160: "40em",
    },
    extend: {
      minWidth: {
        xs: "15rem",
      },
      maxWidth: {
        canvas: '400px',
      },
      height: {
        canvas: '400px',
      },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      cursor: ['active'],
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    base: false,
    themes: ["emerald"],
  },
};

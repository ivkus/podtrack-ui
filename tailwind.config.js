module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#2563eb",    // 蓝色
          secondary: "#7c3aed",  // 紫色
          accent: "#0ea5e9",     // 浅蓝
          neutral: "#374151",    // 深灰
          "base-100": "#ffffff", // 白色
          "base-200": "#f3f4f6", // 浅灰背景
          "base-300": "#e5e7eb", // 中灰
          "base-content": "#1f2937", // 主文本色
        }
      }
    ],
  }
}
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        psl: { gold: '#D4A843', primary: '#1E40AF', secondary: '#3B82F6', light: '#F8FAFC', card: '#FFFFFF', accent: '#D4A843', green: '#10B981', red: '#EF4444', gray: '#6B7280', border: '#E5E7EB' },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

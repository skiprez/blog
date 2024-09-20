import "./styles/globals.css";
import Navigation from "./components/Navigation.jsx"
import More from "./components/More.jsx"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-600 flex flex-row">
        <Navigation />
        {children}
        <More />
      </body>
    </html>
  );
}

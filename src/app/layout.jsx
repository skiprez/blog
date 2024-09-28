import "./styles/globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-600 flex flex-row justify-around">
        {children}
      </body>
    </html>
  );
}

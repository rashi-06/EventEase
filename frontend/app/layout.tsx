import "./globals.css";
import { ThemeProvider } from "./lib/themeProvider";
import { ReactQueryProvider } from "./lib/reactQueryProvider";
import Navbar from "./components/layout/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ReactQueryProvider>
            <Navbar />
            {children}
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

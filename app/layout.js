import ClientLayout from "./ClientLayout";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "Social Media",
  description: "Build networks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}

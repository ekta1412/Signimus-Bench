import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Import the new Sidebar component

export const metadata: Metadata = {
  title: "Bench App",
  description: "A suite of tools for IT resource management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <head>
            {/* Google Analytics */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
            <script dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXXXXX');
              `,
            }} />
            {/* Microsoft Clarity */}
            <script type="text/javascript" dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/XXXXXXXXX";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "XXXXXXXXX");
              `,
            }} />
      </head>
      <body
        className="font-sans antialiased flex" // Added flex to body
      >
        {/* Sidebar */}
        <Sidebar /> {/* Use the Sidebar component */}

        {/* Main content area */}
        <div className="flex-1 flex flex-col ml-64">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}

'use client'

import "./styles/globals.css";
import Image from 'next/image'
import bg from "./../public/images/bg-blog.png";

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <head>
          <title>Tech Threads</title>
          <link rel="shortcut icon" href="/images/favicon.ico" type="image/x-icon" />
        </head>
        <body className="flex flex-row justify-around">
          <Image 
            src={bg}
            placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              zIndex: '-1',
              objectFit: 'cover',
            }}
          />
          {children}
        </body>
      </html>
  );
}

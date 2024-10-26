import { NextResponse } from 'next/server';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
});

client.connect();

const allowedDomains = [
  'imgs.search.brave.com',                  // Brave Search
  'encrypted-tbn0.gstatic.com',             // Google Images (thumbnails)
  'encrypted-tbn1.gstatic.com',             // Google Images (thumbnails)
  'encrypted-tbn2.gstatic.com',             // Google Images (thumbnails)
  'encrypted-tbn3.gstatic.com',             // Google Images (thumbnails)
  'www.google.com',                          // Google
  'www.bing.com',                            // Bing
  's.yimg.com',                              // Yahoo Images
  'images.unsplash.com',                     // Unsplash
  'cdn.pixabay.com',                         // Pixabay
  'external-content.duckduckgo.com',        // DuckDuckGo
  'www.flickr.com',                          // Flickr
  'cdn.discordapp.com',                      // Discord
  'i.imgur.com',                             // Imgur
  'images.pexels.com',                       // Pexels
  'source.unsplash.com',                     // Unsplash (direct link)
  'static.wikia.nocookie.net',              // Fandom
  'media.giphy.com',                         // Giphy
  'cdn.shopify.com',                         // Shopify
  'www.gstatic.com',                         // Google Static
  'www.facebook.com',                        // Facebook
  'www.instagram.com',                       // Instagram
  'pbs.twimg.com',                           // Twitter
  'upload.wikimedia.org',                    // Wikimedia
  'www.deviantart.com',                      // DeviantArt
  'www.canva.com',                           // Canva
  'cdn.wallpapersafari.com',                 // Wallpapersafari
  'www.redditstatic.com',                    // Reddit
  'i.pinimg.com',                            // Pinterest
  'images.freeimages.com',                   // FreeImages
  'static-assets.example.com',               // Example Static Asset
  'myexamplebucket.s3.amazonaws.com',       // Example S3 Bucket
  'res.cloudinary.com',                      // Cloudinary
  'assets-cdn.github.com',                   // GitHub Assets
  'upload.wikimedia.org',                    // Wikipedia
  'www.artstation.com',                       // ArtStation
  'wallhaven.cc',                            // Wallhaven
  'cdn.akamai.steamstatic.com',              // Steam
  'cdn.mysite.com',                          // MySite Assets
  'www.mediacdn.com',                        // Media CDN
  'www.thespruce.com',                       // The Spruce
  'images.unsplash.com',                     // Unsplash
  'img.youtube.com',                         // YouTube Thumbnails
  'cdn5.vectorstock.com',                    // VectorStock
  'images.ctfassets.net',                   // Contentful
  'd3d00suzq5v3s2.cloudfront.net',          // CloudFront
  'www.newyorker.com',                       // New Yorker
  'fpt.filepicker.io',                       // FilePicker
  'static-assets.example.com', 
];

export async function POST(req) {
  const { userId, newUsername, profile_picture_url } = await req.json();
  
  console.log("Received data:", { userId, newUsername, profile_picture_url });

  const url = new URL(profile_picture_url);
  const domain = url.hostname;

  if (!allowedDomains.includes(domain)) {
    return res.status(400).json({ error: 'Invalid image source. Please upload images from allowed sources.' });
  }

  try {
    const query = 'UPDATE users SET username = $1, profile_picture_url = $2 WHERE id = $3';
    const values = [newUsername, profile_picture_url || null, userId];
    const result = await client.query(query, values);

    console.log("Update query executed. Rows affected:", result.rowCount);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Username updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database update error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
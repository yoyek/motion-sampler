/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      '*.ytimg.com', // Youtube
      '*.jtvnw.net', // Twitch
      '*.vimeocdn.com', // Vimeo
      '*.sndcdn.com', // SoundCloud
      '*.fbcdn.net', // Facebook
      '*.dmcdn.net', // Dailymotion
      '*.mixcloud.com', // Mixcloud
    ].map(hostname => ({
      hostname,
      protocol: 'https',
      port: '',
    }))
  },
}

module.exports = nextConfig

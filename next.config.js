/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'spoonacular.com', pathname: '/**' },
      { protocol: 'https', hostname: 'loremflickr.com', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'theplantbasedschool.com', pathname: '/**' },
      { protocol: 'https', hostname: 'frommybowl.com', pathname: '/**' },
      { protocol: 'https', hostname: 'minimalistbaker.com', pathname: '/**' },
      { protocol: 'https', hostname: 'sweetpotatosoul.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plantyou.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plantbasedrdblog.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plantbasedonabudget.com', pathname: '/**' },
      { protocol: 'https', hostname: 'itdoesnttastelikechicken.com', pathname: '/**' },
      { protocol: 'https', hostname: 'thatveganbabe.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.loveandlemons.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.loveandlemons.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i0.wp.com', pathname: '/**' },
    ],
  },
}

module.exports = nextConfig

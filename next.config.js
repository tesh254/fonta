module.exports = {
  async headers() {
    return [
      {
        source: `/api/host/:font_id`,
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css'
          }
        ]
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/bee.js',
        destination: 'https://cdn.splitbee.io/sb.js'
      },
      {
        source: '/_hive/:slug',
        destination: 'https://hive.splitbee.io/:slug'
      }
    ];
  }
};

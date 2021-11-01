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
  }
};

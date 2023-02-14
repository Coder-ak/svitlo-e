module.exports = {
  apps: [
    {
      name: 'svitloe',
      script: 'dist/server/index.js',
      watch: ['dist/server'],
      watch_delay: 1000,
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "smsWorker",
      script: "dist/worker/smsWorker.js",
      watch : false
    },
    {
        name: "emailWorker",
        script: "dist/worker/emailWorker.js",
        watch : false
    },
    {
        name: "server",
        script: "dist/index.js",
        watch : false
    },
  ],
};

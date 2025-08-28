const workerName = process.env.WORKER_NAME || "wdcc-uabc-frontend"

export default {
  $schema: "node_modules/wrangler/config-schema.json",
  main: ".open-next/worker.js",
  name: workerName,
  compatibility_date: "2024-12-30",
  compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"],
  assets: {
    directory: ".open-next/assets",
    binding: "ASSETS",
  },
  services: [
    {
      binding: "WORKER_SELF_REFERENCE",
      service: workerName,
    },
  ],
}

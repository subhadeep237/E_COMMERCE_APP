import NodeCache from "node-cache";

// Cache for 5 minutes by default
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check every 60 seconds for expired keys
  useClones: false, // Better performance
});

export default cache;
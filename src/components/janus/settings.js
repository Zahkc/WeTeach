// Global settings for the react application.

// Server running janus for routing traffic to.

export const server = "https://weteach.ddns.net:8089/janus";

// Change when dev testing API on localhost
export const mediaserver = "https://weteach.ddns.net/";

export const dbdaemon = process.env.NODE_ENV === "production" ? "https://weteach.ddns.net/" : "http://localhost:5000";
export const uploaddaemon = process.env.NODE_ENV === "production" ? "https://weteach.ddns.net/ds/" : "http://localhost:5002";


// For future load scaling
var iceServers = null;

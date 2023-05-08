// Global settings for the react application.

// Server running janus for routing traffic to.

export const server = "https://weteach.ddns.net:8089/janus";

// Change when dev testing API on localhost
export const mediaserver = "https://weteach.ddns.net/";


// Dev
export const dbdaemon = "http://localhost:5000";

export const uploaddaemon = "http://localhost:5002";

// Build
//export const dbdaemon = "https://weteach.ddns.net/";
//export const uploaddaemon = "https://weteach.ddns.net/ds/";


// For future load scaling
var iceServers = null;

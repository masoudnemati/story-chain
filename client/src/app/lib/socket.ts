"use client";

import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? "https://example.com/"
    : "http://localhost:4000";

// please note that the types are reversed
export const socket = io(URL);

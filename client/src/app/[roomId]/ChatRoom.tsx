"use client";

import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export default function GameRoom({ roomId }: { roomId: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [words, setWords] = useState("");
  const [story, setStory] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });

      // Join the room
      socket.emit("join-room", roomId);
      console.log(`Joined room: ${roomId}`);
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on("update-story", (data: string) => {
        console.log("Data received: ", data);
        setStory((prevStory: string) => prevStory + " " + data);
      });

      // Cleanup to avoid multiple listeners being added
      return () => {
        socket.off("update-story");
      };
    }
  }, [socket]);

  async function handleFormSubmit(e: any) {
    e.preventDefault();
    const message = { roomId, words };
    console.log("Sending message: ", message);
    socket.timeout(5000).emit("send-words", message);
    setWords(""); // Clear the input field after submission
  }

  return (
    <div>
      <p>Room ID: {roomId}</p>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <hr />
      <p>{story}</p>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={words}
          onChange={(e: any) => setWords(e.target.value)}
        />
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

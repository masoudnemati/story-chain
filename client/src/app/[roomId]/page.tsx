import React from "react";
import ChatRoom from "./ChatRoom";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <div>
      <ChatRoom roomId={params.roomId} />
    </div>
  );
}

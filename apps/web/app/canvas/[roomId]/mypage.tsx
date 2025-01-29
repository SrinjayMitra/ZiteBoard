import React from "react";
import RoomCanvas from "./RoomCanvas";


interface DashboardProps {
  params: {
    roomId: string;
  };
}

const MyPage: React.FC<DashboardProps> = async ({ params }) => {
    const { roomId } = (await params); 
    console.log(roomId);
    const roomName = String(roomId);
    return (
      <div>
        <RoomCanvas roomId={roomName} />
      </div>
    );

};

export default MyPage;

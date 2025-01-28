import React from "react";
import  Mycanvas  from "./canvas";
import RoomCanvas from "./RoomCanvas";
// import MycanvasCPY from "./socketCanvas";

// Correcting the component definition with type for params
interface DashboardProps {
  params: {
    roomId: string;
  };
}

const Dashboard: React.FC<DashboardProps> =  async ({ params }) => {
  const {roomId} = (await params);
  console.log(roomId);
  return (
    <div>
      {/* <Mycanvas type="rect" text="hello" roomId={roomId}/> */}
      {/* <Mycanvas type="rect" text="hello" roomId={roomId}/> */}
      <RoomCanvas type="round-rect" roomId={roomId}/>
    </div>
  );
}

export default Dashboard;

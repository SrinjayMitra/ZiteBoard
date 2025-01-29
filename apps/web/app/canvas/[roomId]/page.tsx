// "use client";
// import MyPage from "./mypage";
// interface PageProps {
//   params: {
//     roomId: string;
//   };
// }
// export default function Page({ params }: PageProps) {
//   if (!params?.roomId) {
//     return <div>Error: Room ID is missing.</div>;
//   }
//   return <MyPage params={params} />;
// }


// import React from "react";
// import RoomCanvas from "./RoomCanvas";


// interface DashboardProps {
//   params: {
//     roomId: string;
//   };
// }

// const MyPage: React.FC<DashboardProps> = async ({ params }) => {
//     const { roomId } = (await params); 
//     console.log(params);
//     // console.log(roomId);
//     const roomName = String(roomId);
//     return (
//       <div>
//         <RoomCanvas roomId={roomName} />
//       </div>
//     );

// };

// export default MyPage;

'use client'

import React from 'react'
import RoomCanvas from './RoomCanvas'
import { useParams } from 'next/navigation'

interface DashboardProps {}

const MyPage: React.FC<DashboardProps> = () => {
  // Get the roomId from the URL using useParams hook
  const { roomId } = useParams<{ roomId: string }>()

  console.log(roomId)

  // Ensure roomId is valid before rendering
  if (!roomId) {
    return <div>Room not found</div>
  }

  return (
    <div>
      <RoomCanvas roomId={roomId} />
    </div>
  )
}

export default MyPage



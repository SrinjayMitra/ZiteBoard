"use client";
import React from 'react';
import Modal from './modal';
import { useRouter } from 'next/navigation';
import { Folders } from 'lucide-react';

interface RoomsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: { id: string; name: string }[]; // Assuming rooms have an ID and a name
}

function RoomsModal({ isOpen, onClose, rooms }: RoomsModalProps) {
  const router = useRouter();

  const handleJoinRoom = (roomId: string) => {
    router.push(`/canvas/${roomId}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Rooms">
      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <Folders className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</h3>
              </div>
            </div>
            <button
              onClick={() => handleJoinRoom(room.name)}
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
            >
              Join Room
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default RoomsModal;
import React, { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketProvider';
import {useNavigate} from "react-router-dom"

const Lobby = () => {
    const [emailId, setEmailId] = useState(null);
    const [roomId, setRoomId] = useState(null);
    const navigate = useNavigate()
    const socket = useSocket()
    const handleSubmit= useCallback((e)=>{
        e.preventDefault()
        if(socket){
          socket.emit("room:join", {emailId,roomId})
          console.log("hey you coder", emailId, roomId)
          socket.emit("all:emails", {emailId,roomId});
        }
        
    },[emailId,roomId,socket])

    const handleJoinRoom=useCallback((data)=>{
        const {emailId, roomId} = data;
        console.log("data from backend", emailId, roomId)
        navigate(`/room/${roomId}`)
    },[navigate])

    useEffect(()=>{
        socket.on("room:join",handleJoinRoom);
        return()=>{
            socket.off("room:join",handleJoinRoom)
        }
    },[socket,handleJoinRoom])

  return (
    <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={emailId ? emailId : ""}
          onChange={(e)=>setEmailId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="john.doe@example.com"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="text" className="block text-gray-700 text-sm font-bold mb-2">
          Text
        </label>
        <input
          type="text"
          id="text"
          name="text"
          value={roomId ? roomId : ""}
          onChange={e=>setRoomId(e.target.value)}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
          placeholder="Enter text"
          required
        />
      </div>

      <div className="mb-6">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Lobby;

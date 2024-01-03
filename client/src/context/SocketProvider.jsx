import React, { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
export const SocketProvider = (props) => {
  // const socket = useMemo(() => io("http://192.168.1.14:8000"), []);
  const socket = useMemo(() => io("http://localhost:8000"), []);


  // const socket = useMemo(() => io("https://mint-parrot-namely.ngrok-free.app:8000"), []);


  // const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   const newSocket = io('http://192.168.1.14:8000', {
  //    // withCredentials: true, // Include credentials if needed
  //     extraHeaders: {
  //       'Access-Control-Allow-Origin': '*', // Replace * with your specific origin
  //       'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  //       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  //     },
  //   });

  //   // Add event listeners or perform actions with the socket

  //   // Cleanup when the component unmounts
  //   return () => {
  //     newSocket.disconnect();
  //   };
  // }, []); // Run once on component mount

  // useEffect(() => {
  //   setSocket(socket);
  // }, [socket]);

  

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};

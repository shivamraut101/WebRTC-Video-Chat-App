import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState();
  const [users, setUsers] = useState([]);
  const [allEmails, setAllEmails] = useState([]);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState()

  // function for when a new user joins in the room
  const handleNewUserJoined = useCallback(({ emailId, id }) => {
    console.log("new user joined the room", emailId);
    setRemoteSocketId(id);
  },[]);
  // function for mentioning the names of user in the room
  const handleNewUserEmails = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    console.log("from mention", newUser);
  };

  const printNewUserEmails = () => {
    setAllEmails(users);
    console.log("I am from Print Email");
  };

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall= useCallback(async({from, offer})=>{
    setRemoteSocketId(from);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream)
      console.log("Incomming Call", from, offer);
      const ans = await peer.getAnswer(offer)
      socket.emit("call:accepted",{to: from, ans})
      
    } catch (error) {
      console.log("Error :: handleIncommingCall :: ", error)
    }
    
  },[socket])

  const sendStreams = useCallback(()=>{
    for(const track of myStream.getTracks()){
      peer.peer.addTrack(track,myStream)
    }
  },[myStream])

  const handleCallAccepted=useCallback(({from,ans})=>{
    peer.setLocalDescription(ans);
    console.log("Call Accepted")
    sendStreams();
  },[sendStreams])

  

  const handleNegoNeeded=useCallback( async()=>{
      const offer = await peer.getOffer();
      socket.emit("peer:nego:needed", {offer, to: remoteSocketId})
  },[socket, remoteSocketId])

  useEffect(()=>{
    peer.peer.addEventListener("negotiationneeded",handleNegoNeeded);
    return()=>{
      peer.peer.removeEventListener("negotiationneeded",handleNegoNeeded);
    }
  },[handleNegoNeeded])

  useEffect(()=>{
    peer.peer.addEventListener('track', async (ev)=>{
      const remoteStream = ev.streams;
      console.log("Got tracks!!!")
      setRemoteStream(remoteStream[0])
    })
  },[])
  
  const handleNegoNeedIncomming = useCallback(async({from,offer})=>{
    const ans = await peer.getAnswer(offer);
    socket.emit("peer:nego:done",{to: from, ans})
  },[socket]);

  const handleNegoNeedFinal = useCallback(async({ans})=>{
    await peer.setLocalDescription(ans)
  },[])

  

  useEffect(() => {
    socket.on("user:joined", handleNewUserJoined);
    socket.on("show:all:emails", handleNewUserEmails);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted",handleCallAccepted)
    socket.on("peer:nego:needed", handleNegoNeedIncomming)
    socket.on("peer:nego:final",handleNegoNeedFinal)
    // handleNewUserEmails();
    printNewUserEmails();
    return () => {
      socket.off("user:joined", handleNewUserJoined);
      socket.off("show:all:emails", handleNewUserEmails);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted",handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final",handleNegoNeedFinal)
    };
  }, [
    socket,
    handleNewUserJoined,
    handleNewUserEmails,
    handleIncommingCall,
    setAllEmails,
    setUsers,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal
  ]);

  return (
    <>
      <div>
        <div className="flex flex-col items-center justify-center h-screen">
          <h4
            className={`text-lg font-semibold ${
              remoteSocketId ? "text-green-500" : "text-red-500"
            }`}
          >
            {remoteSocketId ? "You are connected" : "Not Connected"}
          </h4>
          
          {remoteSocketId && (
            <button
              onClick={handleCallUser}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Call
            </button>
          )}
          {myStream && (
            <div className="mt-4">
              <h4>Host Stream</h4>
              <ReactPlayer
                url={myStream}
                width={250}
                height={250}
                muted
                playing
                className="rounded-lg overflow-hidden"
              />
            </div>
          )}
          {remoteStream && (
            <div className="mt-4">
              <h4>Remote Stream</h4>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={sendStreams}>Accept Call</button>
              <ReactPlayer
                url={remoteStream}
                width={250}
                height={250}
                muted
                playing
                className="rounded-lg overflow-hidden"
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end absolute top-0 right-0 mr-4 mt-4">
        <h2 className="text-lg font-bold mb-2">User List</h2>
        <ul>
          {allEmails.map((user, index) => (
            <li key={index} className="mb-1">
              {user}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Room;

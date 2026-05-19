import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import socket from "../socket/socket";

function Dashboard() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  const [recentChats, setRecentChats] =
    useState([]);

  const [searchedUsers, setSearchedUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const messagesEndRef = useRef(null);


  // JOIN SOCKET ROOM
  useEffect(() => {

    socket.emit(
      "join_room",
      userInfo._id
    );

  }, []);


  // AUTO SCROLL
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);


  // LOAD RECENT CHATS
  useEffect(() => {

    const loadRecentChats = async () => {

      const response = await axios.get(
        `https://realtime-chat-web-app-ui2m.onrender.com/api/messages/recent/${userInfo._id}`
      );

      setRecentChats(response.data);

    };

    loadRecentChats();

  }, []);


  // RECEIVE LIVE MESSAGE
  useEffect(() => {

    socket.on("receive_message", (data) => {

      setMessages((prev) => [
        ...prev,
        data,
      ]);

    });

    return () => {
      socket.off("receive_message");
    };

  }, []);


  // LOAD OLD MESSAGES
  const loadMessages = async (user) => {

    setSelectedUser(user);

    const response = await axios.get(
      `https://realtime-chat-web-app-ui2m.onrender.com/api/messages/${userInfo._id}/${user._id}`
    );

    setMessages(response.data);

  };


  // SEARCH USERS
  const searchUsers = async (value) => {

    setSearch(value);

    if (!value.trim()) {

      setSearchedUsers([]);

      return;

    }

    const response = await axios.get(
      `https://realtime-chat-web-app-ui2m.onrender.com/api/users?search=${value}`
    );

    const filtered = response.data.filter(
      (u) => u._id !== userInfo._id
    );

    setSearchedUsers(filtered);

  };


  // SEND MESSAGE
  const sendMessage = () => {

    if (!message.trim()) return;

    if (!selectedUser) return;

    const messageData = {

      senderId: userInfo._id,

      receiverId: selectedUser._id,

      text: message,

    };

    socket.emit(
      "send_message",
      messageData
    );

    setMessage("");

  };


  return (
    <div className="h-screen bg-[#0f0f11] text-white flex overflow-hidden">


      {/* SIDEBAR */}
      <div
        className={`
          ${selectedUser ? "hidden md:flex" : "flex"}
          w-full md:w-[350px]
          bg-[#1a1a1d]
          border-r border-gray-800
          flex-col
        `}
      >


        {/* TOP */}
        <div className="p-5 border-b border-gray-800">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-2xl font-bold">
                Chats
              </h1>

              <p className="text-sm text-gray-400 mt-1">
                @{userInfo.username}
              </p>

            </div>

            <button
              onClick={() => {

                localStorage.clear();

                window.location.href =
                  "/login";

              }}

              className="bg-red-500 hover:bg-red-600 transition px-3 py-2 rounded-xl text-sm"
            >
              Logout
            </button>

          </div>

        </div>


        {/* SEARCH */}
        <div className="p-4">

          <input
            type="text"

            placeholder="Search username..."

            value={search}

            onChange={(e) =>
              searchUsers(e.target.value)
            }

            className="w-full bg-[#111] p-3 rounded-xl outline-none border border-gray-700"
          />

        </div>


        {/* USERS */}
        <div className="flex-1 overflow-y-auto">


          {/* RECENT CHATS */}
          {recentChats.map((user) => (

            <div
              key={user._id}

              onClick={() =>
                loadMessages(user)
              }

              className="p-4 border-b border-gray-800 hover:bg-[#232328] cursor-pointer transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold">
                    {user.username}
                  </h2>

                  <p className="text-sm text-gray-400 truncate w-[180px]">
                    {user.email}
                  </p>

                </div>

                <div
                  className={
                    user.isOnline
                      ? "w-3 h-3 bg-green-500 rounded-full"
                      : "w-3 h-3 bg-gray-500 rounded-full"
                  }
                ></div>

              </div>

            </div>

          ))}


          {/* SEARCH RESULTS */}
          {searchedUsers.map((user) => (

            <div
              key={user._id}

              onClick={() =>
                loadMessages(user)
              }

              className="p-4 border-b border-gray-800 hover:bg-[#232328] cursor-pointer transition"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-semibold">
                    {user.username}
                  </h2>

                  <p className="text-sm text-gray-400 truncate w-[180px]">
                    {user.email}
                  </p>

                </div>

                <div
                  className={
                    user.isOnline
                      ? "w-3 h-3 bg-green-500 rounded-full"
                      : "w-3 h-3 bg-gray-500 rounded-full"
                  }
                ></div>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* CHAT AREA */}
      <div
        className={`
          ${selectedUser ? "flex" : "hidden md:flex"}
          flex-1
          flex-col
        `}
      >


        {/* HEADER */}
        <div className="p-4 md:p-5 border-b border-gray-800 bg-[#1a1a1d] flex items-center gap-4">

          {/* MOBILE BACK */}
          <button
            onClick={() =>
              setSelectedUser(null)
            }

            className="md:hidden text-xl"
          >
            ←
          </button>


          <div>

            {selectedUser ? (

              <>
                <h2 className="text-lg md:text-xl font-semibold">
                  {selectedUser.username}
                </h2>

                <p
                  className={
                    selectedUser.isOnline
                      ? "text-green-400 text-sm"
                      : "text-gray-400 text-sm"
                  }
                >
                  {selectedUser.isOnline
                    ? "Online"
                    : "Offline"}
                </p>
              </>

            ) : (

              <h2 className="text-xl font-semibold">
                Select User
              </h2>

            )}

          </div>

        </div>


        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

          {!selectedUser ? (

            <div className="h-full flex items-center justify-center text-gray-500 text-center px-6">
              Select a conversation to start chatting
            </div>

          ) : (

            <>
              {messages.map((msg, index) => (

                <div
                  key={index}

                  className={
                    msg.senderId === userInfo._id ||
                    msg.senderId?._id === userInfo._id
                      ? "flex justify-end"
                      : "flex"
                  }
                >

                  <div
                    className={
                      msg.senderId === userInfo._id ||
                      msg.senderId?._id === userInfo._id
                        ? "bg-purple-600 px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[300px] break-words"
                        : "bg-[#1f1f25] px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[300px] break-words"
                    }
                  >

                    {msg.text}

                  </div>

                </div>

              ))}

              <div ref={messagesEndRef}></div>
            </>

          )}

        </div>


        {/* INPUT */}
        <div className="p-3 md:p-5 border-t border-gray-800 bg-[#1a1a1d] flex gap-3">

          <input
            type="text"

            placeholder="Type a message..."

            value={message}

            onChange={(e) =>
              setMessage(e.target.value)
            }

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}

            className="flex-1 bg-[#111] p-3 md:p-4 rounded-xl outline-none border border-gray-700"
          />

          <button
            onClick={sendMessage}

            className="bg-purple-600 hover:bg-purple-700 transition px-5 md:px-6 rounded-xl"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
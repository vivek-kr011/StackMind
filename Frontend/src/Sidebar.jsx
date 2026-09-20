import "./Sidebar.css";
import { useContext, useEffect, useCallback } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    token,
    setShowAuthModal,
    setAuthMode,
  } = useContext(MyContext);

  const getAllThreads = useCallback(async () => {
    if (!token) {
      setAuthMode("Login");
      setShowAuthModal(true);
      return;
    }

    try {
      // const response = await fetch("http://localhost:8080/api/thread", {
      // const response = await fetch("https://stackmind-4yin.onrender.com/api/thread", {

      const response = await fetch("/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      // console.log(filteredData); // print only threadId and title
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  }, [token, setAuthMode, setShowAuthModal, setAllThreads]);

  useEffect(() => {
    // console.log("Current Thread:", currThreadId);
    getAllThreads();
  }, [currThreadId, getAllThreads]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  // fetch all chat
  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId); // setCurrThreadId is replace with newThreadId

    if (!token) {
      setAuthMode("Login");
      setShowAuthModal(true);
      return;
    }

    //load all old chats with is particular threadId (newThreadId)
    try {
      const response = await fetch(
        // `http://localhost:8080/api/thread/${newThreadId}`,
        // `https://stackmind-4yin.onrender.com/api/thread/${newThreadId}`,
        `/api/thread/${newThreadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);
      // setPrevChats
      setPrevChats(res);
      setNewChat(false);

      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    if (!token) {
      setAuthMode("Login");
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch(
        // `http://localhost:8080/api/thread/${threadId}`,
        // `https://stackmind-4yin.onrender.com/api/thread/${threadId}`,
        `/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await response.json();
      console.log(res);

      // updated thread re-render
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId != threadId),
      );

      // create newChat if curr chat is deleted
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">

      <input type="checkbox" id="sidebarToggle" className="sidebarToggle" />

      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="/SM-logo.png" alt="gpt logo" className="logo" />
        <span>
          {" "}
          <i className="fa-solid fa-pen-to-square"></i>{" "}
        </span>
      </button>

      {/* history - previous history*/}
      <ul className="history">
        {/* if data is exist */}
        {allThreads?.map((thread, idx) => (
          // pass newThreadId
          <li
            key={idx}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : " "}
          >
            {thread.title}

            {/* delete icon  */}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation(); // to stop event bubbling
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      {/* sign */}
      <div className="sign">
        <p>By StackMind</p>
      </div>
    </section>
  );
}

export default Sidebar;
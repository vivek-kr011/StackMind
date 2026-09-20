import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    user,
    token,
    setShowAuthModal,
    setAuthMode,
    logoutUser,
  } = useContext(MyContext);

  // create a new state variable for loader
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const promptRef = useRef("");

  useEffect(() => {
    promptRef.current = prompt;
  }, [prompt]);

  const getReply = async () => {
    if (!token) {
      setAuthMode("Login");
      setShowAuthModal(true);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    setNewChat(false);

    console.log("message", prompt, "threadId", currThreadId);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        // current threadId -> to create a new state variable
        threadId: currThreadId,
      }),
    };
    try {
      // ensure our backend is run, then response will come
      // const response = await fetch("http://localhost:8080/api/chat", options);

      // const response = await fetch(
      //   "https://stackmind-4yin.onrender.com/api/chat",
      //   options,
      // );

      const response = await fetch("/api/chat", options);

      const res = await response.json();
      console.log(res);
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // Append New Chat to prevChats
  useEffect(() => {
    if (promptRef.current && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: promptRef.current,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }

    setPrompt("");
  }, [reply, setPrevChats, setPrompt]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    setAuthMode("Login");
    setShowAuthModal(true);
    setIsOpen(false);
  };

  const handleSignUpClick = () => {
    setAuthMode("Sign Up");
    setShowAuthModal(true);
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    logoutUser();
    setIsOpen(false);
  };

  return (
    <div className="chatWindow">
      <label htmlFor="sidebarToggle" className="sidebarBackdrop"></label>

      {/* 1st component */}
      <div className="navbar">
        <label htmlFor="sidebarToggle" className="menuToggle">
          <i className="fa-solid fa-bars"></i>
        </label>

        <span>
          Stack Mind <i className="fa-solid fa-chevron-down"></i>
        </span>

        {/* clickable icon  */}
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            {" "}
            <i className="fa-solid fa-user"></i>{" "}
          </span>
        </div>
      </div>

      {/* DropDown */}
      {isOpen && (
        <>
          <div
            className="dropDownOverlay"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="dropDown">
            <div className="dropDownItem">
              {" "}
              <i className="fa-solid fa-gear"></i> Settings{" "}
            </div>
            <div className="dropDownItem">
              {" "}
              <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
            </div>
            {user ? (
              <div className="dropDownItem" onClick={handleLogoutClick}>
                {" "}
                <i className="fa-solid fa-right-from-bracket"></i> Log out
              </div>
            ) : (
              <>
                <div className="dropDownItem" onClick={handleLoginClick}>
                  {" "}
                  <i className="fa-solid fa-right-to-bracket"></i> Log in
                </div>
                <div className="dropDownItem" onClick={handleSignUpClick}>
                  {" "}
                  <i className="fa-solid fa-user-plus"></i> Sign Up
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* 2nd - chat component -> it is a individual component */}
      <div className="mainContent">
        <Chat></Chat>
      </div>

      {/* <ScaleLoader color="#fff" loading={loading}></ScaleLoader> */}
      <div className="loaderWrapper">
        <ScaleLoader color="#339cff" loading={loading}></ScaleLoader>
      </div>

      {/* 3rd component */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />

          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          Stack Mind can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;

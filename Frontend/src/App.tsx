import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import TextBox from "./components/InputBox";
import SideBar from "./components/SideMenu";
import DarkModeButton from "./components/DarkButton";
import VideoPlayer from "./components/VideoPlayer";
import { FaArrowUp } from "react-icons/fa";
import PlaylistPanel from "./components/PlaylistPanel";
import MarkdownRenderer from "./components/Markdown";
import CopyButton from "./components/CopyButton";
import MessageBox from "./components/MessageBox";
import Title from "./components/Title";

function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [query, setQuery] = useState("");
  const [responseContent, setResponseContent] = useState("");
  const [displayText, setDisplayText] = useState<string>("");
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  const subText =
    "No Ads!\nNo Recommendations!\nOnly Focus with LLM assistance.\nPaste a valid Youtube playlist or video link and click on ↑ button.";
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = "#343434";
      document.body.style.color = "white";
    } else {
      document.body.style.backgroundColor = "#C7C6C1";
      document.body.style.color = "black";
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const typingRef = useRef<boolean>(false);
  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const validateLink = (link: string): boolean => {
    return (
      link.startsWith("https://www.youtube.com/playlist?list=") ||
      link.startsWith("https://www.youtube.com/watch?v=") ||
      link.startsWith("https://youtu.be/")
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setVideoUrl(e.target.value);
    setIsValid(validateLink(link));
  };
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);
  };
  const fetchQueryResponse = async () => {
    try {
      setDisplayText("");
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:5000/answer_query?query=${query}&video_id=${selectedVideoId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error fetching video data: ${errorData.error || "Unknown error"}`
        );
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setResponseContent(data.content);
      setIsLoading(false);
      startTypewriterEffect(data.content);
    } catch (error) {
      console.error("Error fetching query response:", error);
    }
  };

  const startTypewriterEffect = (text: string) => {
    let i = -1;
    setDisplayText("");
    typingRef.current = true;
    const codeBlockRegex = /\`\`\`([\s\S]*?)\`\`\`/g;
    const processedText = text.replace(codeBlockRegex, (match, codeContent) => {
      return `\`\`\` ${codeContent} \`\`\``;
    });
    const type = () => {
      if (typingRef.current && i < processedText.length) {
        setDisplayText((prev: string) =>
          processedText[i] ? prev + processedText[i] : prev
        );
        i++;
        setTimeout(() => requestAnimationFrame(type), 10);
      } else {
        typingRef.current = false;
      }
    };
    type();
  };

  const stopTypewriterEffect = () => {
    typingRef.current = false;
  };
  const fetchVideoData = async () => {
    try {
      setDisplayText("");
      const isPlaylist = videoUrl.includes("list=");
      if (isPlaylist) {
        await fetchPlaylistData();
        return;
      }

      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        alert("Invalid YouTube video link!");
        return;
      }

      const response = await fetch("http://localhost:5000/fetch_video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error fetching video data: ${errorData.error || "Unknown error"}`
        );
        return;
      }

      const data = await response.json();

      setVideoData(data);
      setSelectedVideoId(videoId);
    } catch (err) {
      console.error("Error fetching video data:", err);
      alert("An error occurred while fetching the video data.");
    }
  };

  const fetchPlaylistData = async () => {
    try {
      const playlistId = extractPlaylistId(videoUrl);
      if (!playlistId) {
        alert("Invalid YouTube playlist link!");
        return;
      }
      const response = await fetch("http://localhost:5000/fetch_playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(
          `Error fetching playlist data: ${errorData.error || "Unknown error"}`
        );
        return;
      }

      const data = await response.json();

      setVideoData({ videos: data.videos });
      setSelectedVideoId(data.videos[0]?.id);
    } catch (err) {
      console.error("Error fetching playlist data:", err);
      alert("An error occurred while fetching the playlist data.");
    }
  };

  const extractVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/))([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };
  const extractPlaylistId = (url: string): string | null => {
    const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };
  return (
    <div
      className="app-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Button
        variant="secondary"
        onClick={toggleSideMenu}
        style={{ position: "absolute", top: 10, left: 10 }}
      >
        ☰
      </Button>
      <SideBar
        isOpen={sideMenuOpen}
        toggleSideMenu={toggleSideMenu}
        button1={
          <div>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setSelectedVideoId(null)}
              style={{
                borderRadius: 30,
                width: "100%",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              Home 🏠︎
            </button>
          </div>
        }
        button2={
          <DarkModeButton
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        }
      />

      {!selectedVideoId && (
        <div>
          <Title title="FocusTube" isDarkMode={isDarkMode} subText={subText} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "95%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            maxHeight: "100%",
            paddingLeft: "20px",
            paddingTop: "20px",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {selectedVideoId && <VideoPlayer videoId={selectedVideoId} />}
          {selectedVideoId && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <TextBox
                placeholder="Enter your Queries Here..."
                handleInputChange={handleQueryChange}
                text={query}
              />
              <button
                className="btn btn-light rounded-circle"
                style={{
                  backgroundColor: "#007bff",
                  border: "none",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: !typingRef.current ? 1 : 0.2,
                  cursor: !typingRef.current ? "pointer" : "not-allowed",
                }}
                onClick={() => {
                  openMessage();
                  stopTypewriterEffect();
                  fetchQueryResponse();
                }}
                disabled={typingRef.current}
              >
                <FaArrowUp style={{ color: "white", fontSize: "18px" }} />
              </button>
              {showMessage && (
                <div>
                  <MessageBox message="Response is being generated! Please wait :)" />
                </div>
              )}
              {
                <button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    opacity: typingRef.current ? 1 : 0.2,
                    cursor: typingRef.current ? "pointer" : "not-allowed",
                  }}
                  onClick={stopTypewriterEffect}
                  disabled={!typingRef}
                >
                  ▮
                </button>
              }
            </div>
          )}
          {displayText.trim() && (
            <div
              className="rounded-3"
              style={{
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                marginLeft: "60px",
                marginRight: "30px",
                padding: "30px",
                paddingRight: "70px",
                backgroundColor: "#36454F",
                position: "relative",
                // paddingTop: "40px",
              }}
            >
              <CopyButton text={displayText} />
              <div>
                {displayText.includes("```") ? (
                  <MarkdownRenderer markdown={displayText} />
                ) : (
                  displayText
                )}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: "350px",
            overflowY: "auto",
            paddingTop: "30px",
            boxSizing: "border-box",
          }}
        >
          {videoData?.videos && (
            <PlaylistPanel
              videos={videoData.videos}
              onVideoSelect={handleVideoSelect}
            />
          )}
        </div>
      </div>

      <div
        className="input-container"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "80%",
          maxWidth: "600px",
          minWidth: "300px",
          marginTop: "10px",
        }}
      >
        <TextBox
          placeholder="Paste YouTube link..."
          handleInputChange={handleInputChange}
          text={videoUrl}
        />
        <button
          className="btn btn-light rounded-circle"
          style={{
            backgroundColor: "#007bff",
            border: "none",
            padding: "10px",
            opacity: isValid ? "1" : "0.2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isValid ? "pointer" : "default",
          }}
          onClick={fetchVideoData}
          disabled={!isValid}
        >
          <FaArrowUp style={{ color: "white", fontSize: "18px" }} />
        </button>
      </div>
    </div>
  );
}
export default App;

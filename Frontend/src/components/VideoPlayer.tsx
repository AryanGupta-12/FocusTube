interface VideoPlayerProps {
  videoId: string | null;
}

function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <div
      className="video-player-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "70vh",
        maxHeight: "calc(100vh - 60px)",
        padding: "10px",
        boxSizing: "border-box",
        // overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "850px",
          aspectRatio: "16/9",
          border: "none",
          display: "block",
          position: "relative",
        }}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default VideoPlayer;

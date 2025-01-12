interface PanelProps {
  videos: any[];
  onVideoSelect: (id: string) => void;
}
function PlaylistPanel({ videos, onVideoSelect }: PanelProps) {
  return (
    <div
      style={{
        width: "100%",
        borderLeft: "5px solid #000000",
        padding: "10px",
      }}
    >
      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            marginBottom: "15px",
            width: "100%",
          }}
          onClick={() => onVideoSelect(video.id)}
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{ width: "100px", height: "auto", marginRight: "10px" }}
          />
          <div>{video.title}</div>
        </div>
      ))}
    </div>
  );
}

export default PlaylistPanel;

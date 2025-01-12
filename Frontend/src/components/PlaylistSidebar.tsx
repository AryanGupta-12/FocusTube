interface PlaylistSidebarProps {
  playlist: any[];
  onVideoSelect: (videoId: string) => void;
}

function PlaylistSidebar({ playlist, onVideoSelect }: PlaylistSidebarProps) {
  return (
    <div className="list-group">
      {playlist.map((video: any) => (
        <button
          key={video.id}
          className="list-group-item list-group-item-action"
          onClick={() => onVideoSelect(video.id)}
        >
          {video.title}
        </button>
      ))}
    </div>
  );
}

export default PlaylistSidebar;

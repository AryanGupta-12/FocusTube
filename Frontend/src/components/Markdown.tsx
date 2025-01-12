import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface MarkdownRendererProps {
  markdown: string;
}
function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  return (
    <div style={{ position: "relative" }}>
      <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
    </div>
  );
}

export default MarkdownRenderer;

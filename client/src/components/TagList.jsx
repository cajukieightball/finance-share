export default function TagList({ tags, selectedTag, onTagClick }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick(tag === selectedTag ? "" : tag)}
          style={{
            padding: "0.25rem 0.5rem",
            margin: "0 .25rem",
            borderRadius: "999px",
            border: tag === selectedTag ? "2px solid #fff" : "1px solid #555",
            background: "transparent",
            color: tag === selectedTag ? "#fff" : "#aaa",
            cursor: "pointer"
          }}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function CommentList({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    try {
      setStatus("loading");
      const res = await api.get("/comments", { params: { postId } });
      if (!Array.isArray(res.data)) throw new Error("Unexpected response format");
      setComments(res.data);
      setStatus("ready");
    } catch (err) {
      console.error("💥 CommentList fetch error:", err);
      setErrMsg(err.message || "Unknown error");
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentSave = async (commentId) => {
    await api.patch(`/comments/${commentId}`, { content: editContent });
    setEditingCommentId(null);
    setEditContent("");
    fetchComments();
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    await api.delete(`/comments/${commentId}`);
    fetchComments();
  };

  if (status === "loading") return <div>Loading comments…</div>;

  if (status === "error") {
    return (
      <div style={{ background: "#fee", padding: 8 }}>
        <strong>Error loading comments:</strong> {errMsg}
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <strong>{comment.author?.username || "?"}</strong>:
          {editingCommentId === comment._id ? (
            <>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button onClick={() => handleCommentSave(comment._id)}>Save</button>
              <button onClick={() => setEditingCommentId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <span> {comment.content}</span>
              {comment.author?._id === user?._id && (
                <>
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditContent(comment.content);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(comment._id)}>🗑️</button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicationsByCategory, addComment, updateComment } from "../../services/api";
import "./publicationDetailsStyle.css";

function PublicationDetail() {
  const { categoryName, id } = useParams();
  const [publication, setPublication] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [userName, setUserName] = useState(""); 
  const [editingCommentId, setEditingCommentId] = useState(null); 
  const [editingCommentText, setEditingCommentText] = useState(""); 

  useEffect(() => {
    const fetchPublication = async () => {
      const data = await getPublicationsByCategory(categoryName); 
      const pub = data.find((p) => p._id === id); 
      setPublication(pub || null);
    };
    fetchPublication();
  }, [categoryName, id]); 

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return alert("Comment cannot be empty.");

    let user = userName.trim();
    if (!user) user = `Anonymous${publication.comments.length + 1}`;

    await addComment(id, { comment: newComment, user });
    setNewComment("");  
    setUserName(""); 
    const data = await getPublicationsByCategory(categoryName); 
    const updatedPublication = data.find((p) => p._id === id); 
    setPublication(updatedPublication); 
  };

  const handleEditComment = async (commentId) => {
    if (!editingCommentText.trim()) return alert("Comment cannot be empty.");
    await updateComment(commentId, { comment: editingCommentText });
    setEditingCommentId(null);
    setEditingCommentText("");
    const data = await getPublicationsByCategory(categoryName); 
    const updatedPublication = data.find((p) => p._id === id); 
    setPublication(updatedPublication); 
  };

  const startEditing = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  // NUEVO: Función para eliminar comentario con confirmación
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Estás seguro de eliminar este comentario?")) return;
    try {
      await fetch(`http://localhost:3001/blog/v1/comment/${commentId}`, { method: 'DELETE' });
      const data = await getPublicationsByCategory(categoryName); 
      const updatedPublication = data.find((p) => p._id === id); 
      setPublication(updatedPublication);
    } catch (error) {
      alert("Error eliminando comentario");
    }
  };

  if (!publication) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <h1 className="post-detail-title">{publication.title}</h1>
      <p className="post-detail-meta">
        <strong>Author:</strong> {publication.user} |{" "}
        <strong>Category:</strong> {publication.category?.name || "Unknown"}
      </p>
      <p className="post-detail-text">{publication.text}</p>

      <h4>Comments:</h4>
      <ul className="comment-list">
        {publication.comments.map((comment) => (
          <li key={comment._id}>
            <strong>{comment.user}:</strong>
            {editingCommentId === comment._id ? (
              <>
                <input
                  type="text"
                  value={editingCommentText}
                  onChange={(e) => setEditingCommentText(e.target.value)}
                  className="comment-input"
                  style={{ flex: "1" }}
                />
                <div className="button-group">
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="add-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {comment.comment}
                <button
                  onClick={() => startEditing(comment._id, comment.comment)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-button"
                  style={{ marginLeft: "0.8rem", backgroundColor: "#e53935", color: "white" }}
                >
                  Delete
                </button>
              </>
            )}
            <br />
            <small style={{ color: "#777" }}>
              {new Date(comment.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="comment-input"
          placeholder="Your name (optional)"
        />
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
          placeholder="Your comment"
          required
        />
        <button type="submit" className="add-button">
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default PublicationDetail;

import { useEffect, useState } from "react";
import {
  getPublications,
  addComment,
} from "../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    fetchAndSetPublications();
  }, []);

  const fetchAndSetPublications = async () => {
    const data = await getPublications();
    setPublications(data.slice(0, 3));
  };
  const handleCommentSubmit = async (e, pubId) => {
    e.preventDefault();
    const form = e.target;
    const comment = form.comment.value;
    const user = form.user.value;

    await addComment(pubId, { comment, user });
    form.reset();
    await fetchAndSetPublications();
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido a tu blog de confianza para aprender!!!</h1>
      {publications.map((pub) => (
        <div key={pub._id} className="publication-card">
          <h2 className="publication-title">{pub.title}</h2>
          <p className="publication-meta">
            <strong>Author:</strong> {pub.user} |{" "}
            <strong>Category:</strong> {pub.category?.name || "Unknown"}
          </p>
          <p className="publication-text">{pub.text}</p>
          <h4>Comments:</h4>
          <ul className="comment-list">
            {(pub.comments || []).map((c) => (
                <li key={c._id}>
                <strong>{c.user}:</strong> {c.comment} <br />
                <small style={{ color: "#777" }}>
                    {new Date(c.createdAt).toLocaleString()}
                </small>
                </li>
            ))}
        </ul>

          <form onSubmit={(e) => handleCommentSubmit(e, pub._id)}>
            <input
              type="text"
              name="user"
              placeholder="Your name (optional)"
              className="comment-input"
            />
            <input
              type="text"
              name="comment"
              placeholder="Your comment"
              required
              className="comment-input"
            />
            <button type="submit" className="add-button">Add</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

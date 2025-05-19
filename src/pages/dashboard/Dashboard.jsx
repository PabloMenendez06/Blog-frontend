import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublications, getCategories, getPublicationsByCategory } from "../../services/api"; 
import "./Dashboard.css";

function Dashboard() {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories(); 
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPublications = async () => {
    if (selectedCategory === "All") {
      const data = await getPublications();
      setPublications(data); // <-- Mostrar todas sin límite
    } else {
      const data = await getPublicationsByCategory(selectedCategory);
      setPublications(data.slice(0, 3)); 
    }
    };
    fetchPublications();
  }, [selectedCategory]);

  const handlePublicationClick = (id, categoryName) => {
    navigate(`/publication/${categoryName}/${id}`);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido a tu blog de confianza!!!</h1>

      <div className="category-filter">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className="category-dropdown"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {publications.map((pub) => (
        <div
          key={pub._id}
          className="publication-card"
          onClick={() => handlePublicationClick(pub._id, pub.category.name)}
        >
          <h2 className="publication-title">{pub.title}</h2>
          <p className="publication-meta">
            <strong>Author:</strong> {pub.user} | <strong>Category:</strong> {pub.category.name || "Unknown"}
          </p>
          <p className="publication-text">{pub.text}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

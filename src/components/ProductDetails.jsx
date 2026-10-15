import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setError("");
    setProduct(null);

    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        if (isActive) {
          setProduct(response.data);
        }
      })
      .catch((error) => {
        console.error("Product details error:", error);

        if (isActive) {
          setError("Unable to load product details.");
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return <p className="status-message">Loading product details...</p>;
  }

  if (error || !product) {
    return (
      <div className="empty-state">
        <h2>{error || "Product not found"}</h2>
        <Link to="/">Back to Products</Link>
      </div>
    );
  }

  return (
    <main className="product-details">
      <Link to="/" className="back-link">
        ← Back to Products
      </Link>

      <div className="details-image">
        <img src={product.image} alt={product.title} />
      </div>

      <div className="details-content">
        <p className="category-label">{product.category}</p>

        <h1>{product.title}</h1>

        <p className="details-description">
          {product.description}
        </p>

        <h2 className="price">${product.price.toFixed(2)}</h2>

        <p className="rating">
          ⭐ {product.rating.rate} / 5
          {" "}({product.rating.count} reviews)
        </p>

        <button
          className="primary-button"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </main>
  );
}

export default ProductDetails;
import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  return (
    <article className="product-card">
      <Link
        to={`/products/${product.id}`}
        className="product-image-link"
      >
        <img src={product.image} alt={product.title} />
      </Link>

      <p className="category-label">{product.category}</p>

      <h3>{product.title}</h3>

      <p className="price">${product.price.toFixed(2)}</p>

      <p className="rating">
        ⭐ {product.rating.rate} / 5
      </p>

      <div className="card-actions">
        <Link
          to={`/products/${product.id}`}
          className="details-link"
        >
          View Details
        </Link>

        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import "./App.css";


function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 4;

  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://fakestoreapi.com/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Products error:", error);
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchProducts();
  }, []);

  
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Categories error:", error);
      });
  }, []);


  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">YOUR ONLINE SHOPPING EXPERIENCE</p>

        <h1>Discover Your Next Favorite</h1>


        <p>
          Explore products, compare prices and find what you need.
        </p>
      </section>

      
      <section className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {!loading && !error && (
        <p className="results-count">
          {filteredProducts.length} products found
        </p>
      )}

      
      {loading && (
        <p className="status-message">Loading products...</p>
      )}

      
      {!loading && error && (
        <div className="status-message">
          <p>{error}</p>

          <button onClick={fetchProducts}>Try Again</button>
        </div>
      )}

      
      {!loading && !error && (
        <>
          {currentProducts.length > 0 ? (
            <div className="product-container">
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products found</h2>
              <p>Try another search term or category.</p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

        
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}


function App() {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("productExplorerCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem("productExplorerCart", JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (product) => {
    setCart((previousCart) => {
      const existingProduct = previousCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  };

  
  const updateQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + amount,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

 
  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== id)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <BrowserRouter>
      <header className="navbar">
        <Link to="/" className="brand">
          Product Explorer
        </Link>

        <nav>
          <Link to="/">Home</Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart ({cartCount})
          </Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={<Home addToCart={addToCart} />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />

        <Route
          path="*"
          element={
            <div className="empty-state">
              <h2>Page not found</h2>
              <Link to="/">Return to Home</Link>
            </div>
          }
        />
      </Routes>

      <footer className="footer">
        <p>Product Explorer | Built with React</p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
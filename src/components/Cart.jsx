import { Link } from "react-router-dom";

function Cart({ cart, updateQuantity, removeFromCart }) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-state">
          <h1>Your Cart Is Empty</h1>

          <p>Add some products to get started.</p>

          <Link to="/" className="primary-link">
            Explore Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>

                <p className="price">
                  ${item.price.toFixed(2)}
                </p>

                <div className="quantity-controls">
                  <button
                    aria-label={`Decrease quantity of ${item.title}`}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    aria-label={`Increase quantity of ${item.title}`}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <p className="item-total">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </article>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <p>
            Items:{" "}
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </p>

          <h3>Total: ${totalPrice.toFixed(2)}</h3>

          <Link to="/" className="primary-link">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
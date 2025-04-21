
let cart = [];

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    cartItems.innerHTML = "<em>Votre panier est vide</em>";
    return;
  }
  cart.forEach(item => {
    const row = document.createElement("div");
    row.textContent = `${item.name} x ${item.qty} — ${item.price * item.qty} €`;
    cartItems.appendChild(row);
  });
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);
    const existing = cart.find(p => p.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    updateCartDisplay();
  });
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  if (window.netlifyIdentity) {
    const user = window.netlifyIdentity.currentUser();
    if (!user) {
      alert("Vous devez être connecté pour finaliser votre commande.");
      window.netlifyIdentity.open();
      return;
    }
  }

  const stripe = Stripe("pk_test_51RG1hpPNi5IY4eI8kOg2kg54Fx3SEgCKlKkkkgBmfkvPQY9snK8vG3i0xvpQAOH46D1uhV8TNHE7AK8UpX6fQ6Vu008a40id8u");

  const lineItems = cart.map(item => ({
    price: stripePriceId(item.id),
    quantity: item.qty
  }));

  stripe.redirectToCheckout({
    lineItems: lineItems,
    mode: "payment",
    successUrl: window.location.href,
    cancelUrl: window.location.href
  }).then(res => {
    if (res.error) alert(res.error.message);
  });
});

function stripePriceId(productId) {
  const map = {
    // Fleurs
    "skittles-indoor": "price_1FLEUR1",
    "kama-kush": "price_1FLEUR2",
    "green-crack": "price_1FLEUR3",
    "auto-diesel": "price_1FLEUR4",
    "jack-herer": "price_1FLEUR5",
    "amnesia-haze": "price_1FLEUR6",
    "royal-purple-haze": "price_1FLEUR7",
    // Tisanes
    "moment-detente": "price_1TISANE1",
    "apres-repas": "price_1TISANE2",
    "mate-vitalite": "price_1TISANE3",
    "rooibos-l-exotique": "price_1TISANE4"
  };
  return map[productId] || "price_xxxxx";
}

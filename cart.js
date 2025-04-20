
let cart = [];

function updateCartDisplay() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.textContent = item.name + " x " + item.qty;
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

  // Ici tu dois remplacer par tes vrais price_id Stripe
  const stripeLineItems = cart.map(item => ({
    price: stripePriceId(item.id), // fonction de correspondance
    quantity: item.qty
  }));

  fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mode: "payment",
      success_url: window.location.href,
      cancel_url: window.location.href,
      line_items: stripeLineItems
    })
  })
  .then(res => res.json())
  .then(data => {
    window.location.href = data.url;
  })
  .catch(err => alert("Erreur de paiement : " + err.message));
});

// Exemples de correspondance id produit → price_id Stripe
function stripePriceId(productId) {
  const map = {
    "skittles-indoor": "price_xxxxxx1",
    "kama-kush": "price_xxxxxx2",
    "green-crack": "price_xxxxxx3",
    "auto-diesel": "price_xxxxxx4",
    "jack-herer": "price_xxxxxx5",
    "amnesia-haze": "price_xxxxxx6",
    "royal-purple-haze": "price_xxxxxx7",
    "moment-detente": "price_xxxxxx8",
    "apres-repas": "price_xxxxxx9",
    "mate-vitalite": "price_xxxxxx10",
    "rooibos-l-exotique": "price_xxxxxx11"
  };
  return map[productId] || "price_xxxxxxxx";
}

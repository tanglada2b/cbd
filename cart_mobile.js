
let cart = [];

function updateCart() {
  const cartBox = document.getElementById("cart-items");
  cartBox.innerHTML = "";
  if (cart.length === 0) {
    cartBox.innerHTML = "<em>Panier vide</em>";
    return;
  }
  cart.forEach(item => {
    const row = document.createElement("div");
    row.textContent = item.name + " x " + item.qty;
    cartBox.appendChild(row);
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
    updateCart();
    document.getElementById("cart-box").style.display = "block";
  });
});

document.getElementById("cart-toggle").addEventListener("click", () => {
  const box = document.getElementById("cart-box");
  box.style.display = (box.style.display === "block") ? "none" : "block";
});

document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  const stripe = Stripe("pk_test_51RG1hpPNi5IY4eI8kOg2kg54Fx3SEgCKlKkkkgBmfkvPQY9snK8vG3i0xvpQAOH46D1uhV8TNHE7AK8UpX6fQ6Vu008a40id8u");

  const items = cart.map(item => ({
    price: stripePriceId(item.id),
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
      line_items: items
    })
  }).then(res => res.json())
    .then(data => window.location.href = data.url)
    .catch(err => alert("Erreur Stripe: " + err.message));
});

function stripePriceId(productId) {
  const map = {
    "skittles-indoor": "price_xxx1",
    "moment-detente": "price_xxx2"
  };
  return map[productId] || "price_xxxxxxxx";
}

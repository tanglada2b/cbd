
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
    row.textContent = `${item.name} x ${item.qty}g — ${item.price * item.qty} €`;
    cartItems.appendChild(row);
  });
}

document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const unitPrice = parseFloat(btn.dataset.price);
    const qtySelect = btn.parentElement.querySelector(".qty-select");
    const qty = qtySelect ? parseInt(qtySelect.value) : 1;

    const existing = cart.find(p => p.id === id && p.qty === qty);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ id, name, price: unitPrice, qty: qty });
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
    price: stripePriceId(item.id, item.qty),
    quantity: 1
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

function stripePriceId(productId, qty) {
  const map = {
    "skittles-indoor": {
      5: "price_skittles_5g",
      10: "price_skittles_10g",
      50: "price_skittles_50g",
      100: "price_skittles_100g"
    },
    "kama-kush": {
      5: "price_kamakush_5g",
      10: "price_kamakush_10g",
      50: "price_kamakush_50g",
      100: "price_kamakush_100g"
    },
    "green-crack": {
      5: "price_greencrack_5g",
      10: "price_greencrack_10g",
      50: "price_greencrack_50g",
      100: "price_greencrack_100g"
    },
    "auto-diesel": {
      5: "price_autodiesel_5g",
      10: "price_autodiesel_10g",
      50: "price_autodiesel_50g",
      100: "price_autodiesel_100g"
    },
    "jack-herer": {
      5: "price_jackherer_5g",
      10: "price_jackherer_10g",
      50: "price_jackherer_50g",
      100: "price_jackherer_100g"
    },
    "amnesia-haze": {
      5: "price_amnesia_5g",
      10: "price_amnesia_10g",
      50: "price_amnesia_50g",
      100: "price_amnesia_100g"
    },
    "royal-purple-haze": {
      5: "price_royalpurple_5g",
      10: "price_royalpurple_10g",
      50: "price_royalpurple_50g",
      100: "price_royalpurple_100g"
    }
  };

  if (map[productId] && map[productId][qty]) {
    return map[productId][qty];
  } else {
    return "price_xxxxx"; // fallback
  }
}

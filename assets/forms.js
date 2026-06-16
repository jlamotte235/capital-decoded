/* Capital Decoded — form handling: newsletter + resources → HubSpot; contact → email */
(function () {
  var HS = window.HS || {};
  function hsSubmit(email) {
    if (!HS.portal || !HS.form || !email) return Promise.reject();
    return fetch("https://api.hsforms.com/submissions/v3/integration/submit/" + HS.portal + "/" + HS.form, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: [{ name: "email", value: email }],
        context: { pageUri: location.href, pageName: document.title }
      })
    });
  }
  // Newsletter signups (hero, inline, footer) — not the resource forms
  document.querySelectorAll("form.signup:not(.resource-form)").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var em = (f.querySelector('input[type=email]') || {}).value || "";
      var m = f.querySelector(".form-msg");
      hsSubmit(em).then(function (r) {
        if (m) m.textContent = r.ok ? "You're on the list. Thanks for subscribing!" : "Hmm, that didn't go through — try again.";
      }).catch(function () { if (m) m.textContent = "You're on the list!"; });
      f.reset();
    });
  });
  // Resource downloads — capture email to HubSpot, then reveal the guide
  document.querySelectorAll("form.resource-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var file = f.getAttribute("data-file");
      var em = (f.querySelector('input[type=email]') || {}).value || "";
      var msg = f.parentElement.querySelector(".form-msg");
      hsSubmit(em).catch(function () {});
      if (msg) msg.innerHTML = file ? 'Thanks! <a href="' + file + '" download>Download your guide &rarr;</a>' : "You're on the list!";
      f.reset();
    });
  });
  // Contact form — open the user's email app to the brand inbox
  document.querySelectorAll("form.contact-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var nm = (f.querySelector('input[name=name]') || {}).value || "";
      var em = (f.querySelector('input[name=email]') || {}).value || "";
      var tx = (f.querySelector("textarea") || {}).value || "";
      var m = f.querySelector(".form-msg");
      window.location.href = "mailto:" + HS.email +
        "?subject=" + encodeURIComponent("Capital Decoded inquiry from " + nm) +
        "&body=" + encodeURIComponent("Message: " + tx + "  —  From: " + nm + " (" + em + ")");
      if (m) m.textContent = "Opening your email app to send…";
    });
  });
})();

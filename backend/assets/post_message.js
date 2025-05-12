window.addEventListener("message", (e) => {
    if (e.origin !== window.origin) return;
  
    if (e.data?.type === "UPDATE_SEQUENCE") {
      const storeEl = document.querySelector("#sequence-store");
      if (!storeEl) return;
      storeEl.dataset.store = JSON.stringify(e.data.payload);
      storeEl.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  
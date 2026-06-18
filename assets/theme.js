document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-nav]');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.hidden = expanded;
      document.body.classList.toggle('menu-open', !expanded);
    });
  }

  document.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
    const panels = gallery.querySelectorAll('[data-media-panel]');
    const buttons = gallery.querySelectorAll('[data-media-trigger]');

    const activateMedia = (mediaId) => {
      if (!mediaId) return;

      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.mediaPanel === mediaId);
      });

      buttons.forEach((button) => {
        const isActive = button.dataset.mediaTrigger === mediaId;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => activateMedia(button.dataset.mediaTrigger));
    });

    const variantSelect = document.querySelector('[data-variant-select]');
    if (variantSelect) {
      const priceTarget = document.querySelector('[data-product-price]');
      const compareTarget = document.querySelector('[data-product-compare-price]');
      const inventoryTarget = document.querySelector('[data-product-inventory]');
      const addToCartButton = document.querySelector('[data-add-to-cart]');

      const syncVariantUI = () => {
        const option = variantSelect.options[variantSelect.selectedIndex];
        if (!option) return;

        if (priceTarget) priceTarget.textContent = option.dataset.price || '';

        if (compareTarget) {
          const comparePrice = option.dataset.comparePrice || '';
          compareTarget.textContent = comparePrice;
          compareTarget.hidden = comparePrice === '';
        }

        if (inventoryTarget) {
          inventoryTarget.textContent = option.dataset.inventoryLabel || '';
        }

        if (addToCartButton) {
          const available = option.dataset.available === 'true';
          addToCartButton.disabled = !available;
          addToCartButton.textContent = available ? addToCartButton.dataset.availableLabel : addToCartButton.dataset.soldoutLabel;
        }

        if (option.dataset.featuredMediaId) {
          activateMedia(option.dataset.featuredMediaId);
        }

        if (option.dataset.url && window.history.replaceState) {
          const nextUrl = new URL(option.dataset.url, window.location.origin);
          window.history.replaceState({}, '', nextUrl);
        }
      };

      variantSelect.addEventListener('change', syncVariantUI);
      syncVariantUI();
    }
  });

  document.querySelectorAll('[data-quantity-button]').forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input[type="number"]');
      if (!input) return;

      const step = Number(input.step || 1);
      const min = Number(input.min || 1);
      const current = Number(input.value || min);
      const nextValue = button.dataset.quantityButton === 'plus' ? current + step : Math.max(min, current - step);
      input.value = nextValue;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
});

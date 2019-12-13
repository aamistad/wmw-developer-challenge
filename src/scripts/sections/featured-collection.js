/**
 * Section: Featured collection
 * ------------------------------------------------------------------------------
 * Featured collection configuration for complete theme support
 * - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-sections
 *
 * @namespace featuredCollection
 */
import {register} from '@shopify/theme-sections';

/**
 * Featured collection constructor
 * Executes on page load as well as Theme Editor `section:load` events.
 *
 * @param {string} container - selector for the section container DOM element
 */
register('featured-collection', {

  init() {
    window.console.log('Initialising featured collection section');

    // initialize carousel
    const carousel = document.querySelector('.js-collection-carousel');
    new Flickity(carousel, {
      // options
      cellAlign: 'left',
      arrowShape: {
        x0: 10,
        x1: 60, y1: 50,
        x2: 65, y2: 45,
        x3: 20,
      },
    });

    // declare add to cart buttons
    const cartButtons = document.querySelectorAll('.js-ajax-cart');

    // loop each button and bind click event to it
    cartButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();

        // call add to cart function passing id and qty. When complete call confirm function
        this.addToCart(button);
      });
    });
  },

  async addToCart(button) {
    // get id and quantity of product
    const variantId = button.getAttribute('data-variant-id');
    const qty = button.getAttribute('data-quantity');

    await window.fetch('/cart/add.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: qty,
      }),
    });

    this.toggleCartButton(button);
    this.updateCart();
  },

  async updateCart() {
    const result = await window.fetch('/cart.json');

    if (result.status === 200) {
      const count = await result.json();
      const cart = document.querySelector('.js-cart-count');

      // increase count of cart items by 1. To make more dynamic it could take the quantity,
      // Working under the assumption that this component will only be ever to add 1 product at a time
      cart.innerHTML = ` (${count.item_count + 1})`;
    } else {
      throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
    }

  },

  toggleCartButton(button) {
    // store previous text to revert back to
    const prevText = button.innerHTML;

    // disable button, add class to make visible, and change text to confirm added to cart
    button.disabled = true;
    button.classList.toggle('added');
    button.innerHTML = 'Added to cart';

    // this.updateCart().then((resp) => this.updateCartCount(resp));
    // after 2 seconds revert back to original button and enable again
    window.setTimeout(() => {
      button.classList.toggle('added');
      button.innerHTML = prevText;
      button.disabled = false;
    }, 2000);
  },

  publicMethod() {
    // Custom public section method
  },

  _privateMethod() {
    // Custom private section method
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad() {
    // Do something when a section instance is loaded
    this.init();
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
    // Do something when a section instance is unloaded
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect() {
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect() {
    // Do something when a section block is deselected
  },
});

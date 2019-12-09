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

    var elem = document.querySelector('.js-collection-carousel');
    var flkty = new Flickity( elem, {
      // options
      cellAlign: 'left',
      arrowShape: { 
        x0: 10,
        x1: 60, y1: 50,
        x2: 65, y2: 45,
        x3: 20
      }
    });
    
    const cartButtons = document.querySelectorAll('.js-ajax-cart');

    cartButtons.forEach((button,index)=>{
      button.addEventListener('click', (e)=>{
        e.preventDefault();
        const variantId = button.getAttribute('data-variant-id'),
              qty = button.getAttribute('data-quantity');
        
        this.addToCart(variantId,qty).then(this.addToCartConfirm(button));
      });
    });

  },
  async addToCart(variantId, qty) {
    const result = await fetch("/cart/add.json", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      },
      body: JSON.stringify({
          id: variantId,
          quantity: qty
      })
    })

  },
  addToCartConfirm(button){
    const prevText = button.innerHTML;
    button.disabled = true;
    button.classList.toggle('added');
    button.innerHTML = 'Added to cart';
    
    this.getCart().then(resp=>this.updateCartCount(resp));

    setTimeout(()=>{
      button.classList.toggle('added');
      button.innerHTML = prevText;
      button.disabled = false;
    },2000);

  },
  async getCart() {
    const result = await fetch("/cart.json");

    if (result.status === 200) {
        return result.json();
    }

    throw new Error(`Failed to get request, Shopify returned ${result.status} ${result.statusText}`);
  },
  updateCartCount(count){
    const cart = document.querySelector('.js-cart-count');
    cart.innerHTML = ' ('+(count.item_count+1)+')';
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

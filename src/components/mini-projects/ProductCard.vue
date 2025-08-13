<template>
  <div class="mini-ecommerce">
    <div class="back-navigation">
      <router-link :to="`/project/1`" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to E-commerce Project
      </router-link>
    </div>
    
    <header class="store-header">
      <div class="store-logo">
        <h1>TechStore</h1>
      </div>
      <nav class="store-nav">
        <button 
          v-for="category in categories" 
          :key="category.id" 
          class="category-btn"
          :class="{ active: selectedCategory === category.id }"
          @click="filterByCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </nav>
      <div class="cart-icon" @click="toggleCart">
        <i class="fas fa-shopping-cart"></i>
        <span class="cart-count" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
      </div>
    </header>
    
    <!-- Cart Sidebar -->
    <div class="cart-sidebar" :class="{ 'open': isCartOpen }">
      <div class="cart-header">
        <h2>Your Cart</h2>
        <button class="close-btn" @click="toggleCart">×</button>
      </div>
      
      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <button class="shop-now-btn" @click="closeCart">Shop Now</button>
      </div>
      
      <div v-else class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="cart-item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="cart-item-details">
            <h3>{{ item.name }}</h3>
            <p class="cart-item-price">${{ item.price.toFixed(2) }}</p>
          </div>
          <div class="cart-item-quantity">
            <button @click="decrementQuantity(item)" :disabled="item.quantity <= 1">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="incrementQuantity(item)">+</button>
          </div>
          <button class="remove-btn" @click="removeFromCart(item)">×</button>
        </div>
        
        <div class="cart-summary">
          <div class="subtotal">
            <span>Subtotal:</span>
            <span>${{ cartSubtotal.toFixed(2) }}</span>
          </div>
          <div class="shipping">
            <span>Shipping:</span>
            <span>{{ cartSubtotal > 50 ? 'FREE' : '$4.99' }}</span>
          </div>
          <div class="total">
            <span>Total:</span>
            <span>${{ cartTotal.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
    
    <!-- Main Content -->
    <main :class="{ 'blur': isCartOpen }">
      <!-- Product Detail View -->
      <div v-if="selectedProduct" class="product-detail-view">
        <div class="product-detail-back">
          <button @click="closeProductDetail">
            <i class="fas fa-arrow-left"></i> Back to Products
          </button>
        </div>
        
        <div class="product-detail-container">
          <div class="product-detail-image">
            <img :src="selectedProduct.image" :alt="selectedProduct.name">
          </div>
          
          <div class="product-detail-info">
            <h1 class="product-detail-title">{{ selectedProduct.name }}</h1>
            
            <div class="product-detail-rating">
              <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= selectedProduct.rating }">★</span>
              <span class="review-count">({{ selectedProduct.reviewCount }} reviews)</span>
            </div>
            
            <div class="product-detail-price">
              <span class="current-price">${{ selectedProduct.price.toFixed(2) }}</span>
              <span class="original-price" v-if="selectedProduct.originalPrice">${{ selectedProduct.originalPrice.toFixed(2) }}</span>
              <span class="discount-label" v-if="selectedProduct.originalPrice">
                {{ Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100) }}% OFF
              </span>
            </div>
            
            <div class="product-detail-stock" :class="{ 'in-stock': selectedProduct.stock > 0, 'low-stock': selectedProduct.stock <= 5 && selectedProduct.stock > 0, 'out-of-stock': selectedProduct.stock === 0 }">
              {{ stockStatus(selectedProduct.stock) }}
            </div>
            
            <p class="product-detail-description">{{ selectedProduct.description }}</p>
            
            <div class="product-detail-specs">
              <h3>Key Features</h3>
              <ul>
                <li v-for="(feature, index) in selectedProduct.features" :key="index">{{ feature }}</li>
              </ul>
            </div>
            
            <div class="product-detail-actions">
              <div class="quantity-selector">
                <button @click="decrementDetailQuantity" :disabled="detailQuantity <= 1">-</button>
                <span>{{ detailQuantity }}</span>
                <button @click="incrementDetailQuantity">+</button>
              </div>
              
              <button 
                class="add-to-cart-btn" 
                :disabled="selectedProduct.stock === 0"
                @click="addToCartFromDetail(selectedProduct, detailQuantity)"
              >
                {{ selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Product Listing -->
      <div v-else class="product-listing">
        <h2 class="section-title">{{ selectedCategory === 'all' ? 'All Products' : getCategoryName(selectedCategory) }}</h2>
        
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
            <div class="product-image" @click="viewProductDetail(product)">
              <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-info">
              <h3 class="product-name" @click="viewProductDetail(product)">{{ product.name }}</h3>
              <div class="product-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= product.rating }">★</span>
                <span class="review-count">({{ product.reviewCount }})</span>
              </div>
              <div class="product-price">
                <span class="current-price">${{ product.price.toFixed(2) }}</span>
                <span class="original-price" v-if="product.originalPrice">${{ product.originalPrice.toFixed(2) }}</span>
              </div>
              <div class="product-stock" :class="{ 'in-stock': product.stock > 0, 'low-stock': product.stock <= 5 && product.stock > 0, 'out-of-stock': product.stock === 0 }">
                {{ stockStatus(product.stock) }}
              </div>
              <button class="add-to-cart" :disabled="product.stock === 0" @click="addToCart(product)">
                {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Overlay -->
    <div class="overlay" :class="{ 'active': isCartOpen }" @click="closeCart"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'MiniEcommerce',
  setup() {
    // Categories
    const categories = [
      { id: 'all', name: 'All Products' },
      { id: 'audio', name: 'Audio' },
      { id: 'computing', name: 'Computing' },
      { id: 'accessories', name: 'Accessories' }
    ];
    
    const selectedCategory = ref('all');
    
    // Products data
    const products = ref([
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 129.99,
        originalPrice: 199.99,
        rating: 4.5,
        reviewCount: 128,
        stock: 15,
        badge: 'Sale',
        category: 'audio',
        description: 'Experience premium sound quality with our wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        features: [
          'Active Noise Cancellation',
          '30-hour battery life',
          'Bluetooth 5.0 connectivity',
          'Built-in microphone for calls',
          'Foldable design for easy storage'
        ]
      },
      {
        id: 2,
        name: 'Smart Fitness Tracker',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 89.99,
        originalPrice: null,
        rating: 4,
        reviewCount: 75,
        stock: 3,
        badge: null,
        category: 'accessories',
        description: 'Track your health and fitness with this advanced smart tracker featuring heart rate monitoring, sleep tracking, and smartphone notifications.',
        features: [
          '24/7 heart rate monitoring',
          'Sleep quality analysis',
          'Water resistant to 50m',
          '7-day battery life',
          'Compatible with iOS and Android'
        ]
      },
      {
        id: 3,
        name: 'Ultra HD Webcam',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 59.99,
        originalPrice: 79.99,
        rating: 5,
        reviewCount: 42,
        stock: 0,
        badge: 'New',
        category: 'computing',
        description: 'Upgrade your video calls with this Ultra HD webcam featuring 4K resolution, auto light correction, and dual noise-canceling microphones.',
        features: [
          '4K Ultra HD resolution',
          'Auto light correction',
          'Dual noise-canceling microphones',
          'Privacy cover included',
          'Universal mounting clip'
        ]
      },
      {
        id: 4,
        name: 'Mechanical Keyboard',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 149.99,
        originalPrice: null,
        rating: 4.5,
        reviewCount: 96,
        stock: 8,
        badge: null,
        category: 'computing',
        description: 'Enhance your typing experience with this premium mechanical keyboard featuring customizable RGB backlighting, programmable keys, and durable construction.',
        features: [
          'Cherry MX Brown switches',
          'Full RGB backlighting',
          'Aluminum frame construction',
          'Programmable macros',
          'Detachable USB-C cable'
        ]
      },
      {
        id: 5,
        name: 'Wireless Earbuds',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 79.99,
        originalPrice: 99.99,
        rating: 4,
        reviewCount: 187,
        stock: 22,
        badge: 'Sale',
        category: 'audio',
        description: 'Enjoy true wireless freedom with these compact earbuds featuring touch controls, water resistance, and a charging case that provides up to 24 hours of battery life.',
        features: [
          'True wireless design',
          'Touch controls',
          'IPX5 water resistance',
          '6-hour battery (24 with case)',
          'Voice assistant compatible'
        ]
      },
      {
        id: 6,
        name: 'Ergonomic Mouse',
        image: '/assets/images/openart-image_lC1XlWa1_1741449161168_raw.jpg',
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.5,
        reviewCount: 114,
        stock: 5,
        badge: null,
        category: 'computing',
        description: 'Reduce strain and increase productivity with this ergonomic mouse designed for all-day comfort, featuring programmable buttons and adjustable DPI settings.',
        features: [
          'Vertical ergonomic design',
          '6 programmable buttons',
          'Adjustable DPI (800-3200)',
          'Rechargeable battery',
          'Compatible with Windows & Mac'
        ]
      }
    ]);
    
    // Cart state
    const cartItems = ref<any[]>([]);
    const isCartOpen = ref(false);
    
    // Product detail state
    const selectedProduct = ref(null);
    const detailQuantity = ref(1);
    
    // Computed properties
    const filteredProducts = computed(() => {
      if (selectedCategory.value === 'all') {
        return products.value;
      }
      return products.value.filter(product => product.category === selectedCategory.value);
    });
    
    const cartItemCount = computed(() => {
      return cartItems.value.reduce((total, item) => total + item.quantity, 0);
    });
    
    const cartSubtotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });
    
    const cartTotal = computed(() => {
      const subtotal = cartSubtotal.value;
      const shipping = subtotal > 50 ? 0 : 4.99;
      return subtotal + shipping;
    });
    
    // Methods
    const stockStatus = (stock: number) => {
      if (stock === 0) return 'Out of Stock';
      if (stock <= 5) return 'Low Stock';
      return 'In Stock';
    };
    
    const filterByCategory = (categoryId: string) => {
      selectedCategory.value = categoryId;
    };
    
    const getCategoryName = (categoryId: string) => {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : '';
    };
    
    const toggleCart = () => {
      isCartOpen.value = !isCartOpen.value;
    };
    
    const closeCart = () => {
      isCartOpen.value = false;
    };
    
    const addToCart = (product: any) => {
      if (product.stock === 0) return;
      
      const existingItem = cartItems.value.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cartItems.value.push({
          ...product,
          quantity: 1
        });
      }
      
      // Show the cart
      isCartOpen.value = true;
    };
    
    const addToCartFromDetail = (product: any, quantity: number) => {
      if (product.stock === 0) return;
      
      const existingItem = cartItems.value.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.value.push({
          ...product,
          quantity: quantity
        });
      }
      
      // Reset detail quantity
      detailQuantity.value = 1;
      
      // Show the cart
      isCartOpen.value = true;
    };
    
    const removeFromCart = (item: any) => {
      const index = cartItems.value.findIndex(cartItem => cartItem.id === item.id);
      if (index !== -1) {
        cartItems.value.splice(index, 1);
      }
    };
    
    const incrementQuantity = (item: any) => {
      const cartItem = cartItems.value.find(cartItem => cartItem.id === item.id);
      if (cartItem) {
        cartItem.quantity++;
      }
    };
    
    const decrementQuantity = (item: any) => {
      const cartItem = cartItems.value.find(cartItem => cartItem.id === item.id);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
      }
    };
    
    const incrementDetailQuantity = () => {
      detailQuantity.value++;
    };
    
    const decrementDetailQuantity = () => {
      if (detailQuantity.value > 1) {
        detailQuantity.value--;
      }
    };
    
    const viewProductDetail = (product: any) => {
      selectedProduct.value = product;
      detailQuantity.value = 1; // Reset quantity
      window.scrollTo(0, 0); // Scroll to top
    };
    
    const closeProductDetail = () => {
      selectedProduct.value = null;
    };
    
    return {
      categories,
      selectedCategory,
      products,
      cartItems,
      isCartOpen,
      selectedProduct,
      detailQuantity,
      filteredProducts,
      cartItemCount,
      cartSubtotal,
      cartTotal,
      stockStatus,
      filterByCategory,
      getCategoryName,
      toggleCart,
      closeCart,
      addToCart,
      addToCartFromDetail,
      removeFromCart,
      incrementQuantity,
      decrementQuantity,
      incrementDetailQuantity,
      decrementDetailQuantity,
      viewProductDetail,
      closeProductDetail
    };
  }
});
</script>

<style scoped>
.mini-ecommerce {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'DM Sans', sans-serif;
}

.back-navigation {
  margin-bottom: 30px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: var(--primary-color);
}

.back-link i {
  margin-right: 8px;
}

/* Header Styles */
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.store-logo h1 {
  font-size: 2.2rem;
  margin: 0;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.store-nav {
  display: flex;
  gap: 15px;
}

.category-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover, .category-btn.active {
  background: var(--primary-color);
  color: white;
}

.cart-icon {
  position: relative;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s;
}

.cart-icon:hover {
  color: var(--primary-color);
}

.cart-count {
  position: absolute;
  top: -10px;
  right: -10px;
  background: var(--accent-color);
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

/* Cart Sidebar */
.cart-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 380px;
  height: 100%;
  background: var(--bg-lighter);
  z-index: 1000;
  padding: 20px;
  box-shadow: -5px 0 30px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  overflow-y: auto;
}

.cart-sidebar.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cart-header h2 {
  margin: 0;
  font-size: 1.8rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: var(--text-color);
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: var(--accent-color);
}

.empty-cart {
  text-align: center;
  padding: 40px 0;
}

.empty-cart p {
  margin-bottom: 20px;
  color: var(--text-muted);
}

.shop-now-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.shop-now-btn:hover {
  background: #4a11c9;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details h3 {
  font-size: 1rem;
  margin: 0 0 5px 0;
}

.cart-item-price {
  font-weight: bold;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cart-item-quantity button {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--text-white);
  cursor: pointer;
  transition: background-color 0.3s;
}

.cart-item-quantity button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.cart-item-quantity button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
}

.remove-btn:hover {
  background: var(--accent-color);
  color: white;
}

.cart-summary {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.subtotal, .shipping, .total {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
  padding-top: 15px;
  margin-top: 15px;
  border-top: 1px dashed rgba(255, 255, 255, 0.1);
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.checkout-btn:hover {
  background: #4a11c9;
}

/* Main Content */
main {
  transition: filter 0.3s ease;
}

main.blur {
  filter: blur(5px);
  pointer-events: none;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 30px;
  color: var(--text-white);
}

/* Product Listing Styles */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-color);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  z-index: 1;
}

.product-image {
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--text-white);
  cursor: pointer;
  transition: color 0.3s;
}

.product-name:hover {
  color: var(--primary-color);
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.star {
  color: #666;
  margin-right: 2px;
}

.star.filled {
  color: #FFC107;
}

.review-count {
  margin-left: 5px;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-white);
}

.original-price {
  margin-left: 10px;
  font-size: 1rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.product-stock {
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.in-stock {
  color: #4CAF50;
}

.low-stock {
  color: #FFC107;
}

.out-of-stock {
  color: #F44336;
}

.add-to-cart {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart:hover:not(:disabled) {
  background: #4a11c9;
}

.add-to-cart:disabled {
  background: #555;
  cursor: not-allowed;
}

/* Product Detail Styles */
.product-detail-view {
  padding: 20px 0;
}

.product-detail-back {
  margin-bottom: 30px;
}

.product-detail-back button {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: color 0.3s;
}

.product-detail-back button:hover {
  color: var(--primary-color);
}

.product-detail-back button i {
  margin-right: 8px;
}

.product-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
}

.product-detail-image {
  border-radius: 10px;
  overflow: hidden;
  height: 400px;
}

.product-detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-detail-info {
  display: flex;
  flex-direction: column;
}

.product-detail-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: var(--text-white);
}

.product-detail-rating {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-detail-rating .star {
  font-size: 1.2rem;
}

.product-detail-price {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.product-detail-price .current-price {
  font-size: 2rem;
}

.discount-label {
  margin-left: 15px;
  background: var(--accent-color);
  color: white;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}

.product-detail-stock {
  font-size: 1rem;
  margin-bottom: 20px;
  padding: 8px 15px;
  border-radius: 4px;
  display: inline-block;
}

.product-detail-stock.in-stock {
  background: rgba(76, 175, 80, 0.1);
}

.product-detail-stock.low-stock {
  background: rgba(255, 193, 7, 0.1);
}

.product-detail-stock.out-of-stock {
  background: rgba(244, 67, 54, 0.1);
}

.product-detail-description {
  line-height: 1.8;
  margin-bottom: 30px;
  color: var(--text-light);
}

.product-detail-specs {
  margin-bottom: 30px;
}

.product-detail-specs h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--text-white);
}

.product-detail-specs ul {
  list-style-type: none;
  padding-left: 0;
}

.product-detail-specs li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 10px;
  line-height: 1.6;
}

.product-detail-specs li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

.product-detail-actions {
  display: flex;
  gap: 20px;
  margin-top: auto;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  overflow: hidden;
}

.quantity-selector button {
  width: 40px;
  height: 50px;
  background: none;
  border: none;
  color: var(--text-white);
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.quantity-selector button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.quantity-selector button:disabled {
  color: var(--text-muted);
  cursor: not-allowed;
}

.quantity-selector span {
  width: 50px;
  text-align: center;
  font-size: 1.1rem;
}

.add-to-cart-btn {
  flex: 1;
  padding: 0 30px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #4a11c9;
}

.add-to-cart-btn:disabled {
  background: #555;
  cursor: not-allowed;
}

/* Overlay */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 900;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Responsive Styles */
@media (max-width: 992px) {
  .product-detail-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .product-detail-image {
    height: 350px;
  }
  
  .cart-sidebar {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .store-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .cart-icon {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  
  .store-nav {
    overflow-x: auto;
    width: 100%;
    padding-bottom: 10px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  
  .product-detail-actions {
    flex-direction: column;
  }
  
  .quantity-selector {
    width: 100%;
  }
  
  .quantity-selector button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .cart-sidebar {
    width: 100%;
  }
}
</style> 
<template>
  <div class="demo-wrapper">
    <div class="desktop-frame">
      <div class="desktop-screen">
        <div class="desktop-toolbar">
          <div class="toolbar-controls">
            <span class="control red"></span>
            <span class="control yellow"></span>
            <span class="control green"></span>
          </div>
          <div class="toolbar-title">E-commerce Platform Demo</div>
          <div class="toolbar-spacer"></div>
        </div>
        <div class="desktop-content">
          <div class="ecommerce-platform">
            <div class="back-navigation">
              <router-link :to="`/project/1`" class="back-link">
                <i class="fas fa-arrow-left"></i> Back to E-commerce Project
              </router-link>
            </div>
            
            <!-- Admin Controls / Mode Switcher -->
            <div class="platform-controls">
              <div class="user-mode-toggle">
                <span>View as:</span>
                <button 
                  class="mode-button" 
                  :class="{ active: viewMode === 'customer' }"
                  @click="setViewMode('customer')"
                >
                  Customer
                </button>
                <button 
                  class="mode-button" 
                  :class="{ active: viewMode === 'admin' }"
                  @click="setViewMode('admin')"
                >
                  Admin
                </button>
              </div>
              
              <div class="platform-info">
                <div class="info-badge">{{ inventory.total }} Products</div>
                <div class="info-badge">{{ activeUsers }} Active Users</div>
                <div class="info-badge">{{ stats.ordersToday }} Orders Today</div>
              </div>
            </div>
            
            <!-- Admin Dashboard View -->
            <div v-if="viewMode === 'admin'" class="admin-dashboard">
              <h2 class="section-title">Admin Dashboard</h2>
              
              <div class="dashboard-metrics">
                <div class="metric-card">
                  <h3>Revenue</h3>
                  <div class="metric-value">${{ formatNumber(stats.revenue) }}</div>
                  <div class="metric-trend positive">+{{ stats.revenueGrowth }}%</div>
                </div>
                
                <div class="metric-card">
                  <h3>Orders</h3>
                  <div class="metric-value">{{ stats.orders }}</div>
                  <div class="metric-trend positive">+{{ stats.ordersGrowth }}%</div>
                </div>
                
                <div class="metric-card">
                  <h3>Customers</h3>
                  <div class="metric-value">{{ stats.customers }}</div>
                  <div class="metric-trend positive">+{{ stats.customersGrowth }}%</div>
                </div>
                
                <div class="metric-card">
                  <h3>Conversion Rate</h3>
                  <div class="metric-value">{{ stats.conversionRate }}%</div>
                  <div class="metric-trend negative">{{ stats.conversionRateChange }}%</div>
                </div>
              </div>
              
              <div class="admin-sections">
                <div class="inventory-management">
                  <h3>Inventory Management</h3>
                  <div class="inventory-alerts">
                    <div class="alert low-stock">
                      <i class="fas fa-exclamation-triangle"></i>
                      <span>{{ inventory.lowStock }} products low in stock</span>
                    </div>
                    <div class="alert out-of-stock">
                      <i class="fas fa-times-circle"></i>
                      <span>{{ inventory.outOfStock }} products out of stock</span>
                    </div>
                  </div>
                  
                  <table class="inventory-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="product in products" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ product.category }}</td>
                        <td>${{ product.price.toFixed(2) }}</td>
                        <td>{{ product.stock }}</td>
                        <td>
                          <span :class="getStockStatusClass(product.stock)">
                            {{ stockStatus(product.stock) }}
                          </span>
                        </td>
                        <td>
                          <button class="action-btn edit">Edit</button>
                          <button class="action-btn delete">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div class="recent-orders">
                  <h3>Recent Orders</h3>
                  <table class="orders-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="order in recentOrders" :key="order.id">
                        <td>#{{ order.id }}</td>
                        <td>{{ order.customer }}</td>
                        <td>{{ order.date }}</td>
                        <td>${{ order.amount.toFixed(2) }}</td>
                        <td>
                          <span :class="'order-status ' + order.status">
                            {{ order.status }}
                          </span>
                        </td>
                        <td>
                          <button class="action-btn view">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <!-- Customer Store View -->
            <div v-else class="store-view">
              <!-- Store Header -->
              <header class="store-header">
                <div class="store-brand">
                  <h1>TechRetail</h1>
                  <p>Your one-stop shop for all tech needs</p>
                </div>
                
                <div class="store-actions">
                  <div class="search-bar">
                    <input type="text" placeholder="Search products..." v-model="searchQuery">
                    <button><i class="fas fa-search"></i></button>
                  </div>
                  
                  <div class="user-actions">
                    <button class="user-btn" @click="toggleAccountModal">
                      <i class="fas fa-user"></i>
                      <span>Account</span>
                    </button>
                    
                    <button class="cart-btn" @click="toggleCart">
                      <i class="fas fa-shopping-cart"></i>
                      <span class="cart-count" v-if="cartItems.length > 0">{{ cartItems.length }}</span>
                    </button>
                  </div>
                </div>
              </header>
              
              <!-- Store Navigation -->
              <nav class="store-nav">
                <div class="category-filters">
                  <button 
                    v-for="category in categories" 
                    :key="category.id"
                    class="category-btn" 
                    :class="{ active: selectedCategory === category.id }"
                    @click="filterByCategory(category.id)"
                  >
                    {{ category.name }}
                  </button>
                </div>
                
                <div class="filter-options">
                  <select v-model="sortOption" class="sort-select">
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                </div>
              </nav>
              
              <!-- Add featured products section -->
              <div class="featured-products-section" v-if="viewMode === 'customer'">
                <h2 class="section-heading">Featured Products</h2>
                <div class="featured-carousel">
                  <div 
                    v-for="product in featuredProducts" 
                    :key="product.id" 
                    class="featured-product"
                    @click="viewProductDetail(product)"
                  >
                    <div class="featured-product-image">
                      <img :src="product.image" :alt="product.name">
                    </div>
                    <div class="featured-product-info">
                      <h3>{{ product.name }}</h3>
                      <div class="featured-product-price">
                        <span class="current-price">${{ product.price.toFixed(2) }}</span>
                        <span class="discount-badge" v-if="product.discount > 0">-{{ product.discount }}%</span>
                      </div>
                      <button class="featured-cta-btn" @click.stop="addToCart(product)">Add to Cart</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Products Grid -->
              <div class="products-section">
                <h2 class="section-heading">{{ getCategoryName(selectedCategory) }}</h2>
                
                <div class="products-grid">
                  <div 
                    v-for="product in filteredProducts" 
                    :key="product.id" 
                    class="product-card"
                    @click="viewProductDetail(product)"
                  >
                    <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
                    <div class="shipping-badge" v-if="product.freeShipping">Free Shipping</div>
                    <div class="product-image">
                      <img :src="product.image" :alt="product.name">
                      <div class="quick-actions">
                        <button class="quick-action-btn wishlist">
                          <i class="fas fa-heart"></i>
                        </button>
                        <button class="quick-action-btn compare">
                          <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button 
                          class="quick-action-btn add-to-cart"
                          @click.stop="addToCart(product)"
                          :disabled="product.stock === 0"
                        >
                          <i class="fas fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                    <div class="product-info">
                      <h3 class="product-name">{{ product.name }}</h3>
                      <div class="product-rating">
                        <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= product.rating }">★</span>
                        <span class="review-count">({{ product.reviewCount }})</span>
                      </div>
                      <div class="product-price">
                        <span class="current-price">${{ product.price.toFixed(2) }}</span>
                        <span class="original-price" v-if="product.originalPrice">${{ product.originalPrice.toFixed(2) }}</span>
                        <span class="discount-badge" v-if="product.discount > 0">-{{ product.discount }}%</span>
                      </div>
                      <div class="product-features">
                        <span v-for="(feature, index) in product.features.slice(0, 2)" :key="index" class="feature-tag">{{ feature }}</span>
                      </div>
                      <div class="product-stock" :class="getStockStatusClass(product.stock)">
                        {{ stockStatus(product.stock) }}
                      </div>
                      <button 
                        class="add-to-cart-btn" 
                        @click.stop="addToCart(product)"
                        :disabled="product.stock === 0"
                      >
                        {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="desktop-base"></div>
    </div>
    
    <!-- Product Detail Modal -->
    <div class="modal product-detail-modal" v-if="productDetailOpen">
      <div class="modal-backdrop" @click="productDetailOpen = false"></div>
      <div class="modal-content" v-if="selectedProduct">
        <button class="close-btn" @click="productDetailOpen = false">×</button>
        <div class="product-detail-container">
          <div class="product-detail-image">
            <img :src="selectedProduct.image" :alt="selectedProduct.name">
            <span class="product-badge" v-if="selectedProduct.badge">{{ selectedProduct.badge }}</span>
          </div>
          <div class="product-detail-info">
            <h2>{{ selectedProduct.name }}</h2>
            <div class="product-rating">
              <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= selectedProduct.rating }">★</span>
              <span class="review-count">({{ selectedProduct.reviewCount }} reviews)</span>
            </div>
            <div class="product-price">
              <span class="current-price">${{ selectedProduct.price.toFixed(2) }}</span>
              <span class="original-price" v-if="selectedProduct.originalPrice">${{ selectedProduct.originalPrice.toFixed(2) }}</span>
              <span class="discount-badge" v-if="selectedProduct.discount > 0">-{{ selectedProduct.discount }}%</span>
            </div>
            <p class="product-description">{{ selectedProduct.description }}</p>
            <div class="product-features-list">
              <h3>Key Features:</h3>
              <ul>
                <li v-for="(feature, index) in selectedProduct.features" :key="index">{{ feature }}</li>
              </ul>
            </div>
            <div class="product-stock" :class="getStockStatusClass(selectedProduct.stock)">
              {{ stockStatus(selectedProduct.stock) }}
            </div>
            <div class="product-actions">
              <div class="quantity-selector">
                <button class="qty-btn" @click="decreaseQty" :disabled="selectedProduct.stock === 0">-</button>
                <input type="number" min="1" v-model="productQuantity" :disabled="selectedProduct.stock === 0">
                <button class="qty-btn" @click="increaseQty" :disabled="selectedProduct.stock === 0">+</button>
              </div>
              <button 
                class="add-to-cart-btn full-width" 
                @click="addToCart(selectedProduct)"
                :disabled="selectedProduct.stock === 0"
              >
                {{ selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification System -->
    <div class="notifications-container">
      <transition-group name="notification">
        <div 
          v-for="notification in notifications" 
          :key="notification.id" 
          class="notification" 
          :class="'notification-' + notification.type"
        >
          <div class="notification-content">
            <span class="notification-message">{{ notification.message }}</span>
            <button class="notification-close" @click="removeNotification(notification.id)">×</button>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="back-to-portfolio">
      <router-link to="/#portfolio" class="portfolio-btn">
        <i class="fas fa-arrow-left"></i> Back to Portfolio
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'EcommercePlatform',
  setup() {
    // View mode switching
    const viewMode = ref('customer'); // 'customer' or 'admin'
    const activeUsers = ref(247);
    
    const setViewMode = (mode: string) => {
      viewMode.value = mode;
    };
    
    // Admin dashboard stats
    const stats = ref({
      revenue: 486598.25,
      revenueGrowth: 12.4,
      orders: 2547,
      ordersGrowth: 8.2,
      customers: 18493,
      customersGrowth: 15.3,
      conversionRate: 3.4,
      conversionRateChange: -0.7,
      ordersToday: 87
    });
    
    // Inventory stats
    const inventory = ref({
      total: 2843,
      lowStock: 15,
      outOfStock: 8
    });
    
    // Recent orders data
    const recentOrders = ref([
      { id: 25478, customer: 'John Smith', date: '2023-11-10', amount: 182.50, status: 'delivered' },
      { id: 25477, customer: 'Emily Johnson', date: '2023-11-10', amount: 79.99, status: 'processing' },
      { id: 25476, customer: 'Michael Brown', date: '2023-11-09', amount: 349.95, status: 'shipped' },
      { id: 25475, customer: 'Sarah Wilson', date: '2023-11-09', amount: 124.50, status: 'delivered' },
      { id: 25474, customer: 'David Lee', date: '2023-11-08', amount: 67.80, status: 'delivered' }
    ]);
    
    // Customer view data
    // Categories
    const categories = ref([
      { id: 'all', name: 'All Products' },
      { id: 'laptops', name: 'Laptops' },
      { id: 'smartphones', name: 'Smartphones' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'audio', name: 'Audio' },
      { id: 'wearables', name: 'Wearables' }
    ]);
    
    const selectedCategory = ref('all');
    const sortOption = ref('featured');
    const searchQuery = ref('');
    
    // Products data
    const products = ref([
      {
        id: 1,
        name: 'UltraBook Pro 15"',
        category: 'laptops',
        price: 1299.99,
        originalPrice: 1499.99,
        image: '/assets/images/products/laptop.jpg',
        rating: 4.7,
        reviewCount: 128,
        stock: 15,
        badge: 'Sale',
        description: 'Powerful laptop with 11th Gen Intel Core i7, 16GB RAM, 512GB SSD, and a stunning 15" 4K display.',
        features: ['11th Gen Intel Core i7', '16GB RAM', '512GB SSD', '15" 4K Display', 'Thunderbolt 4'],
        discount: 13,
        isFeatured: true,
        freeShipping: true
      },
      {
        id: 2,
        name: 'Galaxy S22 Ultra',
        category: 'smartphones',
        price: 999.99,
        originalPrice: null,
        image: '/assets/images/products/smartphone.jpg',
        rating: 4.9,
        reviewCount: 256,
        stock: 8,
        badge: null,
        description: 'The ultimate smartphone with a 6.8" Dynamic AMOLED display, 108MP camera, and all-day battery life.',
        features: ['6.8" Dynamic AMOLED', '108MP Camera', '5000mAh Battery', 'S Pen Support', '5G Ready'],
        discount: 0,
        isFeatured: true,
        freeShipping: true
      },
      {
        id: 3,
        name: 'Noise Cancelling Headphones',
        category: 'audio',
        price: 249.99,
        originalPrice: 349.99,
        image: '/assets/images/products/headphones.jpg',
        rating: 4.6,
        reviewCount: 87,
        stock: 0,
        badge: 'Sale',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and immersive sound.',
        features: ['Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.0', 'Voice Assistant Support', 'Foldable Design'],
        discount: 29,
        isFeatured: false,
        freeShipping: true
      },
      {
        id: 4,
        name: 'Smart Watch Series 5',
        category: 'wearables',
        price: 329.99,
        originalPrice: null,
        image: '/assets/images/products/smartwatch.jpg',
        rating: 4.8,
        reviewCount: 142,
        stock: 20,
        badge: 'New',
        description: 'Advanced smartwatch with health monitoring, GPS, and a vibrant always-on display.',
        features: ['Heart Rate Monitor', 'ECG App', 'Always-On Display', 'GPS', 'Water Resistant 50m'],
        discount: 0,
        isFeatured: true,
        freeShipping: true
      },
      {
        id: 5,
        name: 'Wireless Charging Pad',
        category: 'accessories',
        price: 39.99,
        originalPrice: 59.99,
        image: '/assets/images/products/charger.jpg',
        rating: 4.5,
        reviewCount: 65,
        stock: 3,
        badge: 'Sale',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices, with LED indicators and anti-slip surface.',
        features: ['15W Fast Charging', 'Qi Compatible', 'LED Indicator', 'Anti-Slip Surface', 'Multiple Coils for Optimal Charging'],
        discount: 33,
        isFeatured: false,
        freeShipping: false
      },
      {
        id: 6,
        name: 'Ergonomic Keyboard',
        category: 'accessories',
        price: 89.99,
        originalPrice: null,
        image: '/assets/images/products/keyboard.jpg',
        rating: 4.3,
        reviewCount: 42,
        stock: 12,
        badge: null,
        description: 'Comfortable split keyboard design with mechanical switches, customizable RGB lighting, and dedicated media controls.',
        features: ['Split Ergonomic Design', 'Mechanical Switches', 'RGB Lighting', 'Media Controls', 'Wrist Rest Included'],
        discount: 0,
        isFeatured: false,
        freeShipping: true
      },
      {
        id: 7,
        name: 'Bluetooth Earbuds',
        category: 'audio',
        price: 129.99,
        originalPrice: 159.99,
        image: '/assets/images/products/earbuds.jpg',
        rating: 4.4,
        reviewCount: 78,
        stock: 9,
        badge: 'Sale',
        description: 'True wireless earbuds with active noise cancellation, water resistance, and up to 8 hours of battery life.',
        features: ['Active Noise Cancellation', '8-hour Battery Life', 'IPX4 Water Resistance', 'Touch Controls', 'Wireless Charging Case'],
        discount: 19,
        isFeatured: true,
        freeShipping: true
      },
      {
        id: 8,
        name: 'Ultra-wide Monitor',
        category: 'accessories',
        price: 449.99,
        originalPrice: 549.99,
        image: '/assets/images/products/monitor.jpg',
        rating: 4.7,
        reviewCount: 56,
        stock: 0,
        badge: 'Sale',
        description: '34" curved ultra-wide monitor with HDR, 144Hz refresh rate, and AMD FreeSync for smooth gaming and multitasking.',
        features: ['34" Curved Ultra-wide', '3440 x 1440 Resolution', '144Hz Refresh Rate', 'HDR10', 'AMD FreeSync'],
        discount: 18,
        isFeatured: false,
        freeShipping: true
      }
    ]);
    
    // Cart state
    const cartItems = ref<any[]>([]);
    const isCartOpen = ref(false);
    
    // Account modal state
    const showAccountModal = ref(false);
    const isLoggedIn = ref(false);
    const currentUser = ref({
      name: 'John Smith',
      email: 'john.smith@example.com',
      memberSince: 'October 2022',
      rewardPoints: 2450
    });
    
    const loginForm = ref({
      email: '',
      password: ''
    });
    
    // Checkout state
    const showCheckoutModal = ref(false);
    const checkoutStep = ref(1);
    const orderNumber = ref('');
    
    const shippingInfo = ref({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US',
      phone: '',
      method: 'standard'
    });
    
    const paymentInfo = ref({
      method: 'credit-card',
      cardNumber: '',
      expiry: '',
      cvv: '',
      nameOnCard: '',
      sameAsShipping: true
    });
    
    // Add these new refs
    const selectedProduct = ref<any>(null);
    const productDetailOpen = ref(false);
    const cartOpen = ref(false);
    const filtersOpen = ref(false);
    
    // Rename the Notification interface to ToastNotification to avoid naming conflict
    
    // Update the notifications array with proper type
    interface ToastNotification {
      id: number;
      type: string;
      message: string;
      timeout: number;
    }
    
    const notifications = ref<ToastNotification[]>([]);
    
    // Add type to the removeNotification function parameter
    const removeNotification = (id: number) => {
      const index = notifications.value.findIndex(n => n.id === id);
      if (index !== -1) {
        notifications.value.splice(index, 1);
      }
    };
    
    // Add a new ref for product quantity
    const productQuantity = ref(1);
    
    // Add quantity adjustment methods
    const increaseQty = () => {
      productQuantity.value++;
    };
    
    const decreaseQty = () => {
      if (productQuantity.value > 1) {
        productQuantity.value--;
      }
    };
    
    // Computed properties
    const filteredProducts = computed(() => {
      let result = products.value;
      
      // Filter by category
      if (selectedCategory.value !== 'all') {
        result = result.filter(p => p.category === selectedCategory.value);
      }
      
      // Filter by search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query)
        );
      }
      
      // Sort products
      switch (sortOption.value) {
        case 'price-asc':
          result = [...result].sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result = [...result].sort((a, b) => b.price - a.price);
          break;
        case 'name-asc':
          result = [...result].sort((a, b) => a.name.localeCompare(b.name));
          break;
        // For 'featured', use the default order
      }
      
      return result;
    });
    
    const cartTotal = computed(() => {
      return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    });
    
    // Methods
    const formatNumber = (num: number) => {
      return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const stockStatus = (stock: number) => {
      if (stock === 0) return 'Out of Stock';
      if (stock <= 5) return 'Low Stock';
      return 'In Stock';
    };
    
    const getStockStatusClass = (stock: number) => {
      if (stock === 0) return 'out-of-stock';
      if (stock <= 5) return 'low-stock';
      return 'in-stock';
    };
    
    const getCategoryName = (categoryId: string) => {
      const category = categories.value.find(c => c.id === categoryId);
      return category ? category.name : 'All Products';
    };
    
    const filterByCategory = (categoryId: string) => {
      selectedCategory.value = categoryId;
    };
    
    const toggleCart = () => {
      isCartOpen.value = !isCartOpen.value;
      
      // Close other modals if cart is opening
      if (isCartOpen.value) {
        showAccountModal.value = false;
        showCheckoutModal.value = false;
      }
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
    
    const removeFromCart = (item: any) => {
      const index = cartItems.value.findIndex(i => i.id === item.id);
      if (index !== -1) {
        cartItems.value.splice(index, 1);
      }
    };
    
    const incrementCartItem = (item: any) => {
      const cartItem = cartItems.value.find(i => i.id === item.id);
      if (cartItem) {
        cartItem.quantity++;
      }
    };
    
    const decrementCartItem = (item: any) => {
      const cartItem = cartItems.value.find(i => i.id === item.id);
      if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
      }
    };
    
    const calculateFinalTotal = () => {
      const subtotal = cartTotal.value;
      const shipping = subtotal > 50 ? 0 : 5.99;
      const tax = subtotal * 0.08;
      return subtotal + shipping + tax;
    };
    
    const viewProductDetail = (product: any) => {
      selectedProduct.value = product;
      productDetailOpen.value = true;
      
      // Close other panels that might be open
      cartOpen.value = false;
      filtersOpen.value = false;
    };
    
    // Account functions
    const toggleAccountModal = () => {
      showAccountModal.value = !showAccountModal.value;
      
      // Close other modals if account modal is opening
      if (showAccountModal.value) {
        isCartOpen.value = false;
        showCheckoutModal.value = false;
      }
    };
    
    const login = () => {
      // Simulate login - in real app would validate credentials
      if (loginForm.value.email && loginForm.value.password) {
        isLoggedIn.value = true;
        
        // Pre-fill shipping info if user is logged in
        shippingInfo.value.name = currentUser.value.name;
      }
    };
    
    const logout = () => {
      isLoggedIn.value = false;
      loginForm.value = { email: '', password: '' };
    };
    
    // Checkout functions
    const proceedToCheckout = () => {
      toggleCart(); // Close cart
      showCheckoutModal.value = true;
      checkoutStep.value = 1;
    };
    
    const toggleCheckoutModal = () => {
      showCheckoutModal.value = !showCheckoutModal.value;
    };
    
    const goToNextStep = () => {
      if (checkoutStep.value < 3) {
        checkoutStep.value++;
      }
    };
    
    const goToPreviousStep = () => {
      if (checkoutStep.value > 1) {
        checkoutStep.value--;
      }
    };
    
    const getCountryName = (countryCode: string) => {
      const countries: {[key: string]: string} = {
        'US': 'United States',
        'CA': 'Canada',
        'UK': 'United Kingdom'
      };
      return countries[countryCode] || countryCode;
    };
    
    const calculateOrderTotal = () => {
      const subtotal = cartTotal.value;
      const shipping = shippingInfo.value.method === 'standard' ? 5.99 : 12.99;
      const tax = subtotal * 0.08;
      return subtotal + shipping + tax;
    };
    
    const placeOrder = () => {
      // Generate a random order number
      orderNumber.value = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      checkoutStep.value = 4; // Move to confirmation step
    };
    
    const getEstimatedDeliveryDate = () => {
      const today = new Date();
      const deliveryDays = shippingInfo.value.method === 'standard' ? 5 : 2;
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);
      
      return deliveryDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      });
    };
    
    const finishCheckout = () => {
      showCheckoutModal.value = false;
      cartItems.value = []; // Clear cart after successful order
      checkoutStep.value = 1; // Reset checkout process
    };
    
    // Simulate real-time activity
    onMounted(() => {
      setInterval(() => {
        // Randomly update active users
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        activeUsers.value = Math.max(200, activeUsers.value + change);
        
        // Randomly update orders today occasionally
        if (Math.random() > 0.8) {
          stats.value.ordersToday += 1;
        }
      }, 5000);
    });
    
    // Add computed property for featured products
    const featuredProducts = computed(() => {
      return products.value.filter(p => p.isFeatured).slice(0, 4);
    });
    
    return {
      // View mode
      viewMode,
      setViewMode,
      activeUsers,
      
      // Admin dashboard
      stats,
      inventory,
      recentOrders,
      
      // Store
      categories,
      selectedCategory,
      sortOption,
      searchQuery,
      products,
      filteredProducts,
      
      // Cart
      cartItems,
      isCartOpen,
      cartTotal,
      
      // Account
      showAccountModal,
      isLoggedIn,
      currentUser,
      loginForm,
      
      // Checkout
      showCheckoutModal,
      checkoutStep,
      shippingInfo,
      paymentInfo,
      orderNumber,
      
      // Methods
      formatNumber,
      stockStatus,
      getStockStatusClass,
      getCategoryName,
      filterByCategory,
      toggleCart,
      addToCart,
      removeFromCart,
      incrementCartItem,
      decrementCartItem,
      calculateFinalTotal,
      viewProductDetail,
      toggleAccountModal,
      login,
      logout,
      proceedToCheckout,
      toggleCheckoutModal,
      goToNextStep,
      goToPreviousStep,
      getCountryName,
      calculateOrderTotal,
      placeOrder,
      getEstimatedDeliveryDate,
      finishCheckout,
      featuredProducts,
      selectedProduct,
      productDetailOpen,
      cartOpen,
      filtersOpen,
      notifications,
      productQuantity,
      increaseQty,
      decreaseQty,
      removeNotification
    };
  }
});
</script>

<style scoped>
.demo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
}

.desktop-frame {
  max-width: 1400px;
  margin: 120px auto 40px; /* Increased top margin from 80px to 120px */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.desktop-screen {
  width: 100%;
  height: 780px;
  background-color: #1e1e1e;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.desktop-toolbar {
  height: 30px;
  background: #333;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.toolbar-controls {
  display: flex;
  align-items: center;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.control.red { background-color: #ff5f57; }
.control.yellow { background-color: #ffbd2e; }
.control.green { background-color: #28c941; }

.toolbar-title {
  flex-grow: 1;
  text-align: center;
  color: #ddd;
  font-size: 13px;
}

.toolbar-spacer {
  width: 80px;
}

.desktop-content {
  flex: 1;
  background-color: var(--bg-color);
  overflow-y: auto;
  padding: 0;
}

.desktop-base {
  width: 40%;
  height: 20px;
  background: #666;
  border-radius: 0 0 10px 10px;
}

.ecommerce-platform {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px 20px;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-color);
  height: 100%;
  overflow-y: auto;
}

.back-navigation {
  margin-bottom: 30px;
  padding-top: 10px;
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

/* Platform Controls */
.platform-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.user-mode-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-mode-toggle span {
  color: var(--text-muted);
  font-weight: 500;
}

.mode-button {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 5px;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-button.active {
  background: var(--primary-color);
  color: white;
}

.platform-info {
  display: flex;
  gap: 15px;
}

.info-badge {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Admin Dashboard */
.admin-dashboard {
  margin-bottom: 50px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 30px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dashboard-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 25px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.metric-card h3 {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-white);
}

.metric-trend {
  font-size: 0.9rem;
  font-weight: 500;
}

.metric-trend.positive {
  color: #4CAF50;
}

.metric-trend.negative {
  color: #F44336;
}

.admin-sections {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}

.inventory-management, .recent-orders {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 25px;
}

.inventory-management h3, .recent-orders h3 {
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--heading-color);
}

.inventory-alerts {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.alert {
  padding: 10px 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.alert.low-stock {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.alert.out-of-stock {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.inventory-table, .orders-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th, .orders-table th,
.inventory-table td, .orders-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.inventory-table th, .orders-table th {
  font-weight: 500;
  color: var(--text-muted);
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

.action-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  margin-right: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}

.action-btn.edit {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.action-btn.delete {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.action-btn.view {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.order-status {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.order-status.processing {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.order-status.shipped {
  background: rgba(255, 193, 7, 0.1);
  color: #FFC107;
}

.order-status.delivered {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* Store View */
.store-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.store-brand {
  display: flex;
  flex-direction: column;
}

.store-brand h1 {
  font-size: 2.2rem;
  margin: 0;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.store-brand p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 5px;
}

.store-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  overflow: hidden;
  padding: 0 10px;
}

.search-bar input {
  width: 200px;
  padding: 10px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-white);
}

.search-bar button {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--text-color);
  width: 30px;
  height: 30px;
}

.user-actions {
  display: flex;
  gap: 15px;
}

.user-btn, .cart-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 30px;
  padding: 8px 15px;
  color: var(--text-color);
  cursor: pointer;
  transition: background 0.3s ease;
}

.user-btn:hover, .cart-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cart-btn {
  position: relative;
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-color);
  color: white;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.store-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 20px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.category-btn:hover, .category-btn.active {
  background: var(--primary-color);
  color: white;
}

.sort-select {
  padding: 8px 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: var(--text-light);
  cursor: pointer;
  outline: none;
}

.section-heading {
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: var(--text-white);
  position: relative;
  padding-bottom: 10px;
}

.section-heading::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: var(--accent-color);
}

.featured-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.featured-product {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  height: 300px;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%);
}

.featured-product:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.featured-product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.featured-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.featured-product:hover .featured-product-image img {
  transform: scale(1.1);
}

.featured-product-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  color: white;
}

.featured-product-info h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  text-shadow: 0 1px 3px rgba(0,0,0,0.6);
}

.featured-product-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.featured-cta-btn {
  width: 100%;
  padding: 8px 15px;
  background: var(--primary-color);
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  opacity: 0.9;
}

.featured-cta-btn:hover {
  background: #4a11c9;
  opacity: 1;
}

.products-section {
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.product-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--accent-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
}

.shipping-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #00b894;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  z-index: 2;
}

.product-image {
  height: 200px;
  overflow: hidden;
  position: relative;
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

.quick-actions {
  position: absolute;
  bottom: -40px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  transition: bottom 0.3s;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 0;
}

.product-card:hover .quick-actions {
  bottom: 0;
}

.quick-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.quick-action-btn:hover {
  background: var(--primary-color);
  color: white;
}

.quick-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-info {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--text-white);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8rem;
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  font-size: 0.8rem;
  color: var(--text-muted);
}

.product-price {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-white);
}

.original-price {
  margin-left: 10px;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.discount-badge {
  margin-left: auto;
  background: #ff6b6b;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
}

.feature-tag {
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-light);
}

.product-stock {
  margin-bottom: 10px;
  font-size: 0.8rem;
  font-weight: 500;
}

.add-to-cart-btn {
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: auto;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #4a11c9;
}

.add-to-cart-btn:disabled {
  background: #555;
  cursor: not-allowed;
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
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
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

.empty-cart-icon {
  font-size: 3rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: 20px;
}

.empty-cart p {
  margin-bottom: 20px;
  color: var(--text-muted);
}

.shop-btn {
  padding: 10px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.shop-btn:hover {
  background: #4a11c9;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  align-items: center;
  gap: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}

.cart-item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info h3 {
  font-size: 0.9rem;
  margin: 0 0 5px 0;
}

.cart-item-price {
  font-weight: 500;
  font-size: 0.9rem;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-item-quantity button {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--text-white);
  cursor: pointer;
  font-size: 0.8rem;
}

.cart-item-quantity span {
  font-size: 0.9rem;
}

.remove-btn {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
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

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.summary-row.taxes {
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
}

.summary-row.total {
  margin-top: 15px;
  font-size: 1.1rem;
  font-weight: 700;
}

.checkout-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

.checkout-btn:hover {
  background: #4a11c9;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.account-modal, .checkout-modal {
  background: var(--bg-lighter);
  border-radius: 10px;
  padding: 25px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.checkout-modal {
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

/* Account Modal Styles */
.user-welcome {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.user-avatar {
  font-size: 2rem;
  color: var(--primary-color);
}

.user-welcome h3 {
  margin: 0;
  font-size: 1.2rem;
}

.account-details {
  margin-bottom: 25px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.account-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.account-btn {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 5px;
  color: var(--text-color);
  cursor: pointer;
  transition: background 0.3s;
}

.account-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.account-btn.logout {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.account-btn.logout:hover {
  background: rgba(244, 67, 54, 0.2);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.form-group input, .form-group select {
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: var(--text-white);
  outline: none;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.login-btn, .create-account-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn {
  background: var(--primary-color);
  color: white;
  flex: 1;
}

.login-btn:hover {
  background: #4a11c9;
}

.create-account-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  flex: 1;
}

.create-account-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Checkout Modal Styles */
.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.9rem;
}

.step.active .step-number {
  background: var(--primary-color);
  color: white;
}

.step.completed .step-number {
  background: #4CAF50;
  color: white;
}

.step-name {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.step.active .step-name {
  color: var(--text-white);
  font-weight: 500;
}

.step-connector {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 15px;
  position: relative;
  top: -12px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.shipping-options {
  margin-top: 25px;
}

.shipping-options h4 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.shipping-option {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  cursor: pointer;
}

.shipping-option input {
  margin-right: 15px;
  margin-top: 5px;
}

.shipping-option label {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.option-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.option-price {
  font-weight: 600;
  margin-bottom: 5px;
}

.option-time {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.primary-btn, .secondary-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.primary-btn {
  background: var(--primary-color);
  color: white;
}

.primary-btn:hover {
  background: #4a11c9;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.payment-methods {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.payment-method {
  flex: 1;
  padding: 15px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.credit-card-form, .paypal-info {
  margin-top: 20px;
}

.billing-address {
  margin-top: 25px;
}

.review-section {
  margin-bottom: 25px;
}

.review-section h4 {
  font-size: 1.1rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.review-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.review-item {
  display: flex;
  gap: 15px;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h5 {
  margin: 0 0 5px 0;
  font-size: 1rem;
}

.item-details p {
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.item-price {
  font-weight: 600;
  color: var(--text-white) !important;
}

.review-address p {
  margin: 0 0 5px 0;
}

.shipping-method {
  margin-top: 10px;
  font-weight: 500;
}

.order-summary {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 15px;
  margin-top: 25px;
}

.order-confirmation {
  text-align: center;
  padding: 20px 0;
}

.confirmation-icon {
  font-size: 4rem;
  color: #4CAF50;
  margin-bottom: 20px;
}

.confirmation-message {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.order-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.confirmation-email {
  margin-bottom: 30px;
  color: var(--text-muted);
}

.confirmation-details {
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 30px;
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

/* Responsive styles */
@media (max-width: 992px) {
  .platform-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .platform-info {
    width: 100%;
    justify-content: space-between;
  }
  
  .store-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .store-actions {
    width: 100%;
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .search-bar input {
    width: 100%;
  }
  
  .user-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .cart-sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .store-nav {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .category-filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .account-modal, .checkout-modal {
    width: 90%;
  }
  
  .checkout-steps {
    flex-direction: column;
    gap: 20px;
  }
  
  .step-connector {
    width: 1px;
    height: 20px;
    margin: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payment-methods {
    flex-direction: column;
  }
  
  .featured-carousel {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
  
  .featured-product {
    height: 250px;
  }
  
  .section-heading {
    font-size: 1.5rem;
  }
  
  .product-card .product-image {
    height: 160px;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-metrics {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
  }
  
  .cart-item-quantity {
    grid-column: 2;
  }
  
  .remove-btn {
    grid-column: 1;
    grid-row: 2;
    justify-self: end;
  }
}

@media (max-width: 480px) {
  .featured-carousel {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .cart-sidebar {
    width: 100%;
  }
  
  .search-container {
    width: 100%;
  }
  
  .filters-sidebar {
    width: 100%;
  }
  
  .product-name {
    font-size: 0.9rem;
    min-height: 2.4rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .original-price {
    font-size: 0.8rem;
  }
  
  .product-features {
    display: none;
  }
}

.back-to-portfolio {
  margin-top: 30px;
  margin-bottom: 20px;
  text-align: center;
}

.portfolio-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.portfolio-btn:hover {
  background: #4a11c9;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.portfolio-btn i {
  margin-right: 8px;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: var(--bg-dark);
  border-radius: 10px;
  z-index: 2;
  padding: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  z-index: 3;
}

.close-btn:hover {
  color: var(--text-white);
}

.product-detail-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .product-detail-container {
    grid-template-columns: 1fr;
  }
}

.product-detail-image {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.product-detail-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
}

.product-detail-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-detail-info h2 {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.product-description {
  line-height: 1.6;
  color: var(--text-light);
  margin-bottom: 15px;
}

.product-features-list h3 {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.product-features-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.product-features-list li {
  padding: 5px 0;
  position: relative;
  padding-left: 20px;
  color: var(--text-light);
}

.product-features-list li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--accent-color);
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.qty-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-white);
  cursor: pointer;
  font-size: 1.2rem;
}

.qty-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-selector input {
  width: 60px;
  height: 40px;
  border: none;
  text-align: center;
  background: transparent;
  color: var(--text-white);
  font-size: 1rem;
}

.full-width {
  flex: 1;
  min-width: 200px;
}

/* Notification System */
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 300px;
}

.notification {
  margin-bottom: 10px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: var(--bg-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-content {
  display: flex;
  padding: 12px 15px;
  align-items: center;
}

.notification-message {
  flex: 1;
  color: var(--text-white);
}

.notification-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px;
}

.notification-success {
  border-left: 4px solid #4CAF50;
}

.notification-error {
  border-left: 4px solid #F44336;
}

.notification-info {
  border-left: 4px solid #2196F3;
}

.notification-enter-active, 
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from, 
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 
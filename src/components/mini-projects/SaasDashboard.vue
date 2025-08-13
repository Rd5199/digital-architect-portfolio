<template>
  <div class="saas-dashboard-container">
    <div class="back-navigation">
      <router-link :to="`/project/3`" class="back-link">
        <i class="fas fa-arrow-left"></i> Back to SaaS Project
      </router-link>
    </div>
    
    <div class="laptop-frame">
      <div class="laptop-screen">
        <div class="saas-dashboard">
          <!-- Header with user info and controls -->
          <header class="dashboard-header">
            <div class="brand">
              <div class="logo">Pulse<span>SaaS</span></div>
              <div class="menu-toggle">
                <i class="fas fa-bars"></i>
              </div>
            </div>
            
            <div class="header-controls">
              <div class="search-bar">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
              
              <div class="notifications">
                <i class="fas fa-bell"></i>
                <span class="badge">3</span>
              </div>
              
              <div class="user-menu">
                <div class="avatar">
                  <img src="/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg" alt="User Avatar">
                </div>
                <span class="user-name">Amanda Chen</span>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </header>
          
          <!-- Main dashboard content -->
          <div class="dashboard-content">
            <!-- Sidebar navigation -->
            <aside class="sidebar">
              <nav class="main-nav">
                <ul>
                  <li class="active">
                    <a href="#" @click.prevent="setActiveSection('overview')">
                      <i class="fas fa-tachometer-alt"></i>
                      <span>Overview</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click.prevent="setActiveSection('analytics')">
                      <i class="fas fa-chart-line"></i>
                      <span>Analytics</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click.prevent="setActiveSection('customers')">
                      <i class="fas fa-users"></i>
                      <span>Customers</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click.prevent="setActiveSection('subscription')">
                      <i class="fas fa-credit-card"></i>
                      <span>Subscription</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click.prevent="setActiveSection('integrations')">
                      <i class="fas fa-plug"></i>
                      <span>Integrations</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click.prevent="setActiveSection('settings')">
                      <i class="fas fa-cog"></i>
                      <span>Settings</span>
                    </a>
                  </li>
                </ul>
              </nav>
              
              <div class="plan-usage">
                <div class="plan-label">Current Plan</div>
                <div class="plan-name">Enterprise</div>
                <div class="usage-bar">
                  <div class="usage-progress" :style="{ width: `${usageData.currentUsage / usageData.limit * 100}%` }"></div>
                </div>
                <div class="usage-stats">
                  <span>{{ formatNumber(usageData.currentUsage) }}</span> / <span>{{ formatNumber(usageData.limit) }}</span> API calls
                </div>
                <button class="upgrade-btn">Manage Plan</button>
              </div>
            </aside>
            
            <!-- Main content area -->
            <main class="main-content">
              <!-- Overview Section -->
              <div v-if="activeSection === 'overview'" class="dashboard-section">
                <div class="section-header">
                  <h2>Dashboard Overview</h2>
                  <div class="period-selector">
                    <button 
                      v-for="period in timePeriods" 
                      :key="period"
                      :class="['period-btn', { active: activePeriod === period }]"
                      @click="activePeriod = period"
                    >
                      {{ period }}
                    </button>
                  </div>
                </div>
                
                <!-- Key Metrics -->
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-header">
                      <div class="metric-title">Total Revenue</div>
                      <div class="metric-icon revenue">
                        <i class="fas fa-dollar-sign"></i>
                      </div>
                    </div>
                    <div class="metric-value">${{ formatCurrency(metrics.revenue) }}</div>
                    <div class="metric-trend positive">
                      <i class="fas fa-arrow-up"></i> {{ metrics.revenueGrowth }}%
                    </div>
                    <div class="metric-period">vs previous {{ activePeriod.toLowerCase() }}</div>
                  </div>
                  
                  <div class="metric-card">
                    <div class="metric-header">
                      <div class="metric-title">Active Users</div>
                      <div class="metric-icon users">
                        <i class="fas fa-users"></i>
                      </div>
                    </div>
                    <div class="metric-value">{{ formatNumber(metrics.activeUsers) }}</div>
                    <div class="metric-trend positive">
                      <i class="fas fa-arrow-up"></i> {{ metrics.userGrowth }}%
                    </div>
                    <div class="metric-period">vs previous {{ activePeriod.toLowerCase() }}</div>
                  </div>
                  
                  <div class="metric-card">
                    <div class="metric-header">
                      <div class="metric-title">New Subscriptions</div>
                      <div class="metric-icon subscriptions">
                        <i class="fas fa-ticket-alt"></i>
                      </div>
                    </div>
                    <div class="metric-value">{{ metrics.newSubscriptions }}</div>
                    <div class="metric-trend negative">
                      <i class="fas fa-arrow-down"></i> {{ metrics.subscriptionDrop }}%
                    </div>
                    <div class="metric-period">vs previous {{ activePeriod.toLowerCase() }}</div>
                  </div>
                  
                  <div class="metric-card">
                    <div class="metric-header">
                      <div class="metric-title">Churn Rate</div>
                      <div class="metric-icon churn">
                        <i class="fas fa-user-minus"></i>
                      </div>
                    </div>
                    <div class="metric-value">{{ metrics.churnRate }}%</div>
                    <div class="metric-trend positive">
                      <i class="fas fa-arrow-down"></i> {{ metrics.churnImprovement }}%
                    </div>
                    <div class="metric-period">vs previous {{ activePeriod.toLowerCase() }}</div>
                  </div>
                </div>
                
                <!-- Charts -->
                <div class="charts-row">
                  <div class="chart-container revenue-chart">
                    <div class="chart-header">
                      <h3>Revenue Growth</h3>
                      <div class="chart-controls">
                        <button class="chart-control-btn">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </div>
                    <div class="chart-content">
                      <div class="chart-placeholder">
                        <!-- Revenue chart visualization -->
                        <div class="bar-chart">
                          <div v-for="(bar, index) in revenueData" :key="index" class="chart-bar-container">
                            <div class="chart-bar" :style="{ height: `${bar.value * 100 / Math.max(...revenueData.map(item => item.value))}%` }"></div>
                            <div class="chart-label">{{ bar.label }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="chart-container users-chart">
                    <div class="chart-header">
                      <h3>Usage by Plan</h3>
                      <div class="chart-controls">
                        <button class="chart-control-btn">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                      </div>
                    </div>
                    <div class="chart-content">
                      <div class="chart-placeholder">
                        <!-- Users by plan chart visualization -->
                        <div class="donut-chart">
                          <div class="donut-chart-segment starter" :style="{ '--segment-value': '25%' }"></div>
                          <div class="donut-chart-segment pro" :style="{ '--segment-value': '45%' }"></div>
                          <div class="donut-chart-segment enterprise" :style="{ '--segment-value': '30%' }"></div>
                          <div class="donut-hole"></div>
                        </div>
                        <div class="chart-legend">
                          <div class="legend-item">
                            <div class="legend-color starter"></div>
                            <div class="legend-text">Starter (25%)</div>
                          </div>
                          <div class="legend-item">
                            <div class="legend-color pro"></div>
                            <div class="legend-text">Pro (45%)</div>
                          </div>
                          <div class="legend-item">
                            <div class="legend-color enterprise"></div>
                            <div class="legend-text">Enterprise (30%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Recent Activity -->
                <div class="recent-activity">
                  <div class="section-header">
                    <h3>Recent Activity</h3>
                    <button class="view-all-btn">View All</button>
                  </div>
                  
                  <div class="activity-list">
                    <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                      <div class="activity-icon" :class="activity.type">
                        <i :class="getActivityIcon(activity.type)"></i>
                      </div>
                      <div class="activity-details">
                        <div class="activity-title">{{ activity.title }}</div>
                        <div class="activity-time">{{ activity.time }}</div>
                      </div>
                      <div class="activity-action" v-if="activity.actionable">
                        <button class="action-btn">
                          <i class="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Analytics Section -->
              <div v-if="activeSection === 'analytics'" class="dashboard-section">
                <div class="section-header">
                  <h2>Analytics & Reporting</h2>
                  <div class="section-actions">
                    <button class="action-btn">
                      <i class="fas fa-download"></i> Export
                    </button>
                    <button class="action-btn primary">
                      <i class="fas fa-plus"></i> New Report
                    </button>
                  </div>
                </div>
                
                <!-- Analytics Filters -->
                <div class="analytics-filters">
                  <div class="filter-group">
                    <label>Date Range</label>
                    <div class="date-range-picker">
                      <button class="date-picker-btn">
                        <i class="far fa-calendar-alt"></i>
                        Last 30 Days
                        <i class="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="filter-group">
                    <label>Metrics</label>
                    <div class="metrics-selector">
                      <button class="metrics-btn">
                        All Metrics
                        <i class="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div class="filter-group">
                    <label>Segments</label>
                    <div class="segments-selector">
                      <button class="segments-btn">
                        By Plan
                        <i class="fas fa-chevron-down"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Performance Metrics -->
                <div class="performance-metrics">
                  <div class="metric-tabs">
                    <button 
                      v-for="tab in metricTabs" 
                      :key="tab.id"
                      :class="['metric-tab', { active: activeMetricTab === tab.id }]"
                      @click="activeMetricTab = tab.id"
                    >
                      {{ tab.name }}
                    </button>
                  </div>
                  
                  <div class="metric-content">
                    <div class="time-series-chart">
                      <!-- Interactive time series chart -->
                      <div class="line-chart">
                        <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
                          <path 
                            d="M0,180 C50,150 100,100 150,120 C200,140 250,60 300,40 C350,20 400,80 450,60 C500,40 550,120 600,100 C650,80 700,140 750,120 L750,200 L0,200 Z" 
                            fill="rgba(79, 70, 229, 0.1)" 
                            stroke="#4f46e5" 
                            stroke-width="2"
                          />
                        </svg>
                        
                        <div class="chart-axes">
                          <div class="x-axis">
                            <div class="axis-label">Aug 1</div>
                            <div class="axis-label">Aug 8</div>
                            <div class="axis-label">Aug 15</div>
                            <div class="axis-label">Aug 22</div>
                            <div class="axis-label">Aug 29</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="metric-breakdown">
                      <div class="breakdown-header">
                        <h4>Breakdown by Plan</h4>
                        <div class="sort-selector">
                          <span>Sort:</span>
                          <button class="sort-btn">
                            Highest First
                            <i class="fas fa-chevron-down"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div class="breakdown-items">
                        <div v-for="item in metricBreakdown" :key="item.id" class="breakdown-item">
                          <div class="item-details">
                            <div class="item-name">{{ item.name }}</div>
                            <div class="item-value">{{ formatNumber(item.value) }}</div>
                          </div>
                          <div class="item-progress">
                            <div class="progress-bar" :style="{ width: `${item.percentage}%` }"></div>
                          </div>
                          <div class="item-percentage">{{ item.percentage }}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Placeholder for other sections -->
              <div v-if="activeSection !== 'overview' && activeSection !== 'analytics'" class="dashboard-section">
                <!-- Customers Section -->
                <div v-if="activeSection === 'customers'" class="customer-section">
                  <div class="section-header">
                    <h2>Customer Management</h2>
                    <div class="section-actions">
                      <button class="action-btn">
                        <i class="fas fa-filter"></i> Filter
                      </button>
                      <button class="action-btn primary">
                        <i class="fas fa-plus"></i> Add Customer
                      </button>
                    </div>
                  </div>
                  
                  <!-- Customer search and filters -->
                  <div class="customer-filters">
                    <div class="search-filter">
                      <i class="fas fa-search"></i>
                      <input type="text" placeholder="Search customers..." />
                    </div>
                    <div class="filter-pills">
                      <div class="filter-pill active">All Customers</div>
                      <div class="filter-pill">Active</div>
                      <div class="filter-pill">New</div>
                      <div class="filter-pill">At Risk</div>
                    </div>
                  </div>
                  
                  <!-- Customer table -->
                  <div class="customer-table">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            <input type="checkbox" />
                          </th>
                          <th>Customer</th>
                          <th>Plan</th>
                          <th>MRR</th>
                          <th>Status</th>
                          <th>Last Activity</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(customer, index) in customersList" :key="index">
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>
                            <div class="customer-info">
                              <div class="customer-avatar" :style="{ backgroundColor: customer.avatarColor }">
                                {{ customer.initials }}
                              </div>
                              <div class="customer-details">
                                <div class="customer-name">{{ customer.name }}</div>
                                <div class="customer-email">{{ customer.email }}</div>
                              </div>
                            </div>
                          </td>
                          <td>{{ customer.plan }}</td>
                          <td>${{ customer.mrr.toLocaleString() }}</td>
                          <td>
                            <span class="status-badge" :class="customer.status.toLowerCase()">
                              {{ customer.status }}
                            </span>
                          </td>
                          <td>{{ customer.lastActivity }}</td>
                          <td>
                            <button class="icon-btn">
                              <i class="fas fa-ellipsis-v"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Table pagination -->
                  <div class="table-pagination">
                    <div class="pagination-info">
                      Showing 1-10 of 253 customers
                    </div>
                    <div class="pagination-controls">
                      <button class="pagination-btn" disabled>
                        <i class="fas fa-chevron-left"></i>
                      </button>
                      <button class="pagination-btn active">1</button>
                      <button class="pagination-btn">2</button>
                      <button class="pagination-btn">3</button>
                      <button class="pagination-btn">...</button>
                      <button class="pagination-btn">26</button>
                      <button class="pagination-btn">
                        <i class="fas fa-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
                <!-- Subscription Section -->
                <div v-if="activeSection === 'subscription'" class="subscription-section">
                  <div class="section-header">
                    <h2>Subscription Management</h2>
                    <div class="period-selector">
                      <button 
                        v-for="period in ['Monthly', 'Annual']" 
                        :key="period"
                        :class="['period-btn', { active: subscriptionView === period }]"
                        @click="subscriptionView = period"
                      >
                        {{ period }}
                      </button>
                    </div>
                  </div>
                  
                  <!-- Subscription cards -->
                  <div class="subscription-cards">
                    <div class="subscription-card" v-for="(plan, index) in subscriptionPlans" :key="index">
                      <div class="subscription-header" :class="{ 'featured': plan.featured }">
                        <div class="plan-name">{{ plan.name }}</div>
                        <div class="plan-price">
                          <span class="currency">$</span>
                          <span class="amount">{{ subscriptionView === 'Annual' ? plan.annualPrice : plan.monthlyPrice }}</span>
                          <span class="period">/{{ subscriptionView === 'Annual' ? 'year' : 'month' }}</span>
                        </div>
                        <div class="plan-billing" v-if="subscriptionView === 'Annual'">
                          Billed annually (save {{ plan.discount }}%)
                        </div>
                      </div>
                      <div class="subscription-features">
                        <div class="feature-item" v-for="(feature, i) in plan.features" :key="i">
                          <i class="fas fa-check"></i>
                          <span>{{ feature }}</span>
                        </div>
                      </div>
                      <div class="subscription-footer">
                        <button class="subscription-btn" :class="{ 'primary': plan.featured }">
                          {{ plan.featured ? 'Current Plan' : 'Change Plan' }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Billing history -->
                  <div class="billing-history">
                    <div class="subsection-header">
                      <h3>Billing History</h3>
                      <button class="action-btn">
                        <i class="fas fa-download"></i> Download All
                      </button>
                    </div>
                    
                    <div class="history-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Invoice</th>
                            <th>Billing Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(invoice, index) in billingHistory" :key="index">
                            <td>{{ invoice.id }}</td>
                            <td>{{ invoice.date }}</td>
                            <td>${{ invoice.amount.toLocaleString() }}</td>
                            <td>
                              <span class="status-badge" :class="invoice.status.toLowerCase()">
                                {{ invoice.status }}
                              </span>
                            </td>
                            <td>
                              <button class="text-btn">
                                <i class="fas fa-download"></i> PDF
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <!-- Integrations Section -->
                <div v-if="activeSection === 'integrations'" class="integrations-section">
                  <div class="section-header">
                    <h2>Integrations & API</h2>
                    <div class="section-actions">
                      <button class="action-btn primary">
                        <i class="fas fa-plus"></i> Connect New
                      </button>
                    </div>
                  </div>
                  
                  <!-- API keys section -->
                  <div class="api-keys-section">
                    <div class="subsection-header">
                      <h3>API Keys</h3>
                      <button class="action-btn">
                        <i class="fas fa-plus"></i> Generate Key
                      </button>
                    </div>
                    
                    <div class="api-keys-list">
                      <div class="api-key-item" v-for="(key, index) in apiKeys" :key="index">
                        <div class="key-info">
                          <div class="key-name">{{ key.name }}</div>
                          <div class="key-created">Created on {{ key.created }}</div>
                        </div>
                        <div class="key-value">
                          <div class="masked-key">••••••••••••••••{{ key.lastFour }}</div>
                          <button class="text-btn small">
                            <i class="fas fa-eye"></i> Show
                          </button>
                          <button class="text-btn small">
                            <i class="fas fa-copy"></i> Copy
                          </button>
                        </div>
                        <div class="key-actions">
                          <div class="key-status" :class="{ 'active': key.active }">
                            {{ key.active ? 'Active' : 'Inactive' }}
                          </div>
                          <button class="icon-btn">
                            <i class="fas fa-ellipsis-v"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Integrations grid -->
                  <div class="integrations-grid">
                    <div class="subsection-header">
                      <h3>Available Integrations</h3>
                      <div class="integration-filters">
                        <button class="filter-btn active">All</button>
                        <button class="filter-btn">Connected</button>
                        <button class="filter-btn">Popular</button>
                      </div>
                    </div>
                    
                    <div class="integration-cards">
                      <div class="integration-card" v-for="(integration, index) in integrationsList" :key="index" :class="{ 'connected': integration.connected }">
                        <div class="integration-logo" :style="{ backgroundColor: integration.bgColor }">
                          <i :class="integration.icon"></i>
                        </div>
                        <div class="integration-details">
                          <div class="integration-name">{{ integration.name }}</div>
                          <div class="integration-category">{{ integration.category }}</div>
                          <div class="integration-description">{{ integration.description }}</div>
                        </div>
                        <div class="integration-actions">
                          <button class="integration-btn" :class="{ 'disconnect': integration.connected }">
                            {{ integration.connected ? 'Disconnect' : 'Connect' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Settings Section -->
                <div v-if="activeSection === 'settings'" class="settings-section">
                  <div class="section-header">
                    <h2>Account Settings</h2>
                  </div>
                  
                  <div class="settings-layout">
                    <div class="settings-sidebar">
                      <div class="settings-menu">
                        <div class="menu-label">Personal</div>
                        <div class="menu-item active">Profile</div>
                        <div class="menu-item">Security</div>
                        <div class="menu-item">Notifications</div>
                        <div class="menu-label">Organization</div>
                        <div class="menu-item">Team</div>
                        <div class="menu-item">Billing</div>
                        <div class="menu-item">Branding</div>
                      </div>
                    </div>
                    
                    <div class="settings-content">
                      <!-- Profile settings -->
                      <div class="profile-settings">
                        <div class="subsection-header">
                          <h3>Your Profile</h3>
                        </div>
                        
                        <div class="profile-avatar-section">
                          <div class="large-avatar">
                            <img src="/assets/images/openart-image_4J3rsNPv_1741447658208_raw.jpg" alt="User Avatar">
                          </div>
                          <div class="avatar-actions">
                            <button class="action-btn">
                              <i class="fas fa-upload"></i> Upload New
                            </button>
                            <button class="text-btn">
                              <i class="fas fa-trash"></i> Remove
                            </button>
                          </div>
                        </div>
                        
                        <div class="settings-form">
                          <div class="form-row">
                            <div class="form-group">
                              <label>First Name</label>
                              <input type="text" value="Amanda" />
                            </div>
                            <div class="form-group">
                              <label>Last Name</label>
                              <input type="text" value="Chen" />
                            </div>
                          </div>
                          
                          <div class="form-group">
                            <label>Email</label>
                            <input type="email" value="amanda.chen@example.com" />
                          </div>
                          
                          <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" value="+1 (555) 123-4567" />
                          </div>
                          
                          <div class="form-group">
                            <label>Company</label>
                            <input type="text" value="Acme Corporation" />
                          </div>
                          
                          <div class="form-group">
                            <label>Role</label>
                            <input type="text" value="Product Manager" />
                          </div>
                          
                          <div class="form-group">
                            <label>Time Zone</label>
                            <select>
                              <option selected>Pacific Time (UTC-8)</option>
                              <option>Mountain Time (UTC-7)</option>
                              <option>Central Time (UTC-6)</option>
                              <option>Eastern Time (UTC-5)</option>
                            </select>
                          </div>
                          
                          <div class="form-actions">
                            <button class="action-btn">Cancel</button>
                            <button class="action-btn primary">Save Changes</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      
      <div class="laptop-keyboard"></div>
    </div>
    
    <div class="portfolio-navigation">
      <router-link :to="'/'" class="portfolio-button">
        <i class="fas fa-home"></i> Back to Portfolio
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
  name: 'SaasDashboard',
  setup() {
    // Active section
    const activeSection = ref('overview');
    
    const setActiveSection = (section: string) => {
      activeSection.value = section;
    };
    
    // Time periods for filtering
    const timePeriods = ['Day', 'Week', 'Month', 'Quarter', 'Year'];
    const activePeriod = ref('Month');
    
    // Usage data
    const usageData = ref({
      currentUsage: 8426371,
      limit: 10000000,
    });
    
    // Dashboard metrics
    const metrics = ref({
      revenue: 567890,
      revenueGrowth: 12.8,
      activeUsers: 42568,
      userGrowth: 8.3,
      newSubscriptions: 1243,
      subscriptionDrop: 3.2,
      churnRate: 1.8,
      churnImprovement: 0.6
    });
    
    // Revenue chart data
    const revenueData = ref([
      { label: 'Apr', value: 42000 },
      { label: 'May', value: 48000 },
      { label: 'Jun', value: 46500 },
      { label: 'Jul', value: 54000 },
      { label: 'Aug', value: 61000 },
      { label: 'Sep', value: 67000 }
    ]);
    
    // Metric tabs for analytics section
    const metricTabs = [
      { id: 'usage', name: 'API Usage' },
      { id: 'users', name: 'Active Users' },
      { id: 'revenue', name: 'Revenue' },
      { id: 'retention', name: 'Retention' }
    ];
    const activeMetricTab = ref('usage');
    
    // Metric breakdown data
    const metricBreakdown = ref([
      { id: 1, name: 'Enterprise Plan', value: 4826742, percentage: 58 },
      { id: 2, name: 'Pro Plan', value: 2528491, percentage: 30 },
      { id: 3, name: 'Starter Plan', value: 1042138, percentage: 12 }
    ]);
    
    // Recent activities
    const recentActivities = ref([
      { 
        id: 1, 
        type: 'alert', 
        title: 'Usage spike detected on Enterprise API', 
        time: '10 minutes ago',
        actionable: true
      },
      { 
        id: 2, 
        type: 'user', 
        title: 'New customer: Acme Corp signed up for Pro Plan', 
        time: '2 hours ago',
        actionable: true
      },
      { 
        id: 3, 
        type: 'payment', 
        title: 'Invoice #3842 paid by TechSolutions Inc', 
        time: '5 hours ago',
        actionable: false
      },
      { 
        id: 4, 
        type: 'system', 
        title: 'System maintenance scheduled for Sep 15, 02:00 UTC', 
        time: '1 day ago',
        actionable: true
      }
    ]);
    
    // Customer data for the customer section
    const customersList = ref([
      {
        name: 'Acme Corporation',
        email: 'billing@acmecorp.com',
        plan: 'Enterprise',
        mrr: 2499,
        status: 'Active',
        lastActivity: '2 hours ago',
        avatarColor: '#4f46e5',
        initials: 'AC'
      },
      {
        name: 'TechSolutions Inc',
        email: 'admin@techsolutions.co',
        plan: 'Pro',
        mrr: 899,
        status: 'Active',
        lastActivity: '1 day ago',
        avatarColor: '#10b981',
        initials: 'TS'
      },
      {
        name: 'Global Dynamics',
        email: 'support@globaldynamics.io',
        plan: 'Enterprise',
        mrr: 1999,
        status: 'At Risk',
        lastActivity: '3 days ago',
        avatarColor: '#f59e0b',
        initials: 'GD'
      },
      {
        name: 'Cognito Labs',
        email: 'finance@cognitolabs.com',
        plan: 'Pro',
        mrr: 899,
        status: 'Active',
        lastActivity: '12 hours ago',
        avatarColor: '#ef4444',
        initials: 'CL'
      },
      {
        name: 'Quantum Innovations',
        email: 'accounts@quantuminnovate.net',
        plan: 'Enterprise',
        mrr: 2999,
        status: 'Active',
        lastActivity: '5 hours ago',
        avatarColor: '#8b5cf6',
        initials: 'QI'
      }
    ]);
    
    // Subscription plans data
    const subscriptionView = ref('Monthly');
    const subscriptionPlans = ref([
      {
        name: 'Starter',
        monthlyPrice: 49,
        annualPrice: 490,
        discount: 17,
        featured: false,
        features: [
          '5,000 API calls per month',
          'Basic analytics',
          'Email support',
          '1 team member',
          'Standard integrations'
        ]
      },
      {
        name: 'Pro',
        monthlyPrice: 99,
        annualPrice: 990,
        discount: 17,
        featured: false,
        features: [
          '50,000 API calls per month',
          'Advanced analytics',
          'Priority support',
          '5 team members',
          'All integrations',
          'Custom webhooks'
        ]
      },
      {
        name: 'Enterprise',
        monthlyPrice: 299,
        annualPrice: 2990,
        discount: 17,
        featured: true,
        features: [
          'Unlimited API calls',
          'Real-time analytics',
          '24/7 dedicated support',
          'Unlimited team members',
          'Custom integrations',
          'SLA guarantees',
          'Dedicated account manager'
        ]
      }
    ]);
    
    // Billing history
    const billingHistory = ref([
      {
        id: 'INV-3842',
        date: 'Sep 1, 2023',
        amount: 2990,
        status: 'Paid'
      },
      {
        id: 'INV-3741',
        date: 'Aug 1, 2023',
        amount: 2990,
        status: 'Paid'
      },
      {
        id: 'INV-3623',
        date: 'Jul 1, 2023',
        amount: 2990,
        status: 'Paid'
      },
      {
        id: 'INV-3512',
        date: 'Jun 1, 2023',
        amount: 990,
        status: 'Paid'
      }
    ]);
    
    // API keys
    const apiKeys = ref([
      {
        name: 'Production API Key',
        created: 'Jun 15, 2023',
        lastFour: '7a3b',
        active: true
      },
      {
        name: 'Development API Key',
        created: 'Jul 22, 2023',
        lastFour: '9c4d',
        active: true
      },
      {
        name: 'Test Environment',
        created: 'Aug 3, 2023',
        lastFour: '2e5f',
        active: false
      }
    ]);
    
    // Integrations
    const integrationsList = ref([
      {
        name: 'Slack',
        category: 'Communication',
        description: 'Get notifications and alerts directly in your Slack channels.',
        icon: 'fab fa-slack',
        bgColor: '#4A154B',
        connected: true
      },
      {
        name: 'GitHub',
        category: 'Development',
        description: 'Sync issues and pull requests with your dashboard.',
        icon: 'fab fa-github',
        bgColor: '#24292e',
        connected: true
      },
      {
        name: 'Salesforce',
        category: 'CRM',
        description: 'Sync customer data and interactions automatically.',
        icon: 'fas fa-cloud',
        bgColor: '#00a1e0',
        connected: false
      },
      {
        name: 'Google Analytics',
        category: 'Analytics',
        description: 'Import website traffic and user behavior metrics.',
        icon: 'fas fa-chart-line',
        bgColor: '#f9ab00',
        connected: false
      },
      {
        name: 'Stripe',
        category: 'Payments',
        description: 'Track payment processing and subscription data.',
        icon: 'fab fa-stripe-s',
        bgColor: '#6772e5',
        connected: true
      },
      {
        name: 'Jira',
        category: 'Project Management',
        description: 'Manage projects and track issues seamlessly.',
        icon: 'fab fa-jira',
        bgColor: '#0052CC',
        connected: false
      }
    ]);
    
    // Get icon class for activity type
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'alert': return 'fas fa-exclamation-triangle';
        case 'user': return 'fas fa-user-plus';
        case 'payment': return 'fas fa-credit-card';
        case 'system': return 'fas fa-server';
        default: return 'fas fa-info-circle';
      }
    };
    
    // Format numbers with commas
    const formatNumber = (num: number) => {
      return num.toLocaleString();
    };
    
    // Format currency
    const formatCurrency = (num: number) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    };
    
    return {
      activeSection,
      setActiveSection,
      timePeriods,
      activePeriod,
      usageData,
      metrics,
      revenueData,
      metricTabs,
      activeMetricTab,
      metricBreakdown,
      recentActivities,
      customersList,
      subscriptionView,
      subscriptionPlans,
      billingHistory,
      apiKeys,
      integrationsList,
      getActivityIcon,
      formatNumber,
      formatCurrency
    };
  }
});
</script>

<style scoped>
.saas-dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-navigation {
  align-self: flex-start;
  margin-bottom: 20px;
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

.portfolio-navigation {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.portfolio-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.portfolio-button:hover {
  background-color: var(--primary-hover, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.portfolio-button i {
  margin-right: 8px;
}

/* Laptop frame styling */
.laptop-frame {
  position: relative;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  background: #1a1a1a;
  border-radius: 18px 18px 0 0;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
}

.laptop-screen {
  background: #f0f2f5;
  height: 650px;
  overflow: hidden;
  position: relative;
  border: 14px solid #1a1a1a;
  border-bottom: 18px solid #1a1a1a;
}

.laptop-keyboard {
  height: 18px;
  background: #0f0f0f;
  border-radius: 0 0 18px 18px;
  position: relative;
}

.laptop-keyboard:before {
  content: '';
  position: absolute;
  width: 30%;
  height: 5px;
  background: #1e1e1e;
  left: 35%;
  top: 5px;
  border-radius: 5px;
}

/* Dashboard styles */
.saas-dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  color: #333;
  font-family: 'Inter', sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.brand {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
  color: #333;
}

.logo span {
  color: #4f46e5;
}

.menu-toggle {
  display: none;
  cursor: pointer;
  margin-left: 15px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  position: relative;
  width: 250px;
}

.search-bar i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-bar input {
  width: 100%;
  padding: 8px 10px 8px 35px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-bar input:focus {
  border-color: #4f46e5;
}

.notifications {
  position: relative;
  cursor: pointer;
}

.notifications i {
  font-size: 1.2rem;
  color: #6b7280;
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 500;
}

.dashboard-content {
  display: flex;
  flex: 1;
  height: calc(100% - 60px);
  overflow: hidden;
}

.sidebar {
  width: 240px;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.main-nav {
  flex: 1;
}

.main-nav ul {
  list-style: none;
  padding: 0;
  margin: 15px 0;
}

.main-nav li {
  margin-bottom: 2px;
}

.main-nav li a {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.main-nav li a i {
  margin-right: 10px;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.main-nav li a:hover {
  background: #f3f4f6;
  color: #4f46e5;
}

.main-nav li.active a {
  background: #f3f4f6;
  color: #4f46e5;
  font-weight: 500;
  border-left: 3px solid #4f46e5;
}

.plan-usage {
  padding: 15px;
  background: #f9fafb;
  border-top: 1px solid #e0e0e0;
}

.plan-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.plan-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.usage-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  margin-bottom: 5px;
  overflow: hidden;
}

.usage-progress {
  height: 100%;
  background: #4f46e5;
  border-radius: 3px;
}

.usage-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 10px;
}

.upgrade-btn {
  display: block;
  width: 100%;
  padding: 8px;
  background: white;
  color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-btn:hover {
  background: #4f46e5;
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .laptop-frame {
    max-width: 100%;
  }
  
  .laptop-screen {
    height: 500px;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .search-bar {
    display: none;
  }
}

/* Dashboard section styles */
.dashboard-section {
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.period-selector, .section-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.period-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.period-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn i {
  font-size: 0.85rem;
}

.action-btn.primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.action-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.action-btn.primary:hover {
  background: #4338ca;
  color: white;
}

/* Metrics grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.metric-title {
  font-size: 0.9rem;
  color: #6b7280;
}

.metric-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.metric-icon.revenue {
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.metric-icon.users {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.metric-icon.subscriptions {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.metric-icon.churn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 2px;
}

.metric-trend.positive {
  color: #10b981;
}

.metric-trend.negative {
  color: #ef4444;
}

.metric-period {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Charts styling */
.charts-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.chart-control-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 5px;
}

.chart-content {
  height: 200px;
  display: flex;
  align-items: flex-end;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Bar chart */
.bar-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding-top: 10px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 12%;
}

.chart-bar {
  width: 100%;
  background: #4f46e5;
  border-radius: 3px 3px 0 0;
  transition: height 0.3s;
}

.chart-label {
  margin-top: 8px;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Donut chart */
.donut-chart {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  background: #f3f4f6;
  overflow: hidden;
}

.donut-chart-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: 50% 50%;
  transition: transform 0.3s;
}

.donut-chart-segment.starter {
  background: #f59e0b;
  clip-path: polygon(50% 50%, 100% 50%, 100% 0, 50% 0);
  transform: rotate(0deg);
}

.donut-chart-segment.pro {
  background: #10b981;
  clip-path: polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%);
  transform: rotate(90deg);
}

.donut-chart-segment.enterprise {
  background: #4f46e5;
  clip-path: polygon(50% 50%, 0 50%, 0 0, 50% 0);
  transform: rotate(225deg);
}

.donut-hole {
  position: absolute;
  width: 60%;
  height: 60%;
  background: white;
  border-radius: 50%;
  top: 20%;
  left: 20%;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b7280;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.starter {
  background: #f59e0b;
}

.legend-color.pro {
  background: #10b981;
}

.legend-color.enterprise {
  background: #4f46e5;
}

/* Recent Activity */
.recent-activity {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.view-all-btn {
  color: #4f46e5;
  background: transparent;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  transition: background 0.2s;
}

.activity-item:hover {
  background: #f9fafb;
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.alert {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.activity-icon.user {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-icon.payment {
  background: rgba(79, 70, 229, 0.1);
  color: #4f46e5;
}

.activity-icon.system {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-size: 0.9rem;
  margin-bottom: 3px;
}

.activity-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.activity-action button {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #f9fafb;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.activity-action button:hover {
  background: #4f46e5;
  color: white;
}

/* Analytics section styles */
.analytics-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.8rem;
  color: #6b7280;
}

.date-picker-btn, .metrics-btn, .segments-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.date-picker-btn:hover, .metrics-btn:hover, .segments-btn:hover {
  border-color: #4f46e5;
}

.metric-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 15px;
}

.metric-tab {
  padding: 8px 15px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.85rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-tab.active {
  background: #4f46e5;
  color: white;
}

.metric-content {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.time-series-chart {
  margin-bottom: 20px;
}

.line-chart {
  position: relative;
  height: 200px;
}

.line-chart svg {
  display: block;
}

.chart-axes {
  margin-top: 10px;
}

.x-axis {
  display: flex;
  justify-content: space-between;
}

.axis-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.breakdown-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.sort-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #6b7280;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 0.85rem;
  cursor: pointer;
}

.breakdown-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-details {
  width: 180px;
}

.item-name {
  font-size: 0.85rem;
  margin-bottom: 2px;
}

.item-value {
  font-size: 0.8rem;
  color: #6b7280;
}

.item-progress {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.item-progress .progress-bar {
  height: 100%;
  background: #4f46e5;
  border-radius: 4px;
}

.item-percentage {
  width: 40px;
  text-align: right;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Placeholder styling */
.placeholder-section {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #9ca3af;
}

.placeholder-content i {
  font-size: 3rem;
  margin-bottom: 15px;
}

.placeholder-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

/* Customer section styles */
.customer-section {
  margin-bottom: 30px;
}

.customer-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-filter {
  position: relative;
  width: 300px;
}

.search-filter i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-filter input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  font-size: 0.9rem;
  outline: none;
}

.filter-pills {
  display: flex;
  gap: 10px;
}

.filter-pill {
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill.active {
  background: #4f46e5;
  color: white;
}

.customer-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 15px;
}

.customer-table table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th {
  padding: 15px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.customer-table td {
  padding: 15px;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.customer-table tbody tr:hover {
  background: #f9fafb;
}

.customer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.customer-details {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.customer-email {
  font-size: 0.8rem;
  color: #6b7280;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.at {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-badge.paid {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #6b7280;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.pagination-info {
  font-size: 0.85rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn.active {
  background: #4f46e5;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Subscription section styles */
.subscription-section {
  margin-bottom: 30px;
}

.subscription-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.subscription-card {
  flex: 1;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.subscription-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
}

.subscription-header {
  padding: 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e0e0e0;
}

.subscription-header.featured {
  background: #4f46e5;
  color: white;
}

.plan-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.plan-price {
  margin-bottom: 5px;
}

.currency {
  font-size: 1.2rem;
  vertical-align: top;
}

.amount {
  font-size: 2.5rem;
  font-weight: 700;
}

.period {
  font-size: 1rem;
  color: #6b7280;
}

.subscription-header.featured .period {
  color: rgba(255, 255, 255, 0.8);
}

.plan-billing {
  font-size: 0.85rem;
  color: #6b7280;
}

.subscription-header.featured .plan-billing {
  color: rgba(255, 255, 255, 0.8);
}

.subscription-features {
  padding: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.feature-item i {
  color: #10b981;
}

.subscription-footer {
  padding: 0 20px 20px;
}

.subscription-btn {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.subscription-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
}

.subscription-btn.primary {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.subscription-btn.primary:hover {
  background: #4338ca;
}

.billing-history {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.subsection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.subsection-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.history-table {
  width: 100%;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th {
  padding: 10px;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

.history-table td {
  padding: 10px;
  font-size: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}

.text-btn {
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.text-btn i {
  font-size: 0.8rem;
}

.text-btn.small {
  font-size: 0.75rem;
}

/* Integrations section styles */
.integrations-section {
  margin-bottom: 30px;
}

.api-keys-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
}

.api-keys-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.api-key-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.key-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.key-name {
  font-weight: 500;
}

.key-created {
  font-size: 0.8rem;
  color: #6b7280;
}

.key-value {
  display: flex;
  align-items: center;
  gap: 10px;
}

.masked-key {
  font-family: monospace;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.key-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.key-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.key-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.integrations-grid {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.integration-filters {
  display: flex;
  gap: 10px;
}

.filter-btn {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background: white;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.integration-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.integration-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.integration-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.integration-card.connected {
  border-color: #10b981;
}

.integration-logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.integration-details {
  padding: 15px;
  flex: 1;
}

.integration-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.integration-category {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.integration-description {
  font-size: 0.85rem;
  color: #4b5563;
  margin-bottom: 15px;
}

.integration-actions {
  padding: 0 15px 15px;
}

.integration-btn {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #4f46e5;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.integration-btn:hover {
  background: #f3f4f6;
}

.integration-btn.disconnect {
  color: #ef4444;
  border-color: #ef4444;
}

.integration-btn.disconnect:hover {
  background: rgba(239, 68, 68, 0.05);
}

/* Settings section styles */
.settings-section {
  margin-bottom: 30px;
}

.settings-layout {
  display: flex;
  gap: 25px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.settings-sidebar {
  width: 220px;
  background: #f9fafb;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
}

.settings-menu {
  display: flex;
  flex-direction: column;
}

.menu-label {
  padding: 10px 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 5px;
}

.menu-item {
  padding: 10px 20px;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-item.active {
  background: #f3f4f6;
  color: #4f46e5;
  border-left: 2px solid #4f46e5;
}

.menu-item:hover:not(.active) {
  background: #f3f4f6;
}

.settings-content {
  flex: 1;
  padding: 20px;
}

.profile-settings {
  width: 100%;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.large-avatar {
  width: 80px;
  height: 80px;
  border-radius: 40px;
  overflow: hidden;
}

.large-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.settings-form {
  max-width: 600px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 5px;
  color: #4b5563;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4f46e5;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-filters {
    flex-direction: column;
  }
  
  .breakdown-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .item-details {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .item-progress {
    width: 100%;
  }
  
  .item-percentage {
    width: 100%;
    text-align: left;
    margin-top: 2px;
  }
}
</style> 
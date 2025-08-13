<template>
  <div class="mini-project-container">
    <div class="demo-controls">
      <h3>Savour Societies Platform Demo</h3>
      <p>This is an interactive demo of the Savour Societies platform. Toggle between user views below.</p>
      
      <div class="view-controls">
        <button 
          @click="currentView = 'diner'" 
          :class="{ active: currentView === 'diner' }"
          class="view-btn">
          <i class="fas fa-user"></i> Diner View
        </button>
        <button 
          @click="currentView = 'restaurant'" 
          :class="{ active: currentView === 'restaurant' }"
          class="view-btn">
          <i class="fas fa-utensils"></i> Restaurant View
        </button>
      </div>
      
      <router-link to="/project/4" class="back-btn">
        <i class="fas fa-arrow-left"></i> Back to Project Details
      </router-link>
    </div>
    
    <div class="desktop-frame">
      <div class="frame-header">
        <div class="frame-controls">
          <span class="control red"></span>
          <span class="control yellow"></span>
          <span class="control green"></span>
        </div>
        <div class="frame-title">{{ currentView === 'diner' ? 'Savour Societies - Diner Dashboard' : 'Savour Societies - Restaurant Portal' }}</div>
      </div>
      
      <!-- Diner View -->
      <div v-if="currentView === 'diner'" class="platform-content diner-view">
        <div class="platform-sidebar">
          <div class="platform-logo">Savour Societies</div>
          <nav class="platform-nav">
            <a href="#" class="nav-item active"><i class="fas fa-home"></i> Dashboard</a>
            <a href="#" class="nav-item"><i class="fas fa-calendar"></i> Upcoming Meals</a>
            <a href="#" class="nav-item"><i class="fas fa-search"></i> Discover</a>
            <a href="#" class="nav-item"><i class="fas fa-user-friends"></i> My Circle</a>
            <a href="#" class="nav-item"><i class="fas fa-utensils"></i> Saved Restaurants</a>
            <a href="#" class="nav-item"><i class="fas fa-star"></i> Reviews</a>
            <a href="#" class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          </nav>
          <div class="user-profile">
            <div class="user-avatar">JD</div>
            <div class="user-info">
              <div class="user-name">John Doe</div>
              <div class="user-status">Premium Member</div>
            </div>
          </div>
        </div>
        
        <div class="platform-main">
          <div class="platform-header">
            <h2>Welcome back, John!</h2>
            <div class="action-buttons">
              <button class="action-btn search-btn"><i class="fas fa-search"></i></button>
              <button class="action-btn notif-btn"><i class="fas fa-bell"></i><span class="notif-badge">3</span></button>
              <button class="action-btn primary-btn">Book New Experience</button>
            </div>
          </div>
          
          <div class="dashboard-content">
            <div class="upcoming-meal">
              <div class="meal-date">
                <div class="date">18</div>
                <div class="month">MAY</div>
              </div>
              <div class="meal-info">
                <h3>Mediterranean Dinner Club</h3>
                <p class="meal-location"><i class="fas fa-map-marker-alt"></i> Casa Bella Restaurant, Soho</p>
                <p class="meal-time"><i class="fas fa-clock"></i> 7:30 PM - 10:00 PM</p>
                <div class="meal-tags">
                  <span class="meal-tag">Mediterranean</span>
                  <span class="meal-tag">Group of 6</span>
                  <span class="meal-tag">Wine Pairing</span>
                </div>
                <div class="meal-attendees">
                  <div class="attendee">RK</div>
                  <div class="attendee">LM</div>
                  <div class="attendee">AS</div>
                  <div class="attendee">+3</div>
                </div>
              </div>
              <div class="meal-actions">
                <button class="meal-btn primary">Check In</button>
                <button class="meal-btn secondary">Details</button>
              </div>
            </div>
            
            <h3 class="section-title">Recommended For You</h3>
            <div class="recommendations">
              <div class="recommendation-card">
                <div class="rec-image rec-image-1"></div>
                <div class="rec-content">
                  <h4>Italian Wine & Dine</h4>
                  <p class="rec-date">May 25 • 7:00 PM</p>
                  <p class="rec-details">Authentic Italian cuisine with wine pairings. Meet 8 food enthusiasts.</p>
                  <div class="rec-price">£45 per person</div>
                  <button class="rec-btn">Book Seat</button>
                </div>
              </div>
              <div class="recommendation-card">
                <div class="rec-image rec-image-2"></div>
                <div class="rec-content">
                  <h4>Sushi Making Social</h4>
                  <p class="rec-date">May 27 • 6:30 PM</p>
                  <p class="rec-details">Learn to make sushi rolls with Chef Tanaka and 6 other guests.</p>
                  <div class="rec-price">£55 per person</div>
                  <button class="rec-btn">Book Seat</button>
                </div>
              </div>
              <div class="recommendation-card">
                <div class="rec-image rec-image-3"></div>
                <div class="rec-content">
                  <h4>Vegetarian Tasting Menu</h4>
                  <p class="rec-date">June 2 • 7:30 PM</p>
                  <p class="rec-details">6-course vegetarian tasting menu with 8 plant-based enthusiasts.</p>
                  <div class="rec-price">£40 per person</div>
                  <button class="rec-btn">Book Seat</button>
                </div>
              </div>
            </div>
            
            <div class="dashboard-stats">
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-utensils"></i></div>
                <div class="stat-value">12</div>
                <div class="stat-label">Meals Attended</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
                <div class="stat-value">48</div>
                <div class="stat-label">New Connections</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-map-marked-alt"></i></div>
                <div class="stat-value">8</div>
                <div class="stat-label">Venues Discovered</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-award"></i></div>
                <div class="stat-value">4</div>
                <div class="stat-label">Dining Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Restaurant View -->
      <div v-if="currentView === 'restaurant'" class="platform-content restaurant-view">
        <div class="platform-sidebar restaurant-sidebar">
          <div class="platform-logo">Savour Societies</div>
          <div class="restaurant-profile">
            <div class="restaurant-avatar"><i class="fas fa-utensils"></i></div>
            <div class="restaurant-name">Casa Bella Italian</div>
          </div>
          <nav class="platform-nav">
            <a href="#" class="nav-item active"><i class="fas fa-home"></i> Dashboard</a>
            <a href="#" class="nav-item"><i class="fas fa-calendar-alt"></i> Events</a>
            <a href="#" class="nav-item"><i class="fas fa-users"></i> Diners</a>
            <a href="#" class="nav-item"><i class="fas fa-clipboard-list"></i> Menus</a>
            <a href="#" class="nav-item"><i class="fas fa-chart-line"></i> Analytics</a>
            <a href="#" class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          </nav>
        </div>
        
        <div class="platform-main">
          <div class="platform-header">
            <h2>Restaurant Dashboard</h2>
            <div class="action-buttons">
              <button class="action-btn notif-btn"><i class="fas fa-bell"></i><span class="notif-badge">2</span></button>
              <button class="action-btn primary-btn">Create New Event</button>
            </div>
          </div>
          
          <div class="dashboard-content">
            <div class="restaurant-stats">
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-user-friends"></i></div>
                <div class="stat-value">124</div>
                <div class="stat-label">Monthly Diners</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                <div class="stat-value">8</div>
                <div class="stat-label">Active Events</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-pound-sign"></i></div>
                <div class="stat-value">£4,250</div>
                <div class="stat-label">Revenue</div>
              </div>
              <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-star"></i></div>
                <div class="stat-value">4.8</div>
                <div class="stat-label">Average Rating</div>
              </div>
            </div>
            
            <h3 class="section-title">Upcoming Events</h3>
            <div class="event-list">
              <div class="event-item">
                <div class="event-date">
                  <div class="date">18</div>
                  <div class="month">MAY</div>
                </div>
                <div class="event-details">
                  <h4>Mediterranean Dinner Club</h4>
                  <p><i class="fas fa-clock"></i> 7:30 PM - 10:00 PM</p>
                  <div class="event-capacity">
                    <div class="capacity-bar">
                      <div class="capacity-filled" style="width: 80%"></div>
                    </div>
                    <span>8/10 seats booked</span>
                  </div>
                </div>
                <div class="event-actions">
                  <button class="event-btn"><i class="fas fa-edit"></i></button>
                  <button class="event-btn"><i class="fas fa-list"></i></button>
                </div>
              </div>
              
              <div class="event-item">
                <div class="event-date">
                  <div class="date">24</div>
                  <div class="month">MAY</div>
                </div>
                <div class="event-details">
                  <h4>Chef's Tasting Menu Experience</h4>
                  <p><i class="fas fa-clock"></i> 6:30 PM - 9:30 PM</p>
                  <div class="event-capacity">
                    <div class="capacity-bar">
                      <div class="capacity-filled" style="width: 40%"></div>
                    </div>
                    <span>4/10 seats booked</span>
                  </div>
                </div>
                <div class="event-actions">
                  <button class="event-btn"><i class="fas fa-edit"></i></button>
                  <button class="event-btn"><i class="fas fa-list"></i></button>
                </div>
              </div>
              
              <div class="event-item">
                <div class="event-date">
                  <div class="date">2</div>
                  <div class="month">JUN</div>
                </div>
                <div class="event-details">
                  <h4>Wine Pairing Night</h4>
                  <p><i class="fas fa-clock"></i> 7:00 PM - 10:00 PM</p>
                  <div class="event-capacity">
                    <div class="capacity-bar">
                      <div class="capacity-filled" style="width: 60%"></div>
                    </div>
                    <span>6/10 seats booked</span>
                  </div>
                </div>
                <div class="event-actions">
                  <button class="event-btn"><i class="fas fa-edit"></i></button>
                  <button class="event-btn"><i class="fas fa-list"></i></button>
                </div>
              </div>
            </div>
            
            <div class="activity-section">
              <h3 class="section-title">Recent Activity</h3>
              <div class="activity-feed">
                <div class="activity-item">
                  <div class="activity-icon"><i class="fas fa-user-plus"></i></div>
                  <div class="activity-content">
                    <p><strong>New Booking:</strong> Sarah J. booked 2 seats for Mediterranean Dinner Club</p>
                    <span class="activity-time">10 minutes ago</span>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon"><i class="fas fa-star"></i></div>
                  <div class="activity-content">
                    <p><strong>New Review:</strong> Michael T. gave your Italian Wine Night 5 stars</p>
                    <span class="activity-time">2 hours ago</span>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon"><i class="fas fa-comment"></i></div>
                  <div class="activity-content">
                    <p><strong>New Message:</strong> Savour Societies team: "Your Chef's Tasting Menu has been featured"</p>
                    <span class="activity-time">Yesterday</span>
                  </div>
                </div>
                
                <div class="activity-item">
                  <div class="activity-icon"><i class="fas fa-calendar-check"></i></div>
                  <div class="activity-content">
                    <p><strong>Event Completed:</strong> Pasta Making Class with 8 attendees</p>
                    <span class="activity-time">2 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SavourSocieties',
  setup() {
    const currentView = ref('diner');
    
    return {
      currentView
    };
  }
});
</script>

<style scoped>
.mini-project-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.demo-controls {
  margin-bottom: 2rem;
  background: var(--bg-color-secondary);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.view-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.view-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: rgba(52, 152, 219, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.view-btn:hover, .view-btn.active {
  background: rgba(52, 152, 219, 0.8);
  transform: translateY(-2px);
}

.view-btn i {
  margin-right: 0.5rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  background: var(--primary-color);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.back-btn i {
  margin-right: 0.5rem;
}

.back-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
}

/* Desktop Frame Styling */
.desktop-frame {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  color: #333;
}

.frame-header {
  background: #e0e0e0;
  padding: 0.8rem;
  display: flex;
  align-items: center;
}

.frame-controls {
  display: flex;
  gap: 0.5rem;
  margin-right: 1rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red { background: #ff5f57; }
.control.yellow { background: #febc2e; }
.control.green { background: #28c840; }

.frame-title {
  flex-grow: 1;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.platform-content {
  display: flex;
  height: 700px;
}

/* Sidebar Styling */
.platform-sidebar {
  width: 250px;
  background: #1a1a2e;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.platform-logo {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
  text-align: center;
}

.platform-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 6px;
  color: #a0a0b9;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-item i {
  margin-right: 1rem;
  width: 20px;
  text-align: center;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: #3498db;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-weight: bold;
}

.user-name {
  font-weight: 500;
}

.user-status {
  font-size: 0.8rem;
  color: #64d86b;
}

/* Main Content Styling */
.platform-main {
  flex-grow: 1;
  background: #f6f8fc;
  padding: 1.5rem;
  overflow-y: auto;
}

.platform-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.platform-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  border: none;
  background: white;
  height: 40px;
  padding: 0 1rem;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-btn, .notif-btn {
  width: 40px;
  padding: 0;
  position: relative;
}

.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 18px;
  height: 18px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.primary-btn {
  background: #3498db;
  color: white;
  padding: 0 1.5rem;
  font-weight: 500;
}

/* Dashboard Content - Diner View */
.upcoming-meal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  margin-bottom: 2rem;
}

.meal-date {
  width: 80px;
  height: 80px;
  background: #3498db;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1.5rem;
  flex-shrink: 0;
}

.date {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.month {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.meal-info {
  flex-grow: 1;
}

.meal-info h3 {
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
}

.meal-location, .meal-time {
  color: #666;
  margin-bottom: 0.3rem;
}

.meal-location i, .meal-time i {
  margin-right: 0.5rem;
  color: #3498db;
}

.meal-tags {
  display: flex;
  gap: 0.5rem;
  margin: 0.8rem 0;
}

.meal-tag {
  background: #f0f7ff;
  color: #3498db;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.meal-attendees {
  display: flex;
  margin-top: 1rem;
}

.attendee {
  width: 30px;
  height: 30px;
  background: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  margin-right: -10px;
  border: 2px solid white;
}

.attendee:nth-child(1) { background: #3498db; color: white; }
.attendee:nth-child(2) { background: #e74c3c; color: white; }
.attendee:nth-child(3) { background: #2ecc71; color: white; }
.attendee:nth-child(4) { background: #f1c40f; color: white; }

.meal-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
  margin-left: 1.5rem;
}

.meal-btn {
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.meal-btn.primary {
  background: #3498db;
  color: white;
}

.meal-btn.secondary {
  background: #f0f7ff;
  color: #3498db;
}

.meal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.section-title {
  margin: 2rem 0 1rem;
  font-size: 1.4rem;
  font-weight: 600;
}

.recommendations {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.rec-image {
  height: 140px;
  background-position: center;
  background-size: cover;
}

.rec-image-1 { background-image: url('https://source.unsplash.com/random/400x200/?italian-food'); }
.rec-image-2 { background-image: url('https://source.unsplash.com/random/400x200/?sushi'); }
.rec-image-3 { background-image: url('https://source.unsplash.com/random/400x200/?vegetarian'); }

.rec-content {
  padding: 1.2rem;
}

.rec-content h4 {
  margin-bottom: 0.4rem;
  font-size: 1.2rem;
}

.rec-date {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.rec-details {
  margin-bottom: 1rem;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.4;
}

.rec-price {
  font-weight: 600;
  color: #3498db;
  margin-bottom: 1rem;
}

.rec-btn {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.rec-btn:hover {
  background: #2980b9;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 50px;
  height: 50px;
  background: #f0f7ff;
  color: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.2rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

/* Restaurant View Styling */
.restaurant-sidebar {
  background: #1a2635;
}

.restaurant-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.restaurant-avatar {
  width: 60px;
  height: 60px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.restaurant-name {
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
}

.restaurant-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.event-item {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.event-date {
  width: 70px;
  height: 70px;
  background: #e74c3c;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 1.2rem;
  flex-shrink: 0;
}

.event-details {
  flex-grow: 1;
}

.event-details h4 {
  margin-bottom: 0.4rem;
  font-size: 1.1rem;
}

.event-details p {
  color: #666;
  margin-bottom: 0.8rem;
}

.event-details p i {
  margin-right: 0.5rem;
  color: #e74c3c;
}

.event-capacity {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.capacity-bar {
  width: 100px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-right: 1rem;
  overflow: hidden;
}

.capacity-filled {
  height: 100%;
  background: #2ecc71;
}

.event-actions {
  display: flex;
  gap: 0.6rem;
  margin-left: 1rem;
}

.event-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f7f9fc;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.event-btn:hover {
  background: #3498db;
  color: white;
}

.activity-feed {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 36px;
  height: 36px;
  background: #f7f9fc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: #3498db;
  flex-shrink: 0;
}

.activity-content p {
  margin-bottom: 0.3rem;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 1100px) {
  .recommendations {
    grid-template-columns: 1fr 1fr;
  }
  
  .dashboard-stats, .restaurant-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .platform-content {
    flex-direction: column;
    height: auto;
  }
  
  .platform-sidebar {
    width: 100%;
    padding: 1rem;
  }
  
  .platform-logo {
    margin-bottom: 1rem;
  }
  
  .platform-nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .nav-item {
    flex-shrink: 0;
  }
  
  .recommendations {
    grid-template-columns: 1fr;
  }
  
  .upcoming-meal {
    flex-direction: column;
  }
  
  .meal-date {
    margin-bottom: 1rem;
  }
  
  .meal-actions {
    margin-left: 0;
    margin-top: 1rem;
    flex-direction: row;
  }
}
</style> 
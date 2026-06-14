<template>
  <div class="mini-project-container">
    <div class="demo-controls">
      <h3>Healthcare Marketplace Demo</h3>
      <p>This is an interactive demo of a healthcare marketplace. Toggle between client and practitioner views below.</p>
      
      <div class="view-controls">
        <button 
          @click="currentView = 'client'" 
          :class="{ active: currentView === 'client' }"
          class="view-btn">
          <i class="fas fa-user"></i> Client View
        </button>
        <button 
          @click="currentView = 'practitioner'" 
          :class="{ active: currentView === 'practitioner' }"
          class="view-btn">
          <i class="fas fa-user-md"></i> Practitioner View
        </button>
      </div>
      
      <router-link to="/project/6" class="back-btn">
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
        <div class="frame-title">{{ currentView === 'client' ? 'Healthcare Marketplace - Find a Therapist' : 'Healthcare Marketplace - Practitioner Dashboard' }}</div>
      </div>
      
      <!-- Client View -->
      <div v-if="currentView === 'client'" class="platform-content client-view">
        <div class="theramate-header">
          <div class="logo-section">
            <div class="logo">TheraMate<span class="ai-badge">AI</span></div>
            <p class="tagline">Find Your Perfect Therapist Match</p>
          </div>
          <div class="header-actions">
            <button class="icon-btn"><i class="fas fa-bell"></i><span class="badge">2</span></button>
            <button class="icon-btn"><i class="fas fa-user-circle"></i></button>
          </div>
        </div>
        
        <div class="search-section">
          <div class="search-bar-large">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search by location, specialization, or therapist name..." v-model="searchQuery">
            <button class="search-btn">Search</button>
          </div>
          
          <div class="filter-tags">
            <button 
              v-for="filter in filters" 
              :key="filter"
              class="filter-tag"
              :class="{ active: selectedFilters.includes(filter) }"
              @click="toggleFilter(filter)">
              {{ filter }}
            </button>
          </div>
        </div>
        
        <div class="main-content">
          <div class="therapist-results">
            <h3 class="results-title">AI-Matched Therapists Near You</h3>
            <p class="results-count">{{ filteredTherapists.length }} therapists found</p>
            
            <div class="therapist-cards">
              <div 
                v-for="therapist in filteredTherapists" 
                :key="therapist.id"
                class="therapist-card"
                @click="selectTherapist(therapist)">
                <div class="therapist-header">
                  <div class="therapist-avatar">
                    <img :src="therapist.avatar" :alt="therapist.name">
                    <span class="verified-badge" v-if="therapist.verified"><i class="fas fa-check-circle"></i></span>
                  </div>
                  <div class="therapist-info">
                    <h4>{{ therapist.name }}</h4>
                    <p class="therapist-specialty">{{ therapist.specialty }}</p>
                    <div class="therapist-rating">
                      <span class="stars">{{ '★'.repeat(Math.floor(therapist.rating)) }}</span>
                      <span class="rating-value">{{ therapist.rating }}</span>
                      <span class="review-count">({{ therapist.reviews }} reviews)</span>
                    </div>
                  </div>
                  <div class="match-score" v-if="therapist.matchScore">
                    <div class="score-circle">{{ therapist.matchScore }}%</div>
                    <span class="match-label">Match</span>
                  </div>
                </div>
                
                <div class="therapist-details">
                  <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ therapist.location }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-pound-sign"></i>
                    <span>£{{ therapist.price }}/session</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Available {{ therapist.availability }}</span>
                  </div>
                </div>
                
                <div class="therapist-tags">
                  <span v-for="tag in therapist.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
                
                <div class="therapist-actions">
                  <button class="btn-primary" @click.stop="bookAppointment(therapist)">Book Session</button>
                  <button class="btn-secondary" @click.stop="viewProfile(therapist)">View Profile</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="upcoming-appointments" v-if="upcomingAppointments.length > 0">
            <h3>Upcoming Appointments</h3>
            <div class="appointment-list">
              <div 
                v-for="appointment in upcomingAppointments" 
                :key="appointment.id"
                class="appointment-card">
                <div class="appointment-date">
                  <div class="date">{{ appointment.date }}</div>
                  <div class="time">{{ appointment.time }}</div>
                </div>
                <div class="appointment-info">
                  <h4>{{ appointment.therapistName }}</h4>
                  <p>{{ appointment.type }}</p>
                  <span class="appointment-status" :class="appointment.status">{{ appointment.status }}</span>
                </div>
                <button class="btn-icon"><i class="fas fa-chevron-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Practitioner View -->
      <div v-else class="platform-content practitioner-view">
        <div class="practitioner-sidebar">
          <div class="logo-section">
            <div class="logo">TheraMate<span class="ai-badge">AI</span></div>
          </div>
          
          <nav class="practitioner-nav">
            <a href="#" class="nav-item active"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
            <a href="#" class="nav-item"><i class="fas fa-calendar-alt"></i> Calendar</a>
            <a href="#" class="nav-item"><i class="fas fa-users"></i> Clients</a>
            <a href="#" class="nav-item"><i class="fas fa-comments"></i> Messages</a>
            <a href="#" class="nav-item"><i class="fas fa-chart-line"></i> Analytics</a>
            <a href="#" class="nav-item"><i class="fas fa-cog"></i> Settings</a>
          </nav>
          
          <div class="practitioner-profile">
            <div class="profile-avatar">
              <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Practitioner">
              <span class="verified-badge"><i class="fas fa-check-circle"></i></span>
            </div>
            <div class="profile-info">
              <h4>Dr. Sarah Mitchell</h4>
              <p>Osteopath</p>
              <div class="profile-stats">
                <div class="stat">
                  <span class="stat-value">4.9</span>
                  <span class="stat-label">Rating</span>
                </div>
                <div class="stat">
                  <span class="stat-value">127</span>
                  <span class="stat-label">Clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="practitioner-main">
          <div class="dashboard-header">
            <h2>Dashboard Overview</h2>
            <div class="header-actions">
              <button class="btn-primary"><i class="fas fa-plus"></i> New Availability</button>
            </div>
          </div>
          
          <div class="dashboard-stats">
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
              <div class="stat-content">
                <h3>{{ practitionerStats.appointmentsToday }}</h3>
                <p>Appointments Today</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-pound-sign"></i></div>
              <div class="stat-content">
                <h3>£{{ practitionerStats.revenueThisMonth }}</h3>
                <p>Revenue This Month</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-comments"></i></div>
              <div class="stat-content">
                <h3>{{ practitionerStats.unreadMessages }}</h3>
                <p>Unread Messages</p>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon"><i class="fas fa-star"></i></div>
              <div class="stat-content">
                <h3>{{ practitionerStats.rating }}</h3>
                <p>Average Rating</p>
              </div>
            </div>
          </div>
          
          <div class="dashboard-sections">
            <div class="section upcoming-appointments-section">
              <h3>Today's Appointments</h3>
              <div class="appointment-list">
                <div 
                  v-for="appointment in practitionerAppointments" 
                  :key="appointment.id"
                  class="appointment-item">
                  <div class="appointment-time">{{ appointment.time }}</div>
                  <div class="appointment-details">
                    <h4>{{ appointment.clientName }}</h4>
                    <p>{{ appointment.type }}</p>
                    <span class="appointment-status" :class="appointment.status">{{ appointment.status }}</span>
                  </div>
                  <div class="appointment-actions">
                    <button class="btn-icon"><i class="fas fa-comment"></i></button>
                    <button class="btn-icon"><i class="fas fa-ellipsis-v"></i></button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="section messages-section">
              <h3>Recent Messages</h3>
              <div class="message-list">
                <div 
                  v-for="message in recentMessages" 
                  :key="message.id"
                  class="message-item"
                  :class="{ unread: message.unread }">
                  <div class="message-avatar">
                    <img :src="message.avatar" :alt="message.name">
                  </div>
                  <div class="message-content">
                    <h4>{{ message.name }}</h4>
                    <p>{{ message.preview }}</p>
                    <span class="message-time">{{ message.time }}</span>
                  </div>
                  <span class="unread-indicator" v-if="message.unread"></span>
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
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'TheraMate',
  setup() {
    const currentView = ref('client');
    const searchQuery = ref('');
    const selectedFilters = ref<string[]>([]);
    
    const filters = ['Osteopath', 'Sports Massage', 'Sports Therapist', 'In-Person', 'Online', 'Verified'];
    
    const therapists = ref([
      {
        id: 1,
        name: 'Dr. Sarah Mitchell',
        specialty: 'Osteopath',
        location: 'London, UK',
        price: 75,
        rating: 4.9,
        reviews: 127,
        availability: 'Today',
        tags: ['Sports Injury', 'Postural Correction', 'Chronic Pain'],
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        verified: true,
        matchScore: 95
      },
      {
        id: 2,
        name: 'James Thompson',
        specialty: 'Sports Massage Therapist',
        location: 'Manchester, UK',
        price: 60,
        rating: 4.8,
        reviews: 89,
        availability: 'Tomorrow',
        tags: ['Deep Tissue', 'Recovery', 'Performance'],
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        verified: true,
        matchScore: 88
      },
      {
        id: 3,
        name: 'Dr. Emma Wilson',
        specialty: 'Sports Therapist',
        location: 'Birmingham, UK',
        price: 70,
        rating: 4.7,
        reviews: 156,
        availability: 'This Week',
        tags: ['Injury Prevention', 'Rehabilitation', 'Athletic Performance'],
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        verified: true,
        matchScore: 82
      },
      {
        id: 4,
        name: 'Michael Chen',
        specialty: 'Osteopath',
        location: 'Leeds, UK',
        price: 65,
        rating: 4.6,
        reviews: 94,
        availability: 'Next Week',
        tags: ['Back Pain', 'Neck Pain', 'Headaches'],
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        verified: true,
        matchScore: 75
      }
    ]);
    
    const upcomingAppointments = ref([
      {
        id: 1,
        date: '18 May',
        time: '10:00 AM',
        therapistName: 'Dr. Sarah Mitchell',
        type: 'Initial Consultation',
        status: 'confirmed'
      },
      {
        id: 2,
        date: '20 May',
        time: '2:30 PM',
        therapistName: 'James Thompson',
        type: 'Sports Massage',
        status: 'pending'
      }
    ]);
    
    const practitionerStats = ref({
      appointmentsToday: 5,
      revenueThisMonth: '3,450',
      unreadMessages: 3,
      rating: 4.9
    });
    
    const practitionerAppointments = ref([
      {
        id: 1,
        time: '09:00',
        clientName: 'John Smith',
        type: 'Follow-up Session',
        status: 'confirmed'
      },
      {
        id: 2,
        time: '10:30',
        clientName: 'Emma Johnson',
        type: 'Initial Consultation',
        status: 'confirmed'
      },
      {
        id: 3,
        time: '14:00',
        clientName: 'Michael Brown',
        type: 'Sports Massage',
        status: 'pending'
      },
      {
        id: 4,
        time: '15:30',
        clientName: 'Sarah Wilson',
        type: 'Treatment Session',
        status: 'confirmed'
      }
    ]);
    
    const recentMessages = ref([
      {
        id: 1,
        name: 'John Smith',
        preview: 'Thank you for the session yesterday, I feel much better...',
        time: '2 hours ago',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        unread: true
      },
      {
        id: 2,
        name: 'Emma Johnson',
        preview: 'Can we reschedule tomorrow\'s appointment to...',
        time: '5 hours ago',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        unread: true
      },
      {
        id: 3,
        name: 'Michael Brown',
        preview: 'I have a question about the treatment plan...',
        time: '1 day ago',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        unread: false
      }
    ]);
    
    const filteredTherapists = computed(() => {
      let result = therapists.value;
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(t => 
          t.name.toLowerCase().includes(query) ||
          t.location.toLowerCase().includes(query) ||
          t.specialty.toLowerCase().includes(query)
        );
      }
      
      if (selectedFilters.value.length > 0) {
        result = result.filter(t => 
          selectedFilters.value.some(f => 
            t.specialty.includes(f) || 
            t.tags.some(tag => tag.includes(f))
          )
        );
      }
      
      return result;
    });
    
    const toggleFilter = (filter: string) => {
      const index = selectedFilters.value.indexOf(filter);
      if (index > -1) {
        selectedFilters.value.splice(index, 1);
      } else {
        selectedFilters.value.push(filter);
      }
    };
    
    const selectTherapist = (therapist: any) => {
      console.log('Selected therapist:', therapist);
    };
    
    const bookAppointment = (therapist: any) => {
      console.log('Booking appointment with:', therapist);
    };
    
    const viewProfile = (therapist: any) => {
      console.log('Viewing profile:', therapist);
    };
    
    return {
      currentView,
      searchQuery,
      selectedFilters,
      filters,
      therapists,
      filteredTherapists,
      upcomingAppointments,
      practitionerStats,
      practitionerAppointments,
      recentMessages,
      toggleFilter,
      selectTherapist,
      bookAppointment,
      viewProfile
    };
  }
});
</script>

<style scoped>
.mini-project-container {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.demo-controls {
  margin-bottom: 30px;
  text-align: center;
}

.demo-controls h3 {
  font-size: 1.8rem;
  margin-bottom: 10px;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.demo-controls p {
  color: var(--text-muted);
  margin-bottom: 20px;
}

.view-controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.view-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-color);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.back-btn:hover {
  color: var(--primary-color);
  background: rgba(110, 68, 255, 0.1);
}

.desktop-frame {
  background: #1e1e1e;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.frame-header {
  height: 40px;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  padding: 0 15px;
  gap: 15px;
}

.frame-controls {
  display: flex;
  gap: 8px;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.control.red { background: #ff5f57; }
.control.yellow { background: #ffbd2e; }
.control.green { background: #28c941; }

.frame-title {
  flex: 1;
  text-align: center;
  color: #ddd;
  font-size: 13px;
}

.platform-content {
  min-height: 600px;
  background: var(--bg-color);
  padding: 30px;
}

/* Client View Styles */
.theramate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-white);
}

.ai-badge {
  font-size: 0.7rem;
  background: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
}

.tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 5px;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-color);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-color);
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
}

.search-section {
  margin-bottom: 30px;
}

.search-bar-large {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  padding: 12px 20px;
  gap: 15px;
  margin-bottom: 20px;
}

.search-bar-large i {
  color: var(--text-muted);
}

.search-bar-large input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-white);
  font-size: 1rem;
}

.search-btn {
  padding: 8px 20px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-tag {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.filter-tag:hover {
  background: rgba(255, 255, 255, 0.1);
}

.filter-tag.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.main-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.results-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--text-white);
}

.results-count {
  color: var(--text-muted);
  margin-bottom: 20px;
}

.therapist-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.therapist-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.therapist-card:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.therapist-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.therapist-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}

.therapist-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid var(--bg-color);
}

.therapist-info {
  flex: 1;
}

.therapist-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-white);
  font-size: 1.1rem;
}

.therapist-specialty {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0 0 8px 0;
}

.therapist-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #FFC107;
  font-size: 0.9rem;
}

.rating-value {
  color: var(--text-white);
  font-weight: 600;
}

.review-count {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.match-score {
  text-align: center;
}

.score-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

.match-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 5px;
}

.therapist-details {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.therapist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag {
  padding: 4px 10px;
  background: rgba(110, 68, 255, 0.1);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 0.8rem;
}

.therapist-actions {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: #4a11c9;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.upcoming-appointments h3 {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: var(--text-white);
}

.appointment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.appointment-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.appointment-date {
  text-align: center;
  min-width: 60px;
}

.appointment-date .date {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-white);
}

.appointment-date .time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.appointment-info {
  flex: 1;
}

.appointment-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-white);
  font-size: 1rem;
}

.appointment-info p {
  margin: 0 0 5px 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.appointment-status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.appointment-status.confirmed {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.appointment-status.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #FFC107;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Practitioner View Styles */
.practitioner-view {
  display: flex;
  gap: 0;
}

.practitioner-sidebar {
  width: 250px;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.practitioner-nav {
  margin: 30px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-white);
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.practitioner-profile {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 15px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  text-align: center;
}

.profile-info h4 {
  margin: 0 0 5px 0;
  color: var(--text-white);
}

.profile-info p {
  margin: 0 0 15px 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-white);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 3px;
}

.practitioner-main {
  flex: 1;
  padding: 30px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  margin: 0;
  color: var(--text-white);
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  color: var(--text-white);
  font-size: 1.5rem;
}

.stat-content p {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
}

.section h3 {
  margin: 0 0 20px 0;
  color: var(--text-white);
  font-size: 1.2rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  margin-bottom: 10px;
}

.appointment-time {
  min-width: 60px;
  font-weight: 600;
  color: var(--text-white);
}

.appointment-details {
  flex: 1;
}

.appointment-details h4 {
  margin: 0 0 5px 0;
  color: var(--text-white);
  font-size: 1rem;
}

.appointment-details p {
  margin: 0 0 5px 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.appointment-actions {
  display: flex;
  gap: 8px;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.message-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.message-item.unread {
  background: rgba(110, 68, 255, 0.1);
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
}

.message-content h4 {
  margin: 0 0 5px 0;
  color: var(--text-white);
  font-size: 0.95rem;
}

.message-content p {
  margin: 0 0 3px 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
}

@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-sections {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .practitioner-view {
    flex-direction: column;
  }
  
  .practitioner-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>


// Location Page JavaScript

// DOM Elements
const locationSearchEl = document.getElementById('locationSearch');
const searchBtnEl = document.getElementById('searchBtn');
const currentLocationEl = document.getElementById('currentLocation');
const updateLocationBtnEl = document.getElementById('updateLocationBtn');
const useCurrentLocationBtnEl = document.getElementById('useCurrentLocationBtn');
const saveLocationBtnEl = document.getElementById('saveLocationBtn');
const manualAddressEl = document.getElementById('manualAddress');
const locationListEl = document.getElementById('locationList');
const categoryBtnsEl = document.querySelectorAll('.category-btn');
const updateLocationModal = new bootstrap.Modal(document.getElementById('updateLocationModal'));

// Location Data
let userLocation = {
    address: '123 Main St, Anytown, USA',
    latitude: 40.7128,
    longitude: -74.0060
};

// Sample healthcare facility data
const healthcareFacilities = [
    {
        id: 1,
        name: 'City General Hospital',
        category: 'hospital',
        address: '456 Healthcare Blvd, Anytown, USA',
        distance: 1.2,
        phone: '(555) 123-4567',
        latitude: 40.7150,
        longitude: -74.0080
    },
    {
        id: 2,
        name: 'QuickCare Pharmacy',
        category: 'pharmacy',
        address: '789 Wellness St, Anytown, USA',
        distance: 0.5,
        phone: '(555) 987-6543',
        latitude: 40.7135,
        longitude: -74.0050
    },
    {
        id: 3,
        name: 'Downtown Medical Clinic',
        category: 'clinic',
        address: '321 Health Ave, Anytown, USA',
        distance: 0.8,
        phone: '(555) 456-7890',
        latitude: 40.7140,
        longitude: -74.0070
    },
    {
        id: 4,
        name: 'Children\'s Medical Center',
        category: 'hospital',
        address: '555 Pediatric Way, Anytown, USA',
        distance: 2.0,
        phone: '(555) 234-5678',
        latitude: 40.7160,
        longitude: -74.0090
    },
    {
        id: 5,
        name: 'MediMart Pharmacy',
        category: 'pharmacy',
        address: '888 Prescription Rd, Anytown, USA',
        distance: 1.5,
        phone: '(555) 876-5432',
        latitude: 40.7120,
        longitude: -74.0040
    }
];

// Initialize Location Page
function initializeLocationPage() {
    loadUserLocation();
    setupEventListeners();
    initializeMap();
    filterLocations('all');
}

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    searchBtnEl.addEventListener('click', performSearch);
    locationSearchEl.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    
    // Update location
    updateLocationBtnEl.addEventListener('click', function() {
        manualAddressEl.value = userLocation.address;
        updateLocationModal.show();
    });
    
    // Use current location
    useCurrentLocationBtnEl.addEventListener('click', getCurrentLocation);
    
    // Save location
    saveLocationBtnEl.addEventListener('click', saveLocation);
    
    // Category filter buttons
    categoryBtnsEl.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtnsEl.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter locations
            filterLocations(category);
        });
    });
    
    // Location item actions (call and directions buttons)
    const callButtons = document.querySelectorAll('.location-actions button:first-child');
    callButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const facility = healthcareFacilities[index];
            if (facility && facility.phone) {
                // In a real app, this would place a call
                window.location.href = `tel:${facility.phone.replace(/\D/g, '')}`;
            }
        });
    });
    
    const directionButtons = document.querySelectorAll('.location-actions button:last-child');
    directionButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const facility = healthcareFacilities[index];
            if (facility) {
                // In a real app, this would open maps with directions
                alert(`Directions to ${facility.name} would be displayed here.`);
            }
        });
    });
}

// Initialize Map
function initializeMap() {
    // This would integrate with a mapping API like Google Maps in a production app
    // For this demo, we're just using a placeholder
    console.log('Map initialized with user location:', userLocation);
}

// Perform Search
function performSearch() {
    const searchTerm = locationSearchEl.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, show all locations
        filterLocations('all');
        return;
    }
    
    // Filter locations based on search term
    const filteredFacilities = healthcareFacilities.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm) || 
        facility.address.toLowerCase().includes(searchTerm) || 
        facility.category.toLowerCase().includes(searchTerm)
    );
    
    // Display filtered results
    displayLocations(filteredFacilities);
}

// Filter Locations by Category
function filterLocations(category) {
    if (category === 'all') {
        displayLocations(healthcareFacilities);
    } else {
        const filteredFacilities = healthcareFacilities.filter(facility => 
            facility.category === category
        );
        displayLocations(filteredFacilities);
    }
}

// Display Locations
function displayLocations(facilities) {
    // In a production app, this would dynamically create the location items
    // For this demo, we're just toggling visibility of existing items
    
    const locationItems = document.querySelectorAll('.location-item');
    
    if (facilities.length === 0) {
        locationListEl.innerHTML = '<p class="text-center p-3">No healthcare facilities found matching your criteria.</p>';
        return;
    }
    
    // Show/hide location items based on filter
    locationItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const facilityExists = facilities.some(f => f.category === category);
        
        if (facilityExists) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Get Current Location
function getCurrentLocation() {
    // In a real app, this would use the Geolocation API
    // For this demo, we'll simulate it
    
    // Show loading state
    useCurrentLocationBtnEl.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Locating...';
    useCurrentLocationBtnEl.disabled = true;
    
    // Simulate geolocation delay
    setTimeout(() => {
        // Simulate a successful geolocation
        const simulatedAddress = '456 Current St, Anytown, USA';
        manualAddressEl.value = simulatedAddress;
        
        // Reset button
        useCurrentLocationBtnEl.innerHTML = '<i class="bi bi-geo-alt"></i> Use Current Location';
        useCurrentLocationBtnEl.disabled = false;
        
        // Simulate coordinates (would come from the Geolocation API in a real app)
        userLocation.latitude = 40.7129;
        userLocation.longitude = -74.0061;
    }, 1500);
}

// Save Location
function saveLocation() {
    const newAddress = manualAddressEl.value.trim();
    
    if (newAddress === '') {
        alert('Please enter an address or use current location.');
        return;
    }
    
    // Update user location
    userLocation.address = newAddress;
    
    // In a real app, we would geocode the address to get coordinates
    // For this demo, we'll just use dummy values
    userLocation.latitude = 40.7128;
    userLocation.longitude = -74.0060;
    
    // Update UI
    currentLocationEl.textContent = userLocation.address;
    
    // Save location to storage
    saveLocationToStorage();
    
    // Update map
    initializeMap();
    
    // Close modal
    updateLocationModal.hide();
}

// Load User Location from Storage
function loadUserLocation() {
    const storedLocation = localStorage.getItem('user_location');
    
    if (storedLocation) {
        userLocation = JSON.parse(storedLocation);
    }
    
    // Update UI
    currentLocationEl.textContent = userLocation.address;
}

// Save User Location to Storage
function saveLocationToStorage() {
    localStorage.setItem('user_location', JSON.stringify(userLocation));
}

// Calculate Distance Between Two Points (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    const miles = d * 0.621371; // Convert to miles
    return miles.toFixed(1);
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeLocationPage); 
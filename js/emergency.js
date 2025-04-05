// Emergency Page JavaScript

// DOM Elements
const addContactBtn = document.getElementById('addContactBtn');
const saveContactBtn = document.getElementById('saveContactBtn');
const emergencyContactsEl = document.getElementById('emergencyContacts');
const addContactModal = new bootstrap.Modal(document.getElementById('addContactModal'));
const editMedicalInfoBtn = document.getElementById('editMedicalInfoBtn');
const saveMedicalInfoBtn = document.getElementById('saveMedicalInfoBtn');
const editMedicalInfoModal = new bootstrap.Modal(document.getElementById('editMedicalInfoModal'));
const ambulanceBtn = document.getElementById('ambulanceBtn');

// Emergency Contacts Data
let emergencyContacts = [
    { id: 1, name: 'John Doe', relation: 'Family Doctor', phone: '(555) 123-4567', initials: 'JD', color: 'bg-primary' },
    { id: 2, name: 'Mary Smith', relation: 'Daughter', phone: '(555) 987-6543', initials: 'MS', color: 'bg-success' },
    { id: 3, name: 'General Hospital', relation: 'Emergency Room', phone: '(555) 867-5309', initials: 'GH', color: 'bg-danger' }
];

// Medical Information Data
let medicalInfo = {
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    medications: 'Lisinopril, Metformin',
    medicalConditions: 'Hypertension, Type 2 Diabetes'
};

// Initialize Emergency Page
function initializeEmergencyPage() {
    loadFromStorage();
    loadEmergencyContacts();
    loadMedicalInfo();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Contact Button
    addContactBtn.addEventListener('click', () => {
        document.getElementById('contactForm').reset();
        addContactModal.show();
    });
    
    // Save Contact Button
    saveContactBtn.addEventListener('click', saveEmergencyContact);
    
    // Edit Medical Info Button
    editMedicalInfoBtn.addEventListener('click', () => {
        // Populate form with current medical info
        document.getElementById('editBloodType').value = medicalInfo.bloodType;
        document.getElementById('editAllergies').value = medicalInfo.allergies;
        document.getElementById('editMedications').value = medicalInfo.medications;
        document.getElementById('editMedicalConditions').value = medicalInfo.medicalConditions;
        
        editMedicalInfoModal.show();
    });
    
    // Save Medical Info Button
    saveMedicalInfoBtn.addEventListener('click', saveMedicalInfo);
    
    // Ambulance Button
    ambulanceBtn.addEventListener('click', () => {
        // In a real app, this would connect to an ambulance service API
        // For now, we'll just simulate it with a call to emergency services
        if (confirm('This will place a call to emergency medical services. Continue?')) {
            window.location.href = 'tel:911';
        }
    });
}

// Load Emergency Contacts
function loadEmergencyContacts() {
    emergencyContactsEl.innerHTML = '';
    
    if (emergencyContacts.length === 0) {
        emergencyContactsEl.innerHTML = '<p class="text-center p-3">No emergency contacts added yet.</p>';
        return;
    }
    
    emergencyContacts.forEach(contact => {
        const contactCard = document.createElement('div');
        contactCard.className = 'contact-card';
        
        // Create clean phone number for tel: link (remove non-digits)
        const cleanPhone = contact.phone.replace(/\D/g, '');
        
        contactCard.innerHTML = `
            <div class="contact-avatar ${contact.color}">${contact.initials}</div>
            <div class="contact-info">
                <p class="contact-name">${contact.name}</p>
                <p class="contact-relation">${contact.relation}</p>
                <p class="contact-number">${contact.phone}</p>
            </div>
            <a href="tel:${cleanPhone}" class="btn btn-outline-primary call-btn">
                <i class="bi bi-telephone"></i> Call
            </a>
        `;
        
        emergencyContactsEl.appendChild(contactCard);
    });
}

// Save Emergency Contact
function saveEmergencyContact() {
    const contactName = document.getElementById('contactName').value;
    const contactRelation = document.getElementById('contactRelation').value;
    const contactPhone = document.getElementById('contactPhone').value;
    
    if (!contactName || !contactPhone) {
        alert('Please provide at least a name and phone number.');
        return;
    }
    
    // Generate initials from name
    const initials = contactName.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    // Generate random color from a set of bootstrap background colors
    const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const newContact = {
        id: Date.now(),
        name: contactName,
        relation: contactRelation,
        phone: contactPhone,
        initials: initials,
        color: color
    };
    
    emergencyContacts.push(newContact);
    saveToStorage();
    loadEmergencyContacts();
    addContactModal.hide();
}

// Load Medical Info
function loadMedicalInfo() {
    document.getElementById('bloodType').textContent = medicalInfo.bloodType;
    document.getElementById('allergies').textContent = medicalInfo.allergies || 'None';
    document.getElementById('medications').textContent = medicalInfo.medications || 'None';
    document.getElementById('medicalConditions').textContent = medicalInfo.medicalConditions || 'None';
}

// Save Medical Info
function saveMedicalInfo() {
    medicalInfo.bloodType = document.getElementById('editBloodType').value;
    medicalInfo.allergies = document.getElementById('editAllergies').value;
    medicalInfo.medications = document.getElementById('editMedications').value;
    medicalInfo.medicalConditions = document.getElementById('editMedicalConditions').value;
    
    saveToStorage();
    loadMedicalInfo();
    editMedicalInfoModal.hide();
}

// Storage Functions
function loadFromStorage() {
    const storedContacts = localStorage.getItem('emergency_contacts');
    const storedMedicalInfo = localStorage.getItem('medical_info');
    
    if (storedContacts) {
        emergencyContacts = JSON.parse(storedContacts);
    }
    
    if (storedMedicalInfo) {
        medicalInfo = JSON.parse(storedMedicalInfo);
    }
}

function saveToStorage() {
    localStorage.setItem('emergency_contacts', JSON.stringify(emergencyContacts));
    localStorage.setItem('medical_info', JSON.stringify(medicalInfo));
}

// Initialize page when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializeEmergencyPage); 
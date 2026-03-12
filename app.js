// Transparência na Alimentação - Main Application JavaScript

// Default data initialization
const defaultMenu = {
    manha: {
        'Segunda': { main: 'Café com leite, Pão, Fruta', dessert: 'Suco de laranja', calories: '350', protein: '8' },
        'Terça': { main: ' Mingau de aveia, Fruta ', dessert: 'Leite', calories: '300', protein: '6' },
        'Quarta': { main: 'Café com leite, Queijo, Pão', dessert: 'Fruta', calories: '380', protein: '12' },
        'Quinta': { main: 'Pão com manteiga, Fruta', dessert: 'Suco', calories: '320', protein: '7' },
        'Sexta': { main: 'Cuscuz com leite, Fruta', dessert: 'Suco de acerola', calories: '340', protein: '9' }
    },
    tarde: {
        'Segunda': { main: 'Lanche natural, Suco', dessert: 'Fruta', calories: '280', protein: '6' },
        'Terça': { main: 'Pão com queijo, Suco', dessert: 'Fruta', calories: '300', protein: '8' },
        'Quarta': { main: 'Biscoito, Suco, Fruta', dessert: '', calories: '250', protein: '4' },
        'Quinta': { main: 'Sanduíche, Suco', dessert: 'Fruta', calories: '320', protein: '7' },
        'Sexta': { main: 'Bolo, Suco, Fruta', dessert: '', calories: '290', protein: '5' }
    }
};

const defaultSupplies = [
    { item: 'Arroz Tipo 1', quantity: '100 kg', date: '2024-01-15', origin: 'PNAE/FNDE - Lote 4455' },
    { item: 'Feijão Carioca', quantity: '50 kg', date: '2024-01-15', origin: 'PNAE/FNDE - Lote 4455' },
    { item: 'Leite Integral', quantity: '200 Litros', date: '2024-01-14', origin: 'PNAE/FNDE' },
    { item: 'Óleo de Soja', quantity: '30 Litros', date: '2024-01-14', origin: 'PNAE/FNDE' }
];

// Initialize local storage with default data if empty
function initializeData() {
    if (!localStorage.getItem('weeklyMenu')) {
        localStorage.setItem('weeklyMenu', JSON.stringify(defaultMenu));
    }
    if (!localStorage.getItem('supplies')) {
        localStorage.setItem('supplies', JSON.stringify(defaultSupplies));
    }
}

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
    document.getElementById(`section-${sectionName}`).classList.remove('hidden');
    
    // Update tab styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-emerald-50', 'text-emerald-700');
        btn.classList.add('text-gray-600');
    });
    
    const activeTab = document.getElementById(`tab-${sectionName}`);
    if (activeTab) {
        activeTab.classList.add('active', 'bg-emerald-50', 'text-emerald-700');
        activeTab.classList.remove('text-gray-600');
    }
    
    // Load specific data
    if (sectionName === 'cardapio') {
        loadMenu();
    } else if (sectionName === 'mantimentos') {
        loadSupplies();
    }
}

// Menu Functions
let currentShift = 'manha';

function switchShift(shift) {
    currentShift = shift;
    
    // Update buttons
    const manhaBtn = document.getElementById('shift-manha');
    const tardeBtn = document.getElementById('shift-tarde');
    
    if (shift === 'manha') {
        manhaBtn.classList.add('bg-emerald-100', 'text-emerald-700');
        manhaBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
        tardeBtn.classList.remove('bg-emerald-100', 'text-emerald-700');
        tardeBtn.classList.add('text-gray-600', 'hover:bg-gray-50');
    } else {
        tardeBtn.classList.add('bg-emerald-100', 'text-emerald-700');
        tardeBtn.classList.remove('text-gray-600', 'hover:bg-gray-50');
        manhaBtn.classList.remove('bg-emerald-100', 'text-emerald-700');
        manhaBtn.classList.add('text-gray-600', 'hover:bg-gray-50');
    }
    
    loadMenu();
}

function loadMenu() {
    const container = document.getElementById('menu-container');
    const menuData = JSON.parse(localStorage.getItem('weeklyMenu') || '{}');
    const shiftData = menuData[currentShift] || {};
    
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const today = new Date().getDay(); // 0 is Sunday
    const todayName = days[today - 1] || 'Segunda'; // Adjust to match our array
    
    container.innerHTML = days.map(day => {
        const item = shiftData[day] || { 
            main: 'Cardápio não definido', 
            dessert: '-', 
            calories: '-', 
            protein: '-' 
        };
        
        const isToday = day === todayName;
        const highlightClass = isToday ? 'border-emerald-500 border-2' : 'border-gray-200';
        const badge = isToday ? '<span class="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full ml-2">Hoje</span>' : '';
        
        return `
            <div class="menu-card bg-white rounded-xl shadow-sm ${highlightClass} border overflow-hidden">
                <div class="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
                    <h3 class="font-bold text-emerald-800 flex items-center">
                        ${day}-feira ${badge}
                    </h3>
                    <i data-lucide="calendar" class="w-4 h-4 text-emerald-600"></i>
                </div>
                <div class="p-4 space-y-3">
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Refeição</p>
                        <p class="text-gray-800 font-medium">${item.main}</p>
                    </div>
                    ${item.dessert !== '-' && item.dessert ? `
                    <div>
                        <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Complemento</p>
                        <p class="text-gray-600 text-sm">${item.dessert}</p>
                    </div>
                    ` : ''}
                    <div class="flex gap-2 pt-2 border-t border-gray-100">
                        <span class="nutri-badge calories">
                            <i data-lucide="flame" class="w-3 h-3"></i>
                            ${item.calories} kcal
                        </span>
                        <span class="nutri-badge protein">
                            <i data-lucide="beef" class="w-3 h-3"></i>
                            ${item.protein}g prot
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Reinitialize icons for new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Supplies Functions
function loadSupplies() {
    const container = document.getElementById('supplies-list');
    const supplies = JSON.parse(localStorage.getItem('supplies') || '[]');
    
    if (supplies.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <i data-lucide="package-x" class="w-12 h-12 mx-auto mb-2 text-gray-300"></i>
                <p>Nenhum mantimento registrado</p>
            </div>
        `;
    } else {
        container.innerHTML = supplies.map(item => `
            <div class="p-4 flex items-start gap-3 hover:bg-gray-50 transition">
                <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i data-lucide="package" class="w-5 h-5 text-emerald-600"></i>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-800">${item.item}</h4>
                    <p class="text-sm text-gray-600">Quantidade: ${item.quantity}</p>
                    <div class="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span class="flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i>
                            ${item.date}
                        </span>
                        <span class="flex items-center gap-1">
                            <i data-lucide="truck" class="w-3 h-3"></i>
                            ${item.origin}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Notification Functions
function checkNotification() {
    const notification = JSON.parse(localStorage.getItem('notification') || 'null');
    const lastDismissed = localStorage.getItem('lastDismissedNotification');
    
    if (notification) {
        // Check if this notification was already dismissed
        if (lastDismissed === notification.date) {
            return;
        }
        
        const banner = document.getElementById('notification-banner');
        const text = document.getElementById('notification-text');
        
        if (banner && text) {
            text.textContent = notification.message;
            banner.classList.remove('hidden');
        }
    }
}

function dismissNotification() {
    const banner = document.getElementById('notification-banner');
    const notification = JSON.parse(localStorage.getItem('notification') || 'null');
    
    if (notification) {
        localStorage.setItem('lastDismissedNotification', notification.date);
    }
    
    if (banner) {
        banner.classList.add('hidden');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    
    // Only run these if on main page (index.html)
    if (document.getElementById('menu-container')) {
        loadMenu();
        checkNotification();
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Service Worker registration for PWA-like experience
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('data:text/javascript;base64,' + btoa(`
        self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
        self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
        self.addEventListener('fetch', e => e.respondWith(fetch(e.request).catch(() => new Response('Offline'))));
    `)).catch(() => console.log('Service Worker not registered'));
}

// Export functions for global access
window.showSection = showSection;
window.switchShift = switchShift;
window.dismissNotification = dismissNotification;
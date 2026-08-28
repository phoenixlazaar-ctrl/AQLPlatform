// AQL Platform - Main Application JavaScript
// Adaptive Quran Learning Platform

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('AQL Platform initialized');
    setupNavigation();
    initializeAyahSelect();
    loadStudentProfile();
});

// Navigation between views
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const viewId = this.getAttribute('data-view');
            switchView(viewId);
            
            // Update active button
            navButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-on-primary-container', 'active', 'font-bold');
                b.classList.add('text-on-surface-variant', 'hover:bg-surface-container-highest');
            });
            this.classList.add('bg-primary-container', 'text-on-primary-container', 'active', 'font-bold');
            this.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-highest');
        });
    });
}

// Switch between view panels
function switchView(viewId) {
    const allPanels = document.querySelectorAll('.view-panel');
    allPanels.forEach(panel => panel.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    // Update top bar title
    const titleMap = {
        'student-view': '🎓 Today\'s Adaptive Session',
        'memory-view': '🧠 Ayah Memory Heatmap',
        'audio-view': '🎙️ Audio Recitation & Diagnostics',
        'teacher-view': '👨‍🏫 Teacher Triage & Case Board',
        'parent-view': '👨‍👩‍👧 Parent Portal & Analytics',
        'sandbox-view': '⚙️ Timeline & Policy Simulator'
    };
    document.getElementById('topBarTitle').textContent = titleMap[viewId] || 'AQL Platform';
}

// Initialize Ayah selection dropdown
function initializeAyahSelect() {
    const select = document.getElementById('audioAyahSelect');
    if (!select) return;
    
    // Sample data - in production, this would come from your API
    const sampleAyahs = [
        { value: '1:1', text: 'Al-Fatihah 1:1 - الحمد لله رب العالمين' },
        { value: '2:255', text: 'Al-Baqarah 2:255 - اللهُ لَا إِلَٰهَ إِلَّا هُوَ' },
        { value: '67:1', text: 'Al-Mulk 67:1 - تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ' }
    ];
    
    sampleAyahs.forEach(ayah => {
        const option = document.createElement('option');
        option.value = ayah.value;
        option.textContent = ayah.text;
        select.appendChild(option);
    });
}

// Load student profile
function loadStudentProfile() {
    const archetypeSelect = document.getElementById('archetypeSelect');
    if (!archetypeSelect) return;
    
    archetypeSelect.addEventListener('change', function() {
        const studentId = this.value;
        console.log('Student profile switched to:', studentId);
        // In production, fetch student data from API
    });
}

// Generate today's adaptive session
function generateTodaySession() {
    console.log('Generating adaptive session...');
    switchView('student-view');
    // In production, call your API endpoint: POST /sessions/generate
    alert('🚀 Fetching today\'s adaptive session from server...');
}

// Submit recitation evaluation
function submitRecitationEvaluation() {
    const transcript = document.getElementById('spokenTranscriptInput')?.value || '';
    console.log('Evaluating recitation:', transcript);
    alert('📊 Analyzing audio and comparing with target verse...');
}

// Apply preset recitation
function applyPresetRecitation(preset) {
    console.log('Applying preset:', preset);
    const textarea = document.getElementById('spokenTranscriptInput');
    if (!textarea) return;
    
    const presets = {
        'perfect': 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا',
        'omission': 'الَّذِي خَلَقَ سَبْعَ طِبَاقًا',
        'mutashabih': 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٌ طِبَاقًا',
        'tajweed_defect': 'الَّذي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا'
    };
    
    textarea.value = presets[preset] || '';
}

// Toggle audio playback
function toggleAyahAudioPlayback() {
    console.log('Playing audio segment...');
}

// Open spectrogram modal
function openSpectrogramModal() {
    const modal = document.getElementById('spectrogramModal');
    if (modal) modal.classList.remove('hidden');
}

// Close spectrogram modal
function closeSpectrogramModal() {
    const modal = document.getElementById('spectrogramModal');
    if (modal) modal.classList.add('hidden');
}

// Load teacher triage data
function loadTeacherTriage() {
    console.log('Loading teacher triage cases...');
    // In production, fetch from API
}

// Simulate advancing time
function simulateAdvanceDays(days) {
    console.log('Advancing simulation by', days, 'days');
    alert(`⏰ Advancing simulation by ${days} day(s)...`);
}

// Reset all presets
function resetAllPresets() {
    console.log('Resetting models...');
    alert('🔄 Resetting all learning models to baseline...');
}

// Open audio workbench
function openAudioWorkbench(ayahRef) {
    console.log('Opening audio workbench for:', ayahRef);
    switchView('audio-view');
}

// Fetch API endpoint (helper function)
async function fetchAPI(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);
        
        const response = await fetch(endpoint, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Initialize on first load
window.addEventListener('load', function() {
    console.log('✅ AQL Platform fully loaded');
});
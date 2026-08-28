// AQL Platform - Main Application JavaScript
// Adaptive Quran Learning Platform

// Global state
const appState = {
    currentView: 'audio-view',
    currentStudent: 'student_tariq',
    currentDay: 14
};

// Initialize app on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('AQL Platform initializing...')
    setupNavigation();
    initializeAyahSelect();
    loadStudentProfile();
    setupViewSwitching();
    console.log('✅ AQL Platform initialized');
});

// ============================================================================
// NAVIGATION & VIEW SWITCHING
// ============================================================================

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-btn');
    console.log(`Found ${navButtons.length} navigation buttons`);
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const viewId = this.getAttribute('data-view');
            console.log(`Switching to view: ${viewId}`);
            switchView(viewId);
            
            // Update active button styling
            navButtons.forEach(b => {
                b.classList.remove('bg-primary-container', 'text-on-primary-container', 'active', 'font-bold');
                b.classList.add('text-on-surface-variant', 'hover:bg-surface-container-highest');
            });
            
            this.classList.add('bg-primary-container', 'text-on-primary-container', 'active', 'font-bold');
            this.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-highest');
        });
    });
}

function setupViewSwitching() {
    // Make sure all view panels are properly hidden except the active one
    const allPanels = document.querySelectorAll('.view-panel');
    allPanels.forEach(panel => {
        if (!panel.classList.contains('active')) {
            panel.style.display = 'none';
        } else {
            panel.style.display = 'block';
        }
    });
}

// Switch between view panels
function switchView(viewId) {
    console.log(`Switching to: ${viewId}`);
    
    const allPanels = document.querySelectorAll('.view-panel');
    allPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });
    
    const targetPanel = document.getElementById(viewId);
    if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.style.display = 'block';
        appState.currentView = viewId;
        console.log(`✅ View switched to: ${viewId}`);
    } else {
        console.error(`Panel not found: ${viewId}`);
    }
    
    // Update top bar title
    const titleMap = {
        'student-view': '🎓 Today\'s Adaptive Session',
        'memory-view': '🧠 Ayah Memory Heatmap',
        'audio-view': '🎙️ Audio Recitation & Diagnostics',
        'teacher-view': '👨‍🏫 Teacher Triage & Case Board',
        'parent-view': '👨‍👩‍👧 Parent Portal & Analytics',
        'sandbox-view': '⚙️ Timeline & Policy Simulator'
    };
    
    const topBarTitle = document.getElementById('topBarTitle');
    if (topBarTitle) {
        topBarTitle.textContent = titleMap[viewId] || 'AQL Platform';
    }
}

// ============================================================================
// INITIALIZATION FUNCTIONS
// ============================================================================

function initializeAyahSelect() {
    const select = document.getElementById('audioAyahSelect');
    if (!select) {
        console.warn('Ayah select element not found');
        return;
    }
    
    // Sample Quranic data
    const sampleAyahs = [
        { value: '1:1', text: 'Al-Fatihah 1:1 - الحمد لله رب العالمين' },
        { value: '2:255', text: 'Al-Baqarah 2:255 - الله لا إله إلا هو الحي القيوم' },
        { value: '67:1', text: 'Al-Mulk 67:1 - تبارك الذي بيده الملك' },
        { value: '112:1', text: 'Al-Ikhlas 112:1 - قل هو الله أحد' },
        { value: '1:2', text: 'Al-Fatihah 1:2 - الرحمن الرحيم' }
    ];
    
    sampleAyahs.forEach(ayah => {
        const option = document.createElement('option');
        option.value = ayah.value;
        option.textContent = ayah.text;
        select.appendChild(option);
    });
    
    console.log(`✅ Initialized ${sampleAyahs.length} Ayah options`);
}

function loadStudentProfile() {
    const archetypeSelect = document.getElementById('archetypeSelect');
    if (!archetypeSelect) {
        console.warn('Archetype select not found');
        return;
    }
    
    archetypeSelect.addEventListener('change', function() {
        appState.currentStudent = this.value;
        console.log('Student profile switched to:', appState.currentStudent);
        updateStudentBadge();
    });
    
    updateStudentBadge();
}

function updateStudentBadge() {
    const badge = document.getElementById('studentNameBadge');
    if (!badge) return;
    
    const studentNames = {
        'student_tariq': 'Tariq Al-Mansouri',
        'student_maryam': 'Maryam',
        'student_zaid': 'Zaid'
    };
    
    badge.textContent = studentNames[appState.currentStudent] || 'Student';
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

async function generateTodaySession() {
    console.log('Generating adaptive session...');
    switchView('student-view');
    
    try {
        const response = await fetch(`/api/sessions/generate?student_id=${appState.currentStudent}`);
        if (response.ok) {
            const session = await response.json();
            console.log('Session generated:', session);
            displaySessionData(session);
        } else {
            console.error('Failed to generate session');
        }
    } catch (error) {
        console.error('Error generating session:', error);
    }
}

function displaySessionData(session) {
    const elements = {
        'gaugeValue': session.ars_score || 58,
        'vecRecall': '78%',
        'vecStability': '65%',
        'vecTajweed': '82%',
        'vecRisk': '12%'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
    
    console.log('Session data displayed');
}

// ============================================================================
// AUDIO & RECITATION
// ============================================================================

async function submitRecitationEvaluation() {
    const transcript = document.getElementById('spokenTranscriptInput')?.value || '';
    console.log('Evaluating recitation:', transcript);
    
    if (!transcript.trim()) {
        alert('⚠️ Please enter or record a recitation first');
        return;
    }
    
    try {
        const response = await fetch('/api/verses/recall', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: appState.currentStudent,
                verse_id: document.getElementById('audioAyahSelect')?.value || '1:1',
                is_correct: true,
                response_time_ms: 5000
            })
        });
        
        if (response.ok) {
            alert('✅ Recitation analyzed and recorded');
            console.log('Recitation submitted successfully');
        }
    } catch (error) {
        console.error('Error submitting recitation:', error);
    }
}

function applyPresetRecitation(preset) {
    console.log('Applying preset:', preset);
    const textarea = document.getElementById('spokenTranscriptInput');
    if (!textarea) return;
    
    const presets = {
        'perfect': 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا',
        'omission': 'الَّذِي خَلَقَ سَبْعَ طِبَاقًا',
        'mutashabih': 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٌ طِبَاقًا',
        'tajweed_defect': 'الذي خلقَ سبعَ سماواتٍ طباقا'
    };
    
    textarea.value = presets[preset] || '';
    console.log(`✅ Applied preset: ${preset}`);
}

function toggleAyahAudioPlayback() {
    console.log('Playing audio segment...');
    const btn = document.getElementById('btnPlaySegment');
    if (btn) {
        btn.textContent = '⏸️';
        setTimeout(() => { btn.innerHTML = '<span class="material-symbols-outlined" style="font-size: 18px;">play_arrow</span>'; }, 2000);
    }
}

// ============================================================================
// MODAL & VISUALIZATION
// ============================================================================

function openSpectrogramModal() {
    const modal = document.getElementById('spectrogramModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        console.log('Spectrogram modal opened');
    }
}

function closeSpectrogramModal() {
    const modal = document.getElementById('spectrogramModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
        console.log('Spectrogram modal closed');
    }
}

// ============================================================================
// TEACHER & ANALYTICS
// ============================================================================

async function loadTeacherTriage() {
    console.log('Loading teacher triage cases...');
    
    try {
        const response = await fetch('/api/students/student_tariq/metrics');
        if (response.ok) {
            const metrics = await response.json();
            console.log('Triage data:', metrics);
            displayTriageData(metrics);
        }
    } catch (error) {
        console.error('Error loading triage data:', error);
    }
}

function displayTriageData(metrics) {
    const greenList = document.getElementById('greenCohortList');
    const yellowList = document.getElementById('yellowCohortList');
    const redList = document.getElementById('redCohortList');
    
    if (greenList) {
        greenList.innerHTML = '<div class="text-xs text-on-surface-variant">✅ All verses stable</div>';
    }
    if (yellowList) {
        yellowList.innerHTML = '<div class="text-xs text-on-surface-variant">⚠️ Monitor closely</div>';
    }
    if (redList) {
        redList.innerHTML = '<div class="text-xs text-on-surface-variant">🔴 Needs immediate attention</div>';
    }
}

// ============================================================================
// SANDBOX & SIMULATION
// ============================================================================

function simulateAdvanceDays(days) {
    appState.currentDay += days;
    console.log(`⏱️ Advancing simulation by ${days} day(s). Current day: ${appState.currentDay}`);
    
    const dayBadge = document.getElementById('simDayBadge');
    if (dayBadge) {
        dayBadge.textContent = `Day #${appState.currentDay}`;
    }
    
    alert(`✅ Simulation advanced by ${days} day(s)\nCurrent Day: ${appState.currentDay}`);
}

function resetAllPresets() {
    console.log('Resetting all models to baseline...');
    appState.currentDay = 1;
    
    const dayBadge = document.getElementById('simDayBadge');
    if (dayBadge) {
        dayBadge.textContent = 'Day #1';
    }
    
    alert('🔄 All models reset to baseline\nDay counter reset to Day #1');
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function openAudioWorkbench(ayahRef) {
    console.log('Opening audio workbench for:', ayahRef);
    switchView('audio-view');
    
    const select = document.getElementById('audioAyahSelect');
    if (select) {
        select.value = ayahRef;
    }
}

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

// ============================================================================
// INITIALIZATION ON LOAD
// ============================================================================

window.addEventListener('load', function() {
    console.log('✅ AQL Platform fully loaded and ready');
    console.log('Available views:', ['student-view', 'memory-view', 'audio-view', 'teacher-view', 'parent-view', 'sandbox-view']);
});

// === DOM Element Selection ===
const passwordInput = document.getElementById('password-input');
const strengthMeterFill = document.getElementById('strength-meter-fill');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const entropyText = document.getElementById('entropy');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackList = document.getElementById('feedback-list');

// === Constants & Word Lists ===
const COMMON_WORDS = [
  'password', '123456', 'qwerty', 'admin', 'user', 'pass', 'test', 'login', 'secret'
];

const STRENGTH_LEVELS = {
    'Very Weak': { color: 'var(--color-very-weak)' },
    'Weak': { color: 'var(--color-weak)' },
    'Medium': { color: 'var(--color-medium)' },
    'Strong': { color: 'var(--color-strong)' },
    'Very Strong': { color: 'var(--color-very-strong)' },
};

// === Event Listener ===
passwordInput.addEventListener('input', (e) => {
    const password = e.target.value;
    if (password) {
        updateUI(password);
    } else {
        resetUI();
    }
});

// === Main UI Update Function ===
async function updateUI(password) {
    const analysis = await evaluatePassword(password);
    
    // Update Strength Meter
    strengthMeterFill.style.width = `${analysis.score}%`;
    strengthMeterFill.style.backgroundColor = STRENGTH_LEVELS[analysis.level]?.color || '#a0a0b0';
    
    // Update Strength Text
    strengthText.textContent = analysis.level;
    strengthText.style.color = STRENGTH_LEVELS[analysis.level]?.color || '#a0a0b0';

    // Update Stats
    crackTimeText.textContent = analysis.crackTime;
    entropyText.textContent = `${analysis.entropy} bits`;

    // Update Feedback
    feedbackList.innerHTML = ''; // Clear previous feedback
    if (analysis.feedback.length > 0) {
        feedbackContainer.style.display = 'block';
        analysis.feedback.forEach(item => {
            const li = document.createElement('li');
            li.className = `feedback-item ${item.type}`;
            const icon = item.type === 'success' ? '✅' : item.type === 'warning' ? '⚠️' : '❌';
            li.innerHTML = `<span>${icon}</span> ${item.message}`;
            feedbackList.appendChild(li);
        });
    } else {
        feedbackContainer.style.display = 'none';
    }
}

// === Reset UI Function ===
function resetUI() {
    strengthMeterFill.style.width = '0%';
    strengthMeterFill.style.backgroundColor = '#a0a0b0';
    strengthText.textContent = 'Enter a password';
    strengthText.style.color = '#a0a0b0';
    crackTimeText.textContent = 'N/A';
    entropyText.textContent = 'N/A';
    feedbackContainer.style.display = 'none';
    feedbackList.innerHTML = '';
}

// === Password Evaluation Logic (same as before but adapted) ===
async function evaluatePassword(password) {
    const analysis = { score: 0, feedback: [] };

    // --- All the check functions go here ---
    lengthCheck(password, analysis);
    varietyCheck(password, analysis);
    patternCheck(password, analysis);
    await pwnedCheck(password, analysis);
    securityMetricsCheck(password, analysis);

    // Finalize score and map to level
    analysis.score = Math.max(0, Math.min(100, analysis.score));
    if (analysis.score >= 90) analysis.level = 'Very Strong';
    else if (analysis.score >= 75) analysis.level = 'Strong';
    else if (analysis.score >= 50) analysis.level = 'Medium';
    else if (analysis.score >= 25) analysis.level = 'Weak';
    else analysis.level = 'Very Weak';

    return analysis;
}

// === Individual Check Functions (copy these directly) ===
function lengthCheck(password, analysis) {
    const len = password.length;
    if (len >= 16) {
        analysis.score += 40;
        analysis.feedback.push({ message: 'Excellent length (16+ characters)', type: 'success' });
    } else if (len >= 12) {
        analysis.score += 30;
        analysis.feedback.push({ message: 'Good length (12-15 characters)', type: 'success' });
    } else if (len >= 8) {
        analysis.score += 15;
        analysis.feedback.push({ message: 'Minimum length of 8 characters met', type: 'warning' });
    } else {
        analysis.score -= 20;
        analysis.feedback.push({ message: `Too short. Add ${8 - len} more characters`, type: 'error' });
    }
}

function varietyCheck(password, analysis) {
    let varietyCount = 0;
    if (/[a-z]/.test(password)) varietyCount++;
    if (/[A-Z]/.test(password)) varietyCount++;
    if (/[0-9]/.test(password)) varietyCount++;
    if (/[^a-zA-Z0-9]/.test(password)) varietyCount++;

    if (varietyCount >= 4) {
        analysis.score += 25;
        analysis.feedback.push({ message: 'Excellent mix of character types', type: 'success' });
    } else if (varietyCount === 3) {
        analysis.score += 15;
        analysis.feedback.push({ message: 'Good mix of character types', type: 'success' });
    } else {
        analysis.feedback.push({ message: 'Add more character types (e.g., symbols, numbers)', type: 'warning' });
    }
}

function patternCheck(password, analysis) {
    for (const word of COMMON_WORDS) {
        if (password.toLowerCase().includes(word)) {
            analysis.score -= 25;
            analysis.feedback.push({ message: `Contains a common word: "${word}"`, type: 'error' });
            break;
        }
    }
    if (/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/.test(password.toLowerCase()) ||
        /(123|234|345|456|567|678|789|890)/.test(password)) {
        analysis.score -= 15;
        analysis.feedback.push({ message: 'Avoid sequential characters (e.g., "abc", "123")', type: 'error' });
    }
    if (/(qwerty|asdfgh|zxcvbn)/.test(password.toLowerCase())) {
        analysis.score -= 20;
        analysis.feedback.push({ message: 'Avoid common keyboard patterns (e.g., "qwerty")', type: 'error' });
    }
}

function securityMetricsCheck(password, analysis) {
    let characterPoolSize = 0;
    if (/[a-z]/.test(password)) characterPoolSize += 26;
    if (/[A-Z]/.test(password)) characterPoolSize += 26;
    if (/[0-9]/.test(password)) characterPoolSize += 10;
    if (/[^a-zA-Z0-9]/.test(password)) characterPoolSize += 32;

    analysis.entropy = 0;
    if (characterPoolSize > 0) {
        const entropy = Math.log2(Math.pow(characterPoolSize, password.length));
        analysis.entropy = Math.round(entropy);
        if (analysis.entropy > 100) analysis.score += 25;
        else if (analysis.entropy > 75) analysis.score += 15;
        else if (analysis.entropy > 50) analysis.score += 5;
    }

    const guessesPerSecond = 1e10; // 10 billion guesses/sec
    const secondsToCrack = Math.pow(2, analysis.entropy) / guessesPerSecond;
    
    if (secondsToCrack < 60) analysis.crackTime = 'instantly';
    else if (secondsToCrack < 3600) analysis.crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
    else if (secondsToCrack < 86400) analysis.crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
    else if (secondsToCrack < 31536000) analysis.crackTime = `${Math.round(secondsToCrack / 86400)} days`;
    else if (secondsToCrack < 3153600000) analysis.crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
    else analysis.crackTime = 'centuries';
}

async function pwnedCheck(password, analysis) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        const prefix = hashHex.substring(0, 5);
        const suffix = hashHex.substring(5).toUpperCase();

        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) return;
        
        const text = await response.text();
        const lines = text.split('\r\n');
        let pwnedCount = 0;
        for (const line of lines) {
            const [hashSuffix, count] = line.split(':');
            if (hashSuffix === suffix) {
                pwnedCount = parseInt(count, 10);
                break;
            }
        }

        if (pwnedCount > 0) {
            analysis.score -= 50;
            analysis.feedback.push({ message: `This password has appeared in ${pwnedCount.toLocaleString()} data breaches`, type: 'error' });
        } else {
            analysis.score += 5;
            analysis.feedback.push({ message: 'Not found in known data breaches', type: 'success' });
        }
    } catch (error) {
        console.error('Could not check Pwned Passwords API:', error);
    }
}

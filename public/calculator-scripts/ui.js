// HALKETT Calculator - UI Functions v60

// Check for global variables and use them if available
if (typeof projectConfig === 'undefined') {
    var projectConfig = {};
}
// ... other global checks ...

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced notification system
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const notificationText = document.getElementById('notificationText');
    const notificationIcon = document.getElementById('notificationIcon');
    
    let iconSVG = '';
    switch(type) {
        case 'success':
            iconSVG = '<polyline points="20 6 9 17 4 12"></polyline>';
            break;
        case 'error':
            iconSVG = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>';
            break;
        case 'info':
            iconSVG = '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>';
            break;
        case 'warning':
            iconSVG = '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>';
            break;
    }
    
    if (notificationIcon) notificationIcon.innerHTML = iconSVG;
    if (notificationText) notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    if (notification.hideTimeout) {
        clearTimeout(notification.hideTimeout);
    }
    
    notification.hideTimeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Loading overlay control
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// Highlight error fields
function highlightError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#B19359';
        setTimeout(() => {
            field.style.borderColor = '#D1C6B4';
        }, 3000);
    }
}

// Step indicators
function createStepIndicators() {
    const indicators = document.getElementById('stepIndicators');
    if (!indicators) return;
    
    const steps = [
        { num: 1, title: 'System', icon: '📋' },
        { num: 2, title: 'Configure', icon: '📐' },
        { num: 3, title: 'Design', icon: '🎨' },
        { num: 4, title: 'Materials', icon: '🏗️' },
        { num: 5, title: 'Walls', icon: '📏' },
        { num: 6, title: 'Results', icon: '✅' }
    ];
    
    indicators.innerHTML = steps.map(step => {
        const isActive = projectConfig.currentStep === step.num;
        const isCompleted = projectConfig.currentStep > step.num;
        const canNavigate = step.num < projectConfig.currentStep;
        
        return `
            <div class="step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}" 
                 ${canNavigate ? `onclick="goToStep(${step.num})"` : ''}
                 style="${canNavigate ? 'cursor: pointer;' : 'cursor: default;'}">
                <div class="step-icon">${step.icon}</div>
                <div class="step-label">${step.title}</div>
            </div>
        `;
    }).join('');
}

// Auto-save progress
function autoSaveProgress() {
    const progress = {
        config: projectConfig,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('halkettProgress', JSON.stringify(progress));
}

// Toggle metric units
function toggleUnits() {
    projectConfig.useMetric = !projectConfig.useMetric;
    const btn = document.getElementById('unitToggle');
    btn.textContent = projectConfig.useMetric ? 'Switch to Imperial' : 'Switch to Metric';
    
    // Update all displayed values
    updateAllDisplayedUnits();
    showNotification(`Switched to ${projectConfig.useMetric ? 'Metric' : 'Imperial'} units`, 'info');
}

function updateAllDisplayedUnits() {
    // Update input placeholders and labels
    const heightInputs = document.querySelectorAll('input[type="number"][id*="Height"], input[id*="length"]');
    heightInputs.forEach(input => {
        if (projectConfig.useMetric) {
            input.placeholder = input.placeholder.replace('inches', 'mm');
        } else {
            input.placeholder = input.placeholder.replace('mm', 'inches');
        }
    });
}

// Material details handling - ONLY DECLARE ONCE
let materialDetailsListeners = [];

function updateMaterialDetails() {
    const material = document.querySelector('input[name="material"]:checked')?.value;
    if (!material) return;
    
    const detailsDiv = document.getElementById('materialDetails');
    if (!detailsDiv) return;
    
    // Remove previous event listeners
    materialDetailsListeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
    });
    materialDetailsListeners = []; // Clear the array, don't redeclare it
    
    let html = '<div class="form-group">';
    switch(material) {
        case 'natural-wood':
            html += `
                <label for="woodSpecies">Wood Species</label>
                <select id="woodSpecies">
                    <option value="">Select wood species...</option>
                    <option value="white-oak">White Oak</option>
                    <option value="walnut">Walnut</option>
                    <option value="sapele">Sapele</option>
                </select>
                </div>
                <div class="form-group">
                <label for="woodStain">Stain Color</label>
                <select id="woodStain">
                    <option value="">Select stain color...</option>
                    <option value="clear">Clear (Natural)</option>
                    <option value="medium">Medium Stain</option>
                    <option value="dark">Dark Stain</option>
                </select>
                </div>
                <div class="form-group">
                <label for="woodSheen">Finish Sheen</label>
                <select id="woodSheen">
                    <option value="">Select sheen level...</option>
                    <option value="matte">Matte</option>
                    <option value="satin">Satin</option>
                    <option value="high-gloss">High Gloss - Premium</option>
                </select>`;
            break;
        case 'painted':
            html += `
                <label for="paintColor">Paint Color</label>
                <select id="paintColor">
                    <option value="">Select paint color...</option>
                    <option value="pure-white">Pure White - SW7005</option>
                    <option value="alabaster">Alabaster - SW7008</option>
                    <option value="tricorn-black">Tricorn Black - SW6258</option>
                    <option value="urbane-bronze">Urbane Bronze - SW7048</option>
                    <option value="repose-gray">Repose Gray - SW7015</option>
                    <option value="naval">Naval - SW6244</option>
                    <option value="sage">Evergreen Fog - SW9130</option>
                    <option value="accessible-beige">Accessible Beige - SW7036</option>
                </select>
                </div>
                <div class="form-group">
                <label for="paintSheen">Paint Sheen</label>
                <select id="paintSheen">
                    <option value="">Select sheen level...</option>
                    <option value="matte">Matte (0-5% sheen)</option>
                    <option value="eggshell">Eggshell (10-15% sheen)</option>
                    <option value="satin">Satin (25-35% sheen)</option>
                    <option value="semi-gloss">Semi-Gloss (50-70% sheen) - Premium</option>
                    <option value="high-gloss">High Gloss (85%+ sheen) - Premium</option>
                </select>`;
            break;
        case 'leather':
            html += `
                <label for="leatherType">Leather Type</label>
                <select id="leatherType">
                    <option value="">Select leather type...</option>
                    <option value="crock">Crock</option>
                    <option value="shagreen">Shagreen</option>
                    <option value="bison">Bison</option>
                </select>
                </div>
                <div class="form-group">
                <label for="leatherColor">Leather Color</label>
                <select id="leatherColor">
                    <option value="">Select leather color...</option>
                    <option value="bordeaux">Bordeaux</option>
                    <option value="cognac">Cognac</option>
                    <option value="ebony">Ebony</option>
                    <option value="midnight">Midnight</option>
                </select>`;
            break;
        case 'metal':
            html += `
                <label for="materialDetail">Metal Finish</label>
                <select id="materialDetail">
                    <option value="">Select metal finish...</option>
                    <option value="copper">Copper</option>
                    <option value="brass">Brass</option>
                    <option value="zinc">Zinc</option>
                    <option value="bronze">Bronze</option>
                    <option value="stainless-steel">Stainless Steel</option>
                    <option value="blackened-steel">Blackened Steel</option>
                </select>`;
            break;
    }
    html += '</div>';
    
    detailsDiv.innerHTML = html;
    
    if (material === 'leather') {
        setTimeout(() => {
            const leatherType = document.getElementById('leatherType');
            const leatherColor = document.getElementById('leatherColor');
            
            if (leatherType && leatherColor) {
                const handler = updateLeatherColor;
                leatherType.addEventListener('change', handler);
                leatherColor.addEventListener('change', handler);
                
                materialDetailsListeners.push(
                    { element: leatherType, event: 'change', handler },
                    { element: leatherColor, event: 'change', handler }
                );
            }
        }, 0);
    }
}

function updateLeatherColor() {
    const leatherType = document.getElementById('leatherType');
    const leatherColor = document.getElementById('leatherColor');
    if (leatherType && leatherColor && leatherType.value && leatherColor.value) {
        projectConfig.materialDetail = leatherType.value + '-' + leatherColor.value;
    }
}

// Wall generation and live preview
function generateWalls() {
    const count = parseInt(document.getElementById('wallCount').value) || 0;
    const container = document.getElementById('wallsContainer');
    
    if (count < 1 || count > 10) {
        container.innerHTML = '<div class="warning">Please enter 1-10 walls</div>';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= count; i++) {
        const unitLabel = projectConfig.useMetric ? 'mm' : 'inches';
        html += `
            <div class="wall-config" id="wallConfig${i}">
                <h4>Wall ${i}</h4>
                <div class="form-group">
                    <label for="length${i}">
                        Wall Length (${unitLabel})
                        <span class="tooltip" data-tooltip="Measure from corner to corner" style="color: #A1A2A0; margin-left: 5px;">ⓘ</span>
                    </label>
                    <input type="number" id="length${i}" step="${projectConfig.useMetric ? '1' : '0.125'}" 
                           placeholder="Enter wall length in ${unitLabel}" inputmode="decimal">
                    <div id="lengthError${i}" class="field-error"></div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="left${i}">Left Side</label>
                        <select id="left${i}">
                            <option value="">Select termination...</option>
                            <option value="end">Starting End</option>
                            <option value="inside">Inside Corner</option>
                            <option value="outside">Outside Corner</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="right${i}">Right Side</label>
                        <select id="right${i}">
                            <option value="">Select termination...</option>
                            <option value="end">Ending End</option>
                            <option value="inside">Inside Corner</option>
                            <option value="outside">Outside Corner</option>
                        </select>
                    </div>
                </div>
                ${i > 1 ? `
                <div class="form-group">
                    <label for="connected${i}">Connected to previous wall?</label>
                    <select id="connected${i}">
                        <option value="">Select connection...</option>
                        <option value="no">No - Separate wall</option>
                        <option value="yes">Yes - Shares corner</option>
                    </select>
                </div>` : ''}
                <div id="result${i}" class="wall-result"></div>
            </div>
        `;
    }
    container.innerHTML = html;
    
    // Add event listeners for live calculation
    for (let i = 1; i <= count; i++) {
        const lengthInput = document.getElementById(`length${i}`);
        const leftSelect = document.getElementById(`left${i}`);
        const rightSelect = document.getElementById(`right${i}`);
        
        const liveCalc = debounce(() => liveCalculateWall(i), 300);
        
        lengthInput.addEventListener('input', liveCalc);
        leftSelect.addEventListener('change', liveCalc);
        rightSelect.addEventListener('change', liveCalc);
        
        lengthInput.addEventListener('blur', () => {
            const value = projectConfig.useMetric ? fromMetric(parseFloat(lengthInput.value)) : parseFloat(lengthInput.value);
            const validation = validateWallLength(value);
            const errorDiv = document.getElementById(`lengthError${i}`);
            
            if (!validation.valid) {
                errorDiv.textContent = validation.error;
                errorDiv.style.display = 'block';
                highlightError(`length${i}`);
            } else {
                errorDiv.style.display = 'none';
            }
        });
    }
}

// Live wall calculation preview
function liveCalculateWall(wallNumber) {
    const lengthInput = document.getElementById(`length${wallNumber}`);
    const length = projectConfig.useMetric ? 
        fromMetric(parseFloat(lengthInput.value)) : 
        parseFloat(lengthInput.value);
    
    const left = document.getElementById(`left${wallNumber}`).value;
    const right = document.getElementById(`right${wallNumber}`).value;
    const resultDiv = document.getElementById(`result${wallNumber}`);
    
    if (length && left && right) {
        const validation = validateWallLength(length);
        
        if (!validation.valid) {
            resultDiv.innerHTML = `<div class="live-preview error">⚠️ ${validation.error}</div>`;
            return;
        }
        
        // Use memoized calculation
        const cacheKey = `${length}-${left}-${right}`;
        const calc = memoizedCalculation(cacheKey, () => calculateWall(length, left, right));
        
        if (calc.success) {
            resultDiv.innerHTML = `
                <div class="live-preview success">
                    <svg style="width: 16px; height: 16px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Valid configuration
                    <small>Visible filler: ${formatDimension(calc.visible)} each side</small>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="live-preview warning">
                    <svg style="width: 16px; height: 16px; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Checking configuration...
                </div>
            `;
        }
    } else {
        resultDiv.innerHTML = '';
    }
}

// Gallery Modal Functions
function openGallery() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function closeGallery() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
    document.body.style.overflow = '';
}

function closeGalleryOutside(event) {
    if (event.target === event.currentTarget) {
        closeGallery();
    }
}

// Material sample request modal
function showSampleRequest() {
    const modal = document.getElementById('sampleModal');
    if (!modal) return;
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeSampleModal() {
    const modal = document.getElementById('sampleModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

function submitSampleRequest() {
    const form = document.getElementById('sampleForm');
    if (!form) return;
    const formData = new FormData(form);
    
    // In real implementation, this would send to server
    const requestData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        materials: formData.getAll('materials'),
        notes: formData.get('notes'),
        configuration: {
            project: projectConfig,
            specification: typeof globalSpecification !== 'undefined' ? globalSpecification : {}
        }
    };
    
    console.log('Sample request:', requestData);
    
    // Simulate submission
    showNotification('Sample request submitted! We\'ll contact you within 24 hours.', 'success');
    closeSampleModal();
    
    // Create mailto link as backup
    const subject = 'HALKETT Material Sample Request';
    const body = `Name: ${requestData.name}
Email: ${requestData.email}
Phone: ${requestData.phone}
Company: ${requestData.company}
Materials Requested: ${requestData.materials.join(', ')}
Notes: ${requestData.notes}

Configuration attached.`;
    
    window.location.href = `mailto:samples@halkett.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Recent configurations modal
function showRecentConfigurations() {
    const modal = document.getElementById('recentModal');
    const list = document.getElementById('recentList');
    
    if (!modal || !list) return;
    
    const recentConfigurations = JSON.parse(localStorage.getItem('recentConfigurations') || '[]');
    
    if (recentConfigurations.length === 0) {
        list.innerHTML = '<div class="recent-item">No recent configurations found</div>';
    } else {
        list.innerHTML = recentConfigurations.map(recent => `
            <div class="recent-item" onclick="loadRecentConfig('${recent.id}')">
                <div class="recent-name">${recent.name}</div>
                <div class="recent-details">
                    ${recent.summary} • ${new Date(recent.date).toLocaleDateString()}
                </div>
            </div>
        `).join('');
    }
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeRecentModal() {
    const modal = document.getElementById('recentModal');
    if (!modal) return;
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 300);
}

function loadRecentConfig(id) {
    const recentConfigurations = JSON.parse(localStorage.getItem('recentConfigurations') || '[]');
    const recent = recentConfigurations.find(r => r.id === id);
    if (recent) {
        if (typeof restoreConfiguration === 'function') {
            restoreConfiguration(recent.config);
            closeRecentModal();
            showNotification('Configuration loaded from recent projects', 'success');
        }
    }
}

// Display cost estimate
function displayCostEstimate() {
    if (typeof calculateCosts !== 'function') return;
    
    const costs = calculateCosts();
    if (!costs) return;
    
    if (typeof globalCostEstimate !== 'undefined') {
        globalCostEstimate = costs;
    }
    
    const costHTML = `
        <div class="cost-estimate">
            <h3>COST ESTIMATE</h3>
            <div class="cost-section">
                <h4>Materials</h4>
                <div class="cost-line">
                    <span>Boards & Panels</span>
                    <span>$${costs.boards.toFixed(2)}</span>
                </div>
                <div class="cost-line">
                    <span>Fillers</span>
                    <span>$${costs.fillers.toFixed(2)}</span>
                </div>
                <div class="cost-line">
                    <span>Hardware</span>
                    <span>$${costs.hardware.toFixed(2)}</span>
                </div>
                <div class="cost-line">
                    <span>Trim</span>
                    <span>$${costs.trim.toFixed(2)}</span>
                </div>
                <div class="cost-line total">
                    <span>Materials Subtotal</span>
                    <span>$${costs.materials.toFixed(2)}</span>
                </div>
            </div>
            <div class="cost-section">
                <h4>Labor</h4>
                <div class="cost-line">
                    <span>Installation</span>
                    <span>$${costs.labor.toFixed(2)}</span>
                </div>
            </div>
            <div class="cost-section">
                <h4>Total</h4>
                <div class="cost-line">
                    <span>Subtotal</span>
                    <span>$${costs.subtotal.toFixed(2)}</span>
                </div>
                ${costs.markup > 0 ? `
                <div class="cost-line">
                    <span>Markup</span>
                    <span>$${costs.markup.toFixed(2)}</span>
                </div>
                ` : ''}
                <div class="cost-line total final">
                    <span>Project Total</span>
                    <span>$${costs.total.toFixed(2)}</span>
                </div>
            </div>
            <div class="cost-actions">
                <button onclick="toggleCostBreakdown()" class="secondary">
                    <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Detailed Breakdown
                </button>
                <button onclick="exportCostEstimate()">
                    <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Export Estimate
                </button>
            </div>
            <div id="costBreakdown" style="display: none;">
                <h4>Detailed Cost Breakdown</h4>
                ${costs.breakdown ? Object.entries(costs.breakdown).map(([item, cost]) => `
                    <div class="cost-line small">
                        <span>${item}</span>
                        <span>$${cost.toFixed(2)}</span>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `;
    
    const costContainer = document.getElementById('costEstimateContainer');
    if (costContainer) {
        costContainer.innerHTML = costHTML;
    }
}

function toggleCostBreakdown() {
    const breakdown = document.getElementById('costBreakdown');
    if (breakdown) {
        breakdown.style.display = breakdown.style.display === 'none' ? 'block' : 'none';
    }
}

// Display installation time estimate
function displayInstallationTime() {
    if (typeof calculateInstallationTime !== 'function') return;
    
    const timeEstimate = calculateInstallationTime();
    if (!timeEstimate) return;
    
    const timeHTML = `
        <div class="time-estimate">
            <h3>INSTALLATION TIME ESTIMATE</h3>
            <div class="time-summary">
                <div class="time-box">
                    <div class="time-value">${timeEstimate.hours}</div>
                    <div class="time-label">Total Hours</div>
                </div>
                <div class="time-box">
                    <div class="time-value">${timeEstimate.days}</div>
                    <div class="time-label">Work Days</div>
                </div>
            </div>
            <div class="time-breakdown">
                <h4>Time Breakdown</h4>
                ${timeEstimate.breakdown ? Object.entries(timeEstimate.breakdown).map(([task, hours]) => `
                    <div class="time-line">
                        <span>${task}</span>
                        <span>${hours.toFixed(1)} hours</span>
                    </div>
                `).join('') : ''}
            </div>
            <p class="time-note">* Based on professional installation by experienced crew</p>
        </div>
    `;
    
    const timeContainer = document.getElementById('timeEstimateContainer');
    if (timeContainer) {
        timeContainer.innerHTML = timeHTML;
    }
}

// Update trim options based on coverage type
function updateTrimOptions() {
    const coverageType = projectConfig.coverageType || 'full';
    const fullHeightOptions = document.getElementById('fullHeightTrimOptions');
    const wainscotOptions = document.getElementById('wainscotTrimOptions');
    
    if (fullHeightOptions && wainscotOptions) {
        if (coverageType === 'full') {
            fullHeightOptions.style.display = 'block';
            wainscotOptions.style.display = 'none';
            // Update config
            const ceilingTrim = document.getElementById('ceilingTrim');
            const baseTrimFull = document.getElementById('baseTrimFull');
            projectConfig.useCeilingTrim = ceilingTrim ? ceilingTrim.checked : true;
            projectConfig.useFloorTrim = baseTrimFull ? baseTrimFull.checked : false;
        } else {
            fullHeightOptions.style.display = 'none';
            wainscotOptions.style.display = 'block';
            // Update config
            projectConfig.useCeilingTrim = false; // Never use ceiling trim for wainscot
            const baseTrimWainscot = document.getElementById('baseTrimWainscot');
            const capRailCheck = document.getElementById('capRailCheck');
            projectConfig.useFloorTrim = baseTrimWainscot ? baseTrimWainscot.checked : false;
            projectConfig.needsCap = capRailCheck ? capRailCheck.checked : true;
        }
    }
}
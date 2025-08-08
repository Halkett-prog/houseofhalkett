// HALKETT Calculator - Main Application v60

// Step validation
function validateStep(step) {
    switch(step) {
        case 1:
            // Step 1: Welcome/System Overview - no validation needed
            return true;
            
        case 2:
            // Step 2: Wall Configuration
            const projectName = document.getElementById('projectName').value.trim();
            if (!projectName) {
                showNotification('Please enter a Project Name or PO Number', 'error');
                document.getElementById('projectName').focus();
                highlightError('projectName');
                return false;
            }
            
            const wallHeight = parseInt(document.getElementById('wallHeight').value);
            if (!wallHeight || wallHeight < 24 || wallHeight > 200) {
                showNotification('Please enter wall height between 24" and 200"', 'error');
                document.getElementById('wallHeight').focus();
                highlightError('wallHeight');
                return false;
            }
            projectConfig.wallHeight = wallHeight;
            projectConfig.projectName = projectName;
            
            const coverageType = document.querySelector('input[name="coverage"]:checked').value;
            projectConfig.coverageType = coverageType;
            
            if (coverageType === 'partial') {
                const coverageHeight = parseInt(document.getElementById('coverageHeight').value);
                if (!coverageHeight || coverageHeight < 12 || coverageHeight >= wallHeight) {
                    showNotification(`Wainscot height must be between 12" and ${wallHeight - 1}"`, 'error');
                    document.getElementById('coverageHeight').focus();
                    highlightError('coverageHeight');
                    return false;
                }
                projectConfig.coverageHeight = coverageHeight;
                projectConfig.needsCap = true;
                document.getElementById('capRailOptions').style.display = 'block';
                // Update trim options for wainscot
                if (typeof updateTrimOptions === 'function') {
                    updateTrimOptions();
                }
            } else {
                projectConfig.coverageHeight = wallHeight;
                document.getElementById('capRailOptions').style.display = 'none';
                // Update trim options for full height
                if (typeof updateTrimOptions === 'function') {
                    updateTrimOptions();
                }
            }
            
            updateBoardRecommendation();
            return true;
            
        case 3:
            // Step 3: Design Selection (Profile & Board System)
            const boardLength = document.getElementById('boardLength').value;
            if (!boardLength) {
                showNotification('Please select a modular board system size', 'error');
                document.getElementById('boardLength').focus();
                return false;
            }
            
            const profile = document.querySelector('input[name="profile"]:checked');
            if (!profile) {
                showNotification('Please select a profile style', 'error');
                return false;
            }
            
            projectConfig.boardLength = parseInt(boardLength);
            projectConfig.boardStyle = profile.value;
            
            // Handle cap rail selection if wainscot
            if (projectConfig.coverageType === 'partial') {
                const capSelection = document.querySelector('input[name="capProfile"]:checked')?.value;
                if (!capSelection) {
                    showNotification('Please select a cap rail profile', 'error');
                    return false;
                }
                
                if (capSelection === '1.75') {
                    projectConfig.capWidth = '1.75';
                    projectConfig.capEdge = 'standard';
                } else if (capSelection === '2.5-square') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'square';
                } else if (capSelection === '2.5-beveled') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'beveled';
                } else if (capSelection === '2.5-bullnose') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'bullnose';
                }
            }
            
            return true;
            
        case 4:
            // Step 4: Materials & Finishes
            const boardMaterial = document.querySelector('input[name="material"]:checked');
            if (!boardMaterial) {
                showNotification('Please select a board material', 'error');
                return false;
            }
            
            const material = boardMaterial.value;
            projectConfig.boardMaterial = material;
            
            const materialDetail = document.getElementById('materialDetails')?.querySelector('select');
            
            if (materialDetail && materialDetail.id === 'materialDetail' && !materialDetail.value) {
                let detailType = '';
                switch(material) {
                    case 'natural-wood':
                        detailType = 'wood species';
                        break;
                    case 'painted':
                        detailType = 'paint color';
                        break;
                    case 'metal':
                        detailType = 'metal finish';
                        break;
                }
                if (detailType) {
                    showNotification(`Please select a ${detailType}`, 'error');
                    materialDetail.focus();
                    highlightError('materialDetail');
                    return false;
                }
            }
            
            if (material === 'leather') {
                const leatherType = document.getElementById('leatherType');
                const leatherColor = document.getElementById('leatherColor');
                if (!leatherType?.value || !leatherColor?.value) {
                    showNotification('Please select both leather type and color', 'error');
                    if (leatherType && !leatherType.value) {
                        leatherType.focus();
                        highlightError('leatherType');
                    }
                    return false;
                }
                projectConfig.materialDetail = `${leatherType.value}-${leatherColor.value}`;
            } else if (materialDetail) {
                projectConfig.materialDetail = materialDetail.value;
            }
            
            // Save trim options based on coverage type
            if (projectConfig.coverageType === 'full') {
                projectConfig.useCeilingTrim = document.getElementById('ceilingTrim')?.checked || false;
                projectConfig.useFloorTrim = document.getElementById('baseTrimFull')?.checked || false;
            } else {
                projectConfig.useCeilingTrim = false; // Never for wainscot
                projectConfig.useFloorTrim = document.getElementById('baseTrimWainscot')?.checked || false;
                projectConfig.needsCap = document.getElementById('capRailCheck')?.checked !== false; // Default true for wainscot
            }
            
            // Save trim material selection
            const trimMaterial = document.getElementById('allTrimMaterial');
            if (trimMaterial && trimMaterial.value) {
                projectConfig.matchMaterials = false;
                projectConfig.trimMaterial = trimMaterial.value;
                projectConfig.fillerMaterial = trimMaterial.value;
            } else {
                projectConfig.matchMaterials = true;
                projectConfig.trimMaterial = '';
                projectConfig.fillerMaterial = '';
            }
            
            // Update board recommendation based on trim selections
            updateBoardRecommendation();
            
            return true;
            
        case 5:
            // Step 5: Wall Details
            const wallCount = parseInt(document.getElementById('wallCount').value);
            if (!wallCount || wallCount < 1 || wallCount > 10) {
                showNotification('Please enter number of walls (1-10)', 'error');
                document.getElementById('wallCount').focus();
                highlightError('wallCount');
                return false;
            }
            
            // Check if walls have been generated
            const wallsContainer = document.getElementById('wallsContainer');
            if (!wallsContainer.innerHTML.trim()) {
                showNotification('Please click "Configure Walls" to set up wall details', 'error');
                return false;
            }
            
            globalWallDetails = [];
            let allValid = true;
            
            for (let i = 1; i <= wallCount; i++) {
                const lengthInput = document.getElementById(`length${i}`);
                if (!lengthInput) {
                    showNotification('Please configure walls first', 'error');
                    return false;
                }
                
                const length = projectConfig.useMetric ? 
                    fromMetric(parseFloat(lengthInput.value)) : 
                    parseFloat(lengthInput.value);
                const left = document.getElementById(`left${i}`).value;
                const right = document.getElementById(`right${i}`).value;
                const connected = i > 1 ? document.getElementById(`connected${i}`)?.value : 'no';
                
                if (!length || !left || !right || (i > 1 && connected === '')) {
                    showNotification(`Please complete all fields for Wall ${i}`, 'error');
                    if (!length) highlightError(`length${i}`);
                    if (!left) highlightError(`left${i}`);
                    if (!right) highlightError(`right${i}`);
                    if (i > 1 && connected === '') highlightError(`connected${i}`);
                    allValid = false;
                    break;
                }
                
                const validation = validateWallLength(length);
                if (!validation.valid) {
                    showNotification(`Wall ${i}: ${validation.error}`, 'error');
                    highlightError(`length${i}`);
                    allValid = false;
                    break;
                }
                
                const calc = calculateWall(length, left, right, connected === 'yes');
                
                if (!calc.success) {
                    showNotification(`Wall ${i}: ${calc.error}`, 'error');
                    allValid = false;
                    break;
                }
                
                globalWallDetails.push({
                    number: i,
                    length: length,
                    leftType: left,
                    rightType: right,
                    connected: connected,
                    ...calc
                });
            }
            
            return allValid;
            
        default:
            return true;
    }
}

// Calculate all results
function calculateAll() {
    showLoadingOverlay(true);
    
    setTimeout(() => {
        try {
            generateSpecification();
            displayCostEstimate();
            displayInstallationTime();
            showLoadingOverlay(false);
            showNotification('Calculation complete!', 'success');
        } catch (error) {
            console.error('Calculation error:', error);
            showLoadingOverlay(false);
            showNotification('Error during calculation. Please check your inputs.', 'error');
        }
    }, 500);
}

// Generate specification text
function generateSpecification() {
    let spec = `PROJECT: ${projectConfig.projectName}\n`;
    spec += `DATE: ${new Date().toLocaleDateString()}\n`;
    spec += `VERSION: ${VERSION}\n`;
    spec += `${'='.repeat(60)}\n\n`;
    
    spec += `CONFIGURATION SUMMARY\n`;
    spec += `Wall Height: ${formatDimension(projectConfig.wallHeight)}\n`;
    spec += `Coverage: ${projectConfig.coverageType === 'full' ? 'Full Height' : `Wainscot ${formatDimension(projectConfig.coverageHeight)}`}\n`;
    spec += `Profile: ${projectConfig.boardStyle.charAt(0).toUpperCase() + projectConfig.boardStyle.slice(1)}\n`;
    spec += `Material: ${getMaterialDescription()}\n`;
    spec += `Board Length: ${projectConfig.boardLength}"\n`;
    
    // Add trim material info
    if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
        spec += `Trim Material: ${getTrimMaterialDescription()}\n`;
    } else {
        spec += `Trim Material: Matching board material\n`;
    }
    
    if (projectConfig.coverageType === 'partial') {
        spec += `Cap Rail: ${projectConfig.capWidth}" ${projectConfig.capEdge}\n`;
    }
    
    spec += `Ceiling Trim: ${projectConfig.useCeilingTrim ? 'Yes' : 'No'}\n`;
    spec += `Floor/Base Trim: ${projectConfig.useFloorTrim ? 'Yes' : 'No'}\n`;
    spec += `\n${'='.repeat(60)}\n\n`;
    
    spec += `WALL DETAILS\n`;
    globalWallDetails.forEach(wall => {
        spec += `\nWall ${wall.number}: ${formatDimension(wall.length)}\n`;
        spec += `  Left: ${wall.leftType} | Right: ${wall.rightType}\n`;
        if (wall.connected === 'yes') {
            spec += `  Connected to previous wall\n`;
        }
        
        // CHANGED: Show structural sizes for cutting, not visible sizes
        spec += `  Left Filler (cut to): ${formatDimension(wall.leftStruct)}\n`;
        spec += `  Right Filler (cut to): ${formatDimension(wall.rightStruct)}\n`;
        spec += `  Visible gap each side: ${formatDimension(wall.visible)}\n`;
        
        spec += `  Boards: `;
        const boardList = [];
        if (wall.panels['6N-P1'] > 0) boardList.push(`${wall.panels['6N-P1']} x 6"N-P1`);
        if (wall.panels['4N-P1'] > 0) boardList.push(`${wall.panels['4N-P1']} x 4"N-P1`);
        if (wall.panels['2N-P1'] > 0) boardList.push(`${wall.panels['2N-P1']} x 2"N-P1`);
        if (wall.panels.p2Size > 0) boardList.push(`1 x ${wall.panels.p2Size}"N-P2`);
        spec += boardList.join(', ') + '\n';
    });
    
    spec += `\n${'='.repeat(60)}\n\n`;
    
    spec += `MATERIALS LIST\n\n`;
    
    // Aggregate all materials
    const materials = {
        boards: {},
        fillers: { end: 0, inside: 0, outside: 0 }
    };
    
    globalWallDetails.forEach(wall => {
        // Count boards
        ['6N-P1', '4N-P1', '2N-P1'].forEach(type => {
            if (wall.panels[type] > 0) {
                materials.boards[type] = (materials.boards[type] || 0) + wall.panels[type];
            }
        });
        
        if (wall.panels.p2Size > 0) {
            const p2Type = `${wall.panels.p2Size}N-P2`;
            materials.boards[p2Type] = (materials.boards[p2Type] || 0) + 1;
        }
        
        // Count fillers
        if (wall.connected !== 'yes' || wall.leftType === 'end') {
            materials.fillers[wall.leftType]++;
        }
        materials.fillers[wall.rightType]++;
    });
    
    spec += `BOARDS (${projectConfig.boardLength}" length, cut to ${formatDimension((projectConfig.coverageHeight || projectConfig.wallHeight) - (projectConfig.useCeilingTrim ? CEILING_GAP : 1.0) - (projectConfig.useFloorTrim ? FLOOR_GAP : 0))})\n`;
    Object.entries(materials.boards).forEach(([type, count]) => {
        spec += `  ${type}: ${count} boards\n`;
    });
    
    spec += `\nFILLERS (Structural/Cut Sizes)\n`;
    // Show actual cut sizes for each filler type with installation notes
    Object.entries(materials.fillers).forEach(([type, count]) => {
        if (count > 0) {
            spec += `  ${type.charAt(0).toUpperCase() + type.slice(1)} Fillers: ${count}\n`;
            
            // Add specific cutting instructions for each wall
            globalWallDetails.forEach(wall => {
                if ((wall.connected !== 'yes' || wall.leftType === 'end') && wall.leftType === type) {
                    spec += `    - Wall ${wall.number} Left: Cut to ${formatDimension(wall.leftStruct)}\n`;
                }
                if (wall.rightType === type) {
                    spec += `    - Wall ${wall.number} Right: Cut to ${formatDimension(wall.rightStruct)}\n`;
                }
            });
        }
    });
    
    spec += `\nINSTALLATION NOTES\n`;
    spec += `  - All filler dimensions shown are STRUCTURAL (cut) sizes\n`;
    spec += `  - Visible gap will be ${formatDimension(globalWallDetails[0]?.visible || 0.25)} on each side\n`;
    spec += `  - End fillers: Structural = Visible + 0.25"\n`;
    spec += `  - Inside corners: Structural = Visible + 1.0"\n`;
    spec += `  - Outside corners: Structural = Visible + 0.25"\n`;
    spec += `  - CUTTING: Cut from back side, apply painter's tape on face\n`;
    
    spec += `\nHARDWARE\n`;
    const boardHeight = (projectConfig.coverageHeight || projectConfig.wallHeight) - 
                       (projectConfig.useCeilingTrim ? CEILING_GAP : 1.0) - 
                       (projectConfig.useFloorTrim ? FLOOR_GAP : 0);
    const zClipRows = boardHeight > 96 ? 4 : 3;
    spec += `  Z-Clip System: ${zClipRows} rows per board\n`;
    
    if (materials.fillers.end > 0) {
        spec += `  Finishing Kits: ${Math.ceil(materials.fillers.end / 6)}\n`;
    }
    
    if (projectConfig.coverageType === 'partial' && projectConfig.needsCap) {
        spec += `\nCAP RAIL\n`;
        spec += `  Profile: ${projectConfig.capWidth}" ${projectConfig.capEdge}\n`;
        if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
            spec += `  Material: ${getTrimMaterialDescription()}\n`;
        }
    } else if (projectConfig.useCeilingTrim) {
        spec += `\nCEILING TRIM\n`;
        spec += `  Standard ceiling trim included\n`;
        if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
            spec += `  Material: ${getTrimMaterialDescription()}\n`;
        }
    }
    
    if (projectConfig.useFloorTrim) {
        spec += `\nFLOOR/BASE TRIM\n`;
        spec += `  Standard base trim included\n`;
        if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
            spec += `  Material: ${getTrimMaterialDescription()}\n`;
        }
    }
    
    spec += `\n${'='.repeat(60)}\n`;
    spec += `HALKETT - THE ART OF WALLS\n`;
    spec += `215.721.9331 | halkett.com\n`;
    
    globalSpecification = spec;
    document.getElementById('resultsContainer').innerHTML = `
        <div class="results">
            <h3>SPECIFICATION</h3>
            <pre>${spec}</pre>
        </div>
    `;
}// main.js continued...

// Get material description
function getMaterialDescription() {
    const material = projectConfig.boardMaterial;
    const detail = projectConfig.materialDetail;
    
    switch(material) {
        case 'natural-wood':
            const woods = {
                'white-oak': 'White Oak',
                'walnut': 'Walnut',
                'sapele': 'Sapele'
            };
            return woods[detail] || 'Natural Wood';
            
        case 'painted':
            const paints = {
                'pure-white': 'Pure White SW7005',
                'alabaster': 'Alabaster SW7008',
                'tricorn-black': 'Tricorn Black SW6258',
                'urbane-bronze': 'Urbane Bronze SW7048',
                'repose-gray': 'Repose Gray SW7015',
                'naval': 'Naval SW6244',
                'sage': 'Evergreen Fog SW9130',
                'accessible-beige': 'Accessible Beige SW7036'
            };
            return paints[detail] || 'Painted';
            
        case 'leather':
            const [type, color] = detail.split('-');
            const types = {
                'crock': 'Crock',
                'shagreen': 'Shagreen',
                'bison': 'Bison'
            };
            const colors = {
                'bordeaux': 'Bordeaux',
                'cognac': 'Cognac',
                'ebony': 'Ebony',
                'midnight': 'Midnight'
            };
            return `Leather - ${types[type]} ${colors[color]}`;
            
        case 'metal':
            const metals = {
                'copper': 'Copper',
                'brass': 'Brass',
                'zinc': 'Zinc',
                'bronze': 'Bronze',
                'stainless-steel': 'Stainless Steel',
                'blackened-steel': 'Blackened Steel'
            };
            return metals[detail] || 'Metal';
            
        default:
            return material;
    }
}

// Get trim material description
function getTrimMaterialDescription() {
    const trimMaterial = projectConfig.trimMaterial;
    
    if (!trimMaterial) return 'Matching board material';
    
    // Handle simple materials
    const simpleMaterials = {
        'white-oak': 'White Oak',
        'walnut': 'Walnut',
        'sapele': 'Sapele',
        'painted': 'Painted'
    };
    
    if (simpleMaterials[trimMaterial]) {
        return simpleMaterials[trimMaterial];
    }
    
    // Handle leather materials
    if (trimMaterial.startsWith('leather-')) {
        const leatherTypes = {
            'leather-crock': 'Leather - Crock',
            'leather-shagreen': 'Leather - Shagreen',
            'leather-bison': 'Leather - Bison'
        };
        return leatherTypes[trimMaterial] || 'Leather';
    }
    
    // Handle metal materials
    if (trimMaterial.startsWith('metal-')) {
        const metalTypes = {
            'metal-copper': 'Copper',
            'metal-brass': 'Brass',
            'metal-zinc': 'Zinc',
            'metal-bronze': 'Bronze',
            'metal-stainless': 'Stainless Steel',
            'metal-blackened': 'Blackened Steel'
        };
        return metalTypes[trimMaterial] || 'Metal';
    }
    
    return trimMaterial;
}

// Save configuration
function saveConfiguration() {
    const config = {
        id: Date.now().toString(),
        name: projectConfig.projectName,
        date: new Date().toISOString(),
        config: projectConfig,
        walls: globalWallDetails,
        specification: globalSpecification,
        summary: `${globalWallDetails.length} walls, ${projectConfig.boardMaterial}`
    };
    
    // Save to localStorage
    try {
        let saved = JSON.parse(localStorage.getItem('halkettConfigurations') || '[]');
        saved.unshift(config);
        saved = saved.slice(0, 10); // Keep only last 10
        localStorage.setItem('halkettConfigurations', JSON.stringify(saved));
        
        recentConfigurations = saved;
        showNotification('Configuration saved successfully!', 'success');
    } catch (e) {
        console.error('Save error:', e);
        showNotification('Unable to save configuration', 'error');
    }
}

// Restore configuration
function restoreConfiguration(config) {
    projectConfig = { ...projectConfig, ...config };
    
    // Navigate to step 6 to show results
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step6').classList.add('active');
    projectConfig.currentStep = 6;
    updateProgress();
    createStepIndicators();
    
    // Regenerate results
    calculateAll();
}

// Auto-save progress
function autoSaveProgress() {
    const progress = {
        config: projectConfig,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('halkettProgress', JSON.stringify(progress));
}

// Load saved progress
function loadSavedProgress() {
    try {
        const saved = localStorage.getItem('halkettProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            const hoursSince = (new Date() - new Date(progress.timestamp)) / (1000 * 60 * 60);
            
            if (hoursSince < 24 && progress.config.currentStep > 1) {
                const resumeBtn = document.createElement('button');
                resumeBtn.className = 'resume-button';
                resumeBtn.textContent = 'Resume Previous Configuration';
                resumeBtn.onclick = () => {
                    projectConfig = { ...projectConfig, ...progress.config };
                    goToStep(projectConfig.currentStep);
                    resumeBtn.remove();
                    showNotification('Previous configuration restored', 'info');
                };
                
                const container = document.querySelector('.container');
                container.insertBefore(resumeBtn, container.firstChild.nextSibling);
            }
        }
        
        // Load recent configurations
        const recentSaved = localStorage.getItem('halkettConfigurations');
        if (recentSaved) {
            recentConfigurations = JSON.parse(recentSaved);
        }
    } catch (e) {
        console.error('Load error:', e);
    }
}

// Copy specification to clipboard
function copySpecification() {
    navigator.clipboard.writeText(globalSpecification).then(() => {
        showNotification('Specification copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = globalSpecification;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Specification copied to clipboard!', 'success');
        } catch (e) {
            showNotification('Unable to copy. Please select and copy manually.', 'error');
        }
        document.body.removeChild(textArea);
    });
}

// Email specification
function emailSpecification() {
    const subject = encodeURIComponent(`HALKETT Specification - ${projectConfig.projectName}`);
    const body = encodeURIComponent(globalSpecification + '\n\n' + 
        (globalCostEstimate ? `Estimated Cost: $${globalCostEstimate.total.toFixed(2)}\n\n` : '') +
        'Please paste this specification into your email.');
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// Export cost estimate
function exportCostEstimate() {
    if (!globalCostEstimate) return;
    
    let estimate = `COST ESTIMATE\n`;
    estimate += `Project: ${projectConfig.projectName}\n`;
    estimate += `Date: ${new Date().toLocaleDateString()}\n`;
    estimate += `${'='.repeat(40)}\n\n`;
    
    estimate += `MATERIALS\n`;
    estimate += `Boards & Panels: $${globalCostEstimate.boards.toFixed(2)}\n`;
    estimate += `Fillers: $${globalCostEstimate.fillers.toFixed(2)}\n`;
    estimate += `Hardware: $${globalCostEstimate.hardware.toFixed(2)}\n`;
    estimate += `Trim: $${globalCostEstimate.trim.toFixed(2)}\n`;
    estimate += `Subtotal: $${globalCostEstimate.materials.toFixed(2)}\n\n`;
    
    estimate += `LABOR\n`;
    estimate += `Installation: $${globalCostEstimate.labor.toFixed(2)}\n\n`;
    
    estimate += `TOTAL\n`;
    estimate += `Subtotal: $${globalCostEstimate.subtotal.toFixed(2)}\n`;
    if (globalCostEstimate.markup > 0) {
        estimate += `Markup: $${globalCostEstimate.markup.toFixed(2)}\n`;
    }
    estimate += `PROJECT TOTAL: $${globalCostEstimate.total.toFixed(2)}\n\n`;
    
    estimate += `BREAKDOWN\n`;
    Object.entries(globalCostEstimate.breakdown).forEach(([item, cost]) => {
        estimate += `${item}: $${cost.toFixed(2)}\n`;
    });
    
    navigator.clipboard.writeText(estimate).then(() => {
        showNotification('Cost estimate copied to clipboard!', 'success');
    });
}

// Generate PDF
function generatePDF() {
    if (typeof window.jspdf === 'undefined') {
        showNotification('PDF library not loaded. Please refresh the page.', 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('HALKETT', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('THE ART OF WALLS', 105, 28, { align: 'center' });
    
    // Project info
    doc.setFontSize(12);
    doc.text(`PROJECT: ${projectConfig.projectName}`, 20, 45);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 20, 52);
    
    // Add specification content
    const lines = globalSpecification.split('\n');
    let y = 65;
    
    doc.setFontSize(10);
    lines.forEach(line => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        if (line.includes('='.repeat(60))) {
            doc.line(20, y, 190, y);
            y += 5;
        } else if (line.match(/^[A-Z\s]+$/)) {
            doc.setFont(undefined, 'bold');
            doc.text(line, 20, y);
            doc.setFont(undefined, 'normal');
            y += 7;
        } else {
            doc.text(line, 20, y);
            y += 5;
        }
    });
    
    // Add cost estimate if available
    if (globalCostEstimate) {
        if (y > 240) {
            doc.addPage();
            y = 20;
        }
        
        y += 10;
        doc.setFont(undefined, 'bold');
        doc.text('COST ESTIMATE', 20, y);
        y += 10;
        
        doc.setFont(undefined, 'normal');
        doc.text(`Materials: $${globalCostEstimate.materials.toFixed(2)}`, 20, y);
        y += 7;
        doc.text(`Labor: $${globalCostEstimate.labor.toFixed(2)}`, 20, y);
        y += 7;
        doc.text(`Total: $${globalCostEstimate.total.toFixed(2)}`, 20, y);
    }
    
    // Save PDF
    const filename = `HALKETT_${projectConfig.projectName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    showNotification('PDF downloaded successfully!', 'success');
}

// Step navigation
function updateProgress() {
    const progress = (projectConfig.currentStep - 1) / 5 * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    autoSaveProgress();
}

function goToStep(stepNum) {
    if (stepNum < projectConfig.currentStep) {
        // Allow going back
        document.getElementById('step' + projectConfig.currentStep).classList.remove('active');
        projectConfig.currentStep = stepNum;
        document.getElementById('step' + stepNum).classList.add('active');
        updateProgress();
        createStepIndicators();
    } else if (stepNum === projectConfig.currentStep + 1) {
        // Allow going forward if next step
        nextStep(projectConfig.currentStep);
    }
}

function nextStep(current) {
    if (validateStep(current)) {
        document.getElementById('step' + current).classList.remove('active');
        projectConfig.currentStep = current + 1;
        document.getElementById('step' + projectConfig.currentStep).classList.add('active');
        updateProgress();
        createStepIndicators();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (current === 5) {
            calculateAll();
        }
    }
}

function previousStep(current) {
    document.getElementById('step' + current).classList.remove('active');
    projectConfig.currentStep = current - 1;
    document.getElementById('step' + projectConfig.currentStep).classList.add('active');
    updateProgress();
    createStepIndicators();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToSystemOverview() {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    projectConfig.currentStep = 1;
    updateProgress();
    createStepIndicators();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make navigation functions globally available - IMPORTANT!
window.nextStep = nextStep;
window.previousStep = previousStep;
window.goToStep = goToStep;
window.goToSystemOverview = goToSystemOverview;
window.toggleUnits = toggleUnits;
window.showRecentConfigurations = showRecentConfigurations;
window.generateWalls = generateWalls;
window.openGallery = openGallery;
window.closeGallery = closeGallery;
window.closeGalleryOutside = closeGalleryOutside;
window.showSampleRequest = showSampleRequest;
window.closeSampleModal = closeSampleModal;
window.submitSampleRequest = submitSampleRequest;
window.closeRecentModal = closeRecentModal;
window.loadRecentConfig = loadRecentConfig;
window.saveConfiguration = saveConfiguration;
window.copySpecification = copySpecification;
window.generatePDF = generatePDF;
window.emailSpecification = emailSpecification;
window.exportCostEstimate = exportCostEstimate;
window.toggleCostBreakdown = toggleCostBreakdown;
window.restoreConfiguration = restoreConfiguration;
window.calculateAll = calculateAll;
window.validateStep = validateStep;
window.updateTrimOptions = updateTrimOptions;
window.toggleTrimMaterial = toggleTrimMaterial;

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Create step indicators
    createStepIndicators();
    
    // Load saved progress
    loadSavedProgress();
    
    // Coverage type change
    document.querySelectorAll('input[name="coverage"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const wainscotDiv = document.getElementById('wainscotHeight');
            if (e.target.value === 'partial') {
                wainscotDiv.style.display = 'block';
                projectConfig.coverageType = 'partial';
            } else {
                wainscotDiv.style.display = 'none';
                projectConfig.coverageType = 'full';
            }
            // Update trim options based on coverage type
            if (typeof updateTrimOptions === 'function') {
                updateTrimOptions();
            }
        });
    });
    
    // Material change
    document.querySelectorAll('input[name="material"]').forEach(radio => {
        radio.addEventListener('change', updateMaterialDetails);
    });
    
    // Ceiling trim change - FIXED VERSION
    const ceilingTrim = document.getElementById('ceilingTrim');
    if (ceilingTrim) {
        ceilingTrim.addEventListener('change', (e) => {
            const warning = document.getElementById('ceilingTrimWarning');
            if (warning) {
                if (!e.target.checked) {
                    warning.style.display = 'block';
                } else {
                    warning.style.display = 'none';
                }
            }
            updateBoardRecommendation();
        });
    }

    // Base trim changes - handle both full height and wainscot versions
    const baseTrimFull = document.getElementById('baseTrimFull');
    if (baseTrimFull) {
        baseTrimFull.addEventListener('change', () => {
            updateBoardRecommendation();
        });
    }

    const baseTrimWainscot = document.getElementById('baseTrimWainscot');
    if (baseTrimWainscot) {
        baseTrimWainscot.addEventListener('change', () => {
            updateBoardRecommendation();
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 's':
                    e.preventDefault();
                    if (projectConfig.currentStep === 6) {
                        saveConfiguration();
                    }
                    break;
                case 'p':
                    e.preventDefault();
                    if (projectConfig.currentStep === 6) {
                        window.print();
                    }
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (projectConfig.currentStep < 6) {
                        nextStep(projectConfig.currentStep);
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    if (recentConfigurations.length > 0) {
                        showRecentConfigurations();
                    }
                    break;
            }
        }
    });
    
    // Update initial board recommendation
    if (typeof updateBoardRecommendation === 'function') {
        updateBoardRecommendation();
    }
});
// Add to Cart function for House of HALKETT integration
function addToCart() {
  console.log('Add to Cart clicked!');
  
  // Make sure projectConfig exists
  if (typeof projectConfig === 'undefined') {
    alert('Please complete the configuration first');
    return;
  }
  
  // Get the current configuration
  const config = {
    projectName: projectConfig.projectName || 'Wall Configuration',
    wallHeight: projectConfig.wallHeight || 96,
    coverageType: projectConfig.coverageType || 'full',
    coverageHeight: projectConfig.coverageHeight || 0,
    profile: projectConfig.profile || 'contemporary',
    boardMaterial: projectConfig.boardMaterial || 'natural-wood',
    boardLength: projectConfig.boardLength || '48',
    wallCount: projectConfig.wallCount || 1,
    walls: projectConfig.walls || [],
estimatedCost: projectConfig.estimatedCost || 5000,
    timestamp: new Date().toISOString()
  };
  
  console.log('Saving config:', config);
  
  // Save to localStorage
  localStorage.setItem('pendingCalculatorOrder', JSON.stringify(config));
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('Added to cart! Redirecting...', 'success');
  } else {
    alert('Added to cart!');
  }
  
  // Redirect to cart after 1.5 seconds
  setTimeout(() => {
    // Always redirect to the House of HALKETT cart
    if (window.self !== window.top) {
      // If in iframe, redirect parent window
      window.parent.location.href = 'https://www.houseofhalkett.com/cart';
    } else {
      // If standalone, redirect directly
      window.location.href = 'https://www.houseofhalkett.com/cart';
    }
  }, 1500);
}  // <-- THIS WAS MISSING! Closes the addToCart function

// Make function globally available
window.addToCart = addToCart;
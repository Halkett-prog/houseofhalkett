// HALKETT Calculator - Main Application v60
// FIXED VERSION: Combines reorganized steps with working Vercel calculations + FIXED RESULTS DISPLAY

// Step validation - UPDATED for reorganized steps but with working validation logic
function validateStep(step) {
    switch(step) {
        case 1:
            // Step 1: Welcome/System Overview - NOW INCLUDES PROJECT NAME VALIDATION (moved from Step 2)
            const projectName = document.getElementById('projectName')?.value;
            
            if (!projectName || projectName.trim() === '') {
                if (typeof showNotification === 'function') {
                    showNotification('Please enter a project name or PO number', 'error');
                }
                document.getElementById('projectName').focus();
                return false;
            }
            
            // Save project name to configuration
            projectConfig.projectName = projectName.trim();
            console.log('Project name saved:', projectConfig.projectName);
            
            return true;
            
        case 2:
            // Step 2: Wall Configuration - NOW INCLUDES BOARD SELECTION (reorganized)
            const wallHeight = document.getElementById('wallHeight')?.value;
            const coverageType = document.querySelector('input[name="coverage"]:checked')?.value;
            
            if (!wallHeight || wallHeight < 24 || wallHeight > 200) {
                if (typeof showNotification === 'function') {
                    showNotification('Please enter a wall height between 24" and 200"', 'error');
                }
                document.getElementById('wallHeight').focus();
                return false;
            }
            
            // Save configuration
            projectConfig.wallHeight = parseFloat(wallHeight);
            projectConfig.coverageType = coverageType;
            
            console.log('Step 2 validation - Coverage type:', coverageType);
            
            if (coverageType === 'partial') {
                const coverageHeight = document.getElementById('coverageHeight')?.value;
                const wainscotHeightDiv = document.getElementById('wainscotHeight');
                
                // Check if wainscot height div is visible
                if (wainscotHeightDiv && wainscotHeightDiv.style.display !== 'none') {
                    if (!coverageHeight || coverageHeight === '') {
                        if (typeof showNotification === 'function') {
                            showNotification('Please enter wainscot height', 'error');
                        }
                        document.getElementById('coverageHeight').focus();
                        return false;
                    }
                    
                    const wainscotHeightValue = parseFloat(coverageHeight);
                    const wallHeightValue = parseFloat(wallHeight);
                    
                    if (wainscotHeightValue < 12) {
                        if (typeof showNotification === 'function') {
                            showNotification('Wainscot height must be at least 12"', 'error');
                        }
                        document.getElementById('coverageHeight').focus();
                        return false;
                    }
                    
                    if (wainscotHeightValue >= wallHeightValue) {
                        if (typeof showNotification === 'function') {
                            showNotification('Wainscot height must be less than wall height', 'error');
                        }
                        document.getElementById('coverageHeight').focus();
                        return false;
                    }
                    
                    projectConfig.coverageHeight = wainscotHeightValue;
                    projectConfig.needsCap = true;
                    console.log('Wainscot height saved:', projectConfig.coverageHeight);
                }
            } else {
                // Full height - handle custom gaps if present
                const ceilingGap = parseFloat(document.getElementById('ceilingGap')?.value) || 1.5;
                const floorGap = parseFloat(document.getElementById('floorGap')?.value) || 0;
                
                // Check if gaps exceed maximum
                if (ceilingGap > 6 || floorGap > 6) {
                    if (typeof showNotification === 'function') {
                        showNotification('Maximum clearance allowed is 6". Please adjust clearances or consider wainscot coverage.', 'error');
                    }
                    if (ceilingGap > 6) document.getElementById('ceilingGap').focus();
                    else document.getElementById('floorGap').focus();
                    return false;
                }
                
                projectConfig.customCeilingGap = ceilingGap;
                projectConfig.customFloorGap = floorGap;
                projectConfig.coverageHeight = projectConfig.wallHeight;
            }
            
            // BOARD VALIDATION - Check if board selection section is visible (reorganized feature)
            const boardSelectionDiv = document.getElementById('boardSelectionSection');
            if (boardSelectionDiv && boardSelectionDiv.style.display !== 'none') {
                const boardLength = document.getElementById('boardLength')?.value;
                
                if (!boardLength) {
                    if (typeof showNotification === 'function') {
                        showNotification('Please select a board length', 'error');
                    }
                    document.getElementById('boardLength').focus();
                    return false;
                }
                
                // Save board configuration
                projectConfig.boardLength = parseFloat(boardLength);
                console.log('Board length validated and saved:', projectConfig.boardLength);
            }
            
            console.log('Final projectConfig after Step 2:', projectConfig);
            return true;
            
        case 3:
            // Step 3: Design Selection - Profile selection (board moved to Step 2)
            const selectedProfile = document.querySelector('input[name="profile"]:checked');
            
            if (!selectedProfile) {
                if (typeof showNotification === 'function') {
                    showNotification('Please select a profile style', 'error');
                }
                return false;
            }
            
            // Save configuration
            projectConfig.boardStyle = selectedProfile.value;
            
            // Handle cap rail for wainscot
            if (projectConfig.coverageType === 'partial') {
                const capProfile = document.querySelector('input[name="capProfile"]:checked');
                if (!capProfile) {
                    if (typeof showNotification === 'function') {
                        showNotification('Please select a cap rail profile for wainscot', 'error');
                    }
                    return false;
                }
                
                // Parse cap profile selection
                if (capProfile.value === '1.75') {
                    projectConfig.capWidth = '1.75';
                    projectConfig.capEdge = 'standard';
                } else if (capProfile.value === '2.5-square') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'square';
                } else if (capProfile.value === '2.5-beveled') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'beveled';
                } else if (capProfile.value === '2.5-bullnose') {
                    projectConfig.capWidth = '2.5';
                    projectConfig.capEdge = 'bullnose';
                }
            }
            
            return true;
            
        case 4:
            // Step 4: Materials & Finishes (trim moved to Step 2)
            const material = document.querySelector('input[name="material"]:checked');
            if (!material) {
                if (typeof showNotification === 'function') {
                    showNotification('Please select a board material', 'error');
                }
                return false;
            }
            
            projectConfig.boardMaterial = material.value;
            
            // Check if material details are selected (if applicable)
            const detailsDiv = document.getElementById('materialDetails');
            if (detailsDiv && detailsDiv.innerHTML.includes('select')) {
                const detailSelect = detailsDiv.querySelector('select');
                if (detailSelect && !detailSelect.value) {
                    if (typeof showNotification === 'function') {
                        showNotification('Please select a specific material option', 'error');
                    }
                    detailSelect.focus();
                    return false;
                }
                if (detailSelect) {
                    projectConfig.materialDetail = detailSelect.value;
                }
            }
            
            // Handle leather material details
            if (material.value === 'leather') {
                const leatherType = document.getElementById('leatherType');
                const leatherColor = document.getElementById('leatherColor');
                if (!leatherType?.value || !leatherColor?.value) {
                    if (typeof showNotification === 'function') {
                        showNotification('Please select both leather type and color', 'error');
                    }
                    if (leatherType && !leatherType.value) {
                        leatherType.focus();
                    }
                    return false;
                }
                projectConfig.materialDetail = `${leatherType.value}-${leatherColor.value}`;
            }
            
            // Save trim selections (moved from original Step 4 but logic preserved)
            if (projectConfig.coverageType === 'full') {
                projectConfig.useCeilingTrim = document.getElementById('ceilingTrim')?.checked || false;
                projectConfig.useFloorTrim = document.getElementById('baseTrimFull')?.checked || false;
            } else {
                projectConfig.useCeilingTrim = false; // Never for wainscot
                projectConfig.useFloorTrim = document.getElementById('baseTrimPartial')?.checked || false;
                projectConfig.needsCap = true; // Always for wainscot
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
            
            return true;
            
        case 5:
            // Step 5: Wall Details - RESTORED WORKING VALIDATION FROM VERCEL
            const wallCount = parseInt(document.getElementById('wallCount')?.value);
            const wallsContainer = document.getElementById('wallsContainer');
            
            if (!wallCount || wallCount < 1) {
                if (typeof showNotification === 'function') {
                    showNotification('Please enter the number of walls', 'error');
                }
                document.getElementById('wallCount').focus();
                return false;
            }
            
            // Check if walls have been generated
            if (!wallsContainer || wallsContainer.children.length === 0) {
                if (typeof showNotification === 'function') {
                    showNotification('Please click "Configure Walls" to set up wall details', 'error');
                }
                return false;
            }
            
            // CRITICAL: Clear and rebuild globalWallDetails using WORKING VERCEL LOGIC
            globalWallDetails = [];
            let allValid = true;
            
            for (let i = 1; i <= wallCount; i++) {
                const lengthInput = document.getElementById(`length${i}`);
                if (!lengthInput) {
                    if (typeof showNotification === 'function') {
                        showNotification('Please configure walls first', 'error');
                    }
                    return false;
                }
                
                const length = projectConfig.useMetric ? 
                    fromMetric(parseFloat(lengthInput.value)) : 
                    parseFloat(lengthInput.value);
                const leftSelect = document.getElementById(`left${i}`);
                const rightSelect = document.getElementById(`right${i}`);
                const leftValue = leftSelect?.value;
                const rightValue = rightSelect?.value;
                
                if (!length || !leftValue || !rightValue) {
                    if (typeof showNotification === 'function') {
                        showNotification(`Please complete all fields for Wall ${i}`, 'error');
                    }
                    if (!length) lengthInput.focus();
                    else if (!leftValue) leftSelect.focus();
                    else if (!rightValue) rightSelect.focus();
                    allValid = false;
                    break;
                }
                
                // Check connection for walls after the first one
                let connected = 'no';
                if (i > 1) {
                    const connectedSelect = document.getElementById(`connected${i}`);
                    connected = connectedSelect?.value;
                    
                    if (!connected) {
                        if (typeof showNotification === 'function') {
                            showNotification(`Please select connection option for Wall ${i}`, 'error');
                        }
                        connectedSelect.focus();
                        return false;
                    }
                }
                
                // Validate wall length using working function
                if (typeof validateWallLength === 'function') {
                    const validation = validateWallLength(length);
                    if (!validation.valid) {
                        if (typeof showNotification === 'function') {
                            showNotification(`Wall ${i}: ${validation.error}`, 'error');
                        }
                        lengthInput.focus();
                        allValid = false;
                        break;
                    }
                }
                
                // Calculate wall using WORKING VERCEL FUNCTION
                if (typeof calculateWall === 'function') {
                    const calc = calculateWall(length, leftValue, rightValue, connected === 'yes');
                    
                    if (!calc.success) {
                        if (typeof showNotification === 'function') {
                            showNotification(`Wall ${i}: ${calc.error || 'Calculation failed'}`, 'error');
                        }
                        allValid = false;
                        break;
                    }
                    
                    // CRITICAL: Save wall details to global array using VERCEL STRUCTURE
                    globalWallDetails.push({
                        number: i,
                        length: length,
                        leftType: leftValue,
                        rightType: rightValue,
                        connected: connected,
                        ...calc  // This spreads all the calculation results from working Vercel function
                    });
                } else {
                    console.error('calculateWall function not available');
                    if (typeof showNotification === 'function') {
                        showNotification('Calculation function not available', 'error');
                    }
                    return false;
                }
            }
            
            console.log('Wall validation complete. globalWallDetails:', globalWallDetails);
            return allValid;
            
        default:
            return true;
    }
}

// RESTORED WORKING CALCULATION FUNCTIONS FROM VERCEL

// Calculate all results - EXACT VERCEL LOGIC
function calculateAll() {
    if (typeof showLoadingOverlay === 'function') {
        showLoadingOverlay(true);
    }
    
    setTimeout(() => {
        try {
            generateSpecification();
            if (typeof displayCostEstimate === 'function') {
                displayCostEstimate();
            }
            if (typeof displayInstallationTime === 'function') {
                displayInstallationTime();
            }
            if (typeof showLoadingOverlay === 'function') {
                showLoadingOverlay(false);
            }
            if (typeof showNotification === 'function') {
                showNotification('Calculation complete!', 'success');
            }
        } catch (error) {
            console.error('Calculation error:', error);
            if (typeof showLoadingOverlay === 'function') {
                showLoadingOverlay(false);
            }
            if (typeof showNotification === 'function') {
                showNotification('Error during calculation. Please check your inputs.', 'error');
            }
        }
    }, 500);
}

// Generate specification text - EXACT VERCEL LOGIC WITH FIXED CSS DISPLAY
function generateSpecification() {
    if (!globalWallDetails || globalWallDetails.length === 0) {
        console.error('No wall details available for specification generation');
        return;
    }
    
    let spec = `PROJECT: ${projectConfig.projectName}\n`;
    spec += `DATE: ${new Date().toLocaleDateString()}\n`;
    spec += `VERSION: ${VERSION}\n`;
    spec += `${'='.repeat(60)}\n\n`;
    
    spec += `CONFIGURATION SUMMARY\n`;
    spec += `Wall Height: ${formatDimension(projectConfig.wallHeight)}\n`;
    spec += `Coverage: ${projectConfig.coverageType === 'full' ? 'Full Height' : `Wainscot ${formatDimension(projectConfig.coverageHeight)}`}\n`;
    spec += `Profile: ${projectConfig.boardStyle ? projectConfig.boardStyle.charAt(0).toUpperCase() + projectConfig.boardStyle.slice(1) : 'Contemporary'}\n`;
    spec += `Material: ${getMaterialDescription()}\n`;
    spec += `Board Length: ${projectConfig.boardLength}"\n`;
    
    // Add trim material info
    if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
        spec += `Trim Material: ${getTrimMaterialDescription()}\n`;
    } else {
        spec += `Trim Material: Matching board material\n`;
    }
    
    if (projectConfig.coverageType === 'partial') {
        spec += `Cap Rail: ${projectConfig.capWidth || '1.75'}" ${projectConfig.capEdge || 'standard'}\n`;
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
        
        // Show structural sizes for cutting, not visible sizes
        spec += `  Left Filler (cut to): ${formatDimension(wall.leftStruct)}\n`;
        spec += `  Right Filler (cut to): ${formatDimension(wall.rightStruct)}\n`;
        spec += `  Visible gap each side: ${formatDimension(wall.visible)}\n`;
        
        spec += `  Boards: `;
        const boardList = [];
        if (wall.panels && wall.panels['6N-P1'] > 0) boardList.push(`${wall.panels['6N-P1']} x 6"N-P1`);
        if (wall.panels && wall.panels['4N-P1'] > 0) boardList.push(`${wall.panels['4N-P1']} x 4"N-P1`);
        if (wall.panels && wall.panels['2N-P1'] > 0) boardList.push(`${wall.panels['2N-P1']} x 2"N-P1`);
        if (wall.panels && wall.panels.p2Size > 0) boardList.push(`1 x ${wall.panels.p2Size}"N-P2`);
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
        if (wall.panels) {
            ['6N-P1', '4N-P1', '2N-P1'].forEach(type => {
                if (wall.panels[type] > 0) {
                    materials.boards[type] = (materials.boards[type] || 0) + wall.panels[type];
                }
            });
            
            if (wall.panels.p2Size > 0) {
                const p2Type = `${wall.panels.p2Size}N-P2`;
                materials.boards[p2Type] = (materials.boards[p2Type] || 0) + 1;
            }
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
        spec += `  Profile: ${projectConfig.capWidth || '1.75'}" ${projectConfig.capEdge || 'standard'}\n`;
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
    
    // 🎯 FIXED: Display the specification with PROPER CSS classes (no inline style overrides)
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results">
                <h3>SPECIFICATION</h3>
                <pre>${spec}</pre>
            </div>
        `;
    }
}

// Helper functions for specification generation - EXACT VERCEL LOGIC
function formatDimension(value) {
    if (typeof value !== 'number' || isNaN(value)) return '0"';
    return value % 1 === 0 ? `${value}"` : `${value.toFixed(2)}"`;
}

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
            if (detail && detail.includes('-')) {
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
                return `Leather - ${types[type] || type} ${colors[color] || color}`;
            }
            return 'Leather';
            
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
            return material || 'Natural Wood';
    }
}

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

// Export functions to window - EXACT VERCEL PATTERN
window.validateStep = validateStep;
window.calculateAll = calculateAll;
window.generateSpecification = generateSpecification;
window.formatDimension = formatDimension;
window.getMaterialDescription = getMaterialDescription;
window.getTrimMaterialDescription = getTrimMaterialDescription;
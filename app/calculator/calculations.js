// HALKETT Calculator - Calculation Functions v60

// Memoized calculation wrapper
function memoizedCalculation(key, calculationFn) {
    if (calculationCache.has(key)) {
        return calculationCache.get(key);
    }
    const result = calculationFn();
    calculationCache.set(key, result);
    return result;
}

// Unit conversion helpers
function toMetric(inches) {
    return projectConfig.useMetric ? inches * 25.4 : inches;
}

function fromMetric(mm) {
    return projectConfig.useMetric ? mm / 25.4 : mm;
}

function formatDimension(inches) {
    if (projectConfig.useMetric) {
        const mm = Math.round(inches * 25.4);
        return `${mm}mm`;
    }
    return toFractionalInches(inches);
}

// Convert decimal inches to fractional format
function toFractionalInches(value) {
    if (Math.abs(value - Math.round(value)) < 0.001) {
        return `${Math.round(value)}"`;
    }
    
    const inch = Math.floor(value);
    const frac = value - inch;
    const eighths = Math.round(frac * 8);
    
    if (eighths === 0) return `${inch}"`;
    if (eighths === 8) return `${inch + 1}"`;
    
    let num = eighths;
    let den = 8;
    if (num % 4 === 0) { num /= 4; den /= 4; }
    else if (num % 2 === 0) { num /= 2; den /= 2; }
    
    return inch > 0 ? `${inch} ${num}/${den}"` : `${num}/${den}"`;
}

// Calculate structural dimension from visible dimension
function calculateStructuralFromVisible(type, visible) {
    switch(type) {
        case "end": return visible + 0.25;
        case "inside": return visible + 1.0;
        case "outside": return visible + 0.25;
        default: return visible + 0.25;
    }
}

// Find panel combination for given space
function findPanelCombination(targetSpace) {
    targetSpace = Math.round(targetSpace * 16) / 16;
    if (targetSpace <= 0) return null;
    
    for (const p2 of P2_SIZES) {
        const p1Space = Math.round((targetSpace - p2) * 16) / 16;
        if (p1Space < 0) continue;
        
        if (p1Space === 0) {
            return {
                "6N-P1": 0, "4N-P1": 0, "2N-P1": 0,
                p2Size: p2, totalLength: p2
            };
        }
        
        const p6 = Math.floor(p1Space / 6);
        const r6 = Math.round((p1Space - p6 * 6) * 16) / 16;
        
        if (r6 === 0 && p6 > 0) {
            return {
                "6N-P1": p6, "4N-P1": 0, "2N-P1": 0,
                p2Size: p2, totalLength: p6 * 6 + p2
            };
        }
        
        const p4 = Math.floor(r6 / 4);
        const r4 = Math.round((r6 - p4 * 4) * 16) / 16;
        
        if (r4 === 0 && (p6 > 0 || p4 > 0)) {
            return {
                "6N-P1": p6, "4N-P1": p4, "2N-P1": 0,
                p2Size: p2, totalLength: p6 * 6 + p4 * 4 + p2
            };
        }
        
        if (r4 > 0 && r4 % 2 === 0) {
            return {
                "6N-P1": p6, "4N-P1": p4, "2N-P1": r4 / 2,
                p2Size: p2, totalLength: p6 * 6 + p4 * 4 + r4 + p2
            };
        }
    }
    
    return null;
}

// Main wall calculation function
function calculateWall(wallLength, leftType, rightType, isConnected = false) {
    wallLength = Math.round(wallLength * 8) / 8;
    
    if (wallLength < 6) {
        return { success: false, error: "Minimum wall length: 6 inches" };
    }
    
    for (let visible = 0.25; visible <= 3.75; visible += 0.0625) {
        visible = Math.round(visible * 16) / 16;
        
        const leftStruct = calculateStructuralFromVisible(leftType, visible);
        const rightStruct = calculateStructuralFromVisible(rightType, visible);
        
        if (leftStruct < 1.25 || leftStruct > 4.0) continue;
        if (rightStruct < 1.25 || rightStruct > 4.0) continue;
        
        let fillerLeft = leftType === "end" ? leftStruct : 
                        leftType === "inside" ? visible : visible - 0.75;
        let fillerRight = rightType === "end" ? rightStruct : 
                         rightType === "inside" ? visible : visible - 0.75;
        
        for (let clearance = 0.5; clearance >= 0.25; clearance -= 0.0625) {
            let panelSpace = wallLength - clearance - fillerLeft - fillerRight;
            if (leftType === "inside") panelSpace -= 1.0;
            if (rightType === "inside") panelSpace -= 1.0;
            
            const panels = findPanelCombination(panelSpace);
            
            if (panels && Math.abs(panels.totalLength - panelSpace) < 0.001) {
                return {
                    success: true,
                    visible: visible,
                    leftStruct: leftStruct,
                    rightStruct: rightStruct,
                    panels: panels,
                    leftType: leftType,
                    rightType: rightType,
                    clearance: clearance / 2
                };
            }
        }
    }
    
    return { success: false, error: "No valid configuration found. Try adjusting the wall length." };
}

// Load advanced pricing if available
function loadCalculationPricing() {
    const advancedStored = localStorage.getItem('halkettAdvancedPricing');
    if (advancedStored) {
        return JSON.parse(advancedStored);
    }
    
    // Fall back to legacy pricing
    reloadPricing();
    return null;
}

// Get board price based on material and width - UPDATED WITH NEW SHEEN LOGIC
function getBoardPrice(material, detail, width) {
    const advancedPricing = loadCalculationPricing();
    
    if (advancedPricing && advancedPricing.boards) {
        let priceKey = '';
        
        // Map material selections to pricing keys
        switch(material) {
            case 'natural-wood':
                // Get wood species, stain, and sheen from project config
                const woodSpecies = projectConfig.woodSpecies || 'white-oak';
                const woodStain = projectConfig.woodStain || 'clear';
                const woodSheen = projectConfig.woodSheen || 'satin';
                
                // Determine if standard or premium sheen
                let sheenType = 'standard';
                if (woodSheen === 'high-gloss' || woodSheen === 'semi-gloss') {
                    sheenType = 'premium';
                }
                
                // Build the complete price key
                priceKey = `${woodSpecies}-${woodStain}-${sheenType}`;
                break;
                
            case 'painted':
                // Get paint sheen from project config
                const paintSheen = projectConfig.paintSheen || 'satin';
                
                // Map sheen directly to price key
                const sheenMap = {
                    'matte': 'painted-matte',
                    'eggshell': 'painted-eggshell',
                    'satin': 'painted-satin',
                    'semi-gloss': 'painted-semigloss',
                    'high-gloss': 'painted-highgloss'
                };
                
                priceKey = sheenMap[paintSheen] || 'painted-satin';
                break;
                
            case 'leather':
                const leatherType = detail ? detail.split('-')[0] : 'crock';
                priceKey = `leather-${leatherType}`;
                break;
                
            case 'metal':
                priceKey = `metal-${detail || 'stainless'}`;
                break;
        }
        
        const boardPricing = advancedPricing.boards[priceKey];
        if (boardPricing) {
            const basePrice = boardPricing.material + boardPricing.labor + boardPricing.finish;
            const markup = advancedPricing.markupType === 'global' ? 0 : (boardPricing.markup / 100);
            const pricePerFoot = basePrice * (1 + markup);
            return pricePerFoot * width;
        }
    }
    
    // Fall back to legacy pricing
    const materialPricing = PRICING.boards[material] || PRICING.boards['natural-wood'];
    return materialPricing.base + (width * materialPricing.perInch);
}

// Get filler price based on type and material
function getFillerPrice(fillerType, material, detail) {
    const advancedPricing = loadCalculationPricing();
    
    // Determine which material to use for fillers
    let fillerMaterial = material;
    let fillerDetail = detail;
    
    if (!projectConfig.matchMaterials && projectConfig.fillerMaterial) {
        fillerMaterial = projectConfig.fillerMaterial;
        fillerDetail = projectConfig.fillerMaterialDetail || '';
    }
    
    if (advancedPricing && advancedPricing.fillers) {
        let materialKey = 'white-oak'; // default
        
        // Map to simplified material keys for fillers
        switch(fillerMaterial) {
            case 'natural-wood':
            case 'white-oak':
                materialKey = 'white-oak';
                break;
            case 'walnut':
                materialKey = 'walnut';
                break;
            case 'sapele':
                materialKey = 'sapele';
                break;
            case 'painted':
                materialKey = 'painted';
                break;
            case 'leather':
                materialKey = 'leather';
                break;
            case 'metal':
                materialKey = 'metal';
                break;
        }
        
        const fillerPricing = advancedPricing.fillers[fillerType]?.[materialKey];
        if (fillerPricing) {
            const basePrice = fillerPricing.material + fillerPricing.labor + fillerPricing.finish;
            const markup = advancedPricing.markupType === 'global' ? 0 : (fillerPricing.markup / 100);
            return basePrice * (1 + markup);
        }
    }
    
    // Fall back to legacy pricing
    return PRICING.fillers[fillerType] || 85;
}

// Get trim price based on type and profile
function getTrimPrice(trimType, profile) {
    const advancedPricing = loadCalculationPricing();
    
    // Determine which material to use for trim
    let trimMaterial = projectConfig.boardMaterial;
    let trimDetail = projectConfig.materialDetail;
    
    if (!projectConfig.matchMaterials && projectConfig.trimMaterial) {
        trimMaterial = projectConfig.trimMaterial;
        trimDetail = projectConfig.trimMaterialDetail || '';
    }
    
    if (advancedPricing && advancedPricing.trim) {
        let materialKey = 'white-oak'; // default
        
        // Map to trim material keys
        switch(trimMaterial) {
            case 'natural-wood':
            case 'white-oak':
                materialKey = 'white-oak';
                break;
            case 'walnut':
                materialKey = 'walnut';
                break;
            case 'sapele':
                materialKey = 'sapele';
                break;
            case 'painted':
                materialKey = 'painted';
                break;
            default:
                // For materials not available in trim (leather, metal), default to white-oak
                materialKey = 'white-oak';
        }
        
        let trimPricing;
        
        switch(trimType) {
            case 'ceiling':
                trimPricing = advancedPricing.trim.ceiling[materialKey];
                break;
            case 'base':
                trimPricing = advancedPricing.trim.base[materialKey];
                break;
            case 'cap':
                // Map cap profile to pricing key
                let capKey = '1.75'; // default
                if (profile) {
                    if (profile.includes('1.75')) capKey = '1.75';
                    else if (profile.includes('square')) capKey = '2.5-square';
                    else if (profile.includes('beveled')) capKey = '2.5-beveled';
                    else if (profile.includes('bullnose')) capKey = '2.5-bullnose';
                }
                trimPricing = advancedPricing.trim.cap[capKey]?.[materialKey];
                break;
        }
        
        if (trimPricing) {
            const basePrice = trimPricing.material + trimPricing.labor + trimPricing.finish;
            const markup = advancedPricing.markupType === 'global' ? 0 : (trimPricing.markup / 100);
            return basePrice * (1 + markup);
        }
    }
    
    // Fall back to legacy pricing
    return PRICING.trim[trimType] || 42;
}

// Cost calculation functions
function calculateCosts() {
    if (!globalWallDetails || globalWallDetails.length === 0) {
        return null;
    }
    
    const costs = {
        boards: 0,
        fillers: 0,
        hardware: 0,
        trim: 0,
        materials: 0,
        labor: 0,
        subtotal: 0,
        markup: 0,
        total: 0,
        breakdown: {}
    };
    
    // Get material details
    const material = projectConfig.boardMaterial;
    const materialDetail = projectConfig.materialDetail;
    
    // Count panels from global specification parsing
    const totalPanels = {};
    const totalFillers = { end: 0, inside: 0, outside: 0 };
    
    // Parse from wall details
    globalWallDetails.forEach(wall => {
        // Count panels
        if (wall.panels) {
            Object.entries(wall.panels).forEach(([key, value]) => {
                if (key !== 'p2Size' && key !== 'totalLength' && value > 0) {
                    totalPanels[key] = (totalPanels[key] || 0) + value;
                }
            });
            if (wall.panels.p2Size) {
                const p2Key = `${wall.panels.p2Size}N-P2`;
                totalPanels[p2Key] = (totalPanels[p2Key] || 0) + 1;
            }
        }
        
        // Count fillers
        if (wall.connected !== "yes" || wall.leftType === "end") {
            totalFillers[wall.leftType]++;
        }
        totalFillers[wall.rightType]++;
    });
    
    // Calculate board costs using advanced pricing
    Object.entries(totalPanels).forEach(([type, count]) => {
        const width = parseInt(type.replace(/[^\d]/g, ''));
        const boardCost = getBoardPrice(material, materialDetail, width);
        costs.boards += boardCost * count;
        costs.breakdown[`${type} boards (${count})`] = boardCost * count;
    });
    
    // Calculate filler costs using advanced pricing
    Object.entries(totalFillers).forEach(([type, count]) => {
        if (count > 0) {
            const fillerCost = getFillerPrice(type, material, materialDetail) * count;
            costs.fillers += fillerCost;
            const fillerMaterial = !projectConfig.matchMaterials && projectConfig.fillerMaterial ? 
                projectConfig.fillerMaterial : 'matching';
            costs.breakdown[`${type} fillers (${count}) - ${fillerMaterial}`] = fillerCost;
        }
    });
    
    // Calculate hardware costs
    const boardHeight = (projectConfig.coverageHeight || projectConfig.wallHeight) - 
                       (projectConfig.useCeilingTrim ? CEILING_GAP : 1.0) - 
                       (projectConfig.useFloorTrim ? FLOOR_GAP : 0);
    
    const zClipRows = boardHeight > 96 ? 4 : 3;
    const totalBoards = Object.values(totalPanels).reduce((sum, count) => sum + count, 0);
    const totalCornerFillers = (totalFillers.inside || 0) + (totalFillers.outside || 0);
    const maleClipsPerItem = zClipRows;
    const totalMaleClips = (totalBoards * maleClipsPerItem) + (totalCornerFillers * maleClipsPerItem * 2);
    
    // Female clips calculation
    let totalFemaleStrips = 0;
    globalWallDetails.forEach(wall => {
        const stripsNeeded = Math.ceil(wall.length / 84);
        totalFemaleStrips += stripsNeeded * zClipRows;
    });
    
    // Use advanced pricing for hardware if available
    const advancedPricing = loadCalculationPricing();
    
    if (advancedPricing?.hardware) {
        const femalePrice = advancedPricing.hardware.femaleZClip.price * 
            (1 + (advancedPricing.markupType === 'global' ? 0 : advancedPricing.hardware.femaleZClip.markup / 100));
        const malePrice = advancedPricing.hardware.maleZClip.price * 
            (1 + (advancedPricing.markupType === 'global' ? 0 : advancedPricing.hardware.maleZClip.markup / 100));
        const kitPrice = advancedPricing.hardware.finishingKit.price * 
            (1 + (advancedPricing.markupType === 'global' ? 0 : advancedPricing.hardware.finishingKit.markup / 100));
        
        costs.hardware += totalFemaleStrips * femalePrice;
        costs.hardware += totalMaleClips * malePrice;
        
        const finishKits = totalFillers.end > 0 ? Math.ceil(totalFillers.end / 6) : 0;
        costs.hardware += finishKits * kitPrice;
        
        costs.breakdown[`Female Z-clips (${totalFemaleStrips} strips)`] = totalFemaleStrips * femalePrice;
        costs.breakdown[`Male Z-clips (${totalMaleClips} clips)`] = totalMaleClips * malePrice;
        if (finishKits > 0) {
            costs.breakdown[`Finishing kits (${finishKits})`] = finishKits * kitPrice;
        }
    } else {
        // Fall back to legacy pricing
        const hardwarePricing = PRICING.hardware;
        costs.hardware += totalFemaleStrips * hardwarePricing.femaleZClip;
        costs.hardware += totalMaleClips * hardwarePricing.maleZClip;
        
        const finishKits = totalFillers.end > 0 ? Math.ceil(totalFillers.end / 6) : 0;
        costs.hardware += finishKits * hardwarePricing.finishingKit;
        
        costs.breakdown[`Female Z-clips (${totalFemaleStrips} strips)`] = totalFemaleStrips * hardwarePricing.femaleZClip;
        costs.breakdown[`Male Z-clips (${totalMaleClips} clips)`] = totalMaleClips * hardwarePricing.maleZClip;
        if (finishKits > 0) {
            costs.breakdown[`Finishing kits (${finishKits})`] = finishKits * hardwarePricing.finishingKit;
        }
    }
    
    // Calculate trim costs using advanced pricing
    const totalWallLength = globalWallDetails.reduce((sum, wall) => sum + wall.length, 0);
    const trimLengths = Math.ceil(totalWallLength / 96); // 8ft lengths
    
    if (projectConfig.coverageType === 'partial' && projectConfig.needsCap) {
        const capProfile = `${projectConfig.capWidth}-${projectConfig.capEdge}`;
        const capPrice = getTrimPrice('cap', capProfile);
        costs.trim += trimLengths * capPrice;
        const trimMaterial = !projectConfig.matchMaterials && projectConfig.trimMaterial ? 
            projectConfig.trimMaterial : 'matching';
        costs.breakdown[`Cap rail (${trimLengths} lengths) - ${trimMaterial}`] = trimLengths * capPrice;
    } else if (projectConfig.useCeilingTrim) {
        const ceilingPrice = getTrimPrice('ceiling', 'standard');
        costs.trim += trimLengths * ceilingPrice;
        const trimMaterial = !projectConfig.matchMaterials && projectConfig.trimMaterial ? 
            projectConfig.trimMaterial : 'matching';
        costs.breakdown[`Ceiling trim (${trimLengths} lengths) - ${trimMaterial}`] = trimLengths * ceilingPrice;
    }
    
    if (projectConfig.useFloorTrim) {
        const basePrice = getTrimPrice('base', 'standard');
        costs.trim += trimLengths * basePrice;
        const trimMaterial = !projectConfig.matchMaterials && projectConfig.trimMaterial ? 
            projectConfig.trimMaterial : 'matching';
        costs.breakdown[`Base trim (${trimLengths} lengths) - ${trimMaterial}`] = trimLengths * basePrice;
    }
    
    // Calculate labor
    const laborPricing = advancedPricing?.labor || PRICING.labor;
    const squareFootage = (totalWallLength * (projectConfig.coverageHeight || projectConfig.wallHeight)) / 144;
    costs.labor = Math.max(squareFootage * laborPricing.perSquareFoot, laborPricing.minimum);
    costs.breakdown['Installation labor'] = costs.labor;
    
    // Calculate totals
    costs.materials = costs.boards + costs.fillers + costs.hardware + costs.trim;
    costs.subtotal = costs.materials + costs.labor;
    
    // Apply global markup if selected
    if (advancedPricing?.markupType === 'global') {
        const markupRate = 1 + (advancedPricing.globalMarkup / 100);
        costs.markup = costs.subtotal * (markupRate - 1);
    } else {
        // Individual markups already applied
        costs.markup = 0;
    }
    
    costs.total = costs.subtotal + costs.markup;
    
    return costs;
}

// Installation time estimate
function calculateInstallationTime() {
    if (!globalWallDetails || globalWallDetails.length === 0) return null;
    
    const totalWalls = globalWallDetails.length;
    const totalLength = globalWallDetails.reduce((sum, wall) => sum + wall.length, 0);
    const squareFootage = (totalLength * (projectConfig.coverageHeight || projectConfig.wallHeight)) / 144;
    
    // Base time calculations (in hours)
    const prepTime = 2; // Site prep
    const layoutTime = totalWalls * 0.5; // Layout and measuring
    const mountingTime = squareFootage * 0.15; // Mounting boards
    const trimTime = projectConfig.useCeilingTrim || projectConfig.useFloorTrim ? totalLength / 96 * 0.5 : 0;
    const finishingTime = 2; // Final touches and cleanup
    
    const totalHours = prepTime + layoutTime + mountingTime + trimTime + finishingTime;
    const totalDays = Math.ceil(totalHours / 8); // 8-hour workdays
    
    return {
        hours: Math.round(totalHours),
        days: totalDays,
        breakdown: {
            'Site Preparation': prepTime,
            'Layout & Measuring': layoutTime,
            'Board Installation': Math.round(mountingTime),
            'Trim Installation': trimTime,
            'Finishing & Cleanup': finishingTime
        }
    };
}

// Input validation functions
function validateWallLength(length) {
    if (!length || isNaN(length)) {
        return { valid: false, error: "Please enter a valid number" };
    }
    
    const minLength = projectConfig.useMetric ? 152.4 : 6; // 6 inches in mm
    const maxLength = projectConfig.useMetric ? 15240 : 600; // 600 inches in mm
    
    if (length < minLength) {
        return { valid: false, error: `Minimum wall length is ${formatDimension(6)}` };
    }
    if (length > maxLength) {
        return { valid: false, error: `Maximum wall length is ${formatDimension(600)}` };
    }
    
    // Check for 1/8 inch increments (3.175mm)
    if (!projectConfig.useMetric) {
        const remainder = (length * 8) % 1;
        if (remainder !== 0) {
            return { valid: false, error: "Please use 1/8 inch increments" };
        }
    }
    
    return { valid: true };
}

// Update board recommendation based on height - FIXED VERSION
function updateBoardRecommendation() {
    const coverageHeight = projectConfig.coverageHeight || projectConfig.wallHeight;
    
    if (!coverageHeight) return; // Exit if no height set yet
    
    // Check the correct elements based on coverage type
    let ceilingTrimChecked = false;
    let floorTrimChecked = false;
    
    if (projectConfig.coverageType === 'full') {
        const ceilingTrim = document.getElementById('ceilingTrim');
        const baseTrimFull = document.getElementById('baseTrimFull');
        ceilingTrimChecked = ceilingTrim ? ceilingTrim.checked : projectConfig.useCeilingTrim;
        floorTrimChecked = baseTrimFull ? baseTrimFull.checked : projectConfig.useFloorTrim;
    } else {
        // Wainscot never uses ceiling trim
        ceilingTrimChecked = false;
        const baseTrimWainscot = document.getElementById('baseTrimWainscot');
        floorTrimChecked = baseTrimWainscot ? baseTrimWainscot.checked : projectConfig.useFloorTrim;
    }
    
    const ceilingGap = ceilingTrimChecked ? CEILING_GAP : 1.0;
    const floorGap = floorTrimChecked ? FLOOR_GAP : 0;
    
    let boardHeight = coverageHeight - ceilingGap - floorGap;
    
    let recommendedLength;
    if (boardHeight <= 48) {
        recommendedLength = 48;
    } else if (boardHeight <= 96) {
        recommendedLength = 96;
    } else if (boardHeight <= 120) {
        recommendedLength = 120;
    } else {
        recommendedLength = 144;
    }
    
    projectConfig.recommendedBoardLength = recommendedLength;
    const boardLengthElement = document.getElementById('boardLength');
    if (boardLengthElement) {
        boardLengthElement.value = recommendedLength;
    }
}
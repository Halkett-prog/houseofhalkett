// HALKETT Calculator Configuration v60
// This file contains all constants and pricing configuration

// Only declare if not already defined by the component
if (typeof CLEARANCE === 'undefined') {
    var CLEARANCE = 0.25;
}
if (typeof CEILING_GAP === 'undefined') {
    var CEILING_GAP = 1.5;
}
if (typeof FLOOR_GAP === 'undefined') {
    var FLOOR_GAP = 1.5;
}
if (typeof P1_SIZES === 'undefined') {
    var P1_SIZES = [6, 4, 2];
}
if (typeof P2_SIZES === 'undefined') {
    var P2_SIZES = [2, 4, 6];
}
if (typeof VERSION === 'undefined') {
    var VERSION = 'v60';
}

// Default pricing configuration (fallback if localStorage is empty)
if (typeof DEFAULT_PRICING === 'undefined') {
    var DEFAULT_PRICING = {
        boards: {
            'natural-wood': { base: 150, perInch: 4.5 },
            'painted': { base: 120, perInch: 3.8 },
            'leather': { base: 280, perInch: 8.5 },
            'metal': { base: 200, perInch: 6.2 }
        },
        fillers: {
            end: 85,
            inside: 120,
            outside: 105
        },
        hardware: {
            femaleZClip: 12.50,
            maleZClip: 1.25,
            finishingKit: 65
        },
        trim: {
            ceiling: 42,
            base: 38,
            cap: 45
        },
        labor: {
            perSquareFoot: 12.50,
            minimum: 500
        },
        markup: 1.35
    };
}

// Load pricing from localStorage or use defaults
function loadPricing() {
    try {
        const stored = localStorage.getItem('halkettPricing');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading pricing:', e);
    }
    return DEFAULT_PRICING;
}

// Dynamic pricing object that loads from localStorage
if (typeof PRICING === 'undefined') {
    var PRICING = loadPricing();
}

// Reload pricing (call this when pricing might have changed)
function reloadPricing() {
    PRICING = loadPricing();
}

// Listen for storage changes (when pricing is updated in another tab)
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        if (e.key === 'halkettPricing') {
            reloadPricing();
            console.log('Pricing updated from another tab');
        }
    });
}

// Only create projectConfig if it doesn't exist
if (typeof projectConfig === 'undefined') {
    var projectConfig = {
        coverageType: 'full',
        wallHeight: null,
        boardLength: 96,
        recommendedBoardLength: null,
        coverageHeight: null,
        useCeilingTrim: true,
        useFloorTrim: false,
        boardStyle: 'contemporary',
        boardMaterial: 'natural-wood',
        materialDetail: '',
        paintSheen: '',
        woodStain: '',
        woodSheen: '',
        matchMaterials: true,
        fillerMaterial: '',
        fillerMaterialDetail: '',
        trimMaterial: '',
        trimMaterialDetail: '',
        needsCap: false,
        capWidth: '1.75',
        capEdge: 'square',
        currentStep: 1,
        projectName: '',
        useMetric: false
    };
}

// Global variables - check if they exist first
if (typeof globalWallDetails === 'undefined') {
    var globalWallDetails = [];
}
if (typeof globalSpecification === 'undefined') {
    var globalSpecification = '';
}
if (typeof globalCostEstimate === 'undefined') {
    var globalCostEstimate = null;
}

// Memoization cache for calculations
if (typeof calculationCache === 'undefined') {
    var calculationCache = new Map();
}

// Recent configurations
if (typeof recentConfigurations === 'undefined') {
    var recentConfigurations = [];
}

// Material mapping for descriptions
if (typeof MATERIAL_NAMES === 'undefined') {
    var MATERIAL_NAMES = {
        'natural-wood': {
            'white-oak': 'White Oak',
            'walnut': 'Walnut',
            'sapele': 'Sapele'
        },
        'painted': {
            'standard': 'Standard Paint',
            'premium': 'Premium Paint'
        },
        'leather': {
            'crock': 'Leather - Crock',
            'shagreen': 'Leather - Shagreen',
            'bison': 'Leather - Bison'
        },
        'metal': {
            'copper': 'Copper',
            'brass': 'Brass',
            'zinc': 'Zinc',
            'bronze': 'Bronze',
            'stainless': 'Stainless Steel',
            'blackened': 'Blackened Steel'
        }
    };
}

// NO EXPORT STATEMENTS - remove any if they exist
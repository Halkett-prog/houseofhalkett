// HALKETT Calculator Configuration v60
// This file contains all constants and pricing configuration

// Constants
const CLEARANCE = 0.25;
const CEILING_GAP = 1.5;
const FLOOR_GAP = 1.5;
const P1_SIZES = [6, 4, 2];
const P2_SIZES = [2, 4, 6];
const VERSION = 'v60';

// Default pricing configuration (fallback if localStorage is empty)
const DEFAULT_PRICING = {
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
let PRICING = loadPricing();

// Reload pricing (call this when pricing might have changed)
function reloadPricing() {
    PRICING = loadPricing();
}

// Listen for storage changes (when pricing is updated in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'halkettPricing') {
        reloadPricing();
        console.log('Pricing updated from another tab');
    }
});

// Project configuration object - UPDATED with material options
let projectConfig = {
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
    paintSheen: '', // Paint sheen level
    woodStain: '', // NEW: Wood stain color
    woodSheen: '', // NEW: Wood finish sheen
    // NEW: Separate materials for components
    matchMaterials: true,  // If true, fillers and trim match boards
    fillerMaterial: '',    // Custom filler material if not matching
    fillerMaterialDetail: '',
    trimMaterial: '',      // Custom trim material if not matching
    trimMaterialDetail: '',
    needsCap: false,
    capWidth: '1.75',
    capEdge: 'square',
    currentStep: 1,
    projectName: '',
    useMetric: false
};

// Global variables
let globalWallDetails = [];
let globalSpecification = '';
let globalCostEstimate = null;

// Memoization cache for calculations
const calculationCache = new Map();

// Recent configurations
let recentConfigurations = [];

// Material mapping for descriptions
const MATERIAL_NAMES = {
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

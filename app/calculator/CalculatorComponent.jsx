'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import './calculator.css';

export default function CalculatorComponent() {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Initialize when component mounts
    if (typeof window !== 'undefined') {
      // Set up global configuration
      window.CLEARANCE = 0.25;
      window.CEILING_GAP = 1.5;
      window.FLOOR_GAP = 1.5;
      window.P1_SIZES = [6, 4, 2];
      window.P2_SIZES = [2, 4, 6];
      window.VERSION = 'v60';
      
      window.DEFAULT_PRICING = {
        boards: {
          'natural-wood': { base: 150, perInch: 4.5 },
          'painted': { base: 120, perInch: 3.8 },
          'leather': { base: 280, perInch: 8.5 },
          'metal': { base: 200, perInch: 6.2 }
        },
        fillers: { end: 85, inside: 120, outside: 105 },
        hardware: { femaleZClip: 12.50, maleZClip: 1.25, finishingKit: 65 },
        trim: { ceiling: 42, base: 38, cap: 45 },
        labor: { perSquareFoot: 12.50, minimum: 500 },
        markup: 1.35
      };

      window.loadPricing = function() {
        try {
          const stored = localStorage.getItem('halkettPricing');
          if (stored) return JSON.parse(stored);
        } catch (e) {
          console.error('Error loading pricing:', e);
        }
        return window.DEFAULT_PRICING;
      };

      window.PRICING = window.loadPricing();
      
      window.reloadPricing = function() {
        window.PRICING = window.loadPricing();
      };

      window.projectConfig = {
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

      window.globalWallDetails = [];
      window.globalSpecification = '';
      window.globalCostEstimate = null;
      window.calculationCache = new Map();
      window.recentConfigurations = [];

      // Set up all the navigation functions
      window.nextStep = function(current) {
        console.log('nextStep called:', current);
        if (window.validateStep && window.validateStep(current)) {
          document.getElementById('step' + current).classList.remove('active');
          window.projectConfig.currentStep = current + 1;
          document.getElementById('step' + (current + 1)).classList.add('active');
          setCurrentStep(current + 1);
          
          if (window.updateProgress) window.updateProgress();
          if (window.createStepIndicators) window.createStepIndicators();
          
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          if (current === 5 && window.calculateAll) {
            window.calculateAll();
          }
        }
      };

      window.previousStep = function(current) {
        console.log('previousStep called:', current);
        document.getElementById('step' + current).classList.remove('active');
        window.projectConfig.currentStep = current - 1;
        document.getElementById('step' + (current - 1)).classList.add('active');
        setCurrentStep(current - 1);
        
        if (window.updateProgress) window.updateProgress();
        if (window.createStepIndicators) window.createStepIndicators();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      window.goToStep = function(stepNum) {
        console.log('goToStep called:', stepNum);
        if (stepNum < window.projectConfig.currentStep) {
          document.getElementById('step' + window.projectConfig.currentStep).classList.remove('active');
          window.projectConfig.currentStep = stepNum;
          document.getElementById('step' + stepNum).classList.add('active');
          setCurrentStep(stepNum);
          if (window.updateProgress) window.updateProgress();
          if (window.createStepIndicators) window.createStepIndicators();
        } else if (stepNum === window.projectConfig.currentStep + 1) {
          window.nextStep(window.projectConfig.currentStep);
        }
      };

      window.goToSystemOverview = function() {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        window.projectConfig.currentStep = 1;
        setCurrentStep(1);
        if (window.updateProgress) window.updateProgress();
        if (window.createStepIndicators) window.createStepIndicators();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      // Add to cart function for integration
      window.addToCart = function() {
        console.log('Add to Cart clicked!');
        
        const config = {
          timestamp: new Date().toISOString(),
          projectName: window.projectConfig.projectName || 'Untitled Project',
          material: window.projectConfig.boardMaterial,
          materialDetail: window.projectConfig.materialDetail,
          profile: window.projectConfig.boardStyle,
          boardWidth: window.projectConfig.boardLength,
          coverage: window.projectConfig.coverageType,
          wallHeight: window.projectConfig.wallHeight,
          coverageHeight: window.projectConfig.coverageHeight,
          specification: window.globalSpecification || 'Configuration saved',
          costEstimate: window.globalCostEstimate,
          walls: window.globalWallDetails
        };
        
        localStorage.setItem('pendingCalculatorOrder', JSON.stringify(config));
        
        // Show notification
        if (window.showNotification) {
          window.showNotification('Configuration added to cart!', 'success');
        } else {
          alert('Configuration added to cart!');
        }
        
        // Navigate to cart after short delay
        setTimeout(() => {
          window.location.href = '/cart';
        }, 1500);
      };

      // Initialize all other functions as stubs that will be replaced by loaded scripts
      window.handleCoverageChange = window.handleCoverageChange || function() {};
      window.toggleTrimMaterial = window.toggleTrimMaterial || function() {};
      window.updateMaterialDetails = window.updateMaterialDetails || function() {};
      window.generateWalls = window.generateWalls || function() {};
      window.openGallery = window.openGallery || function() {};
      window.closeGallery = window.closeGallery || function() {};
      window.closeGalleryOutside = window.closeGalleryOutside || function() {};
      window.showSampleRequest = window.showSampleRequest || function() {};
      window.closeSampleModal = window.closeSampleModal || function() {};
      window.submitSampleRequest = window.submitSampleRequest || function() {};
      window.showRecentConfigurations = window.showRecentConfigurations || function() {};
      window.closeRecentModal = window.closeRecentModal || function() {};
      window.loadRecentConfig = window.loadRecentConfig || function() {};
      window.saveConfiguration = window.saveConfiguration || function() {};
      window.copySpecification = window.copySpecification || function() {};
      window.generatePDF = window.generatePDF || function() {};
      window.emailSpecification = window.emailSpecification || function() {};
      window.exportCostEstimate = window.exportCostEstimate || function() {};
      window.toggleCostBreakdown = window.toggleCostBreakdown || function() {};
      window.toggleUnits = window.toggleUnits || function() {};
      window.restoreConfiguration = window.restoreConfiguration || function() {};
      window.calculateAll = window.calculateAll || function() {};
      window.validateStep = window.validateStep || function() { return true; };
      window.updateTrimOptions = window.updateTrimOptions || function() {};

      setScriptsLoaded(true);
    }
  }, []);

  // Load the actual calculator scripts after initial setup
  useEffect(() => {
    if (scriptsLoaded && typeof window !== 'undefined') {
      // Load the actual calculator scripts
      const loadCalculatorScripts = async () => {
        try {
          // These will override the stub functions with real implementations
          const scripts = [
            '/calculator-scripts/config.js',
            '/calculator-scripts/calculations.js',
            '/calculator-scripts/ui.js',
            '/calculator-scripts/main.js'
          ];

          for (const src of scripts) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = src;
              script.async = false;
              script.onload = resolve;
              script.onerror = () => {
                console.warn(`Could not load ${src}, using built-in functions`);
                resolve(); // Continue even if script fails
              };
              document.body.appendChild(script);
            });
          }

          // Initialize after all scripts are loaded
          setTimeout(() => {
            if (window.createStepIndicators) window.createStepIndicators();
            if (window.loadSavedProgress) window.loadSavedProgress();
            if (window.updateMaterialDetails) window.updateMaterialDetails();
          }, 100);
        } catch (error) {
          console.error('Error loading calculator scripts:', error);
        }
      };

      loadCalculatorScripts();
    }
  }, [scriptsLoaded]);

  if (!scriptsLoaded) {
    return (
      <div className="calculator-wrapper">
        <div className="loading-overlay active">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Add mobile responsive CSS */}
      <link rel="stylesheet" href="/calculator-scripts/calculator-mobile.css" />
      
      <div className="calculator-wrapper">
        {/* Loading Overlay */}
        <div className="loading-overlay" id="loadingOverlay">
          <div className="loading-spinner"></div>
        </div>

        {/* Notification */}
        <div id="notification" className="notification">
          <svg id="notificationIcon" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span id="notificationText"></span>
        </div>
        
        <div className="container">
          <div className="signature-section" style={{ textAlign: 'center', margin: '40px 0 30px 0' }}>
            <h2 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, letterSpacing: '2px', margin: '0 0 10px 0', textTransform: 'uppercase', color: '#232320' }}>
              Signature Walls
            </h2>
            <p style={{ fontSize: 'clamp(14px, 2.5vw, 16px)', color: '#A1A2A0', margin: 0, lineHeight: 1.6, letterSpacing: '0.3px', fontWeight: 300 }}>
              Architectural wall systems that redefine modern spaces. Modular, seamless, and crafted to transform any environment.
            </p>
          </div>
          
          {/* Enhanced controls */}
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <button id="unitToggle" className="unit-toggle-btn" onClick={() => window.toggleUnits && window.toggleUnits()}>Switch to Metric</button>
            <button className="recent-projects-btn" onClick={() => window.showRecentConfigurations && window.showRecentConfigurations()}>Recent Projects</button>
          </div>
          
          {/* Step indicators */}
          <div id="stepIndicators" className="step-indicators"></div>
          
          <div className="progress-bar">
            <div className="progress-fill" id="progressBar"></div>
          </div>
          
          {/* Step 1: System Overview */}
          <div className="step active" id="step1">
            <div className="step-header">
              <div className="step-number">Welcome to HALKETT</div>
              <h2 className="step-title">Signature Wall System</h2>
              <p className="step-description">Everything calculated automatically for you.</p>
            </div>
            
            <div style={{ background: '#F8F7F5', padding: '20px', marginBottom: '20px' }}>
              <div style={{ width: '100%', height: '180px', background: '#E5E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <p style={{ color: '#A1A2A0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  System Components Diagram
                </p>
              </div>
            </div>
            
            <div style={{ background: '#232320', color: '#EFEEE1', padding: '25px', margin: '0 -40px' }}>
              <h4 style={{ fontSize: '14px', color: '#B19359', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px 0', textAlign: 'center' }}>
                Your Complete System
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '400px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#34499E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>1</div>
                  <div style={{ fontSize: '12px' }}>Modular Boards</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#34499E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>2</div>
                  <div style={{ fontSize: '12px' }}>Custom Fillers</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#34499E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>3</div>
                  <div style={{ fontSize: '12px' }}>Z-Clip System</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#34499E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>4</div>
                  <div style={{ fontSize: '12px' }}>Trim Options</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#34499E', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>5</div>
                  <div style={{ fontSize: '12px' }}>Finishing Kit</div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px' }}>
                  <div style={{ width: '24px', height: '24px', background: '#B19359', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div style={{ fontSize: '12px' }}>PDF Specification</div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #444' }}>
                <p style={{ fontSize: '13px', margin: 0, color: '#B19359', fontWeight: 500 }}>
                  Now with Cost Estimation & Installation Time
                </p>
                <p style={{ fontSize: '12px', margin: '5px 0 0 0', opacity: 0.8 }}>
                  Calculate, save & print your custom specification instantly.
                </p>
                <p style={{ fontSize: '11px', margin: '8px 0 0 0', opacity: 0.6 }}>
                  Version 60 - Enhanced Calculator
                </p>
              </div>
            </div>
            
            <div className="navigation">
              <span></span>
              <button onClick={() => window.nextStep(1)} style={{ background: '#B19359' }}>
                Let's Start
                <svg style={{ width: '16px', height: '16px', marginLeft: '8px', verticalAlign: 'middle' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Step 2: Basic Configuration */}
          <div className="step" id="step2">
            <div className="step-header">
              <div className="step-number">Step 1 of 5</div>
              <h2 className="step-title">Wall Configuration</h2>
              <p className="step-description">Let's start with your wall dimensions and coverage type.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="projectName">
                Project Name / PO Number 
                <span style={{ color: '#34499E', fontWeight: 700 }}> (Required)</span>
                <span className="tooltip" data-tooltip="Used for PDF filename and identification" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
              </label>
              <input type="text" id="projectName" placeholder="e.g., Master Bedroom or PO-12345" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="wallHeight">
                Wall Height
                <span className="tooltip" data-tooltip="Floor to ceiling measurement in inches" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
              </label>
              <input type="number" id="wallHeight" min="24" max="200" placeholder="Enter height in inches" inputMode="numeric" />
            </div>
            
            <div className="form-group">
              <label>Coverage Type</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input type="radio" name="coverage" id="fullHeight" value="full" defaultChecked onChange={(e) => window.handleCoverageChange && window.handleCoverageChange(e.target)} />
                  <label htmlFor="fullHeight">Full Height</label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="coverage" id="wainscot" value="partial" onChange={(e) => window.handleCoverageChange && window.handleCoverageChange(e.target)} />
                  <label htmlFor="wainscot">Wainscot</label>
                </div>
              </div>
            </div>
            
            <div className="form-group" id="wainscotHeight" style={{ display: 'none' }}>
              <label htmlFor="coverageHeight">Wainscot Height</label>
              <input type="number" id="coverageHeight" min="12" max="200" placeholder="Enter height in inches" inputMode="numeric" />
            </div>
            
            <div className="navigation">
              <button onClick={() => window.previousStep(2)} className="secondary">Previous</button>
              <button onClick={() => window.nextStep(2)}>Next Step</button>
            </div>
          </div>
          
          {/* Step 3: Design Selection */}
          <div className="step" id="step3">
            <div className="step-header">
              <div className="step-number">Step 2 of 5</div>
              <h2 className="step-title">Design Selection</h2>
              <p className="step-description">Choose your profile style and board system size.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="boardLength">
                Modular Board System
                <span className="tooltip" data-tooltip="Board length will be cut to fit your wall height" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
              </label>
              <select id="boardLength">
                <option value="48">48" Standard Size</option>
                <option value="96">96" Standard Size</option>
                <option value="120">120" Premium Size</option>
                <option value="144">144" Premium Size</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Profile Style</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input type="radio" name="profile" id="contemporary" value="contemporary" defaultChecked />
                  <label htmlFor="contemporary">
                    Contemporary
                    <div className="profile-image">Profile Image</div>
                  </label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="profile" id="wave" value="wave" />
                  <label htmlFor="wave">
                    Wave
                    <div className="profile-image">Profile Image</div>
                  </label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="profile" id="architectural" value="architectural" />
                  <label htmlFor="architectural">
                    Architectural
                    <div className="profile-image">Profile Image</div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group" id="capRailOptions" style={{ display: 'none' }}>
              <label>Cap Rail Profile</label>
              <div className="material-grid">
                <div className="radio-option">
                  <input type="radio" name="capProfile" id="cap175" value="1.75" defaultChecked />
                  <label htmlFor="cap175">
                    1.75" Standard
                    <div className="cap-image">Cap Image</div>
                  </label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="capProfile" id="cap25square" value="2.5-square" />
                  <label htmlFor="cap25square">
                    2.5" Square Edge
                    <div className="cap-image">Cap Image</div>
                  </label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="capProfile" id="cap25beveled" value="2.5-beveled" />
                  <label htmlFor="cap25beveled">
                    2.5" Beveled Edge
                    <div className="cap-image">Cap Image</div>
                  </label>
                </div>
                <div className="radio-option">
                  <input type="radio" name="capProfile" id="cap25bullnose" value="2.5-bullnose" />
                  <label htmlFor="cap25bullnose">
                    2.5" Bullnose
                    <div className="cap-image">Cap Image</div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="navigation">
              <button onClick={() => window.previousStep(3)} className="secondary">Previous</button>
              <button onClick={() => window.nextStep(3)}>Next Step</button>
            </div>
          </div>
          
          {/* Step 4: Material Selection */}
          <div className="step" id="step4">
            <div className="step-header">
              <div className="step-number">Step 3 of 5</div>
              <h2 className="step-title">Materials & Finishes</h2>
              <p className="step-description">Select materials for boards, fillers, and trim.</p>
            </div>
            
            <div className="material-section">
              <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
                Board Material
              </h3>
              <div className="material-grid">
                <div className="material-option">
                  <input type="radio" name="material" id="wood" value="natural-wood" defaultChecked onChange={() => window.updateMaterialDetails && window.updateMaterialDetails()} />
                  <label htmlFor="wood">
                    <div className="material-name">Wood</div>
                    <div className="material-desc">Natural warmth</div>
                  </label>
                </div>
                <div className="material-option">
                  <input type="radio" name="material" id="painted" value="painted" onChange={() => window.updateMaterialDetails && window.updateMaterialDetails()} />
                  <label htmlFor="painted">
                    <div className="material-name">Painted</div>
                    <div className="material-desc">Custom colors</div>
                  </label>
                </div>
                <div className="material-option">
                  <input type="radio" name="material" id="leather" value="leather" onChange={() => window.updateMaterialDetails && window.updateMaterialDetails()} />
                  <label htmlFor="leather">
                    <div className="material-name">Leather</div>
                    <div className="material-desc">Luxe collection</div>
                  </label>
                </div>
                <div className="material-option">
                  <input type="radio" name="material" id="metal" value="metal" onChange={() => window.updateMaterialDetails && window.updateMaterialDetails()} />
                  <label htmlFor="metal">
                    <div className="material-name">Metal</div>
                    <div className="material-desc">Modern edge</div>
                  </label>
                </div>
              </div>
              
              <div id="materialDetails" style={{ marginTop: '15px' }}></div>
            </div>
            
            <div className="material-section" style={{ marginTop: '30px', background: '#F8F7F5', padding: '20px', marginLeft: '-20px', marginRight: '-20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ fontSize: '14px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
                  ALL TRIM COMPONENTS
                </h3>
                <button type="button" id="customizeTrim" onClick={() => window.toggleTrimMaterial && window.toggleTrimMaterial()} 
                        style={{ background: 'none', border: '1px solid #A1A2A0', color: '#A1A2A0', 
                                 padding: '6px 16px', fontSize: '10px', letterSpacing: '1px',
                                 cursor: 'pointer', transition: 'all 0.2s ease', minWidth: 'auto' }}>
                  CUSTOMIZE
                </button>
              </div>
              
              <div id="defaultTrimInfo" style={{ textAlign: 'center', color: '#666', fontSize: '13px' }}>
                <span style={{ color: '#34499E' }}>✓</span> Fillers, cap rail, ceiling & base trim will match your board material
              </div>
              
              <div id="customTrimOptions" style={{ display: 'none' }}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label htmlFor="allTrimMaterial" style={{ fontSize: '11px' }}>Select Trim Material</label>
                  <select id="allTrimMaterial" style={{ fontSize: '14px' }}>
                    <option value="">Match Board Material</option>
                    <optgroup label="Wood">
                      <option value="white-oak">White Oak</option>
                      <option value="walnut">Walnut</option>
                      <option value="sapele">Sapele</option>
                    </optgroup>
                    <option value="painted">Painted</option>
                    <optgroup label="Leather">
                      <option value="leather-crock">Leather - Crock</option>
                      <option value="leather-shagreen">Leather - Shagreen</option>
                      <option value="leather-bison">Leather - Bison</option>
                    </optgroup>
                    <optgroup label="Metal">
                      <option value="metal-copper">Copper</option>
                      <option value="metal-brass">Brass</option>
                      <option value="metal-zinc">Zinc</option>
                      <option value="metal-bronze">Bronze</option>
                      <option value="metal-stainless">Stainless Steel</option>
                      <option value="metal-blackened">Blackened Steel</option>
                    </optgroup>
                  </select>
                </div>
                <p style={{ fontSize: '11px', color: '#A1A2A0', textAlign: 'center', margin: '5px 0 0 0', fontStyle: 'italic' }}>
                  This applies to all fillers, cap rail, ceiling trim, and base trim
                </p>
              </div>
            </div>
            
            <div className="form-group" style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '14px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
                TRIM SELECTIONS
              </h4>
              
              <div id="fullHeightTrimOptions" style={{ display: 'block' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" id="ceilingTrim" defaultChecked style={{ margin: 0 }} />
                    <span>Ceiling Trim</span>
                    <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Recommended for finished edge)</span>
                  </label>
                </div>
                
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" id="baseTrimFull" style={{ margin: 0 }} />
                    <span>Base Trim</span>
                    <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Optional)</span>
                  </label>
                </div>
              </div>
              
              <div id="wainscotTrimOptions" style={{ display: 'none' }}>
                <div style={{ marginBottom: '10px', padding: '10px', background: '#E8F5E9', border: '1px solid #4CAF50' }}>
                  <span style={{ color: '#2E7D32', fontWeight: 600 }}>✓ Cap Rail:</span> 
                  <span style={{ fontSize: '12px' }}>You selected a cap rail profile in Step 3</span>
                </div>
                
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input type="checkbox" id="baseTrimWainscot" style={{ margin: 0 }} />
                    <span>Base Trim</span>
                    <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Optional)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div id="trimGapInfo" style={{ display: 'none', marginTop: '10px' }}>
              <div className="warning" style={{ fontSize: '12px', padding: '10px' }}>
                <strong>Note:</strong> <span id="gapMessage"></span>
              </div>
            </div>
            
            <div className="customization-note">
              <div className="customization-button" onClick={() => window.openGallery && window.openGallery()}>
                <p className="header">BEYOND THE STANDARD</p>
              </div>
              <p className="message">
                Every specification can be customized to your exact vision.
              </p>
              <p className="contact">
                <span>Inquiries:</span> <span>215.721.9331</span>
              </p>
            </div>
            
            <div style={{ textAlign: 'center', margin: '20px 0' }}>
              <button onClick={() => window.showSampleRequest && window.showSampleRequest()} style={{ background: '#A1A2A0' }}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Request Material Samples
              </button>
            </div>
            
            <div className="navigation">
              <button onClick={() => window.previousStep(4)} className="secondary">Previous</button>
              <button onClick={() => window.nextStep(4)}>Next Step</button>
            </div>
          </div>
          
          {/* Step 5: Wall Details */}
          <div className="step" id="step5">
            <div className="step-header">
              <div className="step-number">Step 4 of 5</div>
              <h2 className="step-title">Wall Details</h2>
              <p className="step-description">Configure each wall's dimensions and termination.</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="wallCount">
                Number of Walls
                <span className="tooltip" data-tooltip="Connected walls share corner fillers" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
              </label>
              <input type="number" id="wallCount" min="1" max="10" placeholder="1-10 walls" inputMode="numeric" />
              <button onClick={() => window.generateWalls && window.generateWalls()} style={{ marginTop: '10px' }}>Configure Walls</button>
            </div>
            
            <div id="wallsContainer"></div>
            
            <div className="navigation">
              <button onClick={() => window.previousStep(5)} className="secondary">Previous</button>
              <button onClick={() => window.nextStep(5)} id="calculateBtn">Calculate</button>
            </div>
          </div>
          
          {/* Step 6: Results */}
          <div className="step" id="step6">
            <div className="step-header">
              <div className="step-number">Step 5 of 5</div>
              <h2 className="step-title">Your Specification</h2>
              <p className="step-description">Review your complete HALKETT specification below.</p>
            </div>
            
            <div id="resultsContainer"></div>
            
            <div id="costEstimateContainer"></div>
            
            <div id="timeEstimateContainer"></div>
            
            <div className="results-actions">
              <button onClick={() => window.saveConfiguration && window.saveConfiguration()}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Configuration
              </button>
              <button onClick={() => window.copySpecification && window.copySpecification()}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
                </svg>
                Copy to Clipboard
              </button>
              <button onClick={() => window.generatePDF && window.generatePDF()}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                Download PDF
              </button>
              <button onClick={() => window.addToCart && window.addToCart()} style={{ background: '#B19359', width: '100%', marginTop: '15px' }}>
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#A1A2A0', margin: '10px 0' }}>
                For email: Copy specification above, then 
                <a href="#" onClick={(e) => { e.preventDefault(); window.emailSpecification && window.emailSpecification(); }} style={{ color: '#34499E', textDecoration: 'underline' }}>
                  open email client
                </a>
              </p>
              <p style={{ fontSize: '11px', color: '#A1A2A0', margin: '5px 0' }}>
                Keyboard shortcuts: Ctrl+S (Save), Ctrl+P (Print), Ctrl+Enter (Next), Ctrl+R (Recent)
              </p>
            </div>
            
            <div className="customization-callout">
              <h4>Beyond the Standard</h4>
              <p>Every specification can be customized. From unique dimensions to exclusive finishes, we craft your vision precisely.</p>
              <div className="contact">215.721.9331</div>
            </div>
            
            <div className="navigation">
              <button onClick={() => window.goToSystemOverview && window.goToSystemOverview()} className="secondary">
                <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Start New Configuration
              </button>
              <button onClick={() => window.print()}>Print Specification</button>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Gallery Modal */}
        <div className="modal-overlay" id="galleryModal" onClick={(e) => window.closeGalleryOutside && window.closeGalleryOutside(e)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>CUSTOM HALKETT INSTALLATIONS</h3>
              <button className="modal-close" onClick={() => window.closeGallery && window.closeGallery()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="gallery-grid">
              {[1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className="gallery-item">
                  <div className="gallery-placeholder">Custom Wall {i}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Configurations Modal */}
        <div className="modal-overlay recent-modal" id="recentModal" onClick={(e) => window.closeGalleryOutside && window.closeGalleryOutside(e)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>RECENT PROJECTS</h3>
              <button className="modal-close" onClick={() => window.closeRecentModal && window.closeRecentModal()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="recent-list" id="recentList"></div>
          </div>
        </div>

        {/* Sample Request Modal */}
        <div className="modal-overlay" id="sampleModal" onClick={(e) => window.closeGalleryOutside && window.closeGalleryOutside(e)}>
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>REQUEST MATERIAL SAMPLES</h3>
              <button className="modal-close" onClick={() => window.closeSampleModal && window.closeSampleModal()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form className="sample-form" id="sampleForm" onSubmit={(e) => { e.preventDefault(); window.submitSampleRequest && window.submitSampleRequest(); }}>
              <div className="form-group">
                <label htmlFor="sampleName">Name *</label>
                <input type="text" id="sampleName" name="name" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="sampleEmail">Email *</label>
                <input type="email" id="sampleEmail" name="email" required />
              </div>
              
              <div className="form-group">
                <label htmlFor="samplePhone">Phone</label>
                <input type="tel" id="samplePhone" name="phone" />
              </div>
              
              <div className="form-group">
                <label htmlFor="sampleCompany">Company</label>
                <input type="text" id="sampleCompany" name="company" />
              </div>
              
              <h4>Select Materials</h4>
              <div className="material-samples">
                <div className="material-sample">
                  <input type="checkbox" id="sample-white-oak" name="materials" value="White Oak" />
                  <label htmlFor="sample-white-oak">White Oak</label>
                </div>
                <div className="material-sample">
                  <input type="checkbox" id="sample-walnut" name="materials" value="Walnut" />
                  <label htmlFor="sample-walnut">Walnut</label>
                </div>
                <div className="material-sample">
                  <input type="checkbox" id="sample-painted" name="materials" value="Painted Samples" />
                  <label htmlFor="sample-painted">Painted Samples</label>
                </div>
                <div className="material-sample">
                  <input type="checkbox" id="sample-leather" name="materials" value="Leather Samples" />
                  <label htmlFor="sample-leather">Leather Samples</label>
                </div>
                <div className="material-sample">
                  <input type="checkbox" id="sample-metal" name="materials" value="Metal Samples" />
                  <label htmlFor="sample-metal">Metal Samples</label>
                </div>
                <div className="material-sample">
                  <input type="checkbox" id="sample-all" name="materials" value="Full Sample Set" />
                  <label htmlFor="sample-all">Full Sample Set</label>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="sampleNotes">Additional Notes</label>
                <textarea id="sampleNotes" name="notes" placeholder="Any specific requirements or questions..."></textarea>
              </div>
              
              <div className="navigation">
                <button type="button" onClick={() => window.closeSampleModal && window.closeSampleModal()} className="secondary">Cancel</button>
                <button type="submit">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
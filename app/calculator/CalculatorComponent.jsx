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
      // Set up all the navigation functions
      window.nextStep = function(current) {
        console.log('nextStep called:', current);
        if (window.validateStep && window.validateStep(current)) {
          document.getElementById('step' + current).classList.remove('active');
          if (window.projectConfig) {
            window.projectConfig.currentStep = current + 1;
          }
          document.getElementById('step' + (current + 1)).classList.add('active');
          setCurrentStep(current + 1);
          
          if (window.updateProgress) window.updateProgress();
          if (window.createStepIndicators) window.createStepIndicators();
          
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Special handling for entering Step 3 - BOARD ALREADY SELECTED IN STEP 2
          if (current === 2) {
            console.log('Entering Step 3 - Board already selected in Step 2');
            
            // Check if wainscot to show cap rail options
            if (window.projectConfig && window.projectConfig.coverageType === 'partial') {
              const capRailDiv = document.getElementById('capRailOptions');
              if (capRailDiv) {
                capRailDiv.style.display = 'block';
              }
            }
          }
          
          if (current === 5 && window.calculateAll) {
            window.calculateAll();
          }
        }
      };

      window.previousStep = function(current) {
        console.log('previousStep called:', current);
        document.getElementById('step' + current).classList.remove('active');
        if (window.projectConfig) {
          window.projectConfig.currentStep = current - 1;
        }
        document.getElementById('step' + (current - 1)).classList.add('active');
        setCurrentStep(current - 1);
        
        if (window.updateProgress) window.updateProgress();
        if (window.createStepIndicators) window.createStepIndicators();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Special handling when going back to Step 3
        if (current - 1 === 3 && window.setRecommendedBoard) {
          setTimeout(() => {
            window.setRecommendedBoard();
          }, 100);
        }
      };

      window.goToStep = function(stepNum) {
        console.log('goToStep called:', stepNum);
        if (window.projectConfig && stepNum < window.projectConfig.currentStep) {
          document.getElementById('step' + window.projectConfig.currentStep).classList.remove('active');
          window.projectConfig.currentStep = stepNum;
          document.getElementById('step' + stepNum).classList.add('active');
          setCurrentStep(stepNum);
          if (window.updateProgress) window.updateProgress();
          if (window.createStepIndicators) window.createStepIndicators();
          
          // Special handling when going to Step 3
          if (stepNum === 3 && window.setRecommendedBoard) {
            setTimeout(() => {
              window.setRecommendedBoard();
            }, 100);
          }
        } else if (window.projectConfig && stepNum === window.projectConfig.currentStep + 1) {
          window.nextStep(window.projectConfig.currentStep);
        }
      };

      window.goToSystemOverview = function() {
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.getElementById('step1').classList.add('active');
        if (window.projectConfig) {
          window.projectConfig.currentStep = 1;
        }
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
          projectName: window.projectConfig?.projectName || 'Untitled Project',
          material: window.projectConfig?.boardMaterial,
          materialDetail: window.projectConfig?.materialDetail,
          profile: window.projectConfig?.boardStyle,
          boardWidth: window.projectConfig?.boardLength,
          coverage: window.projectConfig?.coverageType,
          wallHeight: window.projectConfig?.wallHeight,
          coverageHeight: window.projectConfig?.coverageHeight,
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

      // Coverage change handler with board recommendation logic
      window.handleCoverageChangeWithBoard = function(element) {
        const coverageType = element.value;
        const wallHeight = parseFloat(document.getElementById('wallHeight')?.value) || 0;
        const wainscotDiv = document.getElementById('wainscotHeight');
        const gapsSection = document.getElementById('installationGapsSection');
        const boardSelectionDiv = document.getElementById('boardSelectionSection');
        
        console.log('Coverage changed to:', coverageType);
        
        // Save wall height and coverage type to project config FIRST
        if (window.projectConfig) {
          window.projectConfig.wallHeight = wallHeight;
          window.projectConfig.coverageType = coverageType;
          delete window.projectConfig.boardLength; // Clear previous board selection
          console.log('Coverage change - saved config:', {
            wallHeight: window.projectConfig.wallHeight,
            coverageType: window.projectConfig.coverageType
          });
        }
        
        if (coverageType === 'partial') {
          // Wainscot selected
          if (wainscotDiv) wainscotDiv.style.display = 'block';
          if (gapsSection) gapsSection.style.display = 'none';
          if (boardSelectionDiv) boardSelectionDiv.style.display = 'none'; // Hide until wainscot height entered
          
          // Hide trim selections until wainscot height is configured
          const trimSelectionsDiv = document.getElementById('trimSelectionsSection');
          if (trimSelectionsDiv) trimSelectionsDiv.style.display = 'none';
          
          // Hide coverage preview for wainscot
          const coveragePreview = document.getElementById('coveragePreview');
          if (coveragePreview) coveragePreview.style.display = 'none';
          
        } else {
          // Full height selected
          if (wainscotDiv) wainscotDiv.style.display = 'none';
          if (gapsSection) gapsSection.style.display = 'block';
          if (boardSelectionDiv) boardSelectionDiv.style.display = 'none'; // Hide until gaps configured
          
          // Hide trim selections until gaps are configured
          const trimSelectionsDiv = document.getElementById('trimSelectionsSection');
          if (trimSelectionsDiv) trimSelectionsDiv.style.display = 'none';
          
          // Update gap display and check if we should show board selection
          if (window.updateGapValidation) {
            window.updateGapValidation();
          }
          
          // If wall height and gaps already exist, show board selection immediately
          if (wallHeight > 0) {
            const ceilingGap = parseFloat(document.getElementById('ceilingGap')?.value) || 1.5;
            const floorGap = parseFloat(document.getElementById('floorGap')?.value) || 0;
            
            if (ceilingGap || floorGap) {
              console.log('Switching to full height - showing board selection immediately');
              if (boardSelectionDiv) {
                boardSelectionDiv.style.display = 'block';
              }
              if (window.updateBoardRecommendationForFullHeight) {
                window.updateBoardRecommendationForFullHeight();
              }
              // Show trim selections for full height
              if (trimSelectionsDiv) {
                trimSelectionsDiv.style.display = 'block';
                const fullHeightTrimOptions = document.getElementById('fullHeightTrimOptions');
                const wainscotTrimOptions = document.getElementById('wainscotTrimOptions');
                if (fullHeightTrimOptions) fullHeightTrimOptions.style.display = 'block';
                if (wainscotTrimOptions) wainscotTrimOptions.style.display = 'none';
              }
            }
          }
        }
        
        // Call original handler if it exists
        if (window.handleCoverageChange) {
          window.handleCoverageChange(element);
        }
      };

      // Wainscot height change handler
      window.handleWainscotHeightChange = function(element) {
        const wainscotValue = parseFloat(element.value) || 0;
        const wallHeight = parseFloat(document.getElementById('wallHeight')?.value) || 0;
        const boardSelectionDiv = document.getElementById('boardSelectionSection');
        
        // Save wall height to project config if not already saved
        if (window.projectConfig && wallHeight > 0) {
          window.projectConfig.wallHeight = wallHeight;
        }
        
        // Prevent wainscot from being >= wall height
        if (wainscotValue >= wallHeight && wallHeight > 0) {
          element.value = wallHeight - 1;
          
          // Show error message
          const errorDiv = document.getElementById('wainscotError');
          if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `Wainscot height must be less than wall height (${wallHeight}")`;
            
            // Hide error after 3 seconds
            setTimeout(() => {
              errorDiv.style.display = 'none';
            }, 3000);
          }
        }
        
        // Update project config
        if (window.projectConfig) {
          window.projectConfig.coverageHeight = parseFloat(element.value) || 0;
          window.projectConfig.coverageType = 'partial';
          console.log('Wainscot height change - saved config:', {
            wallHeight: window.projectConfig.wallHeight,
            coverageHeight: window.projectConfig.coverageHeight,
            coverageType: window.projectConfig.coverageType
          });
        }
        
        // Show board selection once wainscot height is entered
        if (element.value && parseFloat(element.value) > 0 && boardSelectionDiv) {
          boardSelectionDiv.style.display = 'block';
          if (window.updateBoardRecommendationForWainscot) {
            window.updateBoardRecommendationForWainscot();
          }
          // Show trim selections after board selection for wainscot
          const trimSelectionsDiv = document.getElementById('trimSelectionsSection');
          if (trimSelectionsDiv) {
            trimSelectionsDiv.style.display = 'block';
            // Show wainscot trim options
            const fullHeightTrimOptions = document.getElementById('fullHeightTrimOptions');
            const wainscotTrimOptions = document.getElementById('wainscotTrimOptions');
            if (fullHeightTrimOptions) fullHeightTrimOptions.style.display = 'none';
            if (wainscotTrimOptions) wainscotTrimOptions.style.display = 'block';
          }
        }
      };

      // Gap change handler
      window.handleGapChange = function() {
        const wallHeight = parseFloat(document.getElementById('wallHeight')?.value) || 0;
        const ceilingGap = parseFloat(document.getElementById('ceilingGap')?.value) || 1.5;
        const floorGap = parseFloat(document.getElementById('floorGap')?.value) || 0;
        const boardSelectionDiv = document.getElementById('boardSelectionSection');
        
        // Save values to project config FIRST
        if (window.projectConfig) {
          window.projectConfig.wallHeight = wallHeight;
          window.projectConfig.customCeilingGap = ceilingGap;
          window.projectConfig.customFloorGap = floorGap;
          console.log('Gap change - saved config:', {
            wallHeight: window.projectConfig.wallHeight,
            ceilingGap: window.projectConfig.customCeilingGap,
            floorGap: window.projectConfig.customFloorGap
          });
        }
        
        // Update gap display
        if (window.updateGapValidation) {
          window.updateGapValidation();
        }
        
        // Show board selection once gaps are configured and wall height exists
        if (wallHeight > 0 && boardSelectionDiv) {
          boardSelectionDiv.style.display = 'block';
          if (window.updateBoardRecommendationForFullHeight) {
            window.updateBoardRecommendationForFullHeight();
          }
          // Show trim selections after board selection for full height
          const trimSelectionsDiv = document.getElementById('trimSelectionsSection');
          if (trimSelectionsDiv) {
            trimSelectionsDiv.style.display = 'block';
            // Show full height trim options
            const fullHeightTrimOptions = document.getElementById('fullHeightTrimOptions');
            const wainscotTrimOptions = document.getElementById('wainscotTrimOptions');
            if (fullHeightTrimOptions) fullHeightTrimOptions.style.display = 'block';
            if (wainscotTrimOptions) wainscotTrimOptions.style.display = 'none';
          }
        }
      };

      // Board recommendation functions - FIXED TO READ FROM INPUTS DIRECTLY
      window.updateBoardRecommendationForFullHeight = function() {
        // Get CURRENT values from inputs, don't rely on projectConfig
        const wallHeight = parseFloat(document.getElementById('wallHeight')?.value) || 0;
        const ceilingGap = parseFloat(document.getElementById('ceilingGap')?.value) || 1.5;
        const floorGap = parseFloat(document.getElementById('floorGap')?.value) || 0;
        const effectiveCoverage = wallHeight - ceilingGap - floorGap;
        
        console.log('Full height recommendation - values:', {
          wallHeight,
          ceilingGap,
          floorGap,
          effectiveCoverage
        });
        
        const boardSelect = document.getElementById('boardLength');
        const boardRecommendationDiv = document.getElementById('boardRecommendation');
        
        // Clear previous selection
        if (boardSelect) {
          boardSelect.value = '';
        }
        
        if (boardSelect && effectiveCoverage > 0) {
          // Auto-select recommended board
          if (effectiveCoverage <= 48) {
            boardSelect.value = '48';
          } else if (effectiveCoverage <= 96) {
            boardSelect.value = '96';
          } else if (effectiveCoverage <= 120) {
            boardSelect.value = '120';
          } else if (effectiveCoverage <= 144) {
            boardSelect.value = '144';
          }
          
          console.log('Auto-selected board:', boardSelect.value);
        }
        
        // Update recommendation display
        if (boardRecommendationDiv) {
          let recommendedSize = '';
          if (effectiveCoverage <= 48) {
            recommendedSize = '4ft (48")';
          } else if (effectiveCoverage <= 96) {
            recommendedSize = '8ft (96")';
          } else if (effectiveCoverage <= 120) {
            recommendedSize = '10ft (120")';
          } else if (effectiveCoverage <= 144) {
            recommendedSize = '12ft (144")';
          } else {
            boardRecommendationDiv.innerHTML = `
              <div class="alert warning" style="padding: 10px; background: #FFF3CD; border: 1px solid #FFEEBA; color: #856404; margin-top: 10px;">
                <strong>Note:</strong> Coverage needed (${effectiveCoverage.toFixed(1)}") exceeds maximum board length. 
                Consider reducing clearances or using wainscot coverage.
              </div>
            `;
            return;
          }
          
          boardRecommendationDiv.innerHTML = `
            <div style="padding: 10px; background: #E8F5E9; border: 1px solid #4CAF50; color: #2E7D32; margin-top: 10px;">
              <strong>Recommended Board Size:</strong> ${recommendedSize} or larger
              <br><small>For ${effectiveCoverage.toFixed(1)}" coverage (${wallHeight}" wall - ${(ceilingGap + floorGap).toFixed(1)}" clearances)</small>
            </div>
          `;
        }
      };

      window.updateBoardRecommendationForWainscot = function() {
        // Get CURRENT values from inputs, don't rely on projectConfig
        const wainscotHeight = parseFloat(document.getElementById('coverageHeight')?.value) || 0;
        
        console.log('Wainscot recommendation - wainscot height:', wainscotHeight);
        
        const boardSelect = document.getElementById('boardLength');
        const boardRecommendationDiv = document.getElementById('boardRecommendation');
        
        // Clear previous selection
        if (boardSelect) {
          boardSelect.value = '';
        }
        
        if (boardSelect && wainscotHeight > 0) {
          // Auto-select recommended board for wainscot
          if (wainscotHeight <= 48) {
            boardSelect.value = '48';
          } else if (wainscotHeight <= 96) {
            boardSelect.value = '96';
          } else if (wainscotHeight <= 120) {
            boardSelect.value = '120';
          } else if (wainscotHeight <= 144) {
            boardSelect.value = '144';
          }
          
          console.log('Auto-selected board for wainscot:', boardSelect.value);
        }
        
        // Update recommendation display
        if (boardRecommendationDiv) {
          let recommendedSize = '';
          if (wainscotHeight <= 48) {
            recommendedSize = '4ft (48")';
          } else if (wainscotHeight <= 96) {
            recommendedSize = '8ft (96")';
          } else if (wainscotHeight <= 120) {
            recommendedSize = '10ft (120")';
          } else if (wainscotHeight <= 144) {
            recommendedSize = '12ft (144")';
          } else {
            boardRecommendationDiv.innerHTML = `
              <div class="alert warning" style="padding: 10px; background: #FFF3CD; border: 1px solid #FFEEBA; color: #856404; margin-top: 10px;">
                <strong>Note:</strong> Wainscot height (${wainscotHeight}") exceeds maximum board length.
              </div>
            `;
            return;
          }
          
          boardRecommendationDiv.innerHTML = `
            <div style="padding: 10px; background: #E8F5E9; border: 1px solid #4CAF50; color: #2E7D32; margin-top: 10px;">
              <strong>Recommended Board Size:</strong> ${recommendedSize} or larger
              <br><small>For ${wainscotHeight}" wainscot height</small>
            </div>
          `;
        }
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
      window.updateGapValidation = window.updateGapValidation || function() {};
      window.setRecommendedBoard = window.setRecommendedBoard || function() { console.log('setRecommendedBoard stub called'); };
      window.validateBoardDisplay = window.validateBoardDisplay || function() {};

      setScriptsLoaded(true);
    }
  }, []);

  // Load the actual calculator scripts after initial setup
  useEffect(() => {
    if (scriptsLoaded && typeof window !== 'undefined') {
      // Check if scripts already loaded
      if (window.calculatorScriptsLoaded) {
        console.log('Calculator scripts already loaded, skipping...');
        return;
      }
      
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

          // Mark scripts as loaded - ADD THIS LINE
          window.calculatorScriptsLoaded = true;

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

  // Set up event listeners after component mounts
  useEffect(() => {
    if (scriptsLoaded && typeof window !== 'undefined') {
      // Add event listeners for gap inputs
      const setupGapListeners = () => {
        const wallHeightInput = document.getElementById('wallHeight');
        const ceilingGapInput = document.getElementById('ceilingGap');
        const floorGapInput = document.getElementById('floorGap');
        
        if (wallHeightInput) {
          wallHeightInput.addEventListener('input', () => {
            // Save wall height immediately when it changes
            const wallHeight = parseFloat(wallHeightInput.value) || 0;
            if (window.projectConfig) {
              window.projectConfig.wallHeight = wallHeight;
              console.log('Wall height input changed - saved:', wallHeight);
            }
            
            if (window.updateGapValidation) window.updateGapValidation();
            if (window.handleGapChange) window.handleGapChange();
          });
        }
        
        if (ceilingGapInput) {
          ceilingGapInput.addEventListener('input', () => {
            if (window.updateGapValidation) window.updateGapValidation();
            if (window.handleGapChange) window.handleGapChange();
          });
        }
        
        if (floorGapInput) {
          floorGapInput.addEventListener('input', () => {
            if (window.updateGapValidation) window.updateGapValidation();
            if (window.handleGapChange) window.handleGapChange();
          });
        }
      };
      
      // Set up listeners after a delay to ensure DOM is ready
      setTimeout(setupGapListeners, 500);
    }
  }, [scriptsLoaded]);

  // Add event listener for board selection changes
  useEffect(() => {
    if (scriptsLoaded && currentStep === 3) {
      const boardSelect = document.getElementById('boardLength');
      if (boardSelect && !boardSelect.hasAttribute('data-listener-added')) {
        boardSelect.setAttribute('data-listener-added', 'true');
        
        const handleBoardChange = () => {
          console.log('Board selection changed to:', boardSelect.value);
          if (window.validateBoardDisplay) {
            window.validateBoardDisplay();
          }
        };
        
        boardSelect.addEventListener('change', handleBoardChange);
        
        // Clean up on unmount
        return () => {
          boardSelect.removeEventListener('change', handleBoardChange);
        };
      }
    }
  }, [scriptsLoaded, currentStep]);

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
          
          {/* Step 1: System Overview - WITH PROJECT NAME MOVED HERE */}
          <div className="step active" id="step1">
            <div className="step-header">
              <div className="step-number">Welcome to HALKETT</div>
              <h2 className="step-title">Signature Wall System</h2>
              <p className="step-description">Everything calculated automatically for you.</p>
            </div>
            
            {/* PROJECT NAME INPUT - MOVED FROM STEP 2 */}
            <div className="form-group" style={{ maxWidth: '500px', margin: '0 auto 30px auto' }}>
              <label htmlFor="projectName" style={{ textAlign: 'center', display: 'block', marginBottom: '10px' }}>
                Project Name / PO Number 
                <span style={{ color: '#34499E', fontWeight: 700 }}> (Required)</span>
                <span className="tooltip" data-tooltip="Used for PDF filename and identification" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
              </label>
              <input 
                type="text" 
                id="projectName" 
                placeholder="e.g., Master Bedroom or PO-12345" 
                required 
                style={{ textAlign: 'center' }}
              />
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
          
          {/* Step 2: Basic Configuration - WITH BOARD SELECTION AFTER GAPS */}
          <div className="step" id="step2">
            <div className="step-header">
              <div className="step-number">Step 1 of 5</div>
              <h2 className="step-title">Wall Configuration</h2>
              <p className="step-description">Let's start with your wall dimensions and coverage type.</p>
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
                  <input 
                    type="radio" 
                    name="coverage" 
                    id="fullHeight" 
                    value="full" 
                    defaultChecked 
                    onChange={(e) => window.handleCoverageChangeWithBoard && window.handleCoverageChangeWithBoard(e.target)} 
                  />
                  <label htmlFor="fullHeight">Full Height</label>
                </div>
                <div className="radio-option">
                  <input 
                    type="radio" 
                    name="coverage" 
                    id="wainscot" 
                    value="partial" 
                    onChange={(e) => window.handleCoverageChangeWithBoard && window.handleCoverageChangeWithBoard(e.target)} 
                  />
                  <label htmlFor="wainscot">Wainscot</label>
                </div>
              </div>
            </div>
            
            <div className="form-group" id="wainscotHeight" style={{ display: 'none' }}>
              <label htmlFor="coverageHeight">Wainscot Height</label>
              <input 
                type="number" 
                id="coverageHeight" 
                min="12" 
                max="200" 
                placeholder="Enter height in inches" 
                inputMode="numeric"
                onChange={(e) => window.handleWainscotHeightChange && window.handleWainscotHeightChange(e.target)}
              />
              <div id="wainscotError" style={{ 
                display: 'none', 
                color: '#dc3545', 
                fontSize: '12px', 
                marginTop: '5px' 
              }}></div>
            </div>
            
            {/* Installation Gaps Section - FOR FULL HEIGHT ONLY */}
            <div id="installationGapsSection" style={{ marginTop: '30px' }}>
              <h4 style={{ fontSize: '14px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
                INSTALLATION CLEARANCES
                <span className="tooltip" data-tooltip="Space between boards and ceiling/floor for Z-clip mounting" style={{ color: '#A1A2A0', marginLeft: '5px', fontSize: '11px' }}>ⓘ</span>
              </h4>
              
              <div style={{ background: '#F5F5F5', padding: '15px', marginBottom: '20px', fontSize: '13px', lineHeight: '1.6' }}>
                <strong>What are clearances?</strong><br/>
                Clearances are the spaces left between your boards and the ceiling/floor during installation:
                <ul style={{ margin: '10px 0 0 20px', paddingLeft: '0' }}>
                  <li><strong>Ceiling clearance:</strong> Space between the top of boards and your ceiling</li>
                  <li><strong>Floor clearance:</strong> Space between the bottom of boards and your floor</li>
                </ul>
                <em style={{ color: '#666', fontSize: '12px' }}>These spaces are necessary for the Z-clip mounting system and reduce the coverage area of your boards.</em>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Ceiling Gap */}
                <div>
                  <label htmlFor="ceilingGap" style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>
                    Ceiling Clearance
                    <span style={{ fontSize: '11px', color: '#A1A2A0' }}> (We recommend 1.5")</span>
                  </label>
                  <input 
                    type="number" 
                    id="ceilingGap" 
                    min="1" 
                    max="6" 
                    step="0.125" 
                    defaultValue="1.5"
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #D1C6B4', fontSize: '14px' }}
                  />
                </div>
                
                {/* Floor Gap */}
                <div>
                  <label htmlFor="floorGap" style={{ fontSize: '13px', display: 'block', marginBottom: '5px' }}>
                    Floor Clearance
                    <span style={{ fontSize: '11px', color: '#A1A2A0' }}> (Typically 0")</span>
                  </label>
                  <input 
                    type="number" 
                    id="floorGap" 
                    min="0" 
                    max="6" 
                    step="0.125" 
                    defaultValue="0"
                    style={{ width: '100%', padding: '8px 12px', border: '2px solid #D1C6B4', fontSize: '14px' }}
                  />
                </div>
              </div>
              
              {/* Coverage Preview */}
              <div id="coveragePreview" style={{ marginTop: '15px', padding: '15px', background: '#F8F7F5', border: '1px solid #D1C6B4', display: 'none' }}>
                <div style={{ fontSize: '13px', color: '#232320' }}>
                  <strong>Board Coverage Area:</strong> 
                  <span id="effectiveCoverage"></span>
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  <span id="gapWarning"></span>
                </div>
              </div>
              
              {/* Non-standard gap warning */}
              <div id="nonStandardGapWarning" style={{ display: 'none', marginTop: '10px' }}>
                <div className="warning" style={{ fontSize: '12px', padding: '10px', background: '#FFF3CD', border: '1px solid #FFEEBA', color: '#856404' }}>
                  <strong>Note:</strong> Clearances larger than standard may require custom installation methods. Please consult with your installer.
                </div>
              </div>
            </div>
            
            {/* BOARD SELECTION - SHOWN AFTER GAPS OR WAINSCOT HEIGHT */}
            <div id="boardSelectionSection" style={{ display: 'none', marginTop: '30px' }}>
              <div className="form-group">
                <label htmlFor="boardLength">
                  Modular Board System
                  <span className="tooltip" data-tooltip="Board length will be cut to fit your wall height" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
                </label>
                <select id="boardLength">
                  <option value="">Select a board size...</option>
                  <option value="48">4ft (48") Board</option>
                  <option value="96">8ft (96") Board</option>
                  <option value="120">10ft (120") Board</option>
                  <option value="144">12ft (144") Board</option>
                </select>
              </div>
              
              {/* Board validation message */}
              <div id="boardRecommendation" style={{ marginTop: '15px' }}></div>
            </div>
            
            {/* TRIM SELECTIONS - MOVED FROM STEP 4 */}
            <div id="trimSelectionsSection" style={{ display: 'none', marginTop: '30px' }}>
              <div className="form-group">
                <h4 style={{ fontSize: '14px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
                  TRIM SELECTIONS
                </h4>
                
                <div id="fullHeightTrimOptions" style={{ display: 'block' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" id="ceilingTrim" style={{ margin: '3px 0 0 0' }} />
                      <div>
                        <span style={{ fontWeight: 500 }}>Ceiling Trim</span>
                        <div style={{ fontSize: '11px', color: '#A1A2A0', lineHeight: 1.4, marginTop: '2px' }}>
                          Recommended for covering the gap between modular boards and ceiling, providing a finished architectural edge
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" id="baseTrimFull" style={{ margin: '3px 0 0 0' }} />
                      <div>
                        <span style={{ fontWeight: 500 }}>Base Trim</span>
                        <div style={{ fontSize: '11px', color: '#A1A2A0', lineHeight: 1.4, marginTop: '2px' }}>
                          Optional trim for covering the space between modular boards and floor, creating a seamless transition
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Wainscot Trim Options */}
                <div id="wainscotTrimOptions" style={{ display: 'none' }}>
                  <div style={{ marginBottom: '15px', padding: '10px', background: '#E8F5E9', border: '1px solid #4CAF50' }}>
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>✓ Cap Rail:</span> 
                    <span style={{ fontSize: '12px' }}>You selected a cap rail profile in Design Selection</span>
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <input type="checkbox" id="baseTrimPartial" style={{ margin: '3px 0 0 0' }} />
                      <div>
                        <span style={{ fontWeight: 500 }}>Base Trim</span>
                        <div style={{ fontSize: '11px', color: '#A1A2A0', lineHeight: 1.4, marginTop: '2px' }}>
                          Optional trim for covering the space between modular boards and floor, creating a seamless transition
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="navigation">
              <button onClick={() => window.previousStep(2)} className="secondary">Previous</button>
              <button onClick={() => window.nextStep(2)}>Next Step</button>
            </div>
          </div>
          
          {/* Step 3: Design Selection - BOARD SELECTION REMOVED */}
          <div className="step" id="step3">
            <div className="step-header">
              <div className="step-number">Step 2 of 5</div>
              <h2 className="step-title">Design Selection</h2>
              <p className="step-description">Choose your profile style.</p>
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
                <button 
                  type="button" 
                  id="customizeTrim" 
                  onClick={() => {
                    const btn = document.getElementById('customizeTrim');
                    const defaultInfo = document.getElementById('defaultTrimInfo');
                    const customOptions = document.getElementById('customTrimOptions');
                    
                    if (customOptions && customOptions.style.display === 'none') {
                      // Show custom options
                      if (defaultInfo) defaultInfo.style.display = 'none';
                      customOptions.style.display = 'block';
                      btn.textContent = 'MATCH BOARDS';
                      btn.style.background = '#34499E';
                      btn.style.color = '#fff';
                      btn.style.borderColor = '#34499E';
                      if (window.projectConfig) {
                        window.projectConfig.matchMaterials = false;
                      }
                    } else {
                      // Hide custom options
                      if (defaultInfo) defaultInfo.style.display = 'block';
                      if (customOptions) customOptions.style.display = 'none';
                      btn.textContent = 'CUSTOMIZE';
                      btn.style.background = 'none';
                      btn.style.color = '#A1A2A0';
                      btn.style.borderColor = '#A1A2A0';
                      // Clear selection
                      const trimSelect = document.getElementById('allTrimMaterial');
                      if (trimSelect) trimSelect.value = '';
                      if (window.projectConfig) {
                        window.projectConfig.matchMaterials = true;
                        window.projectConfig.trimMaterial = '';
                      }
                    }
                  }}
                  style={{ 
                    background: 'none', 
                    border: '1px solid #A1A2A0', 
                    color: '#A1A2A0', 
                    padding: '6px 16px', 
                    fontSize: '10px', 
                    letterSpacing: '1px',
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease', 
                    minWidth: 'auto' 
                  }}
                >
                  CUSTOMIZE
                </button>
              </div>
              
              <div id="defaultTrimInfo" style={{ textAlign: 'center', color: '#666', fontSize: '13px' }}>
                <span style={{ color: '#34499E' }}>✓</span> Fillers, cap rail, ceiling & base trim will match your board material
              </div>
              
              <div id="customTrimOptions" style={{ display: 'none' }}>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label htmlFor="allTrimMaterial" style={{ fontSize: '11px' }}>Select Trim Material</label>
                  <select 
                    id="allTrimMaterial" 
                    style={{ fontSize: '14px' }}
                    onChange={(e) => {
                      if (window.projectConfig) {
                        window.projectConfig.trimMaterial = e.target.value;
                        window.projectConfig.fillerMaterial = e.target.value;
                      }
                    }}
                  >
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
                ADDITIONAL OPTIONS
              </h4>
              
              <div style={{ background: '#F8F7F5', padding: '15px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
                <span style={{ color: '#34499E' }}>ⓘ</span> Trim selections have been moved to the Configuration step for a better workflow
              </div>
            </div>
            
            {/* Customization Note */}
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
            
            {/* Sample Request Button */}
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
                  <path d="M5 15H4a2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
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
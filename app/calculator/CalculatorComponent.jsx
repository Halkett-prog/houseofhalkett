'use client';

import React, { useEffect, useState } from 'react';
import './calculator.css';

export default function CalculatorComponent() {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log('=== CALCULATOR COMPONENT MOUNTED ===');
    
    // Initialize the calculator when component mounts
    if (typeof window !== 'undefined') {
      console.log('Setting up calculator functions...');
      
      // Force Step 1 to be active after component renders
      const initializeSteps = () => {
        const allSteps = document.querySelectorAll('.step');
        console.log('Found steps:', allSteps.length);
        
        // Remove active from ALL steps
        allSteps.forEach((step, index) => {
          step.classList.remove('active');
        });
        
        // Show ONLY step 1
        const step1 = document.getElementById('step1');
        if (step1) {
          step1.classList.add('active');
          console.log('Step 1 activated');
        }
      };
      
      // Initialize immediately
      initializeSteps();
      
      // 1. Fix the toggleTrimMaterial error first
      window.toggleTrimMaterial = function() {
        console.log('toggleTrimMaterial called');
      };
      
      // 2. Implement nextStep properly
      window.nextStep = function(currentStep) {
        console.log('nextStep from step', currentStep);
        
        // Hide ALL steps first
        const allSteps = document.querySelectorAll('.step');
        allSteps.forEach(s => {
          s.classList.remove('active');
        });
        
        // Calculate the next step number
        const nextStepNum = currentStep + 1;
        console.log('Going to step', nextStepNum);
        
        // Show the next step
        const nextStepElement = document.getElementById(`step${nextStepNum}`);
        if (nextStepElement) {
          nextStepElement.classList.add('active');
          console.log('Successfully moved to step', nextStepNum);
          
          // Scroll to top of the page
          window.scrollTo(0, 0);
        } else {
          console.log('Step', nextStepNum, 'not found!');
        }
      };
      
      // 3. Implement previousStep properly
      window.previousStep = function(currentStep) {
        console.log('previousStep from step', currentStep);
        
        // Hide ALL steps first
        const allSteps = document.querySelectorAll('.step');
        allSteps.forEach(s => {
          s.classList.remove('active');
        });
        
        // Calculate the previous step number
        const prevStepNum = currentStep - 1;
        console.log('Going back to step', prevStepNum);
        
        // Show the previous step
        const prevStepElement = document.getElementById(`step${prevStepNum}`);
        if (prevStepElement) {
          prevStepElement.classList.add('active');
          console.log('Successfully moved back to step', prevStepNum);
          
          // Scroll to top of the page
          window.scrollTo(0, 0);
        } else {
          console.log('Step', prevStepNum, 'not found!');
        }
      };
      
      // 4. Special function to go back to overview (step 1)
      window.goToSystemOverview = function() {
        console.log('Going to System Overview');
        
        // Hide ALL steps
        const allSteps = document.querySelectorAll('.step');
        allSteps.forEach(s => {
          s.classList.remove('active');
        });
        
        // Show step 1
        const step1 = document.getElementById('step1');
        if (step1) {
          step1.classList.add('active');
          window.scrollTo(0, 0);
        }
      };
      
      // 5. Add the addToCart function
      window.addToCart = function() {
        alert('Add to Cart clicked!');
        
        const config = {
          test: 'Testing if save works',
          timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('pendingCalculatorOrder', JSON.stringify(config));
        console.log('Saved to localStorage:', config);
        
        window.location.href = '/cart';
      };
      
      // 6. Add other essential functions as placeholders
      window.generateWalls = function() { console.log('generateWalls'); };
      window.calculateResults = function() { 
        console.log('calculateResults');
        // When calculate is clicked, show step 6 (results)
        window.nextStep(5);
      };
      window.saveConfiguration = function() { console.log('saveConfiguration'); };
      window.generatePDF = function() { console.log('generatePDF'); };
      window.emailSpecification = function() { console.log('emailSpecification'); };
      window.showSampleRequest = function() { console.log('showSampleRequest'); };
      window.closeSampleModal = function() { console.log('closeSampleModal'); };
      window.closeGallery = function() { console.log('closeGallery'); };
      window.closeGalleryOutside = function() { console.log('closeGalleryOutside'); };
      window.openGallery = function() { console.log('openGallery'); };
      window.closeRecentModal = function() { console.log('closeRecentModal'); };
      window.submitSampleRequest = function() { console.log('submitSampleRequest'); };
      window.handleCoverageChange = function() { console.log('handleCoverageChange'); };
      window.updateTrimOptions = function() { console.log('updateTrimOptions'); };
      window.updateBoardRecommendation = function() { console.log('updateBoardRecommendation'); };
      window.toggleUnits = function() { console.log('toggleUnits'); };
      window.showRecentConfigurations = function() { console.log('showRecentConfigurations'); };
      window.updateMaterialDetails = function() { console.log('updateMaterialDetails'); };
      
      // Initialize projectConfig
      window.projectConfig = {};
      
      console.log('All functions registered');
    }
  }, []);

 return (
   <div className="calculator-wrapper">
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
         <button id="unitToggle" className="unit-toggle-btn" onClick={() => window.toggleUnits()}>Switch to Metric</button>
         <button className="recent-projects-btn" onClick={() => window.showRecentConfigurations()}>Recent Projects</button>
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
         
         {/* Compact Visual */}
         <div style={{ background: '#F8F7F5', padding: '20px', marginBottom: '20px' }}>
           <div style={{ width: '100%', height: '180px', background: '#E5E4DC', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
             <p style={{ color: '#A1A2A0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
               System Components Diagram
             </p>
           </div>
         </div>
         
         {/* Compact Component List */}
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
             <span style={{ color: '#34499E', fontWeight: 700 }}>(Required)</span>
             <span className="tooltip" data-tooltip="Used for PDF filename and identification" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
           </label>
           <input type="text" id="projectName" placeholder="e.g., Master Bedroom or PO-12345" required/>
         </div>
         
         <div className="form-group">
           <label htmlFor="wallHeight">
             Wall Height
             <span className="tooltip" data-tooltip="Floor to ceiling measurement in inches" style={{ color: '#A1A2A0', marginLeft: '5px' }}>ⓘ</span>
           </label>
           <input type="number" id="wallHeight" min="24" max="200" placeholder="Enter height in inches" inputMode="numeric"/>
         </div>
         
         <div className="form-group">
           <label>Coverage Type</label>
           <div className="radio-group">
             <div className="radio-option">
               <input type="radio" name="coverage" id="fullHeight" value="full" defaultChecked onChange={(e) => window.handleCoverageChange(e.target)}/>
               <label htmlFor="fullHeight">Full Height</label>
             </div>
             <div className="radio-option">
               <input type="radio" name="coverage" id="wainscot" value="partial" onChange={(e) => window.handleCoverageChange(e.target)}/>
               <label htmlFor="wainscot">Wainscot</label>
             </div>
           </div>
         </div>
         
         <div className="form-group" id="wainscotHeight" style={{ display: 'none' }}>
           <label htmlFor="coverageHeight">Wainscot Height</label>
           <input type="number" id="coverageHeight" min="12" max="200" placeholder="Enter height in inches" inputMode="numeric"/>
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
               <input type="radio" name="profile" id="contemporary" value="contemporary" defaultChecked/>
               <label htmlFor="contemporary">
                 Contemporary
                 <div className="profile-image">Profile Image</div>
               </label>
             </div>
             <div className="radio-option">
               <input type="radio" name="profile" id="wave" value="wave"/>
               <label htmlFor="wave">
                 Wave
                 <div className="profile-image">Profile Image</div>
               </label>
             </div>
             <div className="radio-option">
               <input type="radio" name="profile" id="architectural" value="architectural"/>
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
               <input type="radio" name="capProfile" id="cap175" value="1.75" defaultChecked/>
               <label htmlFor="cap175">
                 1.75" Standard
                 <div className="cap-image">Cap Image</div>
               </label>
             </div>
             <div className="radio-option">
               <input type="radio" name="capProfile" id="cap25square" value="2.5-square"/>
               <label htmlFor="cap25square">
                 2.5" Square Edge
                 <div className="cap-image">Cap Image</div>
               </label>
             </div>
             <div className="radio-option">
               <input type="radio" name="capProfile" id="cap25beveled" value="2.5-beveled"/>
               <label htmlFor="cap25beveled">
                 2.5" Beveled Edge
                 <div className="cap-image">Cap Image</div>
               </label>
             </div>
             <div className="radio-option">
               <input type="radio" name="capProfile" id="cap25bullnose" value="2.5-bullnose"/>
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
         
         {/* Board Material */}
         <div className="material-section">
           <h3 style={{ fontSize: '16px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
             Board Material
           </h3>
           <div className="material-grid">
             <div className="material-option">
               <input type="radio" name="material" id="wood" value="natural-wood" defaultChecked onChange={() => window.updateMaterialDetails()}/>
               <label htmlFor="wood">
                 <div className="material-name">Wood</div>
                 <div className="material-desc">Natural warmth</div>
               </label>
             </div>
             <div className="material-option">
               <input type="radio" name="material" id="painted" value="painted" onChange={() => window.updateMaterialDetails()}/>
               <label htmlFor="painted">
                 <div className="material-name">Painted</div>
                 <div className="material-desc">Custom colors</div>
               </label>
             </div>
             <div className="material-option">
               <input type="radio" name="material" id="leather" value="leather" onChange={() => window.updateMaterialDetails()}/>
               <label htmlFor="leather">
                 <div className="material-name">Leather</div>
                 <div className="material-desc">Luxe collection</div>
               </label>
             </div>
             <div className="material-option">
               <input type="radio" name="material" id="metal" value="metal" onChange={() => window.updateMaterialDetails()}/>
               <label htmlFor="metal">
                 <div className="material-name">Metal</div>
                 <div className="material-desc">Modern edge</div>
               </label>
             </div>
           </div>
           
           <div id="materialDetails" style={{ marginTop: '15px' }}></div>
         </div>
         
         {/* Filler & Trim Material */}
         <div className="material-section" style={{ marginTop: '30px', background: '#F8F7F5', padding: '20px', marginLeft: '-20px', marginRight: '-20px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
             <h3 style={{ fontSize: '14px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
               ALL TRIM COMPONENTS
             </h3>
             <button type="button" id="customizeTrim" onClick={() => window.toggleTrimMaterial()} 
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
         
         {/* Smart Trim Options */}
         <div className="form-group" style={{ marginTop: '20px' }}>
           <h4 style={{ fontSize: '14px', margin: '0 0 15px 0', textTransform: 'uppercase', letterSpacing: '1px', color: '#232320' }}>
             TRIM SELECTIONS
           </h4>
           
           {/* Full Height Trim Options */}
           <div id="fullHeightTrimOptions" style={{ display: 'block' }}>
             <div style={{ marginBottom: '10px' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                 <input type="checkbox" id="ceilingTrim" defaultChecked style={{ margin: '0' }}/>
                 <span>Ceiling Trim</span>
                 <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Recommended for finished edge)</span>
               </label>
             </div>
             
             <div>
               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                 <input type="checkbox" id="baseTrimFull" style={{ margin: '0' }}/>
                 <span>Base Trim</span>
                 <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Optional)</span>
               </label>
             </div>
           </div>
           
           {/* Wainscot Trim Options */}
           <div id="wainscotTrimOptions" style={{ display: 'none' }}>
             <div style={{ marginBottom: '10px', padding: '10px', background: '#E8F5E9', border: '1px solid #4CAF50' }}>
               <span style={{ color: '#2E7D32', fontWeight: '600' }}>✓ Cap Rail:</span> 
               <span style={{ fontSize: '12px' }}>You selected a cap rail profile in Step 3</span>
             </div>
             
             <div>
               <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                 <input type="checkbox" id="baseTrimWainscot" style={{ margin: '0' }}/>
                 <span>Base Trim</span>
                 <span style={{ fontSize: '11px', color: '#A1A2A0' }}>(Optional)</span>
               </label>
             </div>
           </div>
         </div>
         
         {/* Simplified Gap Warning */}
         <div id="trimGapInfo" style={{ display: 'none', marginTop: '10px' }}>
           <div className="warning" style={{ fontSize: '12px', padding: '10px' }}>
             <strong>Note:</strong> <span id="gapMessage"></span>
           </div>
         </div>
         
         {/* Customization note */}
         <div className="customization-note">
           <div className="customization-button" onClick={() => window.openGallery()}>
             <p className="header">BEYOND THE STANDARD</p>
           </div>
           <p className="message">
             Every specification can be customized to your exact vision.
           </p>
           <p className="contact">
             <span>Inquiries:</span> <span>215.721.9331</span>
           </p>
         </div>
         
         {/* Material Sample Request Button */}
         <div style={{ textAlign: 'center', margin: '20px 0' }}>
           <button onClick={() => window.showSampleRequest()} style={{ background: '#A1A2A0' }}>
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
           <input type="number" id="wallCount" min="1" max="10" placeholder="1-10 walls" inputMode="numeric"/>
           <button onClick={() => window.generateWalls()} style={{ marginTop: '10px' }}>Configure Walls</button>
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
         
         {/* Cost Estimate Container */}
         <div id="costEstimateContainer"></div>
         
         {/* Installation Time Container */}
         <div id="timeEstimateContainer"></div>
         
         <div className="results-actions">
           <button onClick={() => window.addToCart()} style={{ background: '#34499E', width: '100%' }}>
             <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="9" cy="20" r="1"></circle>
               <circle cx="20" cy="20" r="1"></circle>
               <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
             </svg>
             ADD TO CART
           </button>
         </div>

         <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
           <button onClick={() => window.generatePDF()} style={{ flex: 1, background: 'transparent', border: '2px solid #232320', color: '#232320' }}>
             <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
               <polyline points="14 2 14 8 20 8"></polyline>
             </svg>
             Download PDF
           </button>
           
           <button onClick={() => window.saveConfiguration()} style={{ flex: 1, background: 'transparent', border: '2px solid #232320', color: '#232320' }}>
             <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
               <polyline points="17 21 17 13 7 13 7 21"></polyline>
             </svg>
             Save
           </button>
         </div>
         
         <div style={{ marginTop: '15px', textAlign: 'center' }}>
           <p style={{ fontSize: '12px', color: '#A1A2A0', margin: '10px 0' }}>
             For email: Copy specification above, then 
             <a href="#" onClick={(event) => { event.preventDefault(); window.emailSpecification(); }} style={{ color: '#34499E', textDecoration: 'underline' }}>
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
           <button onClick={() => window.goToSystemOverview()} className="secondary">
             <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <polyline points="15 18 9 12 15 6"></polyline>
             </svg>
             Start New Configuration
           </button>
           <button onClick={() => window.print()}>Print Specification</button>
         </div>
       </div>
     </div>

     {/* Custom Gallery Modal */}
     <div className="modal-overlay" id="galleryModal" onClick={() => window.closeGalleryOutside()}>
       <div className="modal-content">
         <div className="modal-header">
           <h3>CUSTOM HALKETT INSTALLATIONS</h3>
           <button className="modal-close" onClick={() => window.closeGallery()}>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
         </div>
         <div className="gallery-grid">
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 1<br/>Walnut with Wave Profile</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 2<br/>Painted in Naval</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 3<br/>Leather Luxe - Crock</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 4<br/>White Oak Contemporary</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 5<br/>Metal - Blackened Steel</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 6<br/>Wainscot Application</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 7<br/>Architectural Profile</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 8<br/>Mixed Materials</div>
           </div>
           <div className="gallery-item">
             <div className="gallery-placeholder">Custom Wall 9<br/>Painted Alabaster</div>
           </div>
         </div>
       </div>
     </div>

     {/* Recent Configurations Modal */}
     <div className="modal-overlay recent-modal" id="recentModal" onClick={() => window.closeGalleryOutside()}>
       <div className="modal-content">
         <div className="modal-header">
           <h3>RECENT PROJECTS</h3>
           <button className="modal-close" onClick={() => window.closeRecentModal()}>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
         </div>
         <div className="recent-list" id="recentList">
           {/* Recent items will be populated here */}
         </div>
       </div>
     </div>

     {/* Material Sample Request Modal */}
     <div className="modal-overlay" id="sampleModal" onClick={() => window.closeGalleryOutside()}>
       <div className="modal-content" style={{ maxWidth: '600px' }}>
         <div className="modal-header">
           <h3>REQUEST MATERIAL SAMPLES</h3>
           <button className="modal-close" onClick={() => window.closeSampleModal()}>
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
           </button>
         </div>
         <form className="sample-form" id="sampleForm" onSubmit={(event) => { event.preventDefault(); window.submitSampleRequest(); }}>
           <div className="form-group">
             <label htmlFor="sampleName">Name *</label>
             <input type="text" id="sampleName" name="name" required/>
           </div>
           
           <div className="form-group">
             <label htmlFor="sampleEmail">Email *</label>
             <input type="email" id="sampleEmail" name="email" required/>
           </div>
           
           <div className="form-group">
             <label htmlFor="samplePhone">Phone</label>
             <input type="tel" id="samplePhone" name="phone"/>
           </div>
           
           <div className="form-group">
             <label htmlFor="sampleCompany">Company</label>
             <input type="text" id="sampleCompany" name="company"/>
           </div>
           
           <h4>Select Materials</h4>
           <div className="material-samples">
             <div className="material-sample">
               <input type="checkbox" id="sample-white-oak" name="materials" value="White Oak"/>
               <label htmlFor="sample-white-oak">White Oak</label>
             </div>
             <div className="material-sample">
               <input type="checkbox" id="sample-walnut" name="materials" value="Walnut"/>
               <label htmlFor="sample-walnut">Walnut</label>
             </div>
             <div className="material-sample">
               <input type="checkbox" id="sample-painted" name="materials" value="Painted Samples"/>
               <label htmlFor="sample-painted">Painted Samples</label>
             </div>
             <div className="material-sample">
               <input type="checkbox" id="sample-leather" name="materials" value="Leather Samples"/>
               <label htmlFor="sample-leather">Leather Samples</label>
             </div>
             <div className="material-sample">
               <input type="checkbox" id="sample-metal" name="materials" value="Metal Samples"/>
               <label htmlFor="sample-metal">Metal Samples</label>
             </div>
             <div className="material-sample">
               <input type="checkbox" id="sample-all" name="materials" value="Full Sample Set"/>
               <label htmlFor="sample-all">Full Sample Set</label>
             </div>
           </div>
           
           <div className="form-group">
             <label htmlFor="sampleNotes">Additional Notes</label>
             <textarea id="sampleNotes" name="notes" placeholder="Any specific requirements or questions..."></textarea>
           </div>
           
           <div className="navigation">
             <button type="button" onClick={() => window.closeSampleModal()} className="secondary">Cancel</button>
             <button type="submit">Submit Request</button>
           </div>
         </form>
       </div>
     </div>
   </div>
 );
}
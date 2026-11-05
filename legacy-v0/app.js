/**
 * OPERATION SAN ANDREAS // GEODYNAMIC INTELLIGENCE DIRECTORATE
 * High-Precision Interactive Tectonic Physics Engine & Classified Dossier
 * Course: SKTP 2613 / SETP 2213 Basic Geoscience (UTM)
 * Taxonomy: C3 (Apply) | PLO1 (Knowledge) | CLO1
 */

// ==========================================
// 1. AUDIO SYNTHESIZER (Web Audio API)
// ==========================================
class TacticalAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playBeep(freq = 880, type = 'sine', duration = 0.08, gain = 0.05) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(gain, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  playClick() {
    this.playBeep(1200, 'triangle', 0.03, 0.04);
  }

  playRumble(duration = 2.5) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + duration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, now);
      filter.frequency.exponentialRampToValueAtTime(40, now + duration);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Audio rumble error", e);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

const audio = new TacticalAudio();

// ==========================================
// 2. TECTONIC CROSS-SECTION PHYSICS SIMULATOR
// ==========================================
class TectonicPhysicsSim {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Physical state variables
    this.plateRate = 48; // mm/yr
    this.lockingDepth = 15; // km
    this.viscosityExp = 20; // 10^20 Pa.s
    this.slabPullForce = 85; // %
    this.ridgePushForce = 15; // %
    
    this.accumulatedYears = 142; // Years since last rupture
    this.shearStrain = 0; // microstrain
    this.storedEnergy = 0; // x10^17 Joules
    this.rupturing = false;
    this.ruptureProgress = 0;
    this.seismicWaveRadius = 0;
    
    // Convection particles for asthenosphere
    this.particles = [];
    this.initParticles();
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 380;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: 190 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
  }

  setPlateRate(val) {
    this.plateRate = parseFloat(val);
    this.updateTelemetry();
  }

  setLockingDepth(val) {
    this.lockingDepth = parseFloat(val);
    this.updateTelemetry();
  }

  setViscosity(val) {
    this.viscosityExp = parseFloat(val);
    this.updateTelemetry();
  }

  triggerRupture() {
    if (this.rupturing) return;
    this.rupturing = true;
    this.ruptureProgress = 0;
    this.seismicWaveRadius = 0;
    audio.playRumble(3.0);
    
    // Flash HUD
    const box = document.getElementById('gauge-strain-box');
    if (box) box.classList.add('danger');
  }

  updatePhysics(dt) {
    if (!this.rupturing) {
      // Steady strain accumulation: rate proportional to plate velocity
      this.accumulatedYears += dt * 1.5;
      const slipDeficit = (this.plateRate * 0.001) * this.accumulatedYears; // meters
      this.shearStrain = (slipDeficit / (this.lockingDepth * 1000)) * 1e6; // microstrain
      
      // Elastic strain energy U = 0.5 * G * strain^2 * Volume (approx G=30 GPa)
      const G = 3e10; // 30 GPa
      const faultArea = 300000 * (this.lockingDepth * 1000); // 300 km length * depth
      this.storedEnergy = (0.5 * G * Math.pow(this.shearStrain * 1e-6, 2) * faultArea * 15000) / 1e17;
    } else {
      // Dynamic coseismic rupture
      this.ruptureProgress += dt * 2.0;
      this.seismicWaveRadius += dt * 450;
      
      if (this.ruptureProgress >= 1.0) {
        this.rupturing = false;
        this.accumulatedYears = 0; // Strain released
        this.shearStrain = 0;
        this.storedEnergy = 0;
        const box = document.getElementById('gauge-strain-box');
        if (box) box.classList.remove('danger');
      }
    }
    this.updateTelemetry();
  }

  updateTelemetry() {
    const elYears = document.getElementById('sim-readout-years');
    const elStrain = document.getElementById('sim-readout-strain');
    const elEnergy = document.getElementById('sim-readout-energy');
    const elMag = document.getElementById('sim-readout-mag');
    const elTraction = document.getElementById('sim-readout-traction');

    if (elYears) elYears.innerText = `${Math.floor(this.accumulatedYears)} yr`;
    if (elStrain) elStrain.innerText = `${this.shearStrain.toFixed(1)} µε`;
    if (elEnergy) elEnergy.innerText = `${this.storedEnergy.toFixed(2)} ×10¹⁷ J`;
    
    // Estimate moment magnitude: Mw = 2/3 log10(M0) - 6.07
    const slip = (this.plateRate * 0.001) * this.accumulatedYears;
    const M0 = 3e10 * (300000 * this.lockingDepth * 1000) * Math.max(0.1, slip);
    let Mw = (2/3) * (Math.log10(Math.max(1e12, M0)) - 9.1);
    Mw = Math.min(8.2, Math.max(5.5, Mw));
    if (elMag) elMag.innerText = `M${Mw.toFixed(2)}`;

    // Basal traction tau = eta * (v / H)
    const basalTraction = (Math.pow(10, this.viscosityExp - 20) * 1.8 * (this.plateRate / 50)).toFixed(1);
    if (elTraction) elTraction.innerText = `${basalTraction} MPa`;
  }

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Background Grid & Depth Marks
    ctx.strokeStyle = "rgba(0, 240, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const groundY = 60;
    const bdtzY = groundY + (this.lockingDepth / 30) * 130; // Brittle-Ductile boundary
    const mohoY = groundY + 130; // Moho depth (~35 km)
    const asthenoY = groundY + 170; // Lithosphere-Asthenosphere boundary (LAB ~100 km)

    // 2. Crust & Lithosphere Layers
    // Upper Brittle Crust (0 to Locking Depth km)
    const brittleGrad = ctx.createLinearGradient(0, groundY, 0, bdtzY);
    brittleGrad.addColorStop(0, "#192435");
    brittleGrad.addColorStop(1, "#26354d");
    ctx.fillStyle = brittleGrad;
    ctx.fillRect(0, groundY, w, bdtzY - groundY);

    // Ductile Lower Crust / Lithospheric Mantle
    const ductileGrad = ctx.createLinearGradient(0, bdtzY, 0, asthenoY);
    ductileGrad.addColorStop(0, "#26354d");
    ductileGrad.addColorStop(1, "#3d2a33");
    ctx.fillStyle = ductileGrad;
    ctx.fillRect(0, bdtzY, w, asthenoY - bdtzY);

    // Asthenosphere (Convective, high homologous temp)
    const asthenoGrad = ctx.createLinearGradient(0, asthenoY, 0, h);
    asthenoGrad.addColorStop(0, "#4a1c1d");
    asthenoGrad.addColorStop(0.6, "#2c0e12");
    asthenoGrad.addColorStop(1, "#180608");
    ctx.fillStyle = asthenoGrad;
    ctx.fillRect(0, asthenoY, w, h - asthenoY);

    // 3. Convective Flow Streamlines & Particles in Asthenosphere
    const mantleFlowSpeed = (Math.pow(10, 21 - this.viscosityExp) * 0.4);
    ctx.fillStyle = "rgba(255, 120, 50, 0.6)";
    this.particles.forEach(p => {
      p.x += (p.vx + (p.y > (asthenoY + 70) ? -0.6 : 0.6)) * mantleFlowSpeed;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Central Fault Plane: San Andreas Fault (Transform Boundary)
    const faultX = w * 0.5;

    // Draw Locked Seismogenic Zone (Brittle)
    ctx.strokeStyle = this.rupturing ? "#ff3344" : "#00f0ff";
    ctx.lineWidth = 3;
    ctx.shadowColor = this.rupturing ? "rgba(255, 51, 68, 0.8)" : "rgba(0, 240, 255, 0.5)";
    ctx.shadowBlur = this.rupturing ? 20 : 8;
    ctx.beginPath();
    ctx.moveTo(faultX, groundY);
    ctx.lineTo(faultX, bdtzY);
    ctx.stroke();

    // Ductile Shear Zone below BDTZ
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#ffb700";
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(faultX, bdtzY);
    ctx.lineTo(faultX, asthenoY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 5. Elastic Strain Isopachs (Bending marker lines demonstrating strain accumulation)
    const strainOffset = Math.min(35, (this.shearStrain / 200) * 20);
    ctx.lineWidth = 1.5;
    [-120, -70, -25, 25, 70, 120].forEach(dx => {
      const lineX = faultX + dx;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.35)";
      ctx.beginPath();
      ctx.moveTo(lineX, groundY);
      // Curve elastically near fault
      const bend = dx < 0 ? -strainOffset * (1 / (1 + Math.abs(dx)/40)) : strainOffset * (1 / (1 + Math.abs(dx)/40));
      ctx.quadraticCurveTo(lineX + bend, (groundY + bdtzY)/2, lineX, bdtzY);
      ctx.stroke();
    });

    // 6. Seismic Wavefronts if rupturing
    if (this.rupturing) {
      const hypocentreY = groundY + (bdtzY - groundY) * 0.7; // ~10 km depth
      
      // P-Wave (Compressional, fast)
      ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(faultX, hypocentreY, this.seismicWaveRadius, 0, Math.PI * 2);
      ctx.stroke();

      // S-Wave (Shear, slower)
      if (this.seismicWaveRadius > 30) {
        ctx.strokeStyle = "rgba(255, 51, 68, 0.9)";
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(faultX, hypocentreY, this.seismicWaveRadius * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Flash at hypocentre
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(faultX, hypocentreY, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Layer Annotations & Geological Telemetry
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 0;

    // Surface labels
    ctx.fillText("PACIFIC PLATE (NW ➔ 48 mm/yr)", faultX - 220, groundY - 15);
    ctx.fillText("NORTH AMERICAN PLATE (SE ➔)", faultX + 40, groundY - 15);

    // Layer boundaries
    ctx.fillStyle = "#00f0ff";
    ctx.fillText(`BRITTLE SEISMOGENIC CRUST (0 - ${this.lockingDepth} km)`, 20, groundY + 25);
    ctx.fillText("FAIL-MODE: BYERLEE'S LAW STICK-SLIP", 20, groundY + 40);

    ctx.fillStyle = "#ffb700";
    ctx.fillText(`BRITTLE-DUCTILE TRANSITION (BDTZ ~350°C ISOTHERM)`, faultX + 15, bdtzY - 5);
    ctx.fillText("ASEISMIC DUCTILE SHEAR (DISLOCATION CREEP)", 20, bdtzY + 30);

    ctx.fillStyle = "#ff5566";
    ctx.fillText("ASTHENOSPHERE (T/Tm ≈ 0.9, DUCTILE CONVECTIVE OVERTURN)", 20, asthenoY + 30);
    ctx.fillText(`VISCOSITY η = 10^${this.viscosityExp} Pa·s`, 20, asthenoY + 45);

    // Scale Bar
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w - 140, h - 20);
    ctx.lineTo(w - 20, h - 20);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("SCALE: 50 KM", w - 110, h - 25);
  }

  animate() {
    this.updatePhysics(0.016);
    this.draw();
    requestAnimationFrame(this.animate);
  }
}

// ==========================================
// 3. TIME-TRAVEL PALEOGEOGRAPHIC ENGINE ("THEN AND NOW")
// ==========================================
class PaleogeographyPlayer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.epochs = [
      {
        ma: 200,
        name: "EARLY JURASSIC (~200 Ma)",
        desc: "Breakup of Pangea. Ancestral Andean-style subduction. Dense oceanic Farallon Plate subducts beneath Western North America. Vast subduction trench and proto-arc volcanism.",
        plateA: "Farallon Plate (Oceanic)",
        plateB: "North American Plate (Continental)",
        boundary: "Ocean-Continent Convergent (Subduction)",
        driver: "Dominant Farallon Slab Pull (Negative Buoyancy)"
      },
      {
        ma: 100,
        name: "LATE CRETACEOUS (~100 Ma)",
        desc: "High-flux subduction zone. Sierra Nevada magmatic arc active. Massive granitic batholiths emplaced at depth; Franciscan accretionary wedge forming offshore.",
        plateA: "Farallon Plate (Rapid Subduction)",
        plateB: "North American Plate (Forearc Basin)",
        boundary: "Convergent Trench / Magmatic Arc",
        driver: "Vigorous Slab Pull + Mantle Corner Flow"
      },
      {
        ma: 30,
        name: "OLIGOCENE (~30 Ma) - THE TURNING POINT",
        desc: "CRITICAL REORGANIZATION: Pacific-Farallon spreading ridge collides with the continental trench! Subduction ceases locally; slab window opens. Mendocino and Rivera Triple Junctions form, initiating the proto-San Andreas strike-slip transform fault.",
        plateA: "Pacific Plate & Farallon Remnants",
        plateB: "North American Plate",
        boundary: "Ridge-Trench Collision & Proto-Transform Genesis",
        driver: "Far-Field Pacific Torque + Slab Gap"
      },
      {
        ma: 0,
        name: "PRESENT DAY (0 Ma) - MODERN SAFS",
        desc: "Mature 1,200 km dextral continental transform fault. Accommodates 48 mm/yr of relative motion between Pacific and North American plates from Cape Mendocino to the Salton Trough.",
        plateA: "Pacific Plate (Moving NW at ~48 mm/yr)",
        plateB: "North American Plate",
        boundary: "Continental Right-Lateral Transform",
        driver: "Western Pacific Slab Pull + EPR Ridge Push"
      },
      {
        ma: -30,
        name: "FUTURE PROJECTION (+30 Ma)",
        desc: "Continued dextral translation transports Baja California and Los Angeles past San Francisco, forming a linear island terrane destined to dock into the Aleutian subduction trench in Alaska.",
        plateA: "Pacific Plate (Transporting Western CA)",
        plateB: "North American Plate",
        boundary: "Advanced Continental Transform / Shear Slivers",
        driver: "Slab Pull into Kuril/Aleutian Trenches"
      }
    ];

    this.currentEpochIdx = 3; // Default to Present Day
    this.isPlaying = false;
    this.playSpeed = 1;
    this.timer = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.initControls();
    this.render();
  }

  resizeCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = 400;
    this.render();
  }

  initControls() {
    const playBtn = document.getElementById('vcr-play-btn');
    const rewBtn = document.getElementById('vcr-rew-btn');
    const ffwBtn = document.getElementById('vcr-ffw-btn');
    const scrubber = document.getElementById('time-scrubber');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }
    if (rewBtn) {
      rewBtn.addEventListener('click', () => this.stepEpoch(-1));
    }
    if (ffwBtn) {
      ffwBtn.addEventListener('click', () => this.stepEpoch(1));
    }
    if (scrubber) {
      scrubber.addEventListener('input', (e) => {
        this.setEpoch(parseInt(e.target.value));
      });
    }

    // Epoch quick-pills
    document.querySelectorAll('.epoch-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
        this.setEpoch(idx);
        audio.playClick();
      });
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById('vcr-play-btn');
    if (btn) {
      btn.innerHTML = this.isPlaying ? "❚❚ PAUSE" : "▶ PLAY";
      btn.classList.toggle('active', this.isPlaying);
    }
    if (this.isPlaying) {
      audio.playBeep(950, 'sine', 0.1);
      this.timer = setInterval(() => {
        let next = this.currentEpochIdx + 1;
        if (next >= this.epochs.length) next = 0;
        this.setEpoch(next);
      }, 2400 / this.playSpeed);
    } else {
      clearInterval(this.timer);
    }
  }

  stepEpoch(dir) {
    let next = this.currentEpochIdx + dir;
    if (next < 0) next = this.epochs.length - 1;
    if (next >= this.epochs.length) next = 0;
    this.setEpoch(next);
    audio.playClick();
  }

  setEpoch(idx) {
    this.currentEpochIdx = idx;
    const scrubber = document.getElementById('time-scrubber');
    if (scrubber) scrubber.value = idx;
    
    // Update active pill
    document.querySelectorAll('.epoch-pill').forEach((pill, i) => {
      pill.classList.toggle('active', i === idx);
    });

    this.updateInfoPanel();
    this.render();
  }

  updateInfoPanel() {
    const ep = this.epochs[this.currentEpochIdx];
    const badge = document.getElementById('time-badge');
    const title = document.getElementById('epoch-title');
    const desc = document.getElementById('epoch-desc');
    const plateA = document.getElementById('epoch-plate-a');
    const plateB = document.getElementById('epoch-plate-b');
    const boundary = document.getElementById('epoch-boundary');
    const driver = document.getElementById('epoch-driver');

    if (badge) badge.innerText = ep.ma < 0 ? `+${Math.abs(ep.ma)} Ma` : `${ep.ma} Ma`;
    if (title) title.innerText = ep.name;
    if (desc) desc.innerText = ep.desc;
    if (plateA) plateA.innerText = ep.plateA;
    if (plateB) plateB.innerText = ep.plateB;
    if (boundary) boundary.innerText = ep.boundary;
    if (driver) driver.innerText = ep.driver;
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;
    const ep = this.epochs[this.currentEpochIdx];

    ctx.clearRect(0, 0, w, h);

    // Deep Ocean Background
    const oceanGrad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
    oceanGrad.addColorStop(0, "#081324");
    oceanGrad.addColorStop(1, "#040810");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, w, h);

    // Tactical HUD Lines
    ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 50) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 50) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Dynamic Paleogeographic Rendering based on Epoch
    const centerX = w * 0.55;
    const centerY = h * 0.5;

    if (ep.ma === 200) {
      // 200 Ma: Subduction of Farallon Plate
      this.drawContinent(ctx, centerX + 40, centerY - 140, 280, 300, "#1c2b3d", "NORTH AMERICA CRATON");
      this.drawTrench(ctx, centerX + 10, centerY - 160, centerX - 10, centerY + 160, "#00f0ff", "SUBDUCTION TRENCH (FARALLON SUBDUCTS)");
      this.drawOceanicPlate(ctx, centerX - 180, centerY, "FARALLON OCEANIC PLATE (EASTWARD SLAB PULL ➔)");
      this.drawVolcanicArc(ctx, centerX + 35, centerY - 120, 260, false);
    } else if (ep.ma === 100) {
      // 100 Ma: Cretaceous Arc & Sierra Nevada
      this.drawContinent(ctx, centerX + 30, centerY - 140, 290, 300, "#1e334a", "NORTH AMERICA (SIERRA MAGMATIC ARC)");
      this.drawTrench(ctx, centerX, centerY - 160, centerX - 20, centerY + 160, "#00f0ff", "HIGH-FLUX CONVERGENT TRENCH");
      this.drawOceanicPlate(ctx, centerX - 190, centerY, "FARALLON PLATE (RAPID SUBDUCTION ➔)");
      this.drawVolcanicArc(ctx, centerX + 25, centerY - 130, 270, true);
    } else if (ep.ma === 30) {
      // 30 Ma: Spreading Ridge Collides with Trench
      this.drawContinent(ctx, centerX + 15, centerY - 140, 300, 300, "#233952", "NORTH AMERICA");
      
      // Ridge Collision Zone
      ctx.strokeStyle = "#ff3344";
      ctx.lineWidth = 4;
      ctx.shadowColor = "#ff3344"; ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(centerX - 40, centerY - 40);
      ctx.lineTo(centerX - 10, centerY + 40);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Residual Farallon slivers (Juan de Fuca & Cocos)
      ctx.fillStyle = "#ffb700";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("MENDOCINO TRIPLE JUNCTION (MTJ) ➔ MIGRATING NORTH", centerX - 120, centerY - 70);
      ctx.fillText("RIVERA TRIPLE JUNCTION (RTJ) ➔ MIGRATING SOUTH", centerX - 100, centerY + 80);
      ctx.fillText("COLLISION OF EAST PACIFIC RISE (SLAB WINDOW OPENS)", centerX - 220, centerY);
    } else if (ep.ma === 0) {
      // 0 Ma: Modern San Andreas Fault System
      this.drawContinent(ctx, centerX, centerY - 150, 320, 320, "#1f364d", "NORTH AMERICAN PLATE");
      this.drawTransformFault(ctx, centerX - 45, centerY - 150, centerX + 20, centerY + 150, "#00f0ff", "SAN ANDREAS FAULT TRACE (1,200 KM DEXTRAL TRANSFORM)");
      this.drawOceanicPlate(ctx, centerX - 220, centerY - 40, "PACIFIC PLATE (NW RELATIVE MOTION ~48 mm/yr)");
      
      // Highlight Salton Trough & MTJ
      ctx.fillStyle = "#ff3344";
      ctx.beginPath(); ctx.arc(centerX - 45, centerY - 145, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#00ff66";
      ctx.beginPath(); ctx.arc(centerX + 20, centerY + 145, 6, 0, Math.PI * 2); ctx.fill();

      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#ff3344"; ctx.fillText("CAPE MENDOCINO TRIPLE JUNCTION", centerX - 230, centerY - 145);
      ctx.fillStyle = "#00ff66"; ctx.fillText("SALTON TROUGH EXTENSIONAL RIFT", centerX + 30, centerY + 150);
    } else if (ep.ma === -30) {
      // +30 Ma: Future configuration
      this.drawContinent(ctx, centerX + 10, centerY - 150, 310, 320, "#192a3c", "NORTH AMERICAN CONTINENT");
      this.drawTransformFault(ctx, centerX - 80, centerY - 150, centerX - 10, centerY + 150, "#ffb700", "TRANS-CALIFORNIA MEGATHRUST / TRANSLATED SLIVERS");
      ctx.fillStyle = "#00f0ff";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("LOS ANGELES TERRANE ADJACENT TO SAN FRANCISCO", centerX - 260, centerY - 20);
      ctx.fillText("BAJA SLIVER CONVERGING TOWARD ALEUTIAN TRENCH", centerX - 260, centerY + 20);
    }
  }

  drawContinent(ctx, x, y, w, h, color, label) {
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + w * 0.4, y - 20, x + w * 0.8, y + 40, x + w, y + 20);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x - 20, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.fillText(label, x + 30, y + h * 0.5);
  }

  drawTrench(ctx, x1, y1, x2, y2, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    
    // Subduction teeth (sawtooth)
    const steps = 12;
    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 8, py - 3);
      ctx.lineTo(px + 6, py + 5);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = color;
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText(label, x1 - 180, (y1 + y2) / 2);
  }

  drawTransformFault(ctx, x1, y1, x2, y2, color, label) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    ctx.shadowColor = color; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.shadowBlur = 0;

    // Relative motion arrows
    ctx.fillStyle = "#00f0ff";
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText("⇡", x1 - 18, (y1 + y2) / 2 - 20);
    ctx.fillText("⇣", x1 + 14, (y1 + y2) / 2 + 20);

    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText(label, x1 - 140, (y1 + y2) / 2 + 45);
  }

  drawOceanicPlate(ctx, x, y, label) {
    ctx.fillStyle = "rgba(0, 240, 255, 0.7)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(label, x, y);
  }

  drawVolcanicArc(ctx, x, y, len, isPluton) {
    ctx.fillStyle = isPluton ? "#ff5533" : "#ffaa00";
    for (let i = 0; i < 9; i++) {
      const py = y + (len / 9) * i;
      ctx.beginPath();
      ctx.arc(x + (i % 2 === 0 ? 5 : -5), py, isPluton ? 5 : 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ==========================================
// 4. EMPIRICAL EVIDENCE DATA TERMINALS
// ==========================================
class EmpiricalEvidenceViewer {
  constructor() {
    this.initTabs();
    this.initGpsDislocation();
    this.initHypocentreViewer();
    this.initMagneticStripes();
    this.initWallaceCreekCaliper();
  }

  initTabs() {
    const btns = document.querySelectorAll('.evidence-tab-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-tab');
        btns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        document.querySelectorAll('.evidence-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
        audio.playClick();
      });
    });
  }

  // 1. GPS Geodetic Screw Dislocation Model (Savage & Burford 1973)
  initGpsDislocation() {
    const canvas = document.getElementById('gps-dislocation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const depthSlider = document.getElementById('gps-lock-depth-slider');
    const rateSlider = document.getElementById('gps-rate-slider');

    // Empirical GPS stations across Central SAF (Distance km from fault, Velocity mm/yr, Error)
    const stations = [
      { code: 'VNDN', dist: -82, v: -18.2, err: 1.1 },
      { code: 'CRFP', dist: -54, v: -16.5, err: 0.9 },
      { code: 'CARH', dist: -26, v: -12.8, err: 0.8 },
      { code: 'CAND', dist: -8,  v: -5.4,  err: 0.7 },
      { code: 'CHIL', dist: 12,  v: 7.2,   err: 0.8 },
      { code: 'POSO', dist: 35,  v: 14.1,  err: 1.0 },
      { code: 'TEJ2', dist: 78,  v: 17.9,  err: 1.2 }
    ];

    const draw = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 300;
      const D = parseFloat(depthSlider ? depthSlider.value : 14);
      const V0 = parseFloat(rateSlider ? rateSlider.value : 36);

      document.getElementById('gps-depth-val').innerText = `${D} km`;
      document.getElementById('gps-rate-val').innerText = `${V0} mm/yr`;

      ctx.clearRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const originX = w * 0.5;
      const originY = h * 0.5;
      const scaleX = (w * 0.4) / 100; // 100 km range
      const scaleY = (h * 0.4) / 25; // 25 mm/yr range

      // Coordinate axes
      ctx.strokeStyle = "#4d648d";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(w, originY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, h); ctx.stroke();

      // Theoretical Savage & Burford (1973) curve: v(x) = (V0 / pi) * arctan(x / D)
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00f0ff"; ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let px = 0; px < w; px += 2) {
        const xKm = (px - originX) / scaleX;
        const vModel = (V0 / Math.PI) * Math.atan(xKm / D);
        const py = originY - vModel * scaleY;
        if (px === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Real Empirical GPS Station Data Points
      let sumSqResiduals = 0;
      stations.forEach(st => {
        const px = originX + st.dist * scaleX;
        const py = originY - st.v * scaleY;
        const modelV = (V0 / Math.PI) * Math.atan(st.dist / D);
        sumSqResiduals += Math.pow(st.v - modelV, 2);

        // Error bar
        ctx.strokeStyle = "#ff3344";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py - st.err * scaleY);
        ctx.lineTo(px, py + st.err * scaleY);
        ctx.stroke();

        // Point
        ctx.fillStyle = "#ffb700";
        ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.fill();

        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(st.code, px - 12, py - 9);
      });

      const rmse = Math.sqrt(sumSqResiduals / stations.length).toFixed(2);
      const rmseEl = document.getElementById('gps-rmse-val');
      if (rmseEl) rmseEl.innerText = `${rmse} mm/yr`;
    };

    if (depthSlider) depthSlider.addEventListener('input', draw);
    if (rateSlider) rateSlider.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    draw();
  }

  // 2. Earthquake Hypocentre Depth Profile
  initHypocentreViewer() {
    const canvas = document.getElementById('hypocentre-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Generate simulated real-distribution hypocentres based on USGS NCEDC catalog
    const quakes = [];
    for (let i = 0; i < 350; i++) {
      // Gaussian clustering around fault trace (x=0) and depth 0-15 km
      const x = (Math.random() - 0.5) * (Math.random() * 28);
      // Depth truncated sharply at 14.5 km due to BDTZ
      const depth = Math.pow(Math.random(), 0.7) * 14.8;
      const mag = 1.2 + Math.random() * 3.4;
      quakes.push({ x, depth, mag });
    }

    const draw = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 300;
      ctx.clearRect(0, 0, w, h);

      const originX = w * 0.5;
      const topY = 30;
      const maxDepthY = h - 30;
      const depthScale = (maxDepthY - topY) / 25; // 0 to 25 km depth

      // Crustal Background
      ctx.fillStyle = "#0c1524";
      ctx.fillRect(0, topY, w, maxDepthY - topY);

      // BDTZ Line (~15 km)
      const bdtzY = topY + 15 * depthScale;
      ctx.fillStyle = "rgba(255, 183, 0, 0.1)";
      ctx.fillRect(0, bdtzY, w, maxDepthY - bdtzY);

      ctx.strokeStyle = "#ffb700";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(0, bdtzY); ctx.lineTo(w, bdtzY); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ffb700";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("BRITTLE-DUCTILE TRANSITION (BDTZ ~350°C) — SEISMICITY SHUTOFF", 20, bdtzY - 6);
      ctx.fillText("ASEISMIC DUCTILE FLOW REGIME (NO BRITTLE FAILURE)", 20, bdtzY + 20);

      // Fault Trace
      ctx.strokeStyle = "rgba(0, 240, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(originX, topY); ctx.lineTo(originX, bdtzY); ctx.stroke();

      // Hypocentres
      quakes.forEach(q => {
        const px = originX + q.x * 10;
        const py = topY + q.depth * depthScale;
        ctx.fillStyle = q.mag > 3.0 ? "rgba(255, 51, 68, 0.8)" : "rgba(0, 240, 255, 0.6)";
        ctx.beginPath();
        ctx.arc(px, py, q.mag * 1.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Depth ticks
      ctx.fillStyle = "#7f95b2";
      ctx.font = "9px 'JetBrains Mono', monospace";
      [0, 5, 10, 15, 20].forEach(d => {
        const py = topY + d * depthScale;
        ctx.fillText(`${d} km`, originX - 45, py + 3);
      });
    };

    window.addEventListener('resize', draw);
    draw();
  }

  // 3. Marine Magnetic Striping Isochron Decoder
  initMagneticStripes() {
    const canvas = document.getElementById('magnetic-stripe-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Chrons (Polarity normal: true, reversed: false, width relative)
    const chrons = [
      { name: "Chron 1 (Brunhes)", normal: true, w: 25 },
      { name: "Matuyama Rev", normal: false, w: 35 },
      { name: "Chron 2 (Gauss)", normal: true, w: 20 },
      { name: "Gilbert Rev", normal: false, w: 30 },
      { name: "Chron 5 (~10 Ma)", normal: true, w: 45 },
      { name: "Chron 6 (~20 Ma)", normal: false, w: 50 },
      { name: "Chron 10 (~30 Ma)", normal: true, w: 60 },
      { name: "Chron 21 (~47 Ma)", normal: false, w: 80 }
    ];

    const draw = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 220;
      ctx.clearRect(0, 0, w, h);

      let curX = 30;
      chrons.forEach(ch => {
        ctx.fillStyle = ch.normal ? "#00f0ff" : "#1a2536";
        ctx.fillRect(curX, 40, ch.w, 90);
        ctx.strokeStyle = "#2d4366";
        ctx.strokeRect(curX, 40, ch.w, 90);

        ctx.save();
        ctx.translate(curX + ch.w * 0.5, 150);
        ctx.rotate(-Math.PI / 4);
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = ch.normal ? "#00f0ff" : "#7f95b2";
        ctx.fillText(ch.name, 0, 0);
        ctx.restore();

        curX += ch.w;
      });

      // Anomaly waveform overlay
      ctx.strokeStyle = "#ffb700";
      ctx.lineWidth = 2;
      ctx.beginPath();
      let wx = 30;
      chrons.forEach(ch => {
        const val = ch.normal ? 25 : 105;
        ctx.lineTo(wx, val);
        ctx.lineTo(wx + ch.w, val);
        wx += ch.w;
      });
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("PACIFIC-FARALLON MAGNETIC ANOMALY LINEATIONS (ATWATER 1970)", 30, 25);
    };

    window.addEventListener('resize', draw);
    draw();
  }

  // 4. Wallace Creek Offset Stream Interactive Caliper
  initWallaceCreekCaliper() {
    const canvas = document.getElementById('wallace-creek-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let caliperOffset = 130; // meters default
    let isDragging = false;

    const draw = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 260;
      ctx.clearRect(0, 0, w, h);

      // Aerial geomorphic channel rendering
      ctx.fillStyle = "#2a241b"; // Arid Carrizo Plain terrain
      ctx.fillRect(0, 0, w, h);

      const faultY = h * 0.5;

      // Fault trace line
      ctx.strokeStyle = "#ff3344";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(0, faultY); ctx.lineTo(w, faultY); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#ff3344";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("SAN ANDREAS FAULT TRACE (CARRIZO PLAIN)", 20, faultY - 10);

      // Upstream channel (North American side)
      ctx.strokeStyle = "#4d94ff";
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, 10);
      ctx.lineTo(w * 0.45, faultY);
      ctx.stroke();

      // Downstream offset channel (Pacific side, displaced right-laterally)
      const pxOffset = (caliperOffset / 130) * 110;
      ctx.beginPath();
      ctx.moveTo(w * 0.45 + pxOffset, faultY);
      ctx.lineTo(w * 0.45 + pxOffset + 20, h - 10);
      ctx.stroke();

      // Caliper measurement overlay
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, faultY - 25);
      ctx.lineTo(w * 0.45, faultY + 25);
      ctx.moveTo(w * 0.45 + pxOffset, faultY - 25);
      ctx.lineTo(w * 0.45 + pxOffset, faultY + 25);
      ctx.moveTo(w * 0.45, faultY);
      ctx.lineTo(w * 0.45 + pxOffset, faultY);
      ctx.stroke();

      // Compute Slip Rate: Offset (m) / 3,700 yr (C-14 age, Sieh & Jahns 1984)
      const slipRate = ((caliperOffset / 3700) * 1000).toFixed(1);

      ctx.fillStyle = "#00f0ff";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`OFFSET: ${caliperOffset.toFixed(0)} METERS (HOLOCENE C-14 AGE = 3,700 ± 150 BP)`, w * 0.45 - 20, faultY - 35);
      ctx.fillStyle = "#00ff66";
      ctx.fillText(`DERIVED SLIP RATE = ${slipRate} mm/yr [SIEH & JAHNS 1984 BENCHMARK: 35.1 mm/yr]`, w * 0.45 - 20, faultY + 45);
    };

    canvas.addEventListener('mousedown', () => { isDragging = true; });
    window.addEventListener('mouseup', () => { isDragging = false; });
    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const w = canvas.width;
      const deltaPx = mouseX - (w * 0.45);
      caliperOffset = Math.max(20, Math.min(220, (deltaPx / 110) * 130));
      draw();
    });

    window.addEventListener('resize', draw);
    draw();
  }
}

// ==========================================
// 5. MALAYSIA SEISMIC & GEODYNAMIC RADAR
// ==========================================
class MalaysiaGeodynamicsViewer {
  constructor() {
    this.initSoilResonanceSimulator();
  }

  initSoilResonanceSimulator() {
    const soilSelect = document.getElementById('my-soil-type');
    const heightSelect = document.getElementById('my-bldg-height');
    const canvas = document.getElementById('my-resonance-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = 240;
      ctx.clearRect(0, 0, w, h);

      const isClay = soilSelect ? soilSelect.value === 'clay' : true;
      const isHighRise = heightSelect ? heightSelect.value === 'high' : true;

      // Ground site amplification factor (Eurocode 8 / MS EN 1998-1:2015)
      // Soft clay amplifies long-period waves (T > 1.0 s) by 2.5x to 3.5x
      const ampFactor = (isClay ? 2.8 : 1.0) * (isHighRise ? 2.5 : 0.8);

      ctx.fillStyle = "#0a111a";
      ctx.fillRect(0, 0, w, h);

      // Building vibration animation
      const time = Date.now() * 0.003;
      const sway = Math.sin(time * (isHighRise ? 1.2 : 3.5)) * ampFactor * 4;

      const groundY = h - 40;

      // Soil layer
      ctx.fillStyle = isClay ? "#3d3220" : "#1f2a38";
      ctx.fillRect(0, groundY, w, 40);
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(isClay ? "KL SOFT ALLUVIAL CLAY (SITE CLASS D/E — HIGH AMPLIFICATION)" : "HARD BEDROCK (SITE CLASS A — MINIMAL RESONANCE)", 15, groundY + 25);

      // Building structure
      const bldgW = isHighRise ? 45 : 60;
      const bldgH = isHighRise ? 140 : 45;
      const bldgX = w * 0.5 - bldgW * 0.5;

      ctx.strokeStyle = ampFactor > 4 ? "#ff3344" : "#00f0ff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = ampFactor > 4 ? "#ff3344" : "#00f0ff";
      ctx.shadowBlur = ampFactor > 4 ? 12 : 5;
      ctx.beginPath();
      ctx.moveTo(bldgX, groundY);
      ctx.lineTo(bldgX + sway, groundY - bldgH);
      ctx.lineTo(bldgX + bldgW + sway, groundY - bldgH);
      ctx.lineTo(bldgX + bldgW, groundY);
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Waveform from Sumatra
      ctx.strokeStyle = "#ffb700";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w * 0.4; x += 3) {
        const y = groundY - 60 + Math.sin(x * 0.06 - time * 2) * (isClay ? 18 : 6);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = "#ffb700";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("DISTANT SUMATRAN SHEAR/LOVE WAVES (~400 KM AWAY, T > 1.2s)", 15, groundY - 85);

      const ampReadout = document.getElementById('my-amp-readout');
      if (ampReadout) {
        ampReadout.innerText = `${ampFactor.toFixed(1)}x`;
        ampReadout.style.color = ampFactor > 4 ? "#ff3344" : "#00f0ff";
      }

      requestAnimationFrame(draw);
    };

    if (soilSelect) soilSelect.addEventListener('change', () => audio.playClick());
    if (heightSelect) heightSelect.addEventListener('change', () => audio.playClick());
    draw();
  }
}

// ==========================================
// 6. CLASSIFIED VERIFICATION ASSESSMENT (QUIZ)
// ==========================================
class ClassifiedAssessment {
  constructor() {
    this.initQuiz();
  }

  initQuiz() {
    const questions = [
      {
        id: 1,
        correct: 1,
        explanation: "CORRECT: Gravitational differentiation caused dense nickel-iron to sink forming the core, while decompression and subsolidus plastic olivine flow established the ductile asthenosphere beneath a rigid thermal boundary layer (lithosphere)."
      },
      {
        id: 2,
        correct: 0,
        explanation: "CORRECT: Although transform faults lack local slabs, the Pacific Plate's rapid NW motion is driven globally by slab pull in the Western Pacific subduction zones (Mariana, Kuril, Izu), pulling the plate past North America."
      },
      {
        id: 3,
        correct: 2,
        explanation: "CORRECT: As modeled by Savage & Burford (1973), interseismic geodetic strain accumulates elastically in the upper brittle crust down to the ~15 km locking depth (BDTZ), above which stick-slip ruptures occur."
      }
    ];

    questions.forEach(q => {
      const opts = document.querySelectorAll(`[data-quiz-q="${q.id}"]`);
      opts.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const selectedIdx = parseInt(e.currentTarget.getAttribute('data-opt-idx'));
          const feedbackEl = document.getElementById(`quiz-feedback-${q.id}`);

          opts.forEach(b => {
            b.disabled = true;
            b.classList.remove('correct', 'incorrect');
          });

          if (selectedIdx === q.correct) {
            e.currentTarget.classList.add('correct');
            audio.playBeep(1050, 'sine', 0.2);
            if (feedbackEl) {
              feedbackEl.style.display = 'block';
              feedbackEl.style.color = '#00ff66';
              feedbackEl.innerText = q.explanation;
            }
          } else {
            e.currentTarget.classList.add('incorrect');
            audio.playBeep(220, 'sawtooth', 0.3);
            if (feedbackEl) {
              feedbackEl.style.display = 'block';
              feedbackEl.style.color = '#ff3344';
              feedbackEl.innerText = "ACCESS DENIED: INACCURATE GEOMECHANICAL SPECIFICATION. " + q.explanation;
            }
          }
        });
      });
    });
  }
}

// ==========================================
// 7. INITIALIZE DOSSIER APP ON DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Tectonic Physics Simulator
  window.tectonicSim = new TectonicPhysicsSim('tectonic-physics-canvas');

  // Wire simulator inputs
  const rateSlider = document.getElementById('sim-plate-rate');
  const depthSlider = document.getElementById('sim-lock-depth');
  const viscSlider = document.getElementById('sim-viscosity');
  const triggerBtn = document.getElementById('sim-trigger-rupture');

  if (rateSlider) {
    rateSlider.addEventListener('input', (e) => {
      window.tectonicSim.setPlateRate(e.target.value);
      document.getElementById('sim-rate-val').innerText = `${e.target.value} mm/yr`;
    });
  }

  if (depthSlider) {
    depthSlider.addEventListener('input', (e) => {
      window.tectonicSim.setLockingDepth(e.target.value);
      document.getElementById('sim-depth-val').innerText = `${e.target.value} km`;
    });
  }

  if (viscSlider) {
    viscSlider.addEventListener('input', (e) => {
      window.tectonicSim.setViscosity(e.target.value);
      document.getElementById('sim-visc-val').innerText = `10^${e.target.value} Pa·s`;
    });
  }

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      window.tectonicSim.triggerRupture();
    });
  }

  // 2. Paleogeography Player
  window.paleoPlayer = new PaleogeographyPlayer('paleo-player-canvas');

  // 3. Empirical Evidence Viewer
  window.evidenceViewer = new EmpiricalEvidenceViewer();

  // 4. Malaysia Geodynamics Viewer
  window.myViewer = new MalaysiaGeodynamicsViewer();

  // 5. Classified Assessment
  window.assessment = new ClassifiedAssessment();

  // Audio Toggle
  const audioToggle = document.getElementById('audio-toggle-btn');
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      audioToggle.innerHTML = isMuted ? "AUDIO: [MUTED]" : "AUDIO: [ACTIVE]";
      audioToggle.classList.toggle('active', !isMuted);
    });
  }

  // CRT Scanline Toggle
  const scanlineToggle = document.getElementById('scanline-toggle-btn');
  const scanlines = document.querySelector('.scanlines');
  if (scanlineToggle && scanlines) {
    scanlineToggle.addEventListener('click', () => {
      scanlines.classList.toggle('disabled');
      scanlineToggle.classList.toggle('active');
      audio.playClick();
    });
  }

  // Live UTC Clock
  const clockEl = document.getElementById('live-utc-clock');
  const updateClock = () => {
    if (clockEl) {
      const now = new Date();
      clockEl.innerText = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    }
  };
  setInterval(updateClock, 1000);
  updateClock();
});

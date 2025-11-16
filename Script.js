// === CONFIG - change symbols if you prefer different providers ===
const CFD_SYMBOL = "OANDA:XAUUSD";     // TradingView symbol for XAU CFD (change if you prefer broker symbol)
const GC1_SYMBOL = "COMEX:GC1!";       // Futures proxy - change if your TV shows different symbol

// Helpers
function nowStr(){ return new Date().toLocaleTimeString(); }
function el(id){ return document.getElementById(id); }

// Simple alert push
function pushAlert(text){
  const a = el('alerts');
  const ts = `[${nowStr()}] `;
  a.innerText = ts + text + "\n" + a.innerText;
}

// --- TradingView widgets ---
function widgetCFD(){
  new TradingView.widget({
    "width": "100%",
    "height": "100%",
    "symbol": CFD_SYMBOL,
    "interval": "60",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#0e1620",
    "hide_side_toolbar": false,
    "enable_publishing": false,
    "allow_symbol_change": true,
    "container_id": "tv_cfd"
  });
}

function widgetGC1(){
  new TradingView.widget({
    "width": "100%",
    "height": "100%",
    "symbol": GC1_SYMBOL,
    "interval": "60",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#0e1620",
    "hide_side_toolbar": false,
    "enable_publishing": false,
    "allow_symbol_change": true,
    "container_id": "tv_gc1"
  });
}

// --- simple demo "reader" that simulates SRC signals using only available public info ---
// Note: Real SRC needs backend + execution feed to be precise. This is a safe frontend prototype.
let simulated = {
  cfd: null,
  gc1: null,
  spot: null,
  phase: "Idle",
  threshold: null
};

function simulateTick(){
  // read displayed values from DOM (we cannot read internal tradingview series), so we simulate
  if(simulated.cfd === null){
    simulated.cfd = 4197;
    simulated.gc1 = 4195;
    simulated.spot = 4196;
  } else {
    // small random walk to mimic live
    simulated.cfd += (Math.random()-0.5)*4;
    simulated.gc1 += (Math.random()-0.5)*3;
    simulated.spot = simulated.gc1 + (simulated.cfd - simulated.gc1)*0.4;
  }

  const spread = +(simulated.cfd - simulated.gc1).toFixed(2);
  el('cfd_val').innerText = simulated.cfd.toFixed(2);
  el('gc1_val').innerText = simulated.gc1.toFixed(2);
  el('spot_val').innerText = simulated.spot.toFixed(2);
  el('spread_val').innerText = spread;

  // Simple heuristics for phase (demo)
  if(Math.abs(spread) < 2){
    simulated.phase = "Phase 1 (neutral)";
    el('no_trade').innerText = "safe";
    simulated.threshold = "--";
  } else if(Math.abs(spread) < 6){
    simulated.phase = "Phase 2 (watch)";
    el('no_trade').innerText = "watch";
    simulated.threshold = (simulated.gc1 - 30).toFixed(0);
  } else {
    simulated.phase = "Phase 3 (edge)";
    el('no_trade').innerText = "sweep zone";
    simulated.threshold = (simulated.gc1 - 50).toFixed(0);
  }
  el('phase').innerText = simulated.phase;
  el('threshold').innerText = simulated.threshold;
// generate readable note
  const note = `CFD ${simulated.cfd.toFixed(2)}  GC1 ${simulated.gc1.toFixed(2)}  Spread ${spread.toFixed(2)}   Phase=${simulated.phase}`;
  pushAlert(note);
  el('now').innerText = nowStr();
}

// Initialize page
window.addEventListener('load', () => {
  widgetCFD();
  widgetGC1();

  // run simulated ticks every 2s (replace with real websocket later)
  simulateTick();
  setInterval(simulateTick, 2000);
});

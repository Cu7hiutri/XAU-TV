// ============ TradingView Chart ===============
new TradingView.widget({
    "container_id": "tv_chart",
    "width": "100%",
    "height": 400,
    "symbol": "TVC:GOLD",
    "interval": "1",
    "timezone": "Etc/UTC",
    "theme": "dark",
    "style": "1",
    "locale": "en",
    "toolbar_bg": "#000000",
    "hide_top_toolbar": false,
    "hide_legend": true,
    "save_image": false,
});

// ============ Realtime Prices ===============
async function fetchTV(symbol) {
    const url = `https://api.tvdatafeed.com/price/${encodeURIComponent(symbol)}`;
    try {
        const r = await fetch(url);
        const j = await r.json();
        return j.price;
    } catch {
        return null;
    }
}

async function updatePrices() {
    const cfd = await fetchTV("TVC:GOLD");
    const gc1 = await fetchTV("COMEX:GC1!");

    document.getElementById("cfdPrice").innerText = cfd ?? "N/A";
    document.getElementById("gc1Price").innerText = gc1 ?? "N/A";

    // Spot Proxy = midpoint
    if (cfd && gc1) {
        const spot = (cfd + gc1) / 2;
        document.getElementById("spotPrice").innerText = spot.toFixed(2);
    }

    // LBMA Fix placeholder — sẽ nâng cấp
    document.getElementById("fixPrice").innerText = "Updating...";
}

setInterval(updatePrices, 1500);

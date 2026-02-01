const S_ID = '1rUV_hwRCU74-aUn5OjrH15lHoWU-LmtT3nLtlNELDVk';
const S_NAME = 'Form%20Responses%201';
const DATA_URL = `https://docs.google.com/spreadsheets/d/${S_ID}/gviz/tq?tqx=out:csv&sheet=${S_NAME}`;

let dataSet = [];

// THE FIX: Working playback logic from yesterday 3pm
function playVideo(item) {
    let url = item.link;
    
    // Convert standard links to Embed links (Fixes Error 153)
    if(url.includes("watch?v=")) url = url.replace("watch?v=", "embed/");
    if(url.includes("youtu.be/")) url = url.replace("youtu.be/", "youtube.com/embed/");
    
    const player = document.getElementById('main-preview');
    if(player) {
        // Add autoplay and playsinline for mobile app compatibility
        player.src = url + "?autoplay=1&playsinline=1&modestbranding=1&rel=0";
        document.getElementById('preview-title').innerText = "📺 preview player: " + item.name;
    }
}

async function init() {
    try {
        const res = await fetch(DATA_URL);
        const csv = await res.text();
        const rows = csv.split('\n').slice(1);

        dataSet = rows.map(r => {
            const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/"/g, '').trim());
            return {
                name: c[0], link: c[1], 
                views: parseInt(c[2]) || 0, 
                yesterday: parseInt(c[3]) || 0,
                gain: (parseInt(c[2]) || 0) - (parseInt(c[3]) || 0)
            };
        }).filter(x => x.name);

        updateDashboard();
    } catch (e) { 
        console.error("Sync Error");
        document.getElementById('total-views').innerText = "Offline";
    }
}

function updateDashboard() {
    // Update KPI Text
    document.getElementById('total-views').innerText = dataSet.reduce((s, i) => s + i.views, 0).toLocaleString();
    
    const topG = [...dataSet].sort((a,b) => b.gain - a.gain)[0];
    const overall = [...dataSet].sort((a,b) => b.views - a.views)[0];

    if(topG) {
        document.getElementById('top-gainer-name').innerText = topG.name;
        document.getElementById('top-gainer-val').innerText = "+" + topG.gain.toLocaleString();
        // Automatically play the top gainer on launch
        playVideo(topG);
    }
    
    if(overall) {
        document.getElementById('overall-top-name').innerText = overall.name;
    }

    // Populate the List
    document.getElementById('tableBody').innerHTML = dataSet.map(i => `
        <tr onclick='playVideo(${JSON.stringify(i)})' style="cursor:pointer">
            <td><strong>${i.name}</strong></td>
            <td>${i.views.toLocaleString()}</td>
            <td style="color:#FF3B30">+${i.gain}</td>
        </tr>
    `).join('');
}

// Start immediately
init();

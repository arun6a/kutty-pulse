const S_ID = '1rUV_hwRCU74-aUn5OjrH15lHoWU-LmtT3nLtlNELDVk';
const S_NAME = 'Form%20Responses%201';
const DATA_URL = `https://docs.google.com/spreadsheets/d/${S_ID}/gviz/tq?tqx=out:csv&sheet=${S_NAME}`;

// THE FIX: Yesterday's 3PM playback logic
function playVideo(item) {
    let url = item.link;
    if(url.includes("watch?v=")) url = url.replace("watch?v=", "embed/");
    if(url.includes("youtu.be/")) url = url.replace("youtu.be/", "youtube.com/embed/");
    
    // mobile-specific parameters to bypass Error 153
    document.getElementById('main-preview').src = url + "?autoplay=1&playsinline=1&rel=0";
    document.getElementById('preview-title').innerText = "📺 preview player: " + item.name;
}

async function loadData() {
    try {
        const res = await fetch(DATA_URL);
        const csv = await res.text();
        const rows = csv.split('\n').slice(1);

        const data = rows.map(r => {
            const c = r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/"/g, '').trim());
            return {
                name: c[0], link: c[1], 
                views: parseInt(c[2]) || 0, 
                yesterday: parseInt(c[3]) || 0,
                gain: (parseInt(c[2]) || 0) - (parseInt(c[3]) || 0)
            };
        }).filter(x => x.name);

        updateUI(data);
    } catch (e) { console.error("Sync Error"); }
}

function updateUI(dataSet) {
    const totalViews = dataSet.reduce((s, i) => s + i.views, 0);
    document.getElementById('total-views').innerText = totalViews.toLocaleString();

    const topG = [...dataSet].sort((a,b) => b.gain - a.gain)[0];
    if(topG) {
        document.getElementById('top-gainer-name').innerText = topG.name;
        document.getElementById('top-gainer-val').innerText = "+" + topG.gain + " Today";
        playVideo(topG); // Auto-load the gainer
    }

    document.getElementById('tableBody').innerHTML = dataSet.map(i => `
        <tr onclick='playVideo(${JSON.stringify(i)})'>
            <td>${i.name}</td>
            <td>${i.views.toLocaleString()}</td>
            <td>+${i.gain}</td>
        </tr>
    `).join('');
}

loadData();
        

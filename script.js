let ytPlayer;
function onYouTubeIframeAPIReady() {
    const channelID = "UCFt_1FffIE4OS5b-VK_8w3Q";
    const uploadsID = channelID.replace(/^UC/, 'UU');

    ytPlayer = new YT.Player('player', {
        height: '100%',
        width: '100%',
        playerVars: {
            'listType': 'playlist',
            'list': uploadsID,
            'origin': window.location.origin, // Automatically uses your hosted URL
            'enablejsapi': 1
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const channelID = "UCFt_1FffIE4OS5b-VK_8w3Q";
    const sheetID = "1rUV_hwRCU74-aUn5OjrH15lHoWU-LmtT3nLtlNELDVk";

    document.getElementById('profile-pic').src = `https://www.banner.yt/${channelID}/avatar`;

    async function fetchStats() {
        try {
            const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:csv`);
            const text = await response.text();
            const total = text.split('\n').slice(1).reduce((acc, row) => acc + (parseInt(row.split(',')[2]?.replace(/"/g, '')) || 0), 0);
            document.getElementById('sub-status').innerHTML = `● METRICS SYNCED: <b>${total.toLocaleString()}</b> VIEWS`;
        } catch (e) { document.getElementById('sub-status').innerText = "● SYSTEM ACTIVE"; }
    }
    fetchStats();

    document.getElementById('theme-toggle').onclick = () => document.body.classList.toggle('light-mode');
});

document.addEventListener('DOMContentLoaded', () => {
    loadFeed();
});

async function loadFeed() {
    const container = document.getElementById('feed-container');
    const loading = document.getElementById('loading');

    try {
        const response = await fetch('data.json?t=' + new Date().getTime()); // Anti-cache
        const data = await response.json();
        
        loading.style.display = 'none';

        if (data.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 py-10">Tiada maklumat terkini buat masa ini.</p>';
            return;
        }

        // Susun: Paling baru di atas
        data.sort((a, b) => new Date(b.tarikh_masa) - new Date(a.tarikh_masa));

        data.forEach(item => {
            container.innerHTML += createCard(item);
        });

    } catch (error) {
        console.error('Error loading data:', error);
        loading.innerHTML = '<p class="text-red-400">Gagal memuatkan data. Sila cuba lagi.</p>';
    }
}

function createCard(item) {
    const isKhutbah = item.kategori.toLowerCase() === 'khutbah';
    
    return `
        <div class="glass p-5 rounded-3xl mb-4">
            <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] uppercase tracking-widest ${isKhutbah ? 'text-blue-400' : 'text-green-400'} font-bold">
                    ${item.kategori}
                </span>
                <span class="text-xs text-gray-500">
                    ${formatDate(item.tarikh_masa)}
                </span>
            </div>
            <h3 class="font-semibold text-lg mb-4 text-white/90 leading-snug">
                ${item.tajuk}
            </h3>
            ${item.url_pdf ? `
                <a href="reader.html?file=${encodeURIComponent(item.url_pdf)}" class="block w-full text-center bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl text-sm font-semibold transition">
                    Baca Khutbah (Playbook View)
                </a>
            ` : ''}
        </div>
    `;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ms-MY', options);
}

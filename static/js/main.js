document.addEventListener('DOMContentLoaded', function() {
    const extractForm = document.getElementById('extractForm');
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const results = document.getElementById('results');
    const videoTitle = document.getElementById('videoTitle');
    const thumbnailGrid = document.getElementById('thumbnailGrid');

    function sanitizeFileName(title) {
        return title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    async function downloadImage(url, fileName) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = blobUrl;
            downloadLink.download = fileName;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Error downloading image:', err);
            error.textContent = 'Error al descargar la imagen';
            error.classList.remove('d-none');
        }
    }

    extractForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reiniciar estado anterior
        error.classList.add('d-none');
        thumbnailGrid.innerHTML = '';
        videoTitle.classList.add('d-none');

        // Mostrar carga
        loading.classList.remove('d-none');

        const url = document.getElementById('youtubeUrl').value;
        const formData = new FormData();
        formData.append('url', url);

        try {
            const response = await fetch('/extract', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al extraer miniaturas');
            }

            // Ocultar carga
            loading.classList.add('d-none');

            // Mostrar título del video
            videoTitle.textContent = data.thumbnails.title;
            videoTitle.classList.remove('d-none');

            // Mostrar miniaturas
            const qualityLabels = {
                'maxres': 'Máxima resolución',
                'high': 'Alta calidad',
                'medium': 'Calidad media',
                'standard': 'Calidad estándar',
                'default': 'Calidad baja'
            };

            Object.entries(data.thumbnails.thumbnails).forEach(([quality, url]) => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4';

                const fileName = `${sanitizeFileName(data.thumbnails.title)}_${quality}.jpg`;

                col.innerHTML = `
                    <div class="thumbnail-card position-relative">
                        <span class="badge bg-primary quality-badge">${qualityLabels[quality]}</span>
                        <img src="${url}" 
                             alt="Miniatura ${qualityLabels[quality]}" 
                             class="thumbnail-image">
                        <div class="mt-2">
                            <div class="d-grid">
                                <button class="btn btn-primary download-btn" data-url="${url}" data-filename="${fileName}">
                                    <i class="bi bi-download me-2"></i> 
                                    Descargar ${qualityLabels[quality]}
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                thumbnailGrid.appendChild(col);
            });

        } catch (err) {
            loading.classList.add('d-none');
            error.textContent = err.message;
            error.classList.remove('d-none');
        }
    });

    // Manejar clics en los botones de descarga
    thumbnailGrid.addEventListener('click', function(e) {
        if (e.target.closest('.download-btn')) {
            e.preventDefault();
            const button = e.target.closest('.download-btn');
            const url = button.dataset.url;
            const fileName = button.dataset.filename;
            downloadImage(url, fileName);
        }
    });
});
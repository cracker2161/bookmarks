// Simple Logo Creator - Working Version

document.addEventListener('DOMContentLoaded', function() {
    // Essential Elements
    const elements = {
        companyName: document.getElementById('companyName'),
        slogan: document.getElementById('slogan'),
        primaryColor: document.getElementById('primaryColor'),
        fontSize: document.getElementById('fontSize'),
        downloadBtn: document.getElementById('downloadBtn'),
        logoPreview: document.getElementById('logoPreview'),
        previewText: document.querySelector('.logo-text'),
        companyNamePreview: document.querySelector('.company-name'),
        sloganPreview: document.querySelector('.company-slogan')
    };

    // Update Preview Function
    function updatePreview() {
        // Update company name
        if (elements.companyNamePreview) {
            elements.companyNamePreview.textContent = elements.companyName.value || 'Your Company';
            elements.companyNamePreview.style.color = elements.primaryColor.value;
            elements.companyNamePreview.style.fontSize = `${elements.fontSize.value}px`;
        }

        // Update slogan
        if (elements.sloganPreview) {
            elements.sloganPreview.textContent = elements.slogan.value || 'Your Slogan';
            elements.sloganPreview.style.color = elements.primaryColor.value;
        }
    }

    // Event Listeners
    if (elements.companyName) {
        elements.companyName.addEventListener('input', updatePreview);
    }

    if (elements.slogan) {
        elements.slogan.addEventListener('input', updatePreview);
    }

    if (elements.primaryColor) {
        elements.primaryColor.addEventListener('input', updatePreview);
    }

    if (elements.fontSize) {
        elements.fontSize.addEventListener('input', updatePreview);
    }

    // Download Function
    if (elements.downloadBtn) {
        elements.downloadBtn.addEventListener('click', function() {
            html2canvas(elements.logoPreview).then(canvas => {
                // Create download link
                const link = document.createElement('a');
                link.download = 'logo.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }).catch(error => {
                console.error('Download failed:', error);
                alert('Failed to download logo. Please try again.');
            });
        });
    }

    // Initialize preview
    updatePreview();
});

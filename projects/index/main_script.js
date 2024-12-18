// Validate the current URL to ensure only the main homepage is accessible
const allowedURL = "https://oriby.netlify.app/";
if (window.location.href !== allowedURL) {
    document.body.innerHTML = `
        <div style="text-align: center; margin-top: 20%; font-family: Arial, sans-serif;">
            <h1>Access Denied</h1>
            <p>This page is not accessible directly.</p>
            <p><a href="${allowedURL}">Go to Home Page</a></p>
        </div>
    `;
    throw new Error("Unauthorized access to the page!");
}

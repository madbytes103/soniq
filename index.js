const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Node.js Server - Optimized for Module Imports
 * Serves the entire src directory to allow cross-module imports.
 */

// Serve static files from the project root to allow /src/... imports
app.use(express.static(path.join(__dirname)));

// Root route serves the UI index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'ui', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║  SONIQ PRO - High Fidelity Radio Server            ║
╠════════════════════════════════════════════════════╣
║  Access: http://localhost:${PORT}                  ║
║  Status: Operational / High Performance             ║
╚════════════════════════════════════════════════════╝
    `);
});

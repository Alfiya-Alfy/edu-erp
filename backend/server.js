require('dotenv').config();
const express = require('express');
const cors = require('cors');

const paymentsRouter = require('./routes/payments');
const feeStructureRouter = require('./routes/feeStructure');
const certificatesRouter = require('./routes/certificates');
const tcRouter = require('./routes/tc');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', module: 'Finance API' }));

// Finance routes
app.use('/api/payments', paymentsRouter);
app.use('/api/fee-structure', feeStructureRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/tc', tcRouter);

// Global error handler
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`✅ Finance API server running at http://localhost:${PORT}`);
});

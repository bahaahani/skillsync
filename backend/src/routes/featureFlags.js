import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  // Implement feature flags logic here
  const featureFlags = {
    newUserInterface: true,
    advancedSearch: false,
    betaFeatures: process.env.ENABLE_BETA_FEATURES === 'true'
  };
  res.json({ featureFlags });
});

export default router;
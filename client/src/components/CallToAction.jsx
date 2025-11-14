// src/components/CallToAction.js
import React from "react";
import { useNavigate } from 'react-router';

const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="cta text-center">
      <div className="container">
        <h2>Ready to Unlock Your Farm's Full Potential?</h2>
        <p>Join thousands of farmers who are building a more profitable and sustainable future with CropCare AI.</p>
        <button className="btn btn-primary btn-large" onClick={() => navigate('/dashboard')}>Get Your Free Consultation</button>
      </div>
    </section>
  );
};

export default CallToAction;
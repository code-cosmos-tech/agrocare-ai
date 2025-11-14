import React, { useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export const Home = ({ darkMode, toggleDarkMode }) => {
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <Hero />
            <HowItWorks />
            <Features />
            <Testimonials />
            <CallToAction />
            <Footer />
        </div>
    );
}
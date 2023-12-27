import React, { useState, useEffect } from 'react';
import WelcomingPanel from "./WelcomingPanel";
import FormPanel from "./FormPanel";
import "./App.css"

const ScrollIndicator = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = (window.scrollY / scrollHeight) * 100;
        setScrollPercentage(percentage);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="scroll-indicator-container">
            <div
                className="scroll-indicator"
                style={{ width: `${scrollPercentage}%` }}
            />
        </div>
    );
};

const App = () => {
    return (
        <div id="app" className="scroll-container">
            <div id="panel-container" className="scroll-content">
                {/* WelcomingPanel */}
                <WelcomingPanel />

                {/* FormPanel */}
                <FormPanel />

                {/* Scroll Indicator */}
                <ScrollIndicator />
            </div>
        </div>
    );
};

export default App;

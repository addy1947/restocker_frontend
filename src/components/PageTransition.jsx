import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
    const [displayLocation, setDisplayLocation] = useState(useLocation());
    const [transitionStage, setTransitionStage] = useState("fadeIn");
    const location = useLocation();

    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage("fadeOut");
        }
    }, [location, displayLocation]);

    return (
        <div
            className={`page-transition ${transitionStage}`}
            onAnimationEnd={() => {
                if (transitionStage === "fadeOut") {
                    setDisplayLocation(location);
                    setTransitionStage("fadeIn");
                }
            }}
        >
            {children}
        </div>
    );
};

export default PageTransition;

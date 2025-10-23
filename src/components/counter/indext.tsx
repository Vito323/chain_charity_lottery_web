"use client";
import React from 'react'
import './style.css'
import { useScrollAnimation, useStaggeredAnimation, useCounterAnimation } from '@/hooks/useScrollAnimation';

const CounterSection = (props: {countclass?: string}) => {
    const { elementRef: sectionRef } = useScrollAnimation({
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2
    });

    const { containerRef: counterGridsRef } = useStaggeredAnimation('.grid', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.4
    });

    const { elementRef: donationRef, currentValue: donationValue } = useCounterAnimation(6200, 2);
    const { elementRef: fundRef, currentValue: fundValue } = useCounterAnimation(635000, 2);
    const { elementRef: volunteersRef, currentValue: volunteersValue } = useCounterAnimation(245, 2);
    const { elementRef: projectsRef, currentValue: projectsValue } = useCounterAnimation(605, 2);

    return(
        <div ref={sectionRef as React.RefObject<HTMLDivElement>} className={`wpo-counter-area ${props.countclass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div ref={counterGridsRef as React.RefObject<HTMLDivElement>} className="wpo-counter-grids">
                            <div className="grid">
                                <div>
                                    <h2><span ref={donationRef} className="odometer" data-count="6200">6200</span>+</h2>
                                </div>
                                <p>Donation</p>
                            </div>
                            <div className="grid">
                                <div>
                                    <h2><span ref={fundRef} className="odometer" data-count="635k">635k</span></h2>
                                </div>
                                <p>Fund Raised</p>
                            </div>
                            <div className="grid">
                                <div>
                                    <h2><span ref={volunteersRef} className="odometer" data-count="245">245</span>+</h2>
                                </div>
                                <p>Volunteers</p>
                            </div>
                            <div className="grid">
                                <div>
                                    <h2><span ref={projectsRef} className="odometer" data-count="605">605</span>+</h2>
                                </div>
                                <p>Projects</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CounterSection;
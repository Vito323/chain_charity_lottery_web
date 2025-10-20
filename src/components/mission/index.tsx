"use client";
import './style.css'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const Mission = (props: { subclass?: string }) => {
    const { elementRef: sectionRef } = useScrollAnimation({
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2
    });

    const { containerRef: titleRef } = useStaggeredAnimation('.wpo-section-title', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1
    });

    const { containerRef: missionItemsRef } = useStaggeredAnimation('.wpo-mission-item', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3
    });

    return(
        <div ref={sectionRef} className={`wpo-mission-area ${props.subclass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div ref={titleRef} className="wpo-section-title">
                            <span>What We Do?</span>
                            <h2>We Are In A Mission To Help The Helpless</h2>
                        </div>
                    </div>
                </div>
                <div ref={missionItemsRef} className="wpo-mission-wrap">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-12 col-12 custom-grid">
                            <div className="wpo-mission-item">
                                <div className="wpo-mission-icon-7">
                                    <img src={"/images/mission/icon3.png"} alt=""/>
                                </div>
                                <div className="wpo-mission-content">
                                    <h2>Educational support</h2>
                                    <p>Provide essential resources to underprivileged students. makes their dreams a reality.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 col-12 custom-grid">
                            <div className="wpo-mission-item">
                                <div className="wpo-mission-icon-8">
                                    <img src={"/images/mission/icon4.png"} alt=""/>
                                </div>
                                <div className="wpo-mission-content">
                                    <h2>Medical assistance</h2>
                                    <p>Provide timely aid and health security to communities and individuals lacking medical resources. Let compassion be the best medicine.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 col-12 custom-grid">
                            <div className="wpo-mission-item">
                                <div className="wpo-mission-icon-5">
                                    <img src={"/images/mission/icon1.png"} alt=""/>
                                </div>
                                <div className="wpo-mission-content">
                                    <h2>Environmental Protection</h2>
                                    <p>Join our initiatives, from planting trees to cleaning water sources, to secure the green future we depend on.</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-12 col-12 custom-grid">
                            <div className="wpo-mission-item">
                                <div className="wpo-mission-icon-6">
                                    <img src={"/images/mission/icon2.png"} alt=""/>
                                </div>
                                <div className="wpo-mission-content">
                                    <h2>Disaster relief</h2>
                                    <p>When disaster strikes, we move fast to provide critical relief like food, shelter, and medical care to help victims rebuild their lives.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mission;
"use client"
import './style.scss'
import Link from 'next/link';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

const CtaSection = (props: {ctaclass?: string}) => {
    const { elementRef: sectionRef } = useScrollAnimation({
        y: 50,
        opacity: 0,
        duration: 1,
        delay: 0.2
    });

    const { containerRef: ctaContentRef } = useStaggeredAnimation('.wpo-cta-text > *', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.3
    });

    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }
    return(
        <div ref={sectionRef} className={`wpo-cta-area ${props.ctaclass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div ref={ctaContentRef} className="wpo-cta-text">
                            <h2>Join us to act together</h2>
                            <p>Changing the world isn&apos;t a solitary task. Every donation, share, and act of volunteering is a powerful show of support for the helpless. Join us and turn compassion into collective action!</p>
                            <div className="btns">
                                <Link onClick={ClickHandler} href="/project" className="theme-btn">Donate Now</Link>
                                <Link onClick={ClickHandler} href="/" className="theme-btn-s2">Join Us Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CtaSection;
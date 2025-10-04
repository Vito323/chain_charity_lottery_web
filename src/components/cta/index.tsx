"use client"
import './style.css'
import Link from 'next/link';

const CtaSection = (props: {ctaclass?: string}) => {

    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }
    return(
        <div className={`wpo-cta-area ${props.ctaclass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="wpo-cta-text">
                            <h2>Join us to act together</h2>
                            <p>Changing the world isn't a solitary task. Every donation, share, and act of volunteering is a powerful show of support for the helpless. Join us and turn compassion into collective action!</p>
                            <div className="btns">
                                <Link onClick={ClickHandler} href="/project" className="theme-btn">Donate Now</Link>
                                <Link onClick={ClickHandler} href="/home" className="theme-btn-s2">Join Us Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CtaSection;
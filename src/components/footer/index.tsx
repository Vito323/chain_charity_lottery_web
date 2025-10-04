"use client"
import Newsletter from '../newsletter'
import './style.css'
import Link from 'next/link'
import Image from "next/image";

const Footer = () =>{

    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }

  return(
    <footer className="wpo-site-footer">
        <Newsletter />
        <div className="wpo-upper-footer">
            <div className="container">
                <div className="row">
                    <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                        <div className="widget about-widget">
                            <div className="logo widget-title">
                            <Image
                                src={"https://placehold.co/150x150"}
                                width={50}
                                height={50}
                                unoptimized
                                alt=""
                            />
                            </div>
                            <p>Connecting the world with kindness, protecting our home with action.</p>
                            <ul>
                                <li><Link onClick={ClickHandler} href="/"><i className="ti-facebook"></i></Link></li>
                                <li><Link onClick={ClickHandler} href="/"><i className="ti-twitter-alt"></i></Link></li>
                                <li><Link onClick={ClickHandler} href="/"><i className="ti-instagram"></i></Link></li>
                                <li><Link onClick={ClickHandler} href="/"><i className="ti-google"></i></Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col col-lg-3 col-md-6 col-sm-12 col-12">
                        {/* <div className="widget link-widget resource-widget">
                            <div className="widget-title">
                                <h3>Top News</h3>
                            </div>
                            <div className="news-wrap">
                                <div className="news-img">
                                    <img src={'/images/footer/img-1.jpg'} alt=""/>
                                </div>
                                <div className="news-text">
                                    <h3><Link onClick={ClickHandler} href="/blog">Education for all poor children</Link></h3>
                                    <span>12 Nov, 2020</span>
                                </div>
                            </div>
                            <div className="news-wrap">
                                <div className="news-img">
                                    <img src={'/images/footer/img-2.jpg'} alt=""/>
                                </div>
                                <div className="news-text">
                                    <h3><Link onClick={ClickHandler} href="/blog">Education for all poor children</Link></h3>
                                    <span>12 Nov, 2020</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                    <div className="col col-lg-2 col-md-6 col-sm-12 col-12">
                        <div className="widget link-widget">
                            <div className="widget-title">
                                <h3>Useful Links</h3>
                            </div>
                            <ul>
                                <li><Link onClick={ClickHandler} href="/">Home</Link></li>
                                {/* <li><Link onClick={ClickHandler} href="/about">About Us</Link></li> */}
                                <li><Link onClick={ClickHandler} href="/project">Our Project</Link></li>
                                {/* <li><Link onClick={ClickHandler} href="/case">Our Mission</Link></li> */}
                                {/* <li><Link onClick={ClickHandler} href="/contact">Contact Us</Link></li> */}
                                {/* <li><Link onClick={ClickHandler} href="/event">Our Event</Link></li> */}
                            </ul>
                        </div>
                    </div>
                    <div className="col col-lg-3 offset-lg-1 col-md-6 col-sm-12 col-12">
                        <div className="widget market-widget wpo-service-link-widget">
                            <div className="widget-title">
                                <h3>Contact Us</h3>
                            </div>
                            {/* <p>Connecting the world with kindness, protecting our home with action.</p> */}
                            <div className="contact-ft">
                                <ul>
                                    <li><i className="fi flaticon-pin"></i>1 Street, 2 City, Singapore</li>
                                    <li><i className="fi flaticon-call"></i>+1234567890</li>
                                    <li><i className="fi flaticon-envelope"></i>support@chaincharity.com</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="wpo-lower-footer">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <p className="copyright">&copy; 2020 Nasarna. All rights reserved</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
} 

export default Footer;
"use client"

import Link from 'next/link'
import './style.css'

const BlogSection = () => {
    
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }
    return(
        <div className="wpo-blog-area section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-section-title">
                            <span>Our Blog</span>
                            <h2>Latest News</h2>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 custom-grid">
                        <div className="wpo-blog-item">
                            <div className="wpo-blog-img">
                                <img src={'/images/blog/img-1.jpg'} alt=""/>
                            </div>
                            <div className="wpo-blog-content">
                                <span>Nov 24, 2020</span>
                                <h2><Link onClick={ClickHandler} href="/Blog"> Help The Helpless</Link></h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 custom-grid">
                        <div className="wpo-blog-item">
                            <div className="wpo-blog-img">
                                <img src={'/images/blog/img-2.jpg'} alt=""/>
                            </div>
                            <div className="wpo-blog-content">
                                <span>Nov 24, 2020</span>
                                <h2><Link onClick={ClickHandler} href="/Blog"> Help The Helpless</Link></h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 col-12 custom-grid">
                        <div className="wpo-blog-item">
                            <div className="wpo-blog-img">
                                <img src={'/images/blog/img-3.jpg'} alt=""/>
                            </div>
                            <div className="wpo-blog-content">
                                <span>Nov 24, 2020</span>
                                <h2><Link onClick={ClickHandler} href="/Blog"> Help The Helpless</Link></h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogSection;
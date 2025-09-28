import "./style.scss";
import Image from "next/image";
import Link from "next/link";
import VideoModal from "../modal-video";

const Hero = () => {
  return (
    <section className="hero hero-style-2">
      <div className="hero-slider">
        <div className="slide">
          <div className="container">
            <div className="row">
              <div className="col col-lg-6 slide-caption">
                <div className="slide-title">
                  <h2>
                    Let’s be Kind for <span>Children</span>
                  </h2>
                </div>
                <div className="slide-subtitle">
                  <p>High Quality Charity Theme in Envato Market.</p>
                  <p>You Can Satisfied Yourself By Helping.</p>
                </div>
                <div className="btns">
                  <Link href="/donate" className="theme-btn">
                    Donate Now
                  </Link>
                  <ul>
                    <li className="video-holder">
                      <VideoModal />
                    </li>
                    <li className="video-text">Watch Our Video</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="right-vec"></div>
        </div>
      </div>
      <div className="hero-shape">
        <img src={"/images/slider/shape.jpg"} alt="" />
      </div>
    </section>
  );
};

export default Hero;

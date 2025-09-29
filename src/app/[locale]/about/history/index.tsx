"use client";
import useFancybox from "@/hooks/useFancybox";
import "./style.scss";

const OurHistory = () => {
  const [fancyboxRef] = useFancybox({
    Carousel: {
      Thumbs: false,
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
    },
  });
  return (
    <section className="our-history s-title-bg">
      <span className="title-bg">Our History</span>
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-6">
            <div className="our-history-left">
              <h2 className="title-line-left">Our History</h2>
              <div className="overview-info-item">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim veniam.
                </p>
                <p>
                  Elementum nibh tellus molestie nunc non blandit massa enim.
                  Pretium aenean pharetra magna ac placerat vestibulum lectus.
                </p>
              </div>
              <div className="overview-info-item">
                <h5>Our Certificates</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim.{" "}
                </p>
              </div>
              <div className="history-cert" ref={fancyboxRef}>
                <div className="history-cert-img">
                  <a href="images/certificate-1.jpg" data-fancybox="gallery2">
                    <img src="images/certificate-1.jpg" alt="img" />
                  </a>
                </div>
                <div className="history-cert-img">
                  <a href="images/certificate-1.jpg" data-fancybox="gallery2">
                    <img src="images/certificate-1.jpg" alt="img" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="history-info-cover">
              <div className="history-info">
                <h4 className="title">
                  <span>2012-2014. </span>Our Establishment
                </h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim veniam. Elementum nibh
                  tellus molestie.
                </p>
              </div>
              <div className="history-info">
                <h4 className="title">
                  <span>2014. </span>The Early Days
                </h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim veniam.
                </p>
              </div>
              <div className="history-info">
                <h4 className="title">
                  <span>2015-2016. </span>Prosperity of Company
                </h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim veniam.
                </p>
              </div>
              <div className="history-info">
                <h4 className="title">
                  <span>2017-2018. </span>Worldwide Recognition
                </h4>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod aliqua. Ut enim ad minim veniam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurHistory;

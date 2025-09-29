import Link from "next/link";
import BlogSidebar from "../blog-sidebar";
import "./style.css";
import VideoModal from "../modal-video";

const BlogList = () => {
  return (
    <section className="wpo-blog-pg-section section-padding">
      <div className="container">
        <div className="row">
          <div className="col col-lg-8 col-12">
            <div className="wpo-wpo-blog-content">
              <div className="post format-standard-image">
                <div className="entry-media">
                  <img src={"/images/blog/img-1.jpg"} alt="" />
                </div>
                <ul className="entry-meta">
                  <li>
                    <Link href="/blog-details">
                      <img src={"/images/blog/admin.jpg"} alt="" /> By Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-calendar"></i> Sep 25,2020
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-heart"></i> 35
                    </Link>
                  </li>
                </ul>
                <h3>
                  <Link href="/blog-details">
                    Help the helpless who need you.
                  </Link>
                </h3>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed href using &apos;Content
                  here, content here&apos;, making it look like readable English.{" "}
                </p>
                <Link href="/blog-details" className="read-more">
                  Read More...
                </Link>
              </div>
              <div className="post format-video">
                <div className="entry-media video-holder">
                  <img src={"/images/blog/img-2.jpg"} alt="" />
                  <div className="video-btn2">
                    <VideoModal />
                  </div>
                </div>
                <ul className="entry-meta">
                  <li>
                    <Link href="/blog-details">
                      <img src={"/images/blog/img-4.jpg"} alt="" /> By Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-calendar"></i> Sep 25,2020
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-heart"></i> 35
                    </Link>
                  </li>
                </ul>
                <h3>
                  <Link href="/blog-details">
                    They are waiting for your help.
                  </Link>
                </h3>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed href using &apos;Content
                  here, content here&apos;, making it look like readable English.{" "}
                </p>
                <Link href="/blog-details" className="read-more">
                  Read More...
                </Link>
              </div>
              <div className="post format-standard-image">
                <div className="entry-media">
                  <img src={"/images/blog/img-3.jpg"} alt="" />
                </div>
                <ul className="entry-meta">
                  <li>
                    <Link href="/blog-details">
                      <img src={"/images/blog/img-4.jpg"} alt="" /> By Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-calendar"></i> Sep 25,2020
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-heart"></i> 35
                    </Link>
                  </li>
                </ul>
                <h3>
                  <Link href="/blog-details">
                    Help the helpless who need you.
                  </Link>
                </h3>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed href using &apos;Content
                  here, content here&apos;, making it look like readable English.{" "}
                </p>
                <Link href="/blog-details" className="read-more">
                  Read More...
                </Link>
              </div>

              <div className="post format-quote">
                <ul className="entry-meta">
                  <li>
                    <Link href="/blog-details">
                      <img src={"/images/blog/img-4.jpg"} alt="" /> By Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-calendar"></i> Sep 25,2020
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog-details">
                      <i className="ti-heart"></i> 35
                    </Link>
                  </li>
                </ul>
                <h3>
                  <Link href="/blog-details">
                    They are waiting for your help.
                  </Link>
                </h3>
                <p>
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less
                  normal distribution of letters, as opposed href using &apos;Content
                  here, content here&apos;, making it look like readable English.{" "}
                </p>
              </div>
              <div className="pagination-wrapper pagination-wrapper-left">
                <ul className="pg-pagination">
                  <li>
                    <Link href="/blog-details" aria-label="Previous">
                      <i className="fi ti-angle-left"></i>
                    </Link>
                  </li>
                  <li className="active">
                    <Link href="/blog-details">1</Link>
                  </li>
                  <li>
                    <Link href="/blog-details">2</Link>
                  </li>
                  <li>
                    <Link href="/blog-details">3</Link>
                  </li>
                  <li>
                    <Link href="/blog-details">4</Link>
                  </li>
                  <li>
                    <Link href="/blog-details" aria-label="Next">
                      <i className="fi ti-angle-right"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
};

export default BlogList;

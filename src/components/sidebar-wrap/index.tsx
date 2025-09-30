import Link from "next/link";
import '../blog-sidebar/style.css'
const SidebarWrap = () => {
  return (
    <div className="col col-lg-4 col-12">
      <div className="wpo-blog-sidebar">
      <div className="widget tag-widget">
          <h3>Tags</h3>
          <ul>
            <li>
              <Link href="/blog-details">Donations</Link>
            </li>
            <li>
              <Link href="/blog-details">Charity</Link>
            </li>
            <li>
              <Link href="/blog-details">Help</Link>
            </li>
            <li>
              <Link href="/blog-details">Non Profit</Link>
            </li>
            <li>
              <Link href="/blog-details">Poor People</Link>
            </li>
            <li>
              <Link href="/blog-details">Helping Hand</Link>
            </li>
            <li>
              <Link href="/blog-details">Video</Link>
            </li>
          </ul>
        </div>
        <div className="widget recent-post-widget">
          <h3>Recent posts</h3>
          <div className="posts">
            <div className="post">
              <div className="img-holder">
                <img src={"/images/recent-posts/img-1.jpg"} alt="" />
              </div>
              <div className="details">
                <h4>
                  <Link href="/blog-details">
                    Many Children are suffering a lot for food.
                  </Link>
                </h4>
                <span className="date">22 Sep 2020</span>
              </div>
            </div>
            <div className="post">
              <div className="img-holder">
                <img src={"/images/recent-posts/img-2.jpg"} alt="" />
              </div>
              <div className="details">
                <h4>
                  <Link href="/blog-details">
                    Be kind for the poor people and the kids.
                  </Link>
                </h4>
                <span className="date">22 Sep 2020</span>
              </div>
            </div>
            <div className="post">
              <div className="img-holder">
                <img src={"/images/recent-posts/img-3.jpg"} alt="" />
              </div>
              <div className="details">
                <h4>
                  <Link href="/blog-details">
                    Be soft and kind for the poor people.
                  </Link>
                </h4>
                <span className="date">22 Sep 2020</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarWrap;

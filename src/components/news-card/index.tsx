import Link from "next/link";
import ThumbText from "../thumb-text";
import "./style.scss";
export interface NewsCardProps {
  cover?: string;
  title?: string;
  timeStart?: string;
  timeEnd?: string;
  location?: string;
  desc?: string;
  tip?: string;
  path?: string;
  index?: number;
}

const NewsCard = ({
  cover,
  index = 0,
  title,
  timeStart,
  timeEnd,
  location,
  desc,
  tip,
  path = "#",
}: NewsCardProps) => {
  return (
    <div className="col-lg-4 col-md-6 col-sm-12 col-12 custom-grid">
      <div className="wpo-event-item">
        <div className="wpo-event-img">
          <div className="card-cover-container">
            <img src={cover} alt="" />
          </div>
          <ThumbText
            className={
              (index + 1) % 3 === 1 ? "" : "thumb-text-" + ((index + 1) % 3)
            }
            month="NOV"
            date="25"
          ></ThumbText>
        </div>
        <div className="wpo-event-text">
          <h2>{title}</h2>
          <ul>
            <li>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              {timeStart} - {timeEnd}
            </li>
            <li>
              <i className="fi flaticon-pin"></i>
              {location}
            </li>
          </ul>
          <p>{desc}</p>
          <Link href={path}>{tip}</Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;

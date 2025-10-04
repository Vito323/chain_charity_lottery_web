import "@/components/event/style.css";
import NewsCard, { NewsCardProps } from "@/components/news-card";

const MOCK_DATAS = [
  {
    cover: "/images/event/img-1.jpg",
    title: "Education for All Children",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
  {
    cover: "/images/event/img-2.jpg",
    title: "Food for All Everyone",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
  {
    cover: "/images/event/img-3.jpg",
    title: "Free Treatment",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
  {
    cover: "/images/event/img-4.jpg",
    title: "Education for All Children",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
  {
    cover: "/images/event/img-5.jpg",
    title: "Food for All Everyone",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
  {
    cover: "/images/event/img-6.jpg",
    title: "Free Treatment",
    timeStart: "8.00",
    timeEnd: "5.00",
    location: "Newyork City",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    tip: "Learn More...",
    path: "/event-details",
  },
] as NewsCardProps[];

const EventSection2 = () => {
  return (
    <div className="wpo-event-area wpo-event-area2 section-padding">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="wpo-section-title">
              <span>Our Events</span>
              <h2>Upcoming Events</h2>
            </div>
          </div>
        </div>
        <div className="row">
          {MOCK_DATAS.map((item, _i) => (
            <NewsCard key={_i} index={_i} {...item}></NewsCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSection2;

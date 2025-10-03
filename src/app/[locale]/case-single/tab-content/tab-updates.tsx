import React from 'react';
import './style.css';

interface UpdateItem {
  id: number;
  date: {
    day: string;
    month: string;
    year: string;
  };
  title: string;
  greeting: string;
  content: string[];
  emojis?: string[];
}

const TabUpdates = () => {
  const updates: UpdateItem[] = [
    {
      id: 1,
      date: {
        day: "5",
        month: "5月",
        year: "2023"
      },
      title: "Building QF",
      greeting: "Hey Givers!",
      content: [
        "We're excited to announce that we have started building a quadratic funding integration on Giveth.io! We'll be launching our MVP later this year which will empower verified projects to run campaigns to raise funds in a 2-week round, and we'll distribute additional matching funds via QF.",
        "Designs are already in the works, and we're seeking partners who want to fund our 1st QF matching pool. Any and all donations to this project are greatly appreciated, and if you know of any big donors who might want to contribute, feel free to reach out to @laurenluz on telegram!"
      ],
      emojis: ["🙌", "💰"]
    },
    {
      id: 2,
      date: {
        day: "24",
        month: "1月",
        year: "2023"
      },
      title: "Investigating QF with Gitcoin!",
      greeting: "Hey Givers!",
      content: [
        "We're exploring the potential of quadratic funding through our partnership with Gitcoin. This innovative approach to funding public goods could revolutionize how we support meaningful projects in our community."
      ]
    }
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="wpo-case-content">
          <div className="updates-container">
            {updates.map((update) => (
              <div key={update.id} className="update-item">
                <div className="update-date">
                  <div className="date-day">{update.date.day}</div>
                  <div className="date-month">{update.date.month}</div>
                  <div className="date-year">{update.date.year}</div>
                  <div className="date-line"></div>
                </div>
                <div className="update-content">
                  <h2 className="update-title">{update.title}</h2>
                  <p className="update-greeting">{update.greeting}</p>
                  {update.content.map((paragraph, index) => (
                    <p key={index} className="update-paragraph">
                      {paragraph}
                      {index === update.content.length - 1 && update.emojis && (
                        <span className="update-emojis">
                          {update.emojis.map((emoji, emojiIndex) => (
                            <span key={emojiIndex} className="emoji">{emoji}</span>
                          ))}
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabUpdates;

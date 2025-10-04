import MarkdownRenderer from "@/components/markdown-renderer";
import "@/components/markdown-renderer/case-bb-styles.scss";

interface TabAboutProps {
  markdownContent?: string;
  title?: string;
}

const TabAbout = ({ markdownContent = '', title = '' }: TabAboutProps) => {
 
  return (
    <div className="row">
      <div className="col-12">
        <div className="wpo-case-content">
          <div className="wpo-case-text-top">
            <h2>{title}</h2>
            <div className="progress-section">
              <div className="process">
                <div className="progress">
                  <div className="progress-bar">
                    <div className="progress-value">
                      <span>65.5</span>%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul>
              <li>
                <span>Raised:</span> $7,000.00
              </li>
              <li>
                <span>Goal:</span> $8,000.00
              </li>
              <li>
                <span>Donar:</span> 380
              </li>
            </ul>
            <div className="case-bb-text">
              <MarkdownRenderer 
                content={markdownContent}
                className="case-bb-markdown"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabAbout;

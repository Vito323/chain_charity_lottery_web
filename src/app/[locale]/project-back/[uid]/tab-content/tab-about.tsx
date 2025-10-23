import MarkdownRenderer from "@/components/markdown-renderer";
import "@/components/markdown-renderer/case-bb-styles.scss";
import { ProjectDetailData } from "@/service/project";
import { formatCurrency } from "@/utils/currency";

interface TabAboutProps {
  projectInfo?: ProjectDetailData;
}

const TabAbout = ({ projectInfo }: TabAboutProps) => {


  const progress = projectInfo?.goal ? ((projectInfo?.totalDonated || 0) / projectInfo?.goal) * 100 : 0;
 
  return (
    <div className="row">
      <div className="col-12">
        <div className="wpo-case-content">
          <div className="wpo-case-text-top">
            <h2>{projectInfo?.name}</h2>
            <div className="progress-section">
              <div className="process">
                <div className="progress">
                  <div className="progress-bar" style={{width: `${progress}%`}}>
                    <div className="progress-value">
                      <span>{progress}</span>%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul>
              <li>
                <span>Raised:</span> {formatCurrency(projectInfo?.totalDonated || 0)}
              </li>
              <li>
                <span>Goal:</span> {formatCurrency(projectInfo?.goal || 0)}
              </li>
              <li>
                <span>Donar:</span> {projectInfo?.donationCount}
              </li>
            </ul>
            <div className="case-bb-text">
              <MarkdownRenderer 
                content={projectInfo?.content || ''}
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

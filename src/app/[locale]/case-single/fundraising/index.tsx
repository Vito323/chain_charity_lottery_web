import React from "react";
import "./style.css";

interface FundraisingProps {
  totalRaised?: string;
  contributors?: number;
  onDonate?: () => void;
}

const Fundraising: React.FC<FundraisingProps> = ({
  totalRaised = "$0.00",
  contributors = 0,
  onDonate,
}) => {
  return (
    <div className="fundraising-card">
      {/* 筹款摘要部分 */}
      <div>
        <div className="fundraising-summary">
          <div className="fundraising-label">Total amount raised</div>
          <div className="fundraising-amount">{totalRaised}</div>
          <div className="fundraising-contributors">
            Raised from <strong>{contributors.toLocaleString()}</strong>{" "}
            contributors
          </div>
        </div>

        {/* 政策信息部分 */}
        <div className="fundraising-policy">
          <div className="policy-headline">
            100% goes to the project always.
          </div>
          <div className="policy-description">
            Every donation is peer-to-peer, with no fees and no middlemen.
          </div>
          <a href="#" className="policy-link">
            Learn about our zero-fee policy <i className="ti-angle-right"></i>
          </a>
        </div>
      </div>

      {/* 操作按钮部分 */}
      <div className="fundraising-actions">
        <button className="donate-btn theme-btn" onClick={onDonate}>
          Donate
        </button>
      </div>
    </div>
  );
};

export default Fundraising;

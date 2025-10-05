import React, { useState } from "react";
import "./style.css";
import { ProjectChainInfo } from "@/components/case-cards";

interface Donation {
  id: number;
  donatedAt: string;
  donor: string;
  network: {
    name: string;
    icon: string;
    color: string;
  };
  amount: string;
  usdValue: string;
  isHighlighted?: boolean;
}

interface NetworkAddress {
  name: string;
  address: string;
  icon: string;
  color: string;
}

const DonationList = ({
  currentProjectInfo,
}: {
  currentProjectInfo: ProjectChainInfo | null;
}) => {
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const donations: Donation[] = [];

  const networkAddresses: NetworkAddress[] = [
    {
      name: "Polygon",
      address: currentProjectInfo?.beneficiary || "",
      icon: "fa-circle",
      color: "#8247E5",
    },
  ];


  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return "fa-sort";
    return sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down";
  };

  return (
    <div className="container-fluid px-0">
      <div className="wpo-case-content">
        <div className="row g-0">
          <div className="col-12 col-lg-8">
            <div className="donation-table-container">
              {/* <div className="donation-header">
                <div className="filter-dropdown">
                  <select>
                    <option>Showing all donations</option>
                    <option>This month</option>
                    <option>Last 3 months</option>
                    <option>This year</option>
                  </select>
                </div>
              </div> */}

              <div className="table-responsive donation-table-wrapper">
                <table className="table donation-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("donatedAt")}>
                        Donated at{" "}
                        <i className={`fa ${getSortIcon("donatedAt")}`}></i>
                      </th>
                      <th onClick={() => handleSort("donor")}>
                        Donor <i className={`fa ${getSortIcon("donor")}`}></i>
                      </th>
                      <th onClick={() => handleSort("network")}>
                        Network{" "}
                        <i className={`fa ${getSortIcon("network")}`}></i>
                      </th>
                      <th onClick={() => handleSort("amount")}>
                        Amount <i className={`fa ${getSortIcon("amount")}`}></i>
                      </th>
                      <th onClick={() => handleSort("usdValue")}>
                        USD Value{" "}
                        <i className={`fa ${getSortIcon("usdValue")}`}></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.length > 0 ? (
                      donations.map((donation) => (
                        <tr
                          key={donation.id}
                          className={donation.isHighlighted ? "highlighted" : ""}
                        >
                          <td>{donation.donatedAt}</td>
                          <td>{donation.donor}</td>
                          <td>
                            <div className="network-cell">
                              <i
                                className={`fa ${donation.network.icon} network-icon`}
                                style={{ color: donation.network.color }}
                              ></i>
                              {donation.network.name}
                            </div>
                          </td>
                          <td>
                            <div className="amount-cell">
                              {donation.amount}
                              <span className="external-link">
                                <i className="fa fa-external-link"></i>
                              </span>
                            </div>
                          </td>
                          <td>{donation.usdValue}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="empty-state-row">
                        <td colSpan={5} className="empty-state-cell">
                          <div className="empty-state">
                            <div className="empty-state-icon">
                              <i className="fa fa-heart"></i>
                            </div>
                            <h3 className="empty-state-title">No Donations Yet</h3>
                            <p className="empty-state-description">
                              No one has donated to this project yet. Be the first supporter!
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {donations.length > 0 && (
                <div className="pagination">
                  <button className="pagination-btn">Prev</button>
                  <div className="pagination-numbers">
                    <span className="page-number active">1</span>
                    {/* <span className="page-number">2</span>
                    <span className="page-number">3</span>
                    <span className="page-dots">...</span>
                    <span className="page-number">12</span>
                    <span className="page-number">413</span> */}
                  </div>
                  <button className="pagination-btn">Next</button>
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="donation-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">All time donations received</h3>
                <h2 className="sidebar-main-title">Be the first to give!</h2>
                <h4 className="sidebar-subtitle">Project recipient address</h4>

                <div className="address-list">
                  {networkAddresses.map((network, index) => (
                    <div key={index} className="address-item">
                      <div className="address-info">
                        <i
                          className={`fa ${network.icon} address-icon`}
                          style={{ color: network.color }}
                        ></i>
                        <div className="address-details">
                          <div className="network-name">{network.name}</div>
                          <div className="address-text">{network.address}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationList;

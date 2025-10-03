
import React, { useState } from 'react';
import './style.css';

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

const DonationList = () => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const donations: Donation[] = [
    {
      id: 1,
      donatedAt: "Aug 1, 2023",
      donor: "Octant",
      network: { name: "Ethereum", icon: "fa-ethereum", color: "#627EEA" },
      amount: "67.59 ETH",
      usdValue: "$125,453.3"
    },
    {
      id: 2,
      donatedAt: "Feb 19, 2025",
      donor: "ENS",
      network: { name: "OP Mainnet", icon: "fa-circle", color: "#FF0420" },
      amount: "46,500 USDC",
      usdValue: "$46,494.89"
    },
    {
      id: 3,
      donatedAt: "Jul 5, 2024",
      donor: "Public Nouns DAO",
      network: { name: "Ethereum", icon: "fa-ethereum", color: "#627EEA" },
      amount: "5 ETH",
      usdValue: "$14,910",
      isHighlighted: true
    },
    {
      id: 4,
      donatedAt: "Mar 15, 2024",
      donor: "Oxda04...4d41",
      network: { name: "Arbitrum One", icon: "fa-shield", color: "#2D374B" },
      amount: "15,000 USDC",
      usdValue: "$15,000"
    },
    {
      id: 5,
      donatedAt: "Jan 8, 2024",
      donor: "Gains Network | gTrade",
      network: { name: "Celo", icon: "fa-circle", color: "#35D07F" },
      amount: "10,000 cUSD",
      usdValue: "$11,154.7"
    },
    {
      id: 6,
      donatedAt: "Dec 20, 2023",
      donor: "Jon Ruth",
      network: { name: "Ethereum", icon: "fa-ethereum", color: "#627EEA" },
      amount: "10,000 USDGLO",
      usdValue: "$10,000"
    },
    {
      id: 7,
      donatedAt: "Nov 12, 2023",
      donor: "CELO",
      network: { name: "Celo", icon: "fa-circle", color: "#35D07F" },
      amount: "8,500 cUSD",
      usdValue: "$9,458.4"
    }
  ];

  const networkAddresses: NetworkAddress[] = [
    { name: "Ethereum", address: "0x1234...5678", icon: "fa-ethereum", color: "#627EEA" },
    { name: "Optimism", address: "0xabcd...efgh", icon: "fa-circle", color: "#FF0420" },
    { name: "Arbitrum", address: "0x9876...5432", icon: "fa-shield", color: "#2D374B" },
    { name: "Celo", address: "0x1111...2222", icon: "fa-circle", color: "#35D07F" },
    { name: "Polygon", address: "0x3333...4444", icon: "fa-circle", color: "#8247E5" },
    { name: "Base", address: "0x5555...6666", icon: "fa-circle", color: "#0052FF" }
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return 'fa-sort';
    return sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
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
                      <th onClick={() => handleSort('donatedAt')}>
                        Donated at <i className={`fa ${getSortIcon('donatedAt')}`}></i>
                      </th>
                      <th onClick={() => handleSort('donor')}>
                        Donor <i className={`fa ${getSortIcon('donor')}`}></i>
                      </th>
                      <th onClick={() => handleSort('network')}>
                        Network <i className={`fa ${getSortIcon('network')}`}></i>
                      </th>
                      <th onClick={() => handleSort('amount')}>
                        Amount <i className={`fa ${getSortIcon('amount')}`}></i>
                      </th>
                      <th onClick={() => handleSort('usdValue')}>
                        USD Value <i className={`fa ${getSortIcon('usdValue')}`}></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((donation) => (
                      <tr 
                        key={donation.id} 
                        className={donation.isHighlighted ? 'highlighted' : ''}
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
                            <span className="external-link"><i className="fa fa-external-link"></i></span>
                          </div>
                        </td>
                        <td>{donation.usdValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="pagination">
                <button className="pagination-btn">Prev</button>
                <div className="pagination-numbers">
                  <span className="page-number active">1</span>
                  <span className="page-number">2</span>
                  <span className="page-number">3</span>
                  <span className="page-dots">...</span>
                  <span className="page-number">12</span>
                  <span className="page-number">413</span>
                </div>
                <button className="pagination-btn">Next</button>
              </div>
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
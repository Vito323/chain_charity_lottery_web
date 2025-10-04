"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import Image from "next/image";
import HeaderTopBar from "../header-top-bar";
import MobileMenu from "../mobile-menu";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const ROUTE_MAP = [
  {
    label: "Home",
    path: "/",
  },
  // {
  //   label: "About",
  //   path: "/about",
  // },
  {
    label: "Projects",
    path: "/project",
  },
  // {
  //   label: "Event",
  //   path: "/event",
  // },
  // {
  //   label: "Pages",
  //   path: "#",
  //   children: [
  //     {
  //       label: "About",
  //       path: "/about",
  //     },
  //     {
  //       label: "Donate",
  //       path: "/donate",
  //     },
  //     {
  //       label: "Volunteer",
  //       path: "/volunteer",
  //     },
  //     {
  //       label: "Error 404",
  //       path: "/404",
  //     },
  //   ],
  // },
  // {
  //   label: "News",
  //   path: "/news",
  // },
  // {
  //   label: "Contact",
  //   path: "/contact",
  // },
];

const Header = () => {
  const pathname = usePathname();
  return (
    <div className="middle-header header-style-3">
      <HeaderTopBar />
      <div className="container">
        <div className="header-content">
          <div className="row">
            <div className="col-lg-3 col-12">
              <div className="logo">
                <Link href="/" title="">
                  <div className="logo-container">
                    <Image
                      src={"https://placehold.co/150x150"}
                      width={50}
                      height={50}
                      unoptimized
                      alt=""
                    />
                    <div>
                      <h4 className="logo-name">ChainCharity</h4>
                      <p className="logo-desc">Lottery</p>
                    </div>
                  </div>
                  {/* <img src={Logo} alt="" /> */}
                </Link>
              </div>
            </div>
            <div className="col-lg-8 d-lg-block d-none">
              <nav>
                <ul>
                  {ROUTE_MAP.map((item, _i) => (
                    <li key={_i}>
                      <Link
                        className={`${item.path === pathname ? "active" : ""}`}
                        href={item.path}
                        title=""
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <ul>
                          {item.children.map((pie, _ii) => (
                            <li key={`${_i}_${_ii}`}>
                              <Link href={pie.path} title="">
                                {pie.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="col-lg-1 col-md-6 col-sm-6 col-6">
              {/* <div className="contact">
                <div className="cart-search-contact">
                  <div className="header-search-form-wrapper">
                    <button className="search-toggle-btn">
                      <i className="fi flaticon-magnifying-glass"></i>
                    </button>
                    <div className="header-search-form">
                      <form >
                        <div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search here..."
                          />
                          <button type="submit">
                            <i className="ti-search"></i>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="mini-cart">
                    <button className="cart-toggle-btn">
                      <i className="fi flaticon-shopping-bag"></i>{" "}
                      <span className="cart-count">02</span>
                    </button>
                    <div className="mini-cart-content">
                      <div className="mini-cart-items">
                        <div className="mini-cart-item clearfix">
                          <div className="mini-cart-item-image">
                          </div>
                          <div className="mini-cart-item-des">
                            <Link href="/home">Hoodi with zipper</Link>
                            <span className="mini-cart-item-price">$20.15</span>
                            <span className="mini-cart-item-quantity">x 1</span>
                          </div>
                        </div>
                        <div className="mini-cart-item clearfix">
                          <div className="mini-cart-item-image">
                          </div>
                          <div className="mini-cart-item-des">
                            <Link href="/home">Ninja T-shirt</Link>
                            <span className="mini-cart-item-price">$13.25</span>
                            <span className="mini-cart-item-quantity">x 2</span>
                          </div>
                        </div>
                      </div>
                      <div className="mini-cart-action clearfix">
                        <span className="mini-checkout-price">$215.14</span>
                        <Link href="/home" className="view-cart-btn theme-btn">
                          View Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <div className="col-md-2 col-sm-2 col-2">
              <MobileMenu />
            </div>
          </div>
          <div className="clearfix"></div>
        </div>
      </div>
    </div>
  );
};

export default Header;

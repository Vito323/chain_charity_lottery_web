import React from "react";
import "./style.css";
import Link from "next/link";

const PageTitle = (props: {
  pagesub?: string;
  pageTitle?: string;
  pagePrevs?: {label: string; href: string}[];
}) => {
  return (
    <div className="wpo-breadcumb-area">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="wpo-breadcumb-wrap">
              <h2>{props.pageTitle}</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                {props?.pagePrevs?.map((prev) => (
                  <li key={prev.label}>
                    <Link href={prev.href}>{decodeURIComponent(prev.label)}</Link>
                  </li>
                ))}
                <li>
                  <span>{props.pagesub}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;

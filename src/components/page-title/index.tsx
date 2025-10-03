import React from 'react'
import './style.css'
import Link from 'next/link';

const PageTitle = (props: {pagesub?: string; pageTitle?: string, pagePrev?: string}) => {
    return(
        <div className="wpo-breadcumb-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-breadcumb-wrap">
                            <h2>{props.pageTitle}</h2>
                            <ul>
                                <li><Link href="/">Home</Link></li>
                                {props.pagePrev && <li><Link href={props.pagePrev.toLowerCase()}>{props.pagePrev}</Link></li>}
                                <li><span>{props.pagesub}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageTitle;
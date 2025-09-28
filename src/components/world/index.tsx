"use client"
import Link from 'next/link'
import './style.css'



const WorldSection = (props: {worldclass?: string}) => {

    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }
    return(
        <div className={`wpo-world-area ${props.worldclass}`}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="wpo-world-section">
                            <h2>Lets Chenge The World With Humanity</h2>
                            <Link onClick={ClickHandler} href="/Volunteer"><img src={'/images/team/1.png'} alt=""/>   Become A Volunteer</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorldSection;
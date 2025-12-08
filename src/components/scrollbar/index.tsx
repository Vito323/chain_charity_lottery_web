"use client"
import AnchorLink from 'react-anchor-link-smooth-scroll'

const Scrollbar = () => {

    return(
        <div className="col-lg-12">
            <div className="header-menu">
                <ul className="fixed bottom-6 md:bottom-4 right-7 md:right-4 list-none z-[99]">
                    <li>
                        <AnchorLink 
                            href='#scrool'
                            className="bg-[rgba(8,204,127,0.7)] hover:bg-[#08cc7f] w-11 h-11 md:w-8 md:h-8 leading-[40px] md:leading-[25px] border-2 border-[#08cc7f] rounded-full block text-center text-white transition-colors duration-200"
                        >
                            <i className="fa fa-arrow-up"></i>
                        </AnchorLink>
                    </li>
                </ul>
            </div>
        </div>
        
    )
}

export default Scrollbar;

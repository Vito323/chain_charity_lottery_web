"use client";
import React from "react";
import { Collapse, CardBody, Card } from "react-bootstrap";
import Link from "next/link";
import "./style.css";

const menus = [
  {
    id: 1,
    title: "Home",
    link: "/home",
  },

  {
    id: 2,
    title: "About",
    link: "/about",
  },

  {
    id: 3,
    title: "Causes",
    link: "/case",
  },
  {
    id: 4,
    title: "Event",
    link: "/event",
  },
  {
    id: 7,
    title: "Pages",
    link: "/",
    submenu: [
      {
        id: 71,
        title: "About",
        link: "/about",
      },
      {
        id: 75,
        title: "Donate",
        link: "/donate",
      },
      {
        id: 76,
        title: "Volunteer",
        link: "/volunteer",
      },

      {
        id: 79,
        title: "Error 404",
        link: "/404",
      },
    ],
  },

  {
    id: 5,
    title: "News",
    link: "/news",
  },
  {
    id: 88,
    title: "Contact",
    link: "/contact",
  },
];

const MobileMenu = () => {
  const [isMenuShow, setIsMenuShow] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(0);

  const menuHandler = () => {
    setIsMenuShow(!isMenuShow);
  };

  const onHandleOpen = (id: number) => {
    setIsOpen(id === isOpen ? 0 : id);
  };

  return (
    <div>
      <div className={`mobileMenu ${isMenuShow ? "show" : ""}`}>
        {/* <div className="clox" onClick={this.menuHandler}>Close Me</div> */}
        <ul className="responsivemenu">
          {menus.map((item) => {
            return (
              <li key={item.id}>
                {item.submenu ? (
                  <p onClick={() => {
                    onHandleOpen(item.id)
                  }}>
                    {item.title}
                    {item.submenu ? (
                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                    ) : (
                      ""
                    )}
                  </p>
                ) : (
                  <Link href={item.link}>{item.title}</Link>
                )}
                {item.submenu ? (
                  <Collapse in={item.id === isOpen}>
                    <Card>
                      <CardBody>
                        <ul>
                          {item.submenu.map((submenu) => (
                            <li key={submenu.id}>
                              <Link className="active" href={submenu.link}>
                                {submenu.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </Collapse>
                ) : (
                  ""
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="showmenu" onClick={menuHandler}>
        <i className="fa fa-bars" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default MobileMenu;

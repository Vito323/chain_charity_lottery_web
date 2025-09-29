import Link from "next/link";
import "./style.scss";
import Image from "next/image";
import { Dropdown } from "react-bootstrap";
import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { LNG_LIST } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useParams, usePathname } from "next/navigation";
const HeaderTopBar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();
  const [, startTransition] = useTransition();

  const currentLocale = useLocale();

//   console.log(currentLocale, "ll");

  const changeLng = (lng: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname: pathName, params },
        { locale: lng }
      );
      router.refresh();
    });
  };

  return (
    <div className="topbar">
      <div className="container">
        <div className="row">
          <div className="col col-6">
            <Dropdown>
              <Dropdown.Toggle variant="light" className="toggle-btn">
                <div className="contact-intro">
                  <Image
                    src="/icons/global.png"
                    width={26}
                    height={26}
                    alt=""
                  ></Image>
                  <span>{currentLocale}</span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changeLng("en");
                  }}
                >
                  English
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    changeLng("zh");
                  }}
                >
                  简体中文
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="col col-6">
            <div className="contact-info">
              <Link className="theme-btn" href="/donate">
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTopBar;

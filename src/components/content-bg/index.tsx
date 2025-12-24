import Image from "next/image";

const ContentBg = () => {
  return (
    <>
      <Image src="/assets/images/top-left.svg" alt="top-left" width={1183} height={1173} className="absolute top-[1%] left-[-26%]" />
      <Image src="/assets/images/bottom-right.svg" alt="bottom-right" width={1183} height={1173} className="absolute bottom-[-20%] right-[-26%]" />
    </>
  );
};

export default ContentBg;
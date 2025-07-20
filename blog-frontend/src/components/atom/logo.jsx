import Image from "next/image";

import LogoLight from "../../../public/logo/logo.webp";
import LogoDark from "../../../public/logo/logo.webp";
import { cn } from "../../utils/cn";

const Logo = ({ size, className }) => {
  return (
    <>
      {" "}
      <Image
        className={cn(
          "navbar-logo rotate-0 scale-100 rounded-md transition-all dark:-rotate-90 dark:scale-0",
        )}
        src={LogoLight}
        alt="logo"
        width={size}
        height={size}
      />
      <Image
        className={cn(
          "navbar-logo absolute rotate-90 scale-0 rounded-md transition-all dark:rotate-0 dark:scale-100",
        )}
        src={LogoDark}
        alt="logo"
        width={size}
        height={size}
      />
    </>
  );
};

export default Logo;

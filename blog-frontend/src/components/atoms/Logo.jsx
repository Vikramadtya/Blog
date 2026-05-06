import Image from "next/image";

import LogoImage from "../../../public/logo/logo.webp";
import { cn } from "../../utils/cn";

const Logo = ({ size, className }) => {
  return (
    <Image
      className={cn("navbar-logo rounded-md transition-all", className)}
      src={LogoImage}
      alt="logo"
      width={size}
      height={size}
    />
  );
};

export default Logo;

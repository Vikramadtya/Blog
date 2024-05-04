import CustomLink from "../atom/customLink";
import Icon from "../atom/icon";

const InDevelopment = () => {
  return (
    <>
      <div className="flex flex-col items-center md:flex-row">
        <Icon kind="me" className={"h-44 w-44"} />
        <div className="pl-10">
          <h1 className="text-5xl font-bold ">Uh oh...</h1>
          <p className="flex items-center pt-5 ">
            <span>The site is still under development !</span>
            <span className="pl-2">
              <Icon kind="wrenchAndHammer" className={"h-5 w-5"} />
            </span>
          </p>
          <span>the requested page is not available</span>

          <CustomLink
            href="/"
            className="flex items-center pb-1 pt-1 hover:underline"
          >
            Take me
            <span className="pl-2">
              <Icon kind="home" className={"h-24 w-24"} />
            </span>
          </CustomLink>
        </div>
      </div>
    </>
  );
};

export default InDevelopment;

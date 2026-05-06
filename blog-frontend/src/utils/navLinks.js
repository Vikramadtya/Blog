import { siteMetadata } from "../../site.config";
import nav from "../../config/nav.json";

const injectPortfolioLink = (links) =>
  links.map((link) => ({
    ...link,
    href: link.href === "PORTFOLIO_LINK" ? siteMetadata.portfolioLink : link.href,
  }));

export const navLinks = injectPortfolioLink(nav.main);
export const dropDownMenuNavLinks = injectPortfolioLink(nav.dropdown);

import Head from "next/head";
import React, { useState } from "react";
import CatalogPageInput from "../../components/catalogPageInput";
import CatalogPageNavigation, { CatalogMobileSearchOptions } from "../../components/catalogPageNavigation";
import CatalogPageResults from "../../components/catalogPageResults";
import CatalogPageStore from "../../stores/catalogPage";

const CatalogPage = () => {
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);

  return (
    <CatalogPageStore.Provider>
      <Head>
        <meta name="description" content="Browse the Roblox catalog." />
      </Head>

      <div className="catalog-standalone rbx-body light-theme gotham-font">
        <div className="container-main full-screen touch catalog-shell">
          <div className="content">
            <div className="catalog-container">
              <div id="catalog-container">
                <div className="catalog-page">
                  <div
                    id="catalog-content"
                    className="clearfix catalog-content catalog-full-screen"
                  >
                    <div id="main-view">
                      <div className="search-bars">
                        <h1 className="heading">
                          <a href="/catalog">Catalog</a>
                        </h1>
                        <a className="btn-growth-md buy-robux" href="/upgrades/robux?ctx=catalogNew">
                          Buy Robux
                        </a>
                        <CatalogPageInput onOpenMobileOptions={setMobileOptionsOpen} />
                      </div>

                      <CatalogPageResults />
                      <CatalogMobileSearchOptions
                        open={mobileOptionsOpen}
                        onClose={() => setMobileOptionsOpen(false)}
                      />
                    </div>

                    <CatalogPageNavigation />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="footer">
          <ul className="row footer-links">
            {[
              ["About Us", "/info/about-us"],
              ["Jobs", "/info/jobs"],
              ["Blog", "/info/blog"],
              ["Parents", "/info/parents"],
              ["Help", "/info/help"],
              ["Terms", "/info/terms"],
              ["Privacy", "/info/privacy"],
            ].map(([label, href]) => (
              <li className="footer-link" key={label}>
                <a className="text-footer-nav" href={href}>{label}</a>
              </li>
            ))}
          </ul>
          <div className="row copyright-container">
            <div className="col-sm-6 col-md-3" />
            <div className="col-sm-12">
              <p className="text-footer footer-note">
                ©2020 Roblox Corporation. Roblox, the Roblox logo and Powering Imagination are among our registered and unregistered trademarks in the U.S. and other countries.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </CatalogPageStore.Provider>
  );
};

CatalogPage.getInitialProps = () => ({
  title: "Catalog - ROBLOX",
});

export default CatalogPage;

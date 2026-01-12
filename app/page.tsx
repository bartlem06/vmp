"use client";

import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, CSSProperties, FormEvent, useEffect, useState } from "react";

const ourWork = [
  "VMP provides advisory services in structuring and arranging investment capital.",
  "We are an advisory company (as opposed to agents, intermediaries). We go deep into client’s financing needs, help to understand, refine goals, capital requirements, then structure and arrange capital. We lead negotiations with investors, financiers on behalf of and in the best interest of our clients.",
  "We cover all types of financing from equity to mezzanine to senior debt.",
  "We work globally with focus on Europe.",
  "We do not exclude any sectors, except World Bank’s black list.",
  "We have contacts to and working co-operation with many sources of capital coming from all corners of the world: banking and non-banking debt providers, PE and VC funds, family houses, investment banks, private investors, asset managers, developers, in particular those with focus on renewable energy.",
];

const trackStats = ["20+ years of experience", "30+ countries"];

const fundManagement = [
  "EUR 280m investment management in 14 countries of CEE, equity, mezz, debt capital. Fund was successfully exited with positive returns – see: www.ifu.dk",
  "Co-founded and managed EUR XXm closed-end-fund in Poland to invest in PV energy – fund was exited and closed with positive returns. The fund used to operate as part of a Polish TFI, see: https://www.eitfi.pl/aktualnosci/czyste-zyski-z-zielonej-energii-eques-fotowoltaica-fiz-rozlicza-sie-z-inwestorami-2904 and https://www.eitfi.pl/",
];

const arrangingFinancing = [
  "EUR XXm early stage risk capital for Al-Rajef wind power plant in Jordan, see: https://alcazarenegy.com/alcazar-energys-al-rajef-wind-farm-arwf-achieves-cod/",
  "Arranged EUR XXm in risk capital for water desalination start-up in Italy, see: https://en.solarisaquae.com/",
  "Arranged EUR XXm refinancing for Hungarian animal and plant crop producer DFH Kft, see: https://www.firstfarms.dk/en/",
  "For our track record in cooperation with other advisors see also www.traficonadvisors.eu and www.cratone.com",
];

const networkPartners = [
  {
    prefix: "",
    linkText: "www.traficonadvisors.eu",
    href: "http://www.traficonadvisors.eu",
    suffix: " for Czech Republic, Slovakia, Austria, Germany",
  },
  {
    prefix: "",
    linkText: "www.cratone.com",
    href: "http://cratone.com",
    suffix: " for Turkey, Middle East, Southern Europe, Africa",
  },
  {
    prefix: "For investments in developing countries we have excellent contacts to EDFIs, see: ",
    linkText: "https://www.edfi.eu/",
    href: "https://www.edfi.eu/",
    suffix: "",
  },
  {
    prefix: "",
    linkText: null,
    suffix:
      "We co-operate with a network of senior financial advisors and investment bankers across Europe, including Scandinavia, with access to global financing sources.",
  },
  {
    prefix: "",
    linkText: null,
    suffix:
      "We have access and working cooperation with numerous renewable energy developers, investors, assets managers",
  },
];

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const updateOffset = () => {
      const header = document.querySelector<HTMLElement>(".site-header");
      if (!header) {
        return;
      }
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--sticky-header-offset", `${height}px`);
    };

    const handleResize = () => {
      updateOffset();
      if (window.innerWidth >= 900) {
        setIsNavOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".photo-section.has-image"));
    if (!sections.length) {
      return;
    }

    const imageSizeCache = new Map<string, { width: number; height: number }>();
    let cancelled = false;
    let resizeRaf: number | null = null;

    const parseBackgroundUrl = (section: HTMLElement) => {
      const rawValue =
        section.style.getPropertyValue("--section-bg-url") ||
        getComputedStyle(section).getPropertyValue("--section-bg-url");
      const match = rawValue.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
      return match?.[1] ?? null;
    };

    const loadImageSize = (url: string) =>
      new Promise<{ width: number; height: number } | null>((resolve) => {
        if (imageSizeCache.has(url)) {
          resolve(imageSizeCache.get(url)!);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const size = { width: img.naturalWidth, height: img.naturalHeight };
          imageSizeCache.set(url, size);
          resolve(size);
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });

    const numericFromValue = (value: string | undefined, axis: "width" | "height", section: HTMLElement) => {
      if (!value || value === "auto") return null;
      if (value.endsWith("px")) return parseFloat(value);
      if (value.endsWith("%")) {
        const pct = parseFloat(value) / 100;
        const rect = section.getBoundingClientRect();
        return pct * (axis === "width" ? rect.width : rect.height);
      }
      return null;
    };

    const computeRenderedHeight = (
      section: HTMLElement,
      naturalSize: { width: number; height: number },
      backgroundSize: string,
    ) => {
      const rect = section.getBoundingClientRect();
      const ratio = naturalSize.height / naturalSize.width;
      const sizeParts = backgroundSize.split(/\s+/);

      if (sizeParts.length === 1 && (backgroundSize === "cover" || backgroundSize === "contain")) {
        const widthScale = rect.width / naturalSize.width;
        const heightScale = rect.height / naturalSize.height;
        const scale = backgroundSize === "cover" ? Math.max(widthScale, heightScale) : Math.min(widthScale, heightScale);
        return naturalSize.height * scale;
      }

      const [rawWidth, rawHeight = "auto"] = sizeParts;
      const resolvedWidth = numericFromValue(rawWidth, "width", section);
      const resolvedHeight = numericFromValue(rawHeight, "height", section);

      if (typeof resolvedHeight === "number") return resolvedHeight;
      if (typeof resolvedWidth === "number") return resolvedWidth * ratio;
      return naturalSize.height;
    };

    const evaluateBackgrounds = async () => {
      const photoSections = Array.from(document.querySelectorAll<HTMLElement>(".photo-section.has-image"));

      const results = await Promise.all(
        photoSections.map(async (section) => {
          const url = parseBackgroundUrl(section);
          if (!url) return false;

          const naturalSize = await loadImageSize(url);
          if (!naturalSize) return false;

          const computedStyle = getComputedStyle(section);
          const sizeTokens = computedStyle.backgroundSize.split(",");
          const targetSize = sizeTokens[sizeTokens.length - 1]?.trim();
          if (!targetSize) return false;

          const renderedHeight = computeRenderedHeight(section, naturalSize, targetSize);
          const sectionHeight = section.getBoundingClientRect().height;

          return renderedHeight + 1 < sectionHeight;
        }),
      );

      const shouldDisable = results.some(Boolean);

      if (cancelled) return;
      document.documentElement.classList.toggle("background-images-disabled", shouldDisable);
    };

    const handleResize = () => {
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
      }
      resizeRaf = requestAnimationFrame(evaluateBackgrounds);
    };

    evaluateBackgrounds();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelled = true;
      if (resizeRaf) {
        cancelAnimationFrame(resizeRaf);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Thank you for reaching out. We will come back to you shortly.");
    setFormState({ name: "", email: "", message: "" });
  };

  const handleInput =
    (field: "name" | "email" | "message") =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }));
    };

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link href="/" className="logo-block" aria-label="VMP Partners">
          <Image
            src="https://static.wixstatic.com/media/d1d5a8_08568fcaa5e84997a2cecb529d7d50fa~mv2.png/v1/fill/w_130,h_43,al_c,lg_1,q_85,enc_avif,quality_auto/logo_edited.png"
            alt="Logo firmy VMP"
            width={130}
            height={43}
            priority
          />
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isNavOpen}
          aria-controls="primary-nav"
          onClick={() => setIsNavOpen((open) => !open)}
        >
          <span className="nav-toggle__bar" aria-hidden="true" />
          <span className="nav-toggle__bar" aria-hidden="true" />
          <span className="nav-toggle__bar" aria-hidden="true" />
        </button>
        <nav id="primary-nav" className={`primary-nav ${isNavOpen ? "is-open" : ""}`}
        >
          <a href="#about" onClick={() => setIsNavOpen(false)}>
            About Us
          </a>
          <a href="#services" onClick={() => setIsNavOpen(false)}>
            Services
          </a>
          <a href="#track" onClick={() => setIsNavOpen(false)}>
            Track Record
          </a>
          <a href="#network" onClick={() => setIsNavOpen(false)}>
            Our Network
          </a>
          <a href="#contact" onClick={() => setIsNavOpen(false)}>
            Contact
          </a>
        </nav>
      </header>

      <main>
        <section
          id="about"
          className="hero photo-section"
          style={
            {
              "--section-bg-url":
                'url("https://static.wixstatic.com/media/11062b_45b4e283adc345e1a26711ade25c7908~mv2.jpg")',
            } as CSSProperties
          }
        >
          <div className="section-inner hero-inner">
            <p className="eyebrow">WHO WE ARE</p>
            <h1>VMP is a Polish financing advisory boutique.</h1>
            <p>
              VMP’s owner is Piotr Lemieszek – a Polish financial advisor with over 20 years
              international experience in arranging financing, investment management, business advisory
              services.
            </p>
            <p>
              Piotr’s professional track record includes several years in Arthur Andersen, 13 years fund
              management for IFU (www.ifu.dk) – a European development finance fund, 4 years investment
              management of closed-end-fund investing in PV, 10 years in arranging financing as freelance
              consultant with a global list of clients
            </p>
            <p>Piotr holds Executive MBA (2001) from Warsaw University-University of Illinois and Urbana</p>
          </div>
        </section>

        <section id="services" className="our-work section-with-inner">
          <div className="section-inner">
            <div className="section-heading">
              <h2>SERVICES</h2>
            </div>
            <div className="work-list">
              {ourWork.map((item) => (
                <article className="work-item" key={item}>
                  <span className="work-item__icon" aria-hidden="true">
                    <span>➜</span>
                  </span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="track"
          className="track-record section-with-inner photo-section has-image"
          style={
            {
              "--section-bg-url":
                'url("/wind.png")',
              "--section-bg-size": "100% auto",
              "--section-bg-position": "center top",
            } as CSSProperties
          }
        >
          <div className="section-inner">
            <div className="section-heading">
              <h2>TRACK RECORD</h2>
            </div>
            <div className="track-stats">
              {trackStats.map((stat) => (
                <div className="track-stat" key={stat}>
                  {stat}
                </div>
              ))}
            </div>

            <div className="track-subsection">
              <h3>FUND MANAGEMENT</h3>
              <div className="track-list">
                {fundManagement.map((item) => (
                  <article className="track-item" key={item}>
                    <span className="track-item__icon" aria-hidden="true">
                      <span>➜</span>
                    </span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="track-subsection">
              <h3>ARRANGING FINANCING</h3>
              <div className="track-list">
                {arrangingFinancing.map((item) => (
                  <article className="track-item" key={item}>
                    <span className="track-item__icon" aria-hidden="true">
                      <span>➜</span>
                    </span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="network" className="network section-with-inner">
          <div className="section-inner">
            <div className="section-heading">
              <h2>OUR NETWORK</h2>
            </div>
            <p className="network-intro">
              VMP co-operates with similar consulting and capital sourcing companies, including:
            </p>
            <ul className="network-list">
              {networkPartners.map((partner, index) => (
                <li className="network-list__item" key={`${partner.prefix}${partner.suffix}${index}`}>
                  <span className="network-list__icon" aria-hidden="true">
                    <span>➜</span>
                  </span>
                  <p>
                    {partner.prefix}
                    {partner.linkText && partner.href ? (
                      <a href={partner.href} target="_blank" rel="noreferrer">
                        {partner.linkText}
                      </a>
                    ) : (
                      partner.linkText ?? ""
                    )}
                    {partner.suffix}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section
          id="contact"
          className="contact-section photo-section has-image"
          style={
            {
              "--section-bg-url": 'url("/solar-farm.jpg")',
              "--section-bg-size": "100% auto",
              "--section-bg-position": "center top",
            } as CSSProperties
          }
        >
          <div className="contact-container">
            <h2>Contact us</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-row">
                <label className="contact-label">
                  Name/Company
                  <input
                    type="text"
                    value={formState.name}
                    onChange={handleInput("name")}
                    className="contact-input"
                    maxLength={100}
                    placeholder=" "
                  />
                </label>
              </div>
              <label className="contact-label">
                E-mail
                <input
                  type="email"
                  value={formState.email}
                  onChange={handleInput("email")}
                  className="contact-input"
                  required
                  maxLength={250}
                  placeholder=" "
                />
              </label>
              <label className="contact-label">
                Write a message
                <textarea
                  value={formState.message}
                  onChange={handleInput("message")}
                  className="contact-textarea"
                  placeholder=" "
                  rows={4}
                />
              </label>
              <div className="form-actions">
                <button type="submit" className="contact-button">
                  Send
                </button>
                {status && (
                  <p className="form-status" role="status" aria-live="polite">
                    {status}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a
              href="https://www.linkedin.com/in/piotr-lemieszek-4130952/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Image
                src="https://static.wixstatic.com/media/6ea5b4a88f0b4f91945b40499aa0af00.png/v1/fill/w_20,h_20,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6ea5b4a88f0b4f91945b40499aa0af00.png"
                alt="LinkedIn"
                width={20}
                height={20}
              />
            </a>
          </div>
          <p>©2022 by VMP. Built with Next.js.</p>
        </div>
      </footer>
    </div>
  );
}

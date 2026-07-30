"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "el" | "en";
type Route =
  | "home"
  | "info"
  | "applications"
  | "doctor"
  | "what-is-smp"
  | "treatment-guide"
  | "results"
  | "procedure"
  | "aftercare"
  | "contact"
  | "faq";

type Copy = {
  el: string;
  en: string;
};

const c = (el: string, en: string): Copy => ({ el, en });

// Keep the full Before & After implementation available for a future relaunch.
const RESULTS_ENABLED = false;

const nav: { route: Route; href: string; label: Copy }[] = [
  { route: "home", href: "/", label: c("Αρχική", "Home") },
  { route: "info", href: "/info", label: c("Πληροφορίες", "Info") },
  { route: "what-is-smp", href: "/what-is-smp", label: c("Τι είναι το SMP", "What is SMP") },
  { route: "treatment-guide", href: "/treatment-guide", label: c("SMP ή μεταμόσχευση;", "SMP or Transplant?") },
  { route: "results", href: "/results", label: c("Πριν & Μετά", "Before & After") },
  { route: "procedure", href: "/procedure", label: c("Διαδικασία", "Procedure") },
  { route: "aftercare", href: "/aftercare", label: c("Φροντίδα", "Aftercare") },
  { route: "contact", href: "/contact", label: c("Επικοινωνία", "Contact") },
  { route: "faq", href: "/faq", label: c("Συχνές Ερωτήσεις", "FAQ") },
  { route: "doctor", href: "/doctor", label: c("Ανδρέας Πετρόπουλος", "About Andreas") },
];

const topicCards = [
  {
    href: "/what-is-smp",
    title: c("Τι είναι το SMP", "What is SMP"),
    text: c("Η τεχνική, οι εφαρμογές και το φυσικό οπτικό αποτέλεσμα.", "The technique, its uses and the natural visual result."),
  },
  {
    href: "/results",
    title: c("Πριν & Μετά", "Before & After"),
    text: c("Διαφορετικοί στόχοι, πάντα με εξατομικευμένο σχεδιασμό.", "Different goals, always with an individually designed approach."),
  },
  {
    href: "/procedure",
    title: c("Η διαδικασία", "The procedure"),
    text: c("Από την πρώτη συζήτηση έως την τελική συνεδρία.", "From the first conversation to the final session."),
  },
  {
    href: "/aftercare",
    title: c("Μετά τη συνεδρία", "Aftercare"),
    text: c("Απλές οδηγίες για ομαλή επούλωση και σταθερό αποτέλεσμα.", "Simple guidance for smooth healing and a stable result."),
  },
];

const visibleNav = nav.filter((item) => RESULTS_ENABLED || item.route !== "results");
const visibleTopicCards = topicCards.filter((item) => RESULTS_ENABLED || item.href !== "/results");

const faqItems = [
  c("Πονάει;", "Does it hurt?"),
  c("Πόσο κοστίζει;", "How much does it cost?"),
  c("Πόσο διαρκεί;", "How long does it last?"),
  c("Ξεθωριάζει;", "Does it fade?"),
  c("Χρειάζεται συντήρηση;", "Does it need maintenance?"),
  c("Μπορώ να κάνω γυμναστική;", "Can I exercise?"),
  c("Μπορώ να πάω στη θάλασσα;", "Can I swim in the sea?"),
  c("Μπορώ να κάνω μεταμόσχευση μετά από SMP;", "Can I have a hair transplant after SMP?"),
];

const faqAnswers = [
  c(
    "Η θεραπεία SMP προκαλεί μόνο ήπια ενόχληση, την οποία οι περισσότεροι περιγράφουν ως ένα ελαφρύ τσίμπημα. Η ένταση διαφέρει από άτομο σε άτομο, ενώ η διαδικασία πραγματοποιείται με προσοχή, ώστε η εμπειρία να είναι όσο το δυνατόν πιο άνετη.",
    "SMP treatment causes only mild discomfort, which most people describe as a light prickling sensation. The intensity varies from person to person, and the procedure is carried out with care to make the experience as comfortable as possible."
  ),
  c(
    "Το κόστος της θεραπείας εξαρτάται από την έκταση της περιοχής, την εφαρμογή που απαιτείται και τον αριθμό των συνεδριών. Μετά από μια δωρεάν αξιολόγηση, λαμβάνετε μια σαφή και εξατομικευμένη προσφορά, πλήρως προσαρμοσμένη στις ανάγκες και τους στόχους σας, χωρίς καμία δέσμευση.",
    "The cost of treatment depends on the size of the area, the application required and the number of sessions. Following a free consultation, you will receive a clear, personalised quotation tailored to your needs and goals, with no obligation."
  ),
  c(
    "Το SMP προσφέρει ένα μακροχρόνιο αποτέλεσμα που κρατάει αρκετά χρόνια. Για τη διατήρηση της άριστης αισθητικής του εικόνας, μπορεί να πραγματοποιηθεί μια σύντομη συνεδρία ανανέωσης, εφόσον αυτό κριθεί απαραίτητο.",
    "SMP offers a long-lasting result that remains visible for several years. To maintain its optimal aesthetic appearance, a short refresh session can be carried out if considered necessary."
  ),
  c(
    "Το αποτέλεσμα διατηρείται για πολλά χρόνια με φυσική εμφάνιση. Εάν στο μέλλον θελήσετε να ανανεώσετε την έντασή του, αυτό γίνεται εύκολα με μια σύντομη συνεδρία συντήρησης.",
    "The result maintains a natural appearance for many years. If you wish to refresh its intensity in the future, this can be done easily with a short maintenance session."
  ),
  c(
    "Το SMP δεν απαιτεί συχνή συντήρηση. Μια συνεδρία ανανέωσης μετά από αρκετά χρόνια αρκεί για να διατηρηθεί το αποτέλεσμα άψογο, εφόσον το επιθυμείτε.",
    "SMP does not require frequent maintenance. A refresh session after several years is usually enough to keep the result looking its best, should you wish to have one."
  ),
  c(
    "Μετά τη συνεδρία SMP συνιστάται να αποφεύγεται η έντονη γυμναστική για τις πρώτες ημέρες, ώστε να προστατευτεί η εφαρμογή και να επιτευχθεί η καλύτερη δυνατή επούλωση. Στη συνέχεια μπορείτε να επιστρέψετε κανονικά στις καθημερινές σας δραστηριότητες.",
    "After an SMP session, intense exercise should be avoided for the first few days to protect the treatment and support the best possible healing. You can then return to your normal daily activities."
  ),
  c(
    "Μετά τη συνεδρία SMP συνιστάται η αποφυγή θάλασσας για λίγες ημέρες, ώστε να διασφαλιστεί η σωστή σταθεροποίηση της χρωστικής. Έπειτα μπορείτε να απολαύσετε ξανά τις καθημερινές σας δραστηριότητες, ακολουθώντας τις οδηγίες φροντίδας για τη διατήρηση του αποτελέσματος.",
    "After an SMP session, swimming in the sea should be avoided for a few days to allow the pigment to settle correctly. You can then resume your usual activities while following the aftercare guidance provided to maintain the result."
  ),
  c(
    "Ναι, μπορείτε να πραγματοποιήσετε μεταμόσχευση μαλλιών μετά από SMP. Η θεραπεία μπορεί να λειτουργήσει συμπληρωματικά, ενισχύοντας τη συνολική εικόνα και το φυσικό αποτέλεσμα, με τον κατάλληλο σχεδιασμό από εξειδικευμένους επαγγελματίες.",
    "Yes, you can have a hair transplant after SMP. With appropriate planning by qualified professionals, the two treatments can work together to enhance the overall appearance and create a natural result."
  ),
];

function useLanguage() {
  const [lang, setLang] = useState<Language>("el");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("lang") === "en") {
      // URL state is client-only and must be applied after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLang("en");
      document.documentElement.lang = "en";
    }
  }, []);

  const change = (next: Language) => {
    setLang(next);
    document.documentElement.lang = next;
    const url = new URL(window.location.href);
    if (next === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    window.history.replaceState({}, "", url);
  };

  return { lang, change };
}

function useScrollReveal() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function Header({ lang, route, onLanguage }: { lang: Language; route: Route; onLanguage: (lang: Language) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const url = (href: string) => (lang === "en" ? `${href}?lang=en` : href);

  useEffect(() => {
    if (!menuOpen) return;

    const dismissOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !menuButtonRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };

    const dismissWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissWithEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissWithEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-top">
        <button
          ref={menuButtonRef}
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={menuOpen ? (lang === "el" ? "Κλείσιμο κατηγοριών" : "Close categories") : (lang === "el" ? "Άνοιγμα κατηγοριών" : "Open categories")}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <a href={url("/")} className="brand" aria-label="DermaDot home">
          <span className="brand-wordmark" aria-hidden="true">
            <span className="brand-wordmark-derma">Derma</span>
            <span className="brand-wordmark-dot">Dot</span>
          </span>
        </a>
        <div className="header-actions">
          <button
            className="lang-toggle"
            type="button"
            onClick={() => onLanguage(lang === "el" ? "en" : "el")}
            aria-label={lang === "el" ? "Switch to English" : "Αλλαγή στα Ελληνικά"}
          >
            <span className={lang === "el" ? "active" : ""}>ΕΛ</span>
            <span>/</span>
            <span className={lang === "en" ? "active" : ""}>EN</span>
          </button>
          <a
            className="header-call"
            href="tel:+302100000000"
            aria-label={lang === "el" ? "Καλέστε τώρα" : "Call now"}
          >
            <span className="header-call-text">{lang === "el" ? "Καλέστε τώρα" : "Call now"}</span>
            <span className="header-call-icon" aria-hidden="true">☎</span>
          </a>
        </div>
      </div>
      <div ref={menuRef} className={`nav-wrap ${menuOpen ? "open" : ""}`}>
        <nav id="site-navigation" className="main-nav" aria-label={lang === "el" ? "Κύρια πλοήγηση" : "Main navigation"}>
          {visibleNav.map((item) => (
            <a
              key={item.route}
              className={`nav-link ${route === item.route || (route === "applications" && item.route === "info") ? "active" : ""}`}
              href={url(item.href)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label[lang]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer({ lang }: { lang: Language }) {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-name"><span>Derma</span><span className="brand-inline-dot">Dot</span></div>
        <div className="footer-cta">
          <span className="eyebrow">{lang === "el" ? "Το επόμενο βήμα" : "Your next step"}</span>
          <p>
            {lang === "el"
              ? "Μια προσωπική συνάντηση είναι η αρχή για να κατανοήσουμε τις ανάγκες σας και να δημιουργήσουμε ένα αποτέλεσμα που σας ταιριάζει."
              : "A personal consultation is the first step towards understanding your needs and creating a result that suits you."}
          </p>
          <a className="button" href={lang === "en" ? "/contact?lang=en" : "/contact"}>
            {lang === "el" ? "Κλείστε αξιολόγηση" : "Book a consultation"}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DERMA<span className="brand-inline-dot">DOT</span></span>
        <span>SCALP MICROPIGMENTATION • {lang === "el" ? "ΑΘΗΝΑ" : "ATHENS"}</span>
      </div>
    </footer>
  );
}

const pageHeroImages: Partial<Record<string, { src: string; position: string }>> = {
  "02": { src: "/smp-02-equipment.webp", position: "50% 50%" },
  "02B": { src: "/page-heroes/smp-02b-transplant.png", position: "50% 50%" },
  "03": { src: "/page-heroes/smp-03-treatment.jpg", position: "50% 48%" },
  "04": { src: "/page-heroes/smp-04-process.jpg", position: "56% 58%" },
  "06": { src: "/page-heroes/smp-06-equipment.jpg", position: "50% 58%" },
  "07": { src: "/page-heroes/smp-07-hairline.jpg", position: "50% 50%" },
};

function PageHero({
  index,
  title,
  intro,
  lang,
  showCode = true,
}: {
  index: string;
  title: Copy;
  intro: Copy;
  lang: Language;
  showCode?: boolean;
}) {
  const photo = pageHeroImages[index];
  const isFullPhoto = index === "02" || index === "02B";

  return (
    <section
      className={`page-hero ${photo ? "page-hero-with-photo" : ""} ${isFullPhoto ? "page-hero-full-photo" : ""}`}
      data-smp-index={index}
      style={isFullPhoto && photo ? {
        "--page-hero-image": `url("${photo.src}")`,
        "--page-hero-position": photo.position,
      } as React.CSSProperties : undefined}
    >
      <div className="page-hero-main">
        <p className="eyebrow"><span>Derma</span><span className="brand-inline-dot">Dot</span></p>
        <h1>{title[lang]}</h1>
      </div>
      <aside
        className={`page-hero-aside ${showCode ? "" : "page-hero-aside-no-code"} ${photo ? "page-hero-aside-photo" : ""}`}
        style={photo ? {
          "--page-hero-image": `url("${photo.src}")`,
          "--page-hero-position": photo.position,
        } as React.CSSProperties : undefined}
      >
        {showCode ? <span className="page-code">SMP — {index}</span> : null}
        <p>{intro[lang]}</p>
      </aside>
    </section>
  );
}

function Home({ lang }: { lang: Language }) {
  const url = (href: string) => (lang === "en" ? `${href}?lang=en` : href);
  useScrollReveal();

  return (
    <>
      <section className="template-hero">
        <div className="template-hero-shade" />
        <div className="template-hero-copy">
          <p className="hero-kicker">{lang === "el" ? "Scalp Micropigmentation • Αθήνα" : "Scalp Micropigmentation • Athens"}</p>
          <h1 className="editorial-title">
            {lang === "el" ? <>Απόλυτα φυσικό<br />αποτέλεσμα.</> : <>A completely natural<br />result.</>}
          </h1>
          <p className="hero-lede">
            {lang === "el"
              ? "Κάθε θεραπεία SMP σχεδιάζεται αποκλειστικά για εσάς, προσφέροντας ένα διακριτικό, ρεαλιστικό αποτέλεσμα που εναρμονίζεται φυσικά με τα χαρακτηριστικά σας και την εικόνα σας."
              : "Every SMP treatment is designed exclusively for you, delivering a subtle, realistic result that harmonises naturally with your features and overall appearance."}
          </p>
          <div className="hero-actions">
            <a className="button" href={url("/contact")}>
              {lang === "el" ? "Κλείστε ραντεβού" : "Book appointment"} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <section className="template-about home-reveal home-reveal-second" data-scroll-reveal>
        <div className="about-image about-image-left" role="img" aria-label={lang === "el" ? "Λεπτομέρεια εφαρμογής SMP" : "SMP treatment detail"} />
        <div className="about-center">
          <p className="about-label">— {lang === "el" ? "η προσέγγισή μας" : "our approach"} —</p>
          <h2 className="editorial-title">{lang === "el" ? "Ένας απλός τρόπος να ξαναβρείτε την αυτοπεποίθησή σας." : "A simple way to restore your confidence."}</h2>
          <p>
            {lang === "el"
              ? "Με ακρίβεια στον σχεδιασμό, εξειδικευμένη τεχνική και απόλυτη προσήλωση στη λεπτομέρεια, δημιουργούμε ένα φυσικό αποτέλεσμα SMP που αναδεικνύει την εικόνα σας και ανταποκρίνεται στις προσωπικές σας ανάγκες."
              : "With precision in design, specialist technique and an unwavering attention to detail, we create a natural SMP result that enhances your appearance and responds to your individual needs."}
          </p>
          <a className="button" href={url("/info")}>
            {lang === "el" ? "Μάθετε περισσότερα" : "Learn more"} <span aria-hidden="true">→</span>
          </a>
          <div className="about-image about-image-wide" role="img" aria-label={lang === "el" ? "Φυσικό αποτέλεσμα SMP" : "Natural SMP result"} />
        </div>
        <div className="about-right">
          <div className="about-image about-image-right" role="img" aria-label={lang === "el" ? "Εξειδικευμένη φροντίδα SMP" : "Specialist SMP care"} />
        </div>
      </section>
      <section className="section template-topics home-reveal home-reveal-third line-reveal" data-scroll-reveal>
        <div className="section-head">
          <h2 className="slim-title">{lang === "el" ? "Όλα όσα χρειάζεται να γνωρίζετε." : "Everything you need to know."}</h2>
          <p className="section-intro">
            {lang === "el"
              ? "Ανακαλύψτε τη διαδικασία της θεραπείας SMP βήμα προς βήμα, από την αρχική αξιολόγηση έως το τελικό αποτέλεσμα."
              : "Discover the SMP treatment process step by step, from the initial assessment through to the final result."}
          </p>
        </div>
        <div className="topic-grid">
          {visibleTopicCards.map((topic, i) => (
            <a className="topic-card" href={url(topic.href)} key={topic.href}>
              <span className="topic-index">0{i + 1}</span>
              <h3>{topic.title[lang]}</h3>
              <p>{topic.text[lang]}</p>
              <span className="topic-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

const infoCards = [
  {
    slug: "andriki-alopekia",
    title: c("Ανδρική αλωπεκία", "Male hair loss"),
    images: {
      before: "/cases/male-hair-loss-before.webp",
      after: "/cases/male-hair-loss-after.webp",
    },
    text: c("Δημιουργεί την εικόνα ενός φυσικά ξυρισμένου τριχωτού και επαναπροσδιορίζει διακριτικά τη γραμμή των μαλλιών.", "Creates the appearance of a naturally shaved scalp and subtly redefines the hairline."),
    details: [
      c("Η εφαρμογή σχεδιάζεται σύμφωνα με το σχήμα του προσώπου, την ηλικία και το υπάρχον μοτίβο αραίωσης. Η γραμμή των μαλλιών χαράσσεται συντηρητικά ώστε να παραμένει φυσική με την πάροδο του χρόνου.", "Treatment is designed around facial structure, age and the existing pattern of hair loss. The hairline is kept deliberately conservative so it continues to look natural over time."),
      c("Με διαδοχικά, ελαφριά επίπεδα χρωστικής δημιουργείται η οπτική εικόνα πολύ κοντά ξυρισμένων τριχοθυλακίων, χωρίς να προστεθεί πραγματικός όγκος ή τρίχα.", "Successive light layers of pigment create the visual appearance of closely shaved follicles without adding actual volume or hair."),
    ],
  },
  {
    slug: "gynaikeia-araiosi",
    title: c("Γυναικεία αραίωση", "Female thinning"),
    images: {
      before: "/cases/female-thinning-before.webp",
      after: "/cases/female-thinning-after.webp",
    },
    text: c("Μειώνει την αντίθεση του ορατού δέρματος ανάμεσα στα υπάρχοντα μαλλιά, προσφέροντας την εντύπωση μεγαλύτερης πυκνότητας.", "Reduces the contrast of visible scalp between existing hairs, creating the impression of greater density."),
    details: [
      c("Το SMP τοποθετείται ανάμεσα στις υπάρχουσες τρίχες, με στόχο να μειώσει την έντονη αντίθεση ανάμεσα στο χρώμα των μαλλιών και το δέρμα.", "SMP is placed between existing hairs to reduce the strong contrast between hair colour and visible scalp."),
      c("Η τεχνική δεν επιμηκύνει ούτε πυκνώνει τις τρίχες. Η καταλληλότητα εξαρτάται από τη σταθερότητα της αραίωσης, την κατάσταση του δέρματος και την επιθυμητή εικόνα.", "The technique does not lengthen or thicken hair. Suitability depends on the stability of thinning, scalp condition and the desired appearance."),
    ],
  },
  {
    slug: "oules-metamosxefsis",
    title: c("Ουλές από μεταμόσχευση", "Hair-transplant scars"),
    images: {
      before: "/cases/hair-transplant-scar-before.webp",
      after: "/cases/hair-transplant-scar-after.webp",
    },
    text: c("Ενσωματώνει οπτικά ώριμες ουλές FUE ή FUT στο γύρω τριχωτό, μειώνοντας την αντίθεσή τους.", "Visually blends mature FUE or FUT scars into the surrounding scalp, reducing their contrast."),
    details: [
      c("Οι πλήρως επουλωμένες ουλές FUE ή FUT αξιολογούνται ως προς το χρώμα, την υφή, το πάχος και τη θέση τους πριν ξεκινήσει οποιαδήποτε εφαρμογή.", "Fully healed FUE or FUT scars are assessed for colour, texture, thickness and position before any treatment begins."),
      c("Μικροσκοπικά σημεία χρωστικής τοποθετούνται μέσα και γύρω από την ουλή ώστε να ελαττωθεί η οπτική διαφορά. Η ουλή δεν αφαιρείται, αλλά μπορεί να γίνει αισθητά λιγότερο εμφανής.", "Microscopic pigment impressions are placed within and around the scar to soften visual contrast. The scar is not removed, but it may become noticeably less visible."),
    ],
  },
  {
    slug: "oules-travmatismon",
    title: c("Ουλές από τραυματισμούς", "Trauma scars"),
    images: {
      before: "/cases/trauma-scar-before.webp",
      after: "/cases/trauma-scar-after.webp",
    },
    text: c("Μπορεί να καμουφλάρει επιλεγμένες, πλήρως επουλωμένες ουλές έπειτα από προσεκτική αξιολόγηση.", "Can camouflage selected, fully healed scars after careful assessment."),
    details: [
      c("Κάθε ουλή αντιδρά διαφορετικά στη χρωστική. Εξετάζουμε την ωριμότητα, την υφή και την αιμάτωσή της και προχωρούμε μόνο όταν η περιοχή είναι ασφαλής και σταθερή.", "Every scar responds differently to pigment. We examine maturity, texture and blood supply, proceeding only when the area is safe and stable."),
      c("Ο σχεδιασμός ακολουθεί το φυσικό μοτίβο των γύρω τριχοθυλακίων ώστε η μετάβαση να είναι διακριτική και όχι ομοιόμορφα χρωματισμένη.", "The design follows the natural pattern of surrounding follicles so the transition looks subtle rather than uniformly coloured."),
    ],
  },
  {
    slug: "alopecia-areata",
    title: c("Alopecia Areata", "Alopecia Areata"),
    images: {
      before: "/cases/alopecia-areata-before.webp",
      after: "/cases/alopecia-areata-after.webp",
    },
    text: c("Σε σταθεροποιημένες περιπτώσεις μπορεί να μειώσει οπτικά τη διαφορά ανάμεσα στις περιοχές με και χωρίς τρίχες.", "In stable cases, it can visually reduce the contrast between areas with and without hair."),
    details: [
      c("Η εφαρμογή εξετάζεται μόνο όταν η κατάσταση είναι σταθερή και έχει προηγηθεί η κατάλληλη ιατρική καθοδήγηση. Το SMP προσφέρει αισθητική κάλυψη και όχι θεραπεία της αιτίας.", "Treatment is considered only when the condition is stable and appropriate medical guidance has been obtained. SMP provides cosmetic camouflage; it does not treat the underlying cause."),
      c("Η πυκνότητα και ο τόνος χτίζονται προσεκτικά ώστε οι περιοχές να δένουν οπτικά με τα σημεία όπου υπάρχουν φυσικές τρίχες.", "Density and tone are built carefully so treated areas visually blend with regions where natural hair remains."),
    ],
  },
  {
    slug: "genia",
    title: c("Γένια", "Beard"),
    images: {
      before: "/cases/beard-density-before.webp",
      after: "/cases/beard-density-after.webp",
    },
    text: c("Προσθέτει την οπτική εντύπωση πυκνότητας ή βοηθά στην εξισορρόπηση κενών στην περιοχή των γενιών.", "Adds the visual impression of density or helps balance gaps within the beard area."),
    details: [
      c("Η κατεύθυνση, το μέγεθος και η απόσταση των σημείων προσαρμόζονται στο φυσικό μοτίβο των γενιών και στη μορφολογία του προσώπου.", "Direction, size and spacing of impressions are adapted to the natural beard pattern and facial structure."),
      c("Μπορούν να εξισορροπηθούν μικρά κενά ή να ενισχυθεί οπτικά η πυκνότητα σε κοντοξυρισμένο γένι, με σταδιακή εφαρμογή και ήπιους τόνους.", "Small gaps can be balanced or density visually enhanced in a closely trimmed beard through gradual application and restrained tones."),
    ],
  },
  {
    slug: "diorthosi-smp",
    title: c("Διόρθωση αποτυχημένου SMP", "Correction of previous SMP"),
    images: {
      before: "/cases/failed-smp-correction-before.webp",
      after: "/cases/failed-smp-correction-after.webp",
    },
    text: c("Αξιολογούμε χρώμα, βάθος, σχήμα και κατάσταση του δέρματος πριν προτείνουμε ασφαλή διόρθωση ή ανασχεδιασμό.", "We assess colour, depth, shape and skin condition before recommending a safe correction or redesign."),
    details: [
      c("Πρώτα εξετάζουμε αν η προηγούμενη εφαρμογή είναι υπερβολικά σκούρα, βαθιά, ψυχρή σε τόνο ή λανθασμένη ως προς το σχήμα. Δεν είναι κάθε περίπτωση κατάλληλη για άμεση κάλυψη.", "We first assess whether the previous treatment is too dark, deep, cool-toned or incorrectly shaped. Not every case is suitable for immediate camouflage."),
      c("Ανάλογα με την κατάσταση μπορεί να προταθεί χρόνος αναμονής, αφαίρεση ή προσεκτική εξισορρόπηση. Το πλάνο συμφωνείται μόνο μετά από δια ζώσης αξιολόγηση.", "Depending on its condition, waiting, removal or careful rebalancing may be recommended. A plan is agreed only after an in-person assessment."),
    ],
  },
];

function ApplicationImageToggle({
  card,
  lang,
}: {
  card: (typeof infoCards)[number];
  lang: Language;
}) {
  const [showAfter, setShowAfter] = useState(false);
  const title = card.title[lang];

  return (
    <div className="application-toggle">
      <div className="application-toggle-frame">
        {/* Both images must remain mounted to preserve the instant before/after transition. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={!showAfter ? "is-visible" : ""}
          src={card.images.before}
          alt={lang === "el" ? `${title}, πριν από την εφαρμογή` : `${title}, before treatment`}
        />
        {/* Both images must remain mounted to preserve the instant before/after transition. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={showAfter ? "is-visible" : ""}
          src={card.images.after}
          alt={lang === "el" ? `${title}, μετά την εφαρμογή` : `${title}, after treatment`}
        />
        <button
          className={`application-toggle-button ${showAfter ? "show-after" : "show-before"}`}
          type="button"
          aria-pressed={showAfter}
          aria-label={
            showAfter
              ? (lang === "el" ? "Εμφάνιση φωτογραφίας πριν" : "Show before photo")
              : (lang === "el" ? "Εμφάνιση φωτογραφίας μετά" : "Show after photo")
          }
          onClick={() => setShowAfter((current) => !current)}
        >
          {showAfter ? (lang === "el" ? "ΜΕΤΑ" : "AFTER") : (lang === "el" ? "ΠΡΙΝ" : "BEFORE")}
        </button>
      </div>
      <small className="application-ai-note">
        {lang === "el" ? "Ενδεικτική απεικόνιση με AI" : "Illustrative AI visualisation"}
      </small>
    </div>
  );
}

function Info({ lang }: { lang: Language }) {
  const [activeApplication, setActiveApplication] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const applicationUrl = (slug: string) => lang === "en" ? `/applications?lang=en#${slug}` : `/applications#${slug}`;

  const moveApplication = (direction: number) => {
    setActiveApplication((current) => {
      const visibleCards = window.innerWidth >= 901 ? 3 : window.innerWidth >= 701 ? 2 : 1;
      const lastStart = infoCards.length - visibleCards;
      const next = current + direction;
      if (next < 0) return lastStart;
      if (next > lastStart) return 0;
      return next;
    });
  };

  useEffect(() => {
    const viewport = carouselRef.current;
    const target = viewport?.querySelector<HTMLElement>(`[data-slide="${activeApplication}"]`);
    if (viewport && target) {
      viewport.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }
  }, [activeApplication]);

  return (
    <>
      <section className="section applications-page">
        <div className="applications-heading">
          <h1>{lang === "el" ? "Εξειδικευμένες εφαρμογές SMP" : "Specialised SMP Applications"}</h1>
          <p>
            {lang === "el"
              ? "Κάθε περίπτωση απαιτεί διαφορετική προσέγγιση. Δείτε πώς η SMP προσαρμόζεται σε διαφορετικές ανάγκες, προσφέροντας φυσικά και εξατομικευμένα αποτελέσματα."
              : "Every case requires a different approach. See how SMP adapts to different needs, delivering natural, personalised results."}
          </p>
        </div>
        <div className="applications-showcase">
          <div className="applications-carousel-shell">
            <div className="applications-viewport" ref={carouselRef}>
              <div className="applications-track">
                {infoCards.map((card, index) => (
                  <article
                    className="application-slide"
                    key={card.slug}
                    data-slide={index}
                  >
                    <a
                      className="application-slide-navigation"
                      href={applicationUrl(card.slug)}
                      aria-label={`${card.title[lang]} — ${lang === "el" ? "περισσότερες πληροφορίες" : "more information"}`}
                    />
                    <div className="application-slide-image">
                      <ApplicationImageToggle card={card} lang={lang} />
                    </div>
                    <div className="application-slide-copy">
                      <span className="application-slide-meta">
                        <span aria-hidden="true">↗</span>
                      </span>
                      <strong>{card.title[lang]}</strong>
                      <span className="application-slide-link">{lang === "el" ? "Δείτε περισσότερα" : "View more"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="application-controls" aria-label={lang === "el" ? "Πλοήγηση εφαρμογών" : "Applications navigation"}>
              <button className="application-control-previous" type="button" onClick={() => moveApplication(-1)} aria-label={lang === "el" ? "Προηγούμενη εφαρμογή" : "Previous application"}>←</button>
              <button className="application-control-next" type="button" onClick={() => moveApplication(1)} aria-label={lang === "el" ? "Επόμενη εφαρμογή" : "Next application"}>→</button>
            </div>
          </div>
        </div>
      </section>
      <section className="section note-panel">
        <h2>{lang === "el" ? "Όχι μια γενική λύση." : "Never one-size-fits-all."}</h2>
        <p>{lang === "el" ? "Η φυσικότητα ενός αποτελέσματος SMP ξεκινά πριν από την εφαρμογή. Μελετάμε τη συνολική εικόνα, κατανοούμε τους στόχους σας και σχεδιάζουμε μια προσέγγιση που αντανακλά τη δική σας αισθητική." : "The natural appearance of an SMP result begins before treatment. We study the overall picture, understand your goals and design an approach that reflects your own aesthetic."}</p>
      </section>
    </>
  );
}

function Applications({ lang }: { lang: Language }) {
  const infoUrl = lang === "en" ? "/info?lang=en" : "/info";
  return (
    <>
      <PageHero
        index="02A"
        lang={lang}
        showCode={false}
        title={c("Εφαρμογές SMP", "SMP Applications")}
        intro={c("Αναλυτικές πληροφορίες για τις επτά εξειδικευμένες εφαρμογές και τον τρόπο με τον οποίο προσαρμόζονται σε κάθε ανάγκη.", "Detailed information about seven specialist applications and how each is adapted to an individual need.")}
      />
      <section className="section applications-directory">
        <a className="applications-back" href={infoUrl}>← {lang === "el" ? "Πίσω στις εφαρμογές" : "Back to applications"}</a>
        {infoCards.map((card, cardIndex) => (
          <article className="application-detail" id={card.slug} key={card.slug}>
            <div className="application-detail-image">
              <ApplicationImageToggle card={card} lang={lang} />
            </div>
            <div className="application-detail-copy">
              <span className="application-detail-number">0{cardIndex + 1} / 07</span>
              <h2>{card.title[lang]}</h2>
              <p className="application-detail-intro">{card.text[lang]}</p>
              {card.details.map((paragraph) => <p key={paragraph.en}>{paragraph[lang]}</p>)}
              <a className="button" href={lang === "en" ? "/contact?lang=en" : "/contact"}>
                {lang === "el" ? "Κλείστε αξιολόγηση" : "Book a consultation"} <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function WhatIsSmp({ lang }: { lang: Language }) {
  useScrollReveal();
  const essentials = [
    c("Πώς λειτουργεί|Με εξειδικευμένη βελόνα δημιουργούνται μικροσκοπικά σημεία χρωστικής στο ανώτερο στρώμα του δέρματος, μιμούμενα φυσικούς θύλακες.", "How it works|A specialist needle places microscopic pigment impressions in the upper layer of the skin, mimicking natural follicles."),
    c("Πόσο διαρκεί|Το αποτέλεσμα της SMP έχει μεγάλη διάρκεια και παραμένει σταθερό για αρκετά χρόνια. Η διάρκεια μπορεί να επηρεαστεί από παράγοντες όπως ο τύπος δέρματος, η έκθεση στον ήλιο και η σωστή φροντίδα.", "How long it lasts|SMP results are long-lasting and remain stable for several years. Longevity may be affected by factors such as skin type, sun exposure and proper aftercare."),
    c("Είναι ασφαλές;|Ναι, η SMP είναι μια ασφαλής μη χειρουργική τεχνική όταν εφαρμόζεται από εξειδικευμένο επαγγελματία, με σωστά πρωτόκολλα υγιεινής και κατάλληλη προετοιμασία.", "Is it safe?|Yes, SMP is a safe, non-surgical technique when performed by a qualified specialist using appropriate hygiene protocols and proper preparation."),
    c("Πόσες συνεδρίες χρειάζονται;|Ο αριθμός των συνεδριών διαφέρει ανάλογα με τις ανάγκες κάθε περίπτωσης. Στις περισσότερες περιπτώσεις πραγματοποιούνται 2–3 συνεδρίες, ώστε η χρωστική να ενσωματώνεται σταδιακά και να επιτυγχάνεται ένα φυσικό αποτέλεσμα.", "How many sessions are needed?|The number of sessions varies according to the needs of each case. In most cases, 2–3 sessions are carried out so the pigment can be integrated gradually and a natural result achieved."),
    c("Πονάει;|Οι περισσότεροι περιγράφουν ήπια έως μέτρια ενόχληση. Η αίσθηση διαφέρει ανά περιοχή και από άτομο σε άτομο.", "Does it hurt?|Most clients report mild to moderate discomfort. Sensation varies by area and from person to person."),
    c("Τι χρωστικές χρησιμοποιούνται|Χρησιμοποιούνται εξειδικευμένες χρωστικές υψηλής ποιότητας, σχεδιασμένες για τη δημιουργία φυσικής εμφάνισης τριχοθυλακίων. Η επιλογή και η προσαρμογή της απόχρωσης πραγματοποιούνται με βάση τα χαρακτηριστικά του κάθε ατόμου και το επιθυμητό αποτέλεσμα.", "Which pigments are used|Specialist, high-quality pigments designed to create the natural appearance of hair follicles are used. The shade is selected and adjusted according to each person’s characteristics and desired result."),
  ];
  return (
    <>
      <PageHero index="02" lang={lang} showCode={false} title={c("Τι είναι το SMP;", "What is SMP?")} intro={c("Μια εξειδικευμένη τεχνική που δημιουργεί την οπτική εντύπωση φυσικών θυλάκων τρίχας.", "A specialised technique that creates the visual impression of natural hair follicles.")} />
      <section className="section">
        <div className="section-head what-is-smp-head"><h2 className="slim-title">{lang === "el" ? "Όλα όσα χρειάζεται να γνωρίζετε." : "Everything you need to know."}</h2><p className="section-intro">{lang === "el" ? "Η SMP αποτελεί μια σύγχρονη, μη χειρουργική τεχνική που έχει σχεδιαστεί για να βελτιώνει την εικόνα του τριχωτού με φυσικό και διακριτικό τρόπο. Παρακάτω θα βρείτε απαντήσεις στις πιο συχνές ερωτήσεις σχετικά με τη διαδικασία, την εφαρμογή και το αποτέλεσμα." : "SMP is a modern, non-surgical technique designed to improve the appearance of the scalp in a natural and subtle way. Below you will find answers to the most frequently asked questions about the procedure, its application and the result."}</p></div>
        <div className="content-grid essentials-grid">
          {essentials.map((item) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="content-card" key={item.en}><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></article>;
          })}
        </div>
      </section>
      <section className="section treatment-guide-teaser scroll-reveal line-reveal" data-scroll-reveal>
        <span className="eyebrow">{lang === "el" ? "Ενημερωμένη επιλογή" : "An informed choice"}</span>
        <div>
          <h2>{lang === "el" ? "SMP ή μεταμόσχευση μαλλιών;" : "SMP or a hair transplant?"}</h2>
          <p>
            {lang === "el"
              ? "Δεν υπάρχει μία θεραπεία ιδανική για όλους. Δείτε πότε κάθε προσέγγιση μπορεί να έχει θέση και ποιοι παράγοντες πρέπει να αξιολογηθούν."
              : "No single treatment is right for everyone. Explore when each approach may have a place and which factors should be assessed."}
          </p>
          <a className="button" href={lang === "en" ? "/treatment-guide?lang=en" : "/treatment-guide"}>
            {lang === "el" ? "Δείτε τη σύγκριση" : "Explore the comparison"} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Η διαφορά από ένα τατουάζ." : "How SMP differs from a tattoo."}</h2><p>{lang === "el" ? "Η SMP πραγματοποιείται με εξειδικευμένα εργαλεία και ειδικά σχεδιασμένες χρωστικές, μέσω μιας τεχνικής ακριβών μικροσκοπικών σημείων. Το αποτέλεσμα δημιουργείται σταδιακά, με φυσική διαβάθμιση και προσαρμογή στα χαρακτηριστικά του δέρματος." : "SMP is performed using specialist tools and purpose-designed pigments, through a technique of precise microscopic impressions. The result is built gradually, with natural gradation and adaptation to the characteristics of the skin."}</p></section>
    </>
  );
}

function TreatmentGuide({ lang }: { lang: Language }) {
  useScrollReveal();
  const transplantPoints = lang === "el"
    ? [
        "Μικρή ή μέτρια έκταση αλωπεκίας.",
        "Ισχυρή και κατάλληλη δότρια περιοχή.",
        "Ρεαλιστικές προσδοκίες για την κάλυψη και την πυκνότητα.",
        "Καταλληλότητα που έχει επιβεβαιωθεί με ιατρική αξιολόγηση.",
      ]
    : [
        "A small or moderate area of hair loss.",
        "A strong and suitable donor area.",
        "Realistic expectations about coverage and density.",
        "Suitability confirmed through a medical assessment.",
      ];

  const smpUses = lang === "el"
    ? [
        "Πλήρης οπτική αποκατάσταση σε εκτεταμένη αλωπεκία.",
        "Οπτική αύξηση της πυκνότητας σε αραιά μαλλιά.",
        "Καμουφλάζ ώριμων ουλών, συμπεριλαμβανομένων ουλών από μεταμόσχευση.",
        "Επανασχεδιασμός της γραμμής των μαλλιών.",
        "Οπτική κάλυψη τοπικών κενών.",
        "Βελτίωση της εικόνας στα γένια, όπου ενδείκνυται.",
      ]
    : [
        "Complete visual restoration for extensive hair loss.",
        "The visual impression of greater density in thinning hair.",
        "Camouflage of mature scars, including hair-transplant scars.",
        "Redesign of the hairline.",
        "Visual coverage of localised gaps.",
        "Improvement of beard appearance where appropriate.",
      ];

  return (
    <>
      <PageHero
        index="02B"
        lang={lang}
        showCode={false}
        title={c("SMP ή μεταμόσχευση;", "SMP or a hair transplant?")}
        intro={c("Μια ειλικρινής σύγκριση, ώστε η επιλογή να βασίζεται στην πραγματική σας περίπτωση και όχι σε μία γενική υπόσχεση.", "An honest comparison so your choice reflects your individual circumstances, not a general promise.")}
      />

      <section className="section treatment-choice-intro">
        <span className="eyebrow">{lang === "el" ? "Η σωστή επιλογή για εσάς" : "The right choice for you"}</span>
        <div>
          <h2 className="slim-title">{lang === "el" ? "Δεν υπάρχει μία θεραπεία ιδανική για όλους." : "There is no single ideal treatment for everyone."}</h2>
          <p>
            {lang === "el"
              ? "Η σωστή επιλογή εξαρτάται από το είδος της αλωπεκίας, την έκταση της τριχόπτωσης, τη δότρια περιοχή, τις προσδοκίες του κάθε ανθρώπου και το αποτέλεσμα που θέλει να πετύχει."
              : "The right choice depends on the type and extent of hair loss, the donor area, each person’s expectations and the result they want to achieve."}
          </p>
          <p>
            {lang === "el"
              ? "Για τον λόγο αυτό πιστεύω ότι κάθε άνθρωπος πρέπει πρώτα να ενημερώνεται με ειλικρίνεια και στη συνέχεια να επιλέγει τη λύση που πραγματικά του ταιριάζει."
              : "For this reason, I believe everyone should first receive honest information and then choose the solution that genuinely suits them."}
          </p>
        </div>
      </section>

      <section className="section treatment-comparison">
        <article className="treatment-option">
          <span className="treatment-option-code">01 / {lang === "el" ? "Ιατρική επέμβαση" : "Medical procedure"}</span>
          <h2>{lang === "el" ? "Πότε η μεταμόσχευση μαλλιών αποτελεί καλή επιλογή;" : "When can a hair transplant be a good option?"}</h2>
          <p>
            {lang === "el"
              ? "Η μεταμόσχευση μαλλιών είναι ιατρική επέμβαση που μεταφέρει ζωντανά τριχοθυλάκια από τη δότρια περιοχή, συνήθως το πίσω μέρος του κεφαλιού, στις περιοχές όπου υπάρχει αραίωση. Τα μεταμοσχευμένα μαλλιά μπορούν να συνεχίσουν να μεγαλώνουν φυσιολογικά."
              : "A hair transplant is a medical procedure that moves living follicles from a donor area, usually the back of the head, to areas affected by thinning. Transplanted hair can then continue to grow naturally."}
          </p>
          <p>{lang === "el" ? "Μπορεί να προσφέρει πολύ καλά αποτελέσματα, ιδιαίτερα όταν συνυπάρχουν:" : "It can provide very good results, particularly when the following are present:"}</p>
          <ul>{transplantPoints.map((point) => <li key={point}>{point}</li>)}</ul>
        </article>

        <article className="treatment-option treatment-option-smp">
          <span className="treatment-option-code">02 / SMP</span>
          <h2>{lang === "el" ? "Τι προσφέρει το Scalp Micropigmentation;" : "What does Scalp Micropigmentation offer?"}</h2>
          <p>
            {lang === "el"
              ? "Το SMP δεν μεταφέρει ούτε δημιουργεί τρίχες. Δημιουργεί την οπτική εντύπωση φυσικών τριχοθυλακίων με μικροσκοπικά σημεία χρωστικής, χωρίς χειρουργική επέμβαση."
              : "SMP does not move or create hair. It uses microscopic pigment impressions to create the visual appearance of natural follicles without surgery."}
          </p>
          <p>{lang === "el" ? "Δεν αφορά μόνο την ολική αλωπεκία. Μπορεί να χρησιμοποιηθεί για:" : "It is not limited to complete hair loss. It may be used for:"}</p>
          <ul>{smpUses.map((use) => <li key={use}>{use}</li>)}</ul>
        </article>
      </section>

      <section className="section transplant-limits scroll-reveal line-reveal" data-scroll-reveal>
        <div>
          <span className="eyebrow">{lang === "el" ? "Ρεαλιστικές προσδοκίες" : "Realistic expectations"}</span>
          <h2>{lang === "el" ? "Ποιοι είναι οι περιορισμοί μιας μεταμόσχευσης;" : "What are the limitations of a transplant?"}</h2>
        </div>
        <div className="transplant-limits-copy">
          <p>
            {lang === "el"
              ? "Καμία μεταμόσχευση δεν μπορεί να δημιουργήσει απεριόριστη πυκνότητα. Ο αριθμός των διαθέσιμων τριχοθυλακίων είναι συγκεκριμένος και εξαρτάται από τη δότρια περιοχή."
              : "No transplant can create unlimited density. The number of available follicles is finite and depends on the donor area."}
          </p>
          <p>
            {lang === "el"
              ? "Όταν η αλωπεκία είναι πολύ εκτεταμένη, μπορεί να μην είναι δυνατό να καλυφθεί ολόκληρη η επιφάνεια με την πυκνότητα που επιθυμεί ο ασθενής. Αυτό δεν σημαίνει ότι οι μεγάλες επιφάνειες αποκλείουν αυτομάτως τη μεταμόσχευση· η καταλληλότητα εξαρτάται από τη δότρια περιοχή, την εξέλιξη της τριχόπτωσης και τους ρεαλιστικούς στόχους."
              : "When hair loss is extensive, it may not be possible to cover the entire area at the density a patient would prefer. This does not mean extensive hair loss automatically rules out transplantation; suitability depends on donor supply, the likely progression of hair loss and realistic goals."}
          </p>
          <p>
            {lang === "el"
              ? "Οι τεχνικές FUT και FUE αφήνουν διαφορετικού τύπου ουλές. Η FUT συνδέεται συνήθως με γραμμική ουλή, ενώ η FUE δημιουργεί πολλαπλές μικροσκοπικές σημειακές ουλές. Συχνά καλύπτονται από τα μαλλιά, αλλά μπορεί να γίνονται πιο ορατές σε πολύ κοντό ή ξυρισμένο κούρεμα."
              : "FUT and FUE create different patterns of scarring. FUT commonly leaves a linear scar, while FUE creates multiple tiny punctate scars. These are often concealed by hair but may become more visible with a very short or shaved haircut."}
          </p>
        </div>
      </section>

      <section className="section personal-smp-choice scroll-reveal line-reveal" data-scroll-reveal>
        <div className="personal-smp-image" aria-hidden="true" />
        <div>
          <span className="eyebrow">{lang === "el" ? "Προσωπική εμπειρία" : "Personal experience"}</span>
          <h2>{lang === "el" ? "Γιατί επέλεξα το SMP." : "Why I chose SMP."}</h2>
          <p>
            {lang === "el"
              ? "Η προσωπική μου εμπειρία ήταν αυτή που με οδήγησε στο SMP. Έχοντας δει από κοντά τις δυνατότητες αλλά και τους περιορισμούς της μεταμόσχευσης μαλλιών, ανακάλυψα ότι το Scalp Micropigmentation μπορεί να προσφέρει λύσεις εκεί όπου πολλές φορές μια μεταμόσχευση από μόνη της δεν επαρκεί."
              : "My personal experience led me to SMP. Having seen both the possibilities and limitations of hair transplantation at close range, I discovered that Scalp Micropigmentation can offer options where a transplant alone may not be enough."}
          </p>
          <p>
            {lang === "el"
              ? "Δεν επέλεξα το SMP ως αντίπαλο της μεταμόσχευσης, αλλά ως μια διαφορετική, μη χειρουργική προσέγγιση που μπορεί να αλλάξει εντυπωσιακά την εικόνα και την αυτοπεποίθηση ενός ανθρώπου."
              : "I did not choose SMP as an opponent to transplantation, but as a different, non-surgical approach that can meaningfully change a person’s appearance and confidence."}
          </p>
        </div>
      </section>

      <section className="section treatment-philosophy scroll-reveal line-reveal" data-scroll-reveal>
        <h2>{lang === "el" ? "Η δική μου φιλοσοφία." : "My philosophy."}</h2>
        <div>
          <p>
            {lang === "el"
              ? "Δεν πιστεύω ότι το SMP αντικαθιστά τη μεταμόσχευση μαλλιών. Πιστεύω ότι κάθε θεραπεία έχει τη θέση της."
              : "I do not believe SMP replaces hair transplantation. I believe each treatment has its place."}
          </p>
          <p>
            {lang === "el"
              ? "Υπάρχουν άνθρωποι που είναι εξαιρετικοί υποψήφιοι για μεταμόσχευση και άλλοι που μπορεί να έχουν καλύτερο αισθητικό αποτέλεσμα με SMP. Υπάρχουν επίσης περιπτώσεις όπου, μετά από κατάλληλο σχεδιασμό, ο συνδυασμός των δύο μεθόδων μπορεί να προσφέρει το καλύτερο δυνατό αποτέλεσμα."
              : "Some people are excellent transplant candidates, while others may achieve a better aesthetic outcome with SMP. There are also cases where, with appropriate planning, combining the two approaches may offer the best result."}
          </p>
          <p>
            {lang === "el"
              ? "Ο στόχος μου δεν είναι να σας κατευθύνω προς μία συγκεκριμένη θεραπεία. Είναι να σας ενημερώσω με ειλικρίνεια, να αξιολογήσουμε μαζί την περίπτωσή σας και να επιλέξουμε τη λύση που μπορεί να προσφέρει το πιο φυσικό και ρεαλιστικό αποτέλεσμα."
              : "My goal is not to direct you towards one specific treatment. It is to inform you honestly, assess your circumstances together and choose the option most likely to provide a natural and realistic result."}
          </p>
          <a className="button" href={lang === "en" ? "/contact?lang=en" : "/contact"}>
            {lang === "el" ? "Κλείστε προσωπική αξιολόγηση" : "Book a personal consultation"} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

    </>
  );
}

function Results({ lang }: { lang: Language }) {
  const cases = [
    c("Ξυρισμένο αποτέλεσμα|Επανασχεδιασμός απαλής, ηλικιακά κατάλληλης γραμμής.", "Shaved finish|A soft, age-appropriate hairline redesign."),
    c("Αραίωση κορυφής|Μείωση της οπτικής αντίθεσης στην περιοχή της κορυφής.", "Crown thinning|Reduced visual contrast across the crown."),
    c("Ουλή FUE/FUT|Οπτική ενσωμάτωση ώριμης ουλής στο γύρω τριχωτό.", "FUE/FUT scar|Visual blending of a mature scar into surrounding hair."),
    c("Γυναικεία αραίωση|Διακριτική εντύπωση πυκνότητας ανάμεσα στα υπάρχοντα μαλλιά.", "Female thinning|A subtle impression of density between existing hairs."),
  ];
  return (
    <>
      <PageHero index="03" lang={lang} title={c("Πριν & Μετά", "Before & After")} intro={c("Το καλό αποτέλεσμα δεν αλλάζει ποιοι είστε. Αποκαθιστά την ισορροπία με τρόπο διακριτικό.", "A good result does not change who you are. It restores balance in an understated way.")} />
      <section className="section">
        <div className="section-head"><h2>{lang === "el" ? "Τέσσερις διαφορετικοί στόχοι." : "Four different goals."}</h2><p className="section-intro">{lang === "el" ? "Οι παρακάτω κατηγορίες παρουσιάζουν ενδεικτικές εφαρμογές. Τα πραγματικά αποτελέσματα διαφέρουν ανά άτομο." : "The categories below show representative applications. Individual outcomes vary."}</p></div>
        <div className="results-grid">
          {cases.map((item, i) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            const isCrownThinning = i === 1;
            return <article className={`case-card${isCrownThinning ? " case-card-crown" : ""}`} key={item.en}><div className={`case-visual${isCrownThinning ? " case-visual-crown" : ""}`} style={{ "--density": `${17 - i * 2}px` } as React.CSSProperties} role={isCrownThinning ? "img" : undefined} aria-label={isCrownThinning ? (lang === "el" ? "Αραίωση στην περιοχή της κορυφής" : "Crown thinning") : undefined} /><div className="case-copy"><div><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></div><span className="case-tag">{lang === "el" ? "Ενδεικτική εφαρμογή" : "Representative application"}</span></div></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Το φυσικό αποτέλεσμα χτίζεται σταδιακά." : "Natural results are built gradually."}</h2><p>{lang === "el" ? "Δεν επιδιώκουμε υπερβολική πυκνότητα από την πρώτη συνεδρία. Κάθε επίπεδο αξιολογείται μετά την επούλωση, ώστε η επόμενη εφαρμογή να παραμένει ελεγχόμενη και αρμονική." : "We do not chase excessive density in the first session. Each layer is assessed after healing so the next application stays controlled and harmonious."}</p></section>
    </>
  );
}

function Procedure({ lang }: { lang: Language }) {
  const steps = [
    c("Δωρεάν αξιολόγηση|Συζητάμε τον στόχο, το ιστορικό, το δέρμα και αν η τεχνική είναι κατάλληλη για εσάς.", "Free consultation|We discuss your goal, history, skin and whether the technique is right for you."),
    c("Σχεδιασμός hairline|Σχεδιάζουμε μαζί μια φυσική, ηλικιακά κατάλληλη γραμμή και επιλέγουμε τον σωστό τόνο.", "Hairline design|Together, we map a natural, age-appropriate hairline and select the right tone."),
    c("1η συνεδρία|Τοποθετούμε το πρώτο, απαλό επίπεδο σημείων που ορίζει τη βάση του αποτελέσματος.", "First session|We place the first subtle layer of impressions that establishes the foundation of the result."),
    c("2η συνεδρία|Μετά την επούλωση αξιολογούμε την απόκριση του δέρματος και χτίζουμε ελεγχόμενα την πυκνότητα.", "Second session|After healing, we assess the skin response and build density in a controlled way."),
    c("3η συνεδρία (αν χρειάζεται)|Προσθέτουμε τις τελευταίες λεπτομέρειες μόνο όπου χρειάζονται για ισορροπία και ομοιομορφία.", "Third session (if needed)|We add final refinements only where needed for balance and uniformity."),
    c("Οδηγίες μετά τη θεραπεία|Λαμβάνετε σαφείς προσωπικές οδηγίες για επούλωση, άσκηση, νερό, ήλιο και μακροχρόνια φροντίδα.", "Aftercare guidance|You receive clear personal guidance for healing, exercise, water, sun exposure and long-term care."),
  ];
  return (
    <>
      <PageHero index="04" lang={lang} title={c("Η διαδικασία", "The procedure")} intro={c("Σαφές πλάνο, ήρεμος ρυθμός και έλεγχος σε κάθε στάδιο.", "A clear plan, calm pace and control at every stage.")} />
      <section className="section">
        <div className="section-head"><h2 className="slim-title">{lang === "el" ? "Από την ιδέα στο επουλωμένο αποτέλεσμα." : "From first idea to healed result."}</h2><p className="section-intro">{lang === "el" ? "Η θεραπεία ολοκληρώνεται σταδιακά, ώστε το δέρμα να επουλώνεται και το αποτέλεσμα να αξιολογείται αντικειμενικά." : "Treatment is completed gradually so the skin can heal and the result can be assessed objectively."}</p></div>
        <div className="steps">
          {steps.map((item, i) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="step" key={item.en}><span className="step-no">0{i + 1}</span><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Χρόνος χωρίς πίεση." : "Time, without pressure."}</h2><p>{lang === "el" ? "Η διάρκεια και ο αριθμός συνεδριών εξαρτώνται από την έκταση, τον τύπο δέρματος και τον στόχο. Δεν οριστικοποιούμε θεραπεία χωρίς πρώτα να έχει προηγηθεί αξιολόγηση." : "Session length and number depend on treatment area, skin type and goal. We do not finalise a treatment plan before a proper consultation."}</p></section>
    </>
  );
}

function Aftercare({ lang }: { lang: Language }) {
  const cards = [
    c("Πρώτες ημέρες|Οι πρώτες ημέρες είναι σημαντικές για τη σωστή σταθεροποίηση της χρωστικής. Διατηρήστε την περιοχή καθαρή και στεγνή, αποφεύγοντας την επαφή, τον ιδρώτα και οποιαδήποτε δραστηριότητα μπορεί να επηρεάσει τη διαδικασία επούλωσης.", "First days|The first few days are important for the pigment to settle correctly. Keep the area clean and dry, avoiding contact, perspiration and any activity that could affect the healing process."),
    c("Πρώτη εβδομάδα|Κατά την πρώτη εβδομάδα, η περιοχή χρειάζεται ήπια φροντίδα και προστασία. Αποφύγετε την έντονη έκθεση στον ήλιο, την υπερβολική εφίδρωση και ακολουθήστε τις οδηγίες για τη διατήρηση ενός ομοιόμορφου και φυσικού αποτελέσματος.", "First week|During the first week, the area requires gentle care and protection. Avoid intense sun exposure and excessive perspiration, and follow the guidance provided to maintain an even, natural-looking result."),
    c("Μετά την επούλωση|Μετά την ολοκλήρωση της επούλωσης, η σωστή προστασία της περιοχής συμβάλλει στη μακροχρόνια διατήρηση του αποτελέσματος. Η χρήση αντηλιακής προστασίας και η κατάλληλη περιποίηση βοηθούν στη διατήρηση της έντασης και της φυσικότητας της εφαρμογής.", "After healing|Once healing is complete, proper protection of the area contributes to maintaining the result over time. Sun protection and appropriate care help preserve the intensity and natural appearance of the treatment."),
  ];
  return (
    <>
      <PageHero index="05" lang={lang} title={c("Φροντίδα", "Aftercare")} intro={c("Λίγες απλές συνήθειες προστατεύουν την επούλωση και βοηθούν το αποτέλεσμα να σταθεροποιηθεί σωστά.", "A few simple habits protect healing and help the result settle correctly.")} />
      <section className="section">
        <div className="section-head"><h2 className="slim-title">{lang === "el" ? "Η επούλωση είναι μέρος της θεραπείας." : "Healing is part of treatment."}</h2><p className="section-intro">{lang === "el" ? "Θα λάβετε ακριβείς, προσωπικές οδηγίες μετά από κάθε συνεδρία." : "You will receive precise, personal guidance after every session."}</p></div>
        <div className="content-grid">
          {cards.map((item) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="content-card" key={item.en}><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Δώστε χρόνο στο αποτέλεσμα να σταθεροποιηθεί." : "Allow the result time to stabilise."}</h2><p>{lang === "el" ? "Τις πρώτες ημέρες η απόχρωση μπορεί να εμφανίζεται πιο έντονη. Κατά τη διάρκεια της επούλωσης, το χρώμα σταδιακά μαλακώνει και προσαρμόζεται, αποκαλύπτοντας το τελικό φυσικό αποτέλεσμα. Η αξιολόγηση πραγματοποιείται στον χρόνο επανελέγχου." : "During the first few days, the shade may appear more intense. As healing progresses, the colour gradually softens and settles, revealing the final natural-looking result. The result is assessed at the scheduled follow-up appointment."}</p></section>
    </>
  );
}

function Doctor({ lang }: { lang: Language }) {
  const chapters = [
    {
      number: "01",
      title: c("Πειθαρχία και προσωπική διαδρομή", "Discipline and personal journey"),
      paragraphs: [
        c(
          "Από μικρή ηλικία, η πειθαρχία, η συνέπεια και η προσήλωση στους στόχους αποτέλεσαν θεμελιώδεις αξίες στην πορεία του Ανδρέα Πετρόπουλου. Η πολυετής ενασχόλησή του με τον αθλητισμό διαμόρφωσε μια φιλοσοφία συνεχούς εξέλιξης, επιμονής και δέσμευσης στην προσπάθεια για το καλύτερο δυνατό αποτέλεσμα. Με την ίδια φιλοσοφία προσεγγίζει και κάθε επαγγελματική πρόκληση, θέτοντας ως προτεραιότητα την ποιότητα, την υπευθυνότητα και τη δημιουργία σχέσεων εμπιστοσύνης.",
          "From an early age, discipline, consistency and commitment to his goals have been fundamental values throughout Andreas Petropoulos’s journey. His many years of involvement in sport shaped a philosophy of continuous development, perseverance and dedication to achieving the best possible result. He approaches every professional challenge with the same philosophy, prioritising quality, responsibility and the development of relationships built on trust."
        ),
        c(
          "",
          ""
        ),
        c(
          "",
          ""
        ),
      ],
    },
    {
      number: "02",
      title: c("Η προσωπική εμπειρία που με οδήγησε στο SMP", "The personal experience that led me to SMP"),
      paragraphs: [
        c(
          "Η πρώτη μου επαφή με το Scalp Micropigmentation (SMP) προέκυψε μέσα από μια προσωπική οικογενειακή εμπειρία, η οποία άλλαξε τον τρόπο με τον οποίο αντιλαμβανόμουν την αποκατάσταση της εικόνας και της αυτοπεποίθησης. Η αντιμετώπιση της αλωπεκίας από ένα κοντινό μου πρόσωπο και η εντυπωσιακή αλλαγή που έφερε η θεραπεία SMP αποτέλεσαν την αφετηρία για να γνωρίσω σε βάθος αυτή τη σύγχρονη τεχνική.",
          "My first encounter with Scalp Micropigmentation (SMP) came through a personal family experience that changed the way I understood the restoration of appearance and confidence. Seeing someone close to me address alopecia, and witnessing the remarkable change brought about by SMP treatment, became the starting point for exploring this modern technique in depth."
        ),
        c(
          "Με κίνητρο την ουσιαστική κατανόηση της μεθόδου και των δυνατοτήτων της, αποφάσισα να εκπαιδευτώ δίπλα σε καταξιωμένους επαγγελματίες του χώρου και να αφιερωθώ στην εξέλιξη της τεχνικής μου, με στόχο να προσφέρω φυσικά αποτελέσματα και μια εμπειρία που ενισχύει την αυτοπεποίθηση κάθε ανθρώπου που με εμπιστεύεται.",
          "Motivated by a desire to understand the method and its possibilities thoroughly, I decided to train alongside established professionals in the field and dedicate myself to developing my technique, with the aim of delivering natural results and an experience that strengthens the confidence of every person who places their trust in me."
        ),
      ],
    },
    {
      number: "03",
      title: c("Εξειδικευμένη εκπαίδευση", "Specialist training"),
      paragraphs: [
        c(
          "Στο πλαίσιο της συνεχούς εξέλιξης και εξειδίκευσής του, έχει παρακολουθήσει πλήθος εκπαιδευτικών προγραμμάτων και εξειδικευμένων σεμιναρίων στην Ελλάδα και το εξωτερικό. Μέσα από τη συνεχή εκπαίδευση, έχει διευρύνει τις γνώσεις του στις διαφορετικές τεχνικές, τις σύγχρονες μεθόδους εφαρμογής και τις πλέον εξελιγμένες προσεγγίσεις του Scalp Micropigmentation (SMP), με στόχο την επίτευξη φυσικών και υψηλής ποιότητας αποτελεσμάτων.",
          "As part of his continuous development and specialisation, he has attended numerous training programmes and specialist seminars in Greece and abroad. Through ongoing education, he has expanded his knowledge of different techniques, modern application methods and the most advanced approaches to Scalp Micropigmentation (SMP), with the aim of achieving natural, high-quality results."
        ),
      ],
    },
    {
      number: "04",
      title: c("Πάθος, τέχνη και προσωπική δέσμευση", "Passion, artistry and personal commitment"),
      paragraphs: [
        c(
          "Δεν επέλεξα το SMP απλώς ως επαγγελματική κατεύθυνση. Το επέλεξα γιατί πιστεύω βαθιά στη δύναμή του να επηρεάζει θετικά τη ζωή και την αυτοπεποίθηση ενός ανθρώπου. Για εμένα, το Scalp Micropigmentation αποτελεί έναν συνδυασμό τεχνικής ακρίβειας, αισθητικής αντίληψης και κατανόησης της ανθρώπινης ψυχολογίας.",
          "I did not choose SMP simply as a career path. I chose it because I deeply believe in its ability to make a positive difference to a person’s life and confidence. To me, Scalp Micropigmentation combines technical precision, aesthetic awareness and an understanding of human psychology."
        ),
        c(
          "Κάθε εφαρμογή αποτελεί μια ξεχωριστή ευθύνη και μια προσωπική δέσμευση. Στόχος μου είναι κάθε άνθρωπος που με εμπιστεύεται να αποκτά ένα απόλυτα φυσικό αποτέλεσμα, προσαρμοσμένο στα ιδιαίτερα χαρακτηριστικά του και στις προσωπικές του ανάγκες, ώστε να νιώθει ξανά αυτοπεποίθηση και ασφάλεια με την εικόνα του.",
          "Every treatment carries a distinct responsibility and a personal commitment. My goal is for every person who places their trust in me to receive a completely natural result, tailored to their individual features and personal needs, so they can feel confident and comfortable with their appearance again."
        ),
        c(
          "Για μένα, το SMP δεν είναι απλώς μια υπηρεσία. Είναι μια διαδικασία αποκατάστασης της εικόνας, της αυτοπεποίθησης και της σχέσης του ανθρώπου με τον εαυτό του.",
          "For me, SMP is not simply a service. It is a process of restoring a person’s appearance, confidence and relationship with themselves."
        ),
        c(
          "",
          ""
        ),
      ],
    },
  ];

  return (
    <>
      <PageHero
        index="08"
        lang={lang}
        title={c("Γνώρισε τον Ανδρέα Πετρόπουλο", "Meet Andreas Petropoulos")}
        intro={c("Η προσωπική ιστορία, η εκπαίδευση και η φιλοσοφία πίσω από κάθε εφαρμογή SMP.", "The personal story, training and philosophy behind every SMP treatment.")}
      />
      <section className="section doctor-profile">
        <div className="doctor-portrait" role="img" aria-label={lang === "el" ? "Ανδρέας Πετρόπουλος — DermaDot" : "Andreas Petropoulos — DermaDot"}>
          <span>DERMA<span className="brand-inline-dot">DOT</span></span>
        </div>
        <div className="doctor-introduction">
          <p className="eyebrow">{lang === "el" ? "Προσωπικό προφίλ" : "Personal profile"}</p>
          <h2 className="slim-title">{lang === "el" ? <>Ανδρέας<br />Πετρόπουλος</> : <>Andreas<br />Petropoulos</>}</h2>
          <p className="doctor-lede">
            {lang === "el"
              ? "Ο Ανδρέας Πετρόπουλος είναι απόφοιτος του Αρσακείου Σχολείου και του Πανεπιστημίου Queen Margaret στη Σκωτία, όπου ολοκλήρωσε τις σπουδές του στον τομέα του Management. Η ακαδημαϊκή του πορεία και η διεπιστημονική του προσέγγιση αποτελούν τη βάση για τη διαμόρφωση μιας σύγχρονης αντίληψης γύρω από την οργάνωση, τη διοίκηση και την παροχή υψηλού επιπέδου υπηρεσιών υγείας."
              : "Andreas Petropoulos is a graduate of Arsakeio School and Queen Margaret University in Scotland, where he completed his studies in Management. His academic journey and interdisciplinary approach form the foundation of a modern perspective on organisation, management and the delivery of high-quality healthcare services."}
          </p>
        </div>
      </section>
      <section className="section doctor-story">
        <div className="section-head">
          <h2>{lang === "el" ? "Η ιστορία μου." : "My story."}</h2>
          <p className="section-intro">
            {lang === "el"
              ? "Με επίκεντρο τον άνθρωπο και τη σύγχρονη προσέγγιση στη φροντίδα υγείας, ο Ανδρέας Πετρόπουλος συνδυάζει συνέπεια, επιστημονική κατάρτιση και αφοσίωση, δημιουργώντας σχέσεις εμπιστοσύνης με κάθε ασθενή."
              : "With a people-centred focus and a modern approach to healthcare, Andreas Petropoulos combines consistency, professional expertise and dedication, building relationships of trust with every client."}
          </p>
        </div>
        <div className="doctor-biography">
          {chapters.map((chapter) => (
            <article className="doctor-chapter" key={chapter.number}>
              <span>{chapter.number}</span>
              <div>
                <h3 className="slim-title">{chapter.title[lang]}</h3>
                {chapter.paragraphs.map((paragraph, index) => {
                  if (!paragraph[lang]) return null;
                  if (chapter.number === "04" && index === 0) {
                    return (
                      <p key={paragraph.en}>
                        {lang === "el" ? (
                          <>
                            <strong className="doctor-emphasis-inline">Δεν επέλεξα το SMP απλώς ως επαγγελματική κατεύθυνση</strong>. Το επέλεξα γιατί πιστεύω βαθιά στη δύναμή του να επηρεάζει θετικά τη ζωή και την αυτοπεποίθηση ενός ανθρώπου. Για εμένα, το Scalp Micropigmentation αποτελεί έναν συνδυασμό τεχνικής ακρίβειας, αισθητικής αντίληψης και κατανόησης της ανθρώπινης ψυχολογίας.
                          </>
                        ) : (
                          <>
                            <strong className="doctor-emphasis-inline">I did not choose SMP simply as a career path</strong>. I chose it because I deeply believe in its ability to make a positive difference to a person’s life and confidence. To me, Scalp Micropigmentation combines technical precision, aesthetic awareness and an understanding of human psychology.
                          </>
                        )}
                      </p>
                    );
                  }
                  return (
                    <p className={chapter.number === "04" && index === 0 ? "doctor-emphasis" : ""} key={paragraph.en}>
                      {paragraph[lang]}
                    </p>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section doctor-quote">
        <p>{lang === "el" ? "«Πιστεύω πως κάθε άνθρωπος αξίζει να νιώθει καλά με την εικόνα του. Το SMP για μένα είναι η δυνατότητα να συμβάλλω σε αυτή την αλλαγή.»" : "“I believe that everyone deserves to feel good about their appearance. For me, SMP is an opportunity to contribute to that change.”"}</p>
        <a className="button" href={lang === "en" ? "/contact?lang=en" : "/contact"}>
          {lang === "el" ? "Γνωρίστε μας από κοντά" : "Meet us in person"} <span aria-hidden="true">→</span>
        </a>
      </section>
    </>
  );
}

function Contact({ lang }: { lang: Language }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };
  return (
    <>
      <PageHero index="06" lang={lang} title={c("Επικοινωνία", "Contact")} intro={c("Η πρώτη αξιολόγηση είναι μια ιδιωτική, χωρίς πίεση συζήτηση για τον στόχο και τις επιλογές σας.", "Your first consultation is a private, pressure-free conversation about your goal and options.")} />
      <section className="section contact-layout">
        <div>
          <div className="contact-details">
            <div className="contact-row"><span className="contact-label">{lang === "el" ? "Ώρες λειτουργίας" : "Hours"}</span><span className="contact-value appointment-only">{lang === "el" ? "Κατόπιν ραντεβού" : "By appointment only"}</span></div>
            <div className="contact-row"><span className="contact-label">{lang === "el" ? "Τηλέφωνο" : "Phone"}</span><span className="contact-value"><a href="tel:+302100000000">+30 210 000 0000</a></span></div>
            <div className="contact-row"><span className="contact-label">Email</span><span className="contact-value"><a href="mailto:hello@dermadot.gr">hello@dermadot.gr</a></span></div>
            <div className="contact-row"><span className="contact-label">{lang === "el" ? "Διεύθυνση" : "Address"}</span><span className="contact-value">{lang === "el" ? "Κολωνάκι, Αθήνα 106 73" : "Kolonaki, Athens 106 73"}</span></div>
          </div>
          <a className="map-card" href="https://maps.google.com/?q=Kolonaki+Athens" target="_blank" rel="noreferrer" aria-label={lang === "el" ? "Άνοιγμα χάρτη" : "Open map"}>
            <span className="contact-label">{lang === "el" ? "Προβολή στον χάρτη" : "View on map"} ↗</span>
            <span className="map-dot" />
            <p>37.9794° N / 23.7415° E</p>
          </a>
        </div>
        <div>
          <p className="eyebrow">{lang === "el" ? "Αίτημα αξιολόγησης" : "Consultation request"}</p>
          <form className="contact-form" onSubmit={submit}>
            <div className="field"><label htmlFor="name">{lang === "el" ? "Ονοματεπώνυμο" : "Full name"}</label><input id="name" name="name" autoComplete="name" required /></div>
            <div className="field"><label htmlFor="contact">{lang === "el" ? "Τηλέφωνο ή email" : "Phone or email"}</label><input id="contact" name="contact" required /></div>
            <div className="field"><label htmlFor="message">{lang === "el" ? "Πώς μπορούμε να βοηθήσουμε;" : "How can we help?"}</label><textarea id="message" name="message" required /></div>
            <button className="button" type="submit">{lang === "el" ? "Αποστολή αιτήματος" : "Send request"}</button>
            <p className="form-note">{lang === "el" ? "Με την αποστολή συμφωνείτε να επικοινωνήσουμε μαζί σας σχετικά με το αίτημά σας." : "By sending, you agree that we may contact you about your request."}</p>
            {sent && <div className="form-success" role="status">{lang === "el" ? "Ευχαριστούμε. Το αίτημά σας καταχωρήθηκε για αυτή την επίδειξη." : "Thank you. Your request has been recorded for this demonstration."}</div>}
          </form>
        </div>
      </section>
    </>
  );
}

function FAQ({ lang }: { lang: Language }) {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);
  useScrollReveal();

  const toggleQuestion = (index: number) => {
    setOpenQuestion((current) => (current === index ? null : index));
  };

  return (
    <>
      <PageHero index="07" lang={lang} title={c("Συχνές Ερωτήσεις", "FAQ")} intro={c("Σύντομες, ξεκάθαρες απαντήσεις στα θέματα που συζητάμε πιο συχνά στην πρώτη αξιολόγηση.", "Clear, concise answers to the topics we discuss most often during a first consultation.")} />
      <section className="section">
        <div className="faq-list">
          {faqItems.map((question, i) => {
            const isOpen = openQuestion === i;
            const answerId = `faq-answer-${i}`;

            return (
              <article
                className="faq-row scroll-reveal scroll-reveal-question line-reveal"
                data-scroll-reveal
                data-open={isOpen ? "true" : "false"}
                key={question.en}
              >
                <button
                  className="faq-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleQuestion(i)}
                >
                  <h2 className="faq-question">{question[lang]}</h2>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-answer-wrap" id={answerId} aria-hidden={!isOpen}>
                  <div>
                    <p className="faq-answer">{faqAnswers[i][lang]}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

function BackToTop({ lang }: { lang: Language }) {
  const [buttonBottom, setButtonBottom] = useState<number | null>(null);

  useEffect(() => {
    let animationFrame = 0;

    const updatePosition = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const footerDivider = document.querySelector<HTMLElement>(".footer-bottom");
        if (!footerDivider) return;

        const baseBottom = window.innerWidth <= 700
          ? 18
          : Math.max(22, Math.min(window.innerWidth * .03, 42));
        const footerDividerTop = footerDivider.getBoundingClientRect().top;
        const stoppedBottom = window.innerHeight - footerDividerTop - 10;

        setButtonBottom(Math.max(baseBottom, stoppedBottom));
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, []);

  const returnToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      className="back-to-top"
      type="button"
      style={buttonBottom === null ? undefined : { bottom: `${buttonBottom}px` }}
      aria-label={lang === "el" ? "Επιστροφή στην αρχή της σελίδας" : "Return to the top of the page"}
      onClick={returnToTop}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}

export default function DermaDotSite({ route }: { route: Route }) {
  const { lang, change } = useLanguage();
  const activeRoute: Route = route === "results" && !RESULTS_ENABLED ? "home" : route;
  const pages: Record<Route, React.ReactNode> = {
    home: <Home lang={lang} />,
    info: <Info lang={lang} />,
    applications: <Applications lang={lang} />,
    doctor: <Doctor lang={lang} />,
    "what-is-smp": <WhatIsSmp lang={lang} />,
    "treatment-guide": <TreatmentGuide lang={lang} />,
    results: <Results lang={lang} />,
    procedure: <Procedure lang={lang} />,
    aftercare: <Aftercare lang={lang} />,
    contact: <Contact lang={lang} />,
    faq: <FAQ lang={lang} />,
  };
  return (
    <div className="site-shell">
      <Header lang={lang} route={activeRoute} onLanguage={change} />
      <main className="page" key={`${activeRoute}-${lang}`}>{pages[activeRoute]}</main>
      <Footer lang={lang} />
      <BackToTop lang={lang} />
    </div>
  );
}

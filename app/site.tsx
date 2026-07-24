"use client";

import { FormEvent, useEffect, useState } from "react";

type Language = "el" | "en";
type Route =
  | "home"
  | "info"
  | "what-is-smp"
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

const nav: { route: Route; href: string; label: Copy }[] = [
  { route: "info", href: "/info", label: c("Πληροφορίες", "Info") },
  { route: "what-is-smp", href: "/what-is-smp", label: c("Τι είναι το SMP", "What is SMP") },
  { route: "results", href: "/results", label: c("Πριν & Μετά", "Before & After") },
  { route: "procedure", href: "/procedure", label: c("Διαδικασία", "Procedure") },
  { route: "aftercare", href: "/aftercare", label: c("Φροντίδα", "Aftercare") },
  { route: "contact", href: "/contact", label: c("Επικοινωνία", "Contact") },
  { route: "faq", href: "/faq", label: c("Συχνές Ερωτήσεις", "FAQ") },
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
    "Οι περισσότεροι πελάτες περιγράφουν ήπια έως μέτρια ενόχληση, η οποία είναι συνήθως καλά ανεκτή. Η αίσθηση διαφέρει ανά περιοχή και άτομο.",
    "Most clients describe mild to moderate discomfort that is usually well tolerated. Sensation varies by area and from person to person."
  ),
  c(
    "Το κόστος εξαρτάται από την έκταση της περιοχής, την εφαρμογή και τον αριθμό των συνεδριών. Μετά τη δωρεάν αξιολόγηση λαμβάνετε σαφή, εξατομικευμένη προσφορά.",
    "Cost depends on the treatment area, application and number of sessions. After your free consultation, you receive a clear, personalised quote."
  ),
  c(
    "Το αποτέλεσμα διατηρείται συνήθως για αρκετά χρόνια. Η διάρκεια επηρεάζεται από τον τύπο δέρματος, την έκθεση στον ήλιο, τον τρόπο ζωής και τη σωστή φροντίδα.",
    "Results usually last for several years. Longevity is influenced by skin type, sun exposure, lifestyle and proper aftercare."
  ),
  c(
    "Ναι, το χρώμα μαλακώνει και ξεθωριάζει σταδιακά με τον χρόνο. Αυτή η φυσιολογική εξέλιξη επιτρέπει στο αποτέλεσμα να παραμένει διακριτικό καθώς αλλάζει η εμφάνισή σας.",
    "Yes. The pigment softens and fades gradually over time. This normal progression helps the result remain subtle as your appearance changes."
  ),
  c(
    "Μπορεί να χρειαστεί μια συνεδρία ανανέωσης έπειτα από μερικά χρόνια. Η καθημερινή αντηλιακή προστασία βοηθά σημαντικά στη διατήρηση του τόνου.",
    "A refresh session may be useful after several years. Daily sun protection makes a meaningful difference to colour retention."
  ),
  c(
    "Αποφύγετε έντονη άσκηση και υπερβολικό ιδρώτα τις πρώτες ημέρες. Επιστρέφετε σταδιακά, ακολουθώντας τις προσωπικές οδηγίες που θα σας δοθούν.",
    "Avoid intense exercise and heavy sweating during the first few days. Return gradually, following the personal aftercare guidance you receive."
  ),
  c(
    "Όχι αμέσως μετά τη συνεδρία. Θάλασσα, πισίνα και έντονη ηλιακή έκθεση αποφεύγονται κατά την αρχική επούλωση· θα σας ενημερώσουμε πότε είναι ασφαλής η επιστροφή.",
    "Not immediately after a session. Sea water, pools and strong sun exposure should be avoided during initial healing; we will tell you when it is safe to return."
  ),
  c(
    "Ναι, σε πολλές περιπτώσεις το SMP δεν αποκλείει μια μελλοντική μεταμόσχευση. Απαιτείται όμως κοινός σχεδιασμός με τον ιατρό μεταμόσχευσης και πλήρης αξιολόγηση πριν αποφασιστεί το επόμενο βήμα.",
    "Yes, in many cases SMP does not prevent a future hair transplant. The next step should, however, be planned with your transplant surgeon after a full assessment."
  ),
];

function useLanguage() {
  const [lang, setLang] = useState<Language>("el");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("lang") === "en") {
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

function Header({ lang, route, onLanguage }: { lang: Language; route: Route; onLanguage: (lang: Language) => void }) {
  const url = (href: string) => (lang === "en" ? `${href}?lang=en` : href);

  return (
    <header className="site-header">
      <div className="header-top">
        <a href={url("/")} className="brand" aria-label="DermaDot home">
          <img className="brand-logo" src="/logo.png" alt="DermaDot Plus — Andreas Petropoulos" />
        </a>
        <div className="header-actions">
          <button
            className="lang-toggle"
            type="button"
            onClick={() => onLanguage(lang === "el" ? "en" : "el")}
            aria-label={lang === "el" ? "Switch to English" : "Αλλαγή στα Ελληνικά"}
          >
            <span className={lang === "en" ? "active" : ""}>EN</span>
            <span>/</span>
            <span className={lang === "el" ? "active" : ""}>ΕΛ</span>
          </button>
          <a className="header-call" href="tel:+302100000000">
            <span aria-hidden="true">☎</span>
            {lang === "el" ? "Καλέστε τώρα" : "Call now"}
          </a>
        </div>
      </div>
      <div className="nav-wrap">
        <nav className="main-nav" aria-label={lang === "el" ? "Κύρια πλοήγηση" : "Main navigation"}>
          {nav.map((item) => (
            <a key={item.route} className={`nav-link ${route === item.route ? "active" : ""}`} href={url(item.href)}>
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
        <div className="footer-name">DermaDot</div>
        <div className="footer-cta">
          <span className="eyebrow">{lang === "el" ? "Το επόμενο βήμα" : "Your next step"}</span>
          <p>
            {lang === "el"
              ? "Μια ήρεμη, ιδιωτική συζήτηση είναι ο καλύτερος τρόπος να δούμε αν το SMP είναι κατάλληλο για εσάς."
              : "A calm, private conversation is the best way to see whether SMP is right for you."}
          </p>
          <a className="button" href={lang === "en" ? "/contact?lang=en" : "/contact"}>
            {lang === "el" ? "Κλείστε αξιολόγηση" : "Book a consultation"}
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DERMADOT</span>
        <span>{lang === "el" ? "ΜΙΚΡΟΧΡΩΜΑΤΩΣΗ ΤΡΙΧΩΤΟΥ • ΑΘΗΝΑ" : "SCALP MICROPIGMENTATION • ATHENS"}</span>
        <a href="/photo-manager">{lang === "el" ? "ΔΙΑΧΕΙΡΙΣΗ ΦΩΤΟΓΡΑΦΙΩΝ" : "MANAGE PHOTOS"}</a>
      </div>
    </footer>
  );
}

function PageHero({ index, title, intro, lang }: { index: string; title: Copy; intro: Copy; lang: Language }) {
  return (
    <section className="page-hero">
      <div className="page-hero-main">
        <p className="eyebrow">DermaDot / {index}</p>
        <h1>{title[lang]}</h1>
      </div>
      <aside className="page-hero-aside">
        <span className="page-code">SMP — {index}</span>
        <p>{intro[lang]}</p>
      </aside>
    </section>
  );
}

function Home({ lang }: { lang: Language }) {
  const url = (href: string) => (lang === "en" ? `${href}?lang=en` : href);
  return (
    <>
      <section className="template-hero">
        <div className="template-hero-shade" />
        <div className="template-hero-copy">
          <p className="hero-kicker">{lang === "el" ? "Scalp Micropigmentation • Αθήνα" : "Scalp Micropigmentation • Athens"}</p>
          <h1>
            {lang === "el" ? <>Φυσική<br />Ακρίβεια.</> : <>Natural<br />Precision.</>}
          </h1>
          <p className="hero-lede">
            {lang === "el"
              ? "Εξατομικευμένη μικροχρωμάτωση τριχωτού, σχεδιασμένη για να δείχνει αβίαστη, καθαρή και απόλυτα δική σας."
              : "Individual scalp micropigmentation designed to look effortless, refined and entirely your own."}
          </p>
          <div className="hero-actions">
            <a className="button" href={url("/contact")}>
              {lang === "el" ? "Κλείστε ραντεβού" : "Book appointment"} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
      <section className="template-about">
        <div className="about-image about-image-left" role="img" aria-label={lang === "el" ? "Λεπτομέρεια εφαρμογής SMP" : "SMP treatment detail"} />
        <div className="about-center">
          <p className="about-label">— {lang === "el" ? "η προσέγγισή μας" : "our approach"} —</p>
          <h2>{lang === "el" ? "Ένας απλός τρόπος να ξαναβρείτε την αυτοπεποίθησή σας." : "A simple way to restore your confidence."}</h2>
          <p>
            {lang === "el"
              ? "Με προσεκτικό σχεδιασμό, ελεγχόμενη τεχνική και χρόνο για κάθε λεπτομέρεια, δημιουργούμε ένα φυσικό αποτέλεσμα προσαρμοσμένο αποκλειστικά σε εσάς."
              : "Through considered design, controlled technique and time for every detail, we create a natural result tailored entirely to you."}
          </p>
          <a className="button" href={url("/info")}>
            {lang === "el" ? "Μάθετε περισσότερα" : "Learn more"} <span aria-hidden="true">→</span>
          </a>
          <div className="about-image about-image-wide" role="img" aria-label={lang === "el" ? "Φυσικό αποτέλεσμα SMP" : "Natural SMP result"} />
        </div>
        <div className="about-right">
          <div className="about-image about-image-right" role="img" aria-label={lang === "el" ? "Εξειδικευμένη φροντίδα SMP" : "Specialist SMP care"} />
          <div className="about-stat">
            <strong>2–3</strong>
            <span>{lang === "el" ? "συνεδρίες για ένα σταδιακό, φυσικό αποτέλεσμα" : "sessions for a gradual, natural result"}</span>
          </div>
        </div>
      </section>
      <section className="section template-topics">
        <div className="section-head">
          <h2>{lang === "el" ? "Όλα όσα χρειάζεται να γνωρίζετε." : "Everything you need to know."}</h2>
          <p className="section-intro">
            {lang === "el"
              ? "Εξερευνήστε κάθε στάδιο της θεραπείας σε ξεχωριστή, γρήγορη σελίδα."
              : "Explore each part of treatment on its own fast, focused page."}
          </p>
        </div>
        <div className="topic-grid">
          {topicCards.map((topic, i) => (
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
    title: c("Ανδρική αλωπεκία", "Male hair loss"),
    text: c("Δημιουργεί την εικόνα ενός φυσικά ξυρισμένου τριχωτού και επαναπροσδιορίζει διακριτικά τη γραμμή των μαλλιών.", "Creates the appearance of a naturally shaved scalp and subtly redefines the hairline."),
  },
  {
    title: c("Γυναικεία αραίωση", "Female thinning"),
    text: c("Μειώνει την αντίθεση του ορατού δέρματος ανάμεσα στα υπάρχοντα μαλλιά, προσφέροντας την εντύπωση μεγαλύτερης πυκνότητας.", "Reduces the contrast of visible scalp between existing hairs, creating the impression of greater density."),
  },
  {
    title: c("Ουλές από μεταμόσχευση", "Hair-transplant scars"),
    text: c("Ενσωματώνει οπτικά ώριμες ουλές FUE ή FUT στο γύρω τριχωτό, μειώνοντας την αντίθεσή τους.", "Visually blends mature FUE or FUT scars into the surrounding scalp, reducing their contrast."),
  },
  {
    title: c("Ουλές από τραυματισμούς", "Trauma scars"),
    text: c("Μπορεί να καμουφλάρει επιλεγμένες, πλήρως επουλωμένες ουλές έπειτα από προσεκτική αξιολόγηση.", "Can camouflage selected, fully healed scars after careful assessment."),
  },
  {
    title: c("Alopecia Areata", "Alopecia Areata"),
    text: c("Σε σταθεροποιημένες περιπτώσεις μπορεί να μειώσει οπτικά τη διαφορά ανάμεσα στις περιοχές με και χωρίς τρίχες.", "In stable cases, it can visually reduce the contrast between areas with and without hair."),
  },
  {
    title: c("Γένια", "Beard"),
    text: c("Προσθέτει την οπτική εντύπωση πυκνότητας ή βοηθά στην εξισορρόπηση κενών στην περιοχή των γενιών.", "Adds the visual impression of density or helps balance gaps within the beard area."),
  },
  {
    title: c("Διόρθωση αποτυχημένου SMP", "Correction of previous SMP"),
    text: c("Αξιολογούμε χρώμα, βάθος, σχήμα και κατάσταση του δέρματος πριν προτείνουμε ασφαλή διόρθωση ή ανασχεδιασμό.", "We assess colour, depth, shape and skin condition before recommending a safe correction or redesign."),
  },
];

function Info({ lang }: { lang: Language }) {
  const [activeApplication, setActiveApplication] = useState(0);
  const activeCard = infoCards[activeApplication];

  const moveApplication = (direction: number) => {
    setActiveApplication((current) => {
      const next = current + direction;
      if (next < 0) return infoCards.length - 1;
      if (next >= infoCards.length) return 0;
      return next;
    });
  };

  return (
    <>
      <section className="section applications-page">
        <div className="applications-heading">
          <span className="title-quote title-quote-open" aria-hidden="true">“</span>
          <h1>{lang === "el" ? "Εξειδικευμένες εφαρμογές SMP" : "Specialised SMP Applications"}</h1>
          <span className="title-quote title-quote-close" aria-hidden="true">”</span>
          <p>
            {lang === "el"
              ? "Επιλέξτε μία εφαρμογή για να δείτε πώς το SMP προσαρμόζεται σε κάθε διαφορετική ανάγκη."
              : "Select an application to see how SMP is adapted to each individual need."}
          </p>
        </div>
        <div className="applications-carousel">
          <div className="applications-tabs" role="tablist" aria-label={lang === "el" ? "Εφαρμογές SMP" : "SMP applications"}>
            {infoCards.map((card, index) => (
              <button
                className={`application-tab ${activeApplication === index ? "active" : ""}`}
                id={`application-tab-${index}`}
                key={card.title.en}
                type="button"
                role="tab"
                aria-controls="application-panel"
                aria-selected={activeApplication === index}
                tabIndex={activeApplication === index ? 0 : -1}
                onClick={() => setActiveApplication(index)}
              >
                <span>0{index + 1}</span>
                <strong>{card.title[lang]}</strong>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <article
            className="application-panel"
            id="application-panel"
            role="tabpanel"
            aria-labelledby={`application-tab-${activeApplication}`}
            key={`${lang}-${activeApplication}`}
          >
            <span className="application-panel-number">0{activeApplication + 1} / 07</span>
            <div>
              <h2>{activeCard.title[lang]}</h2>
              <p>{activeCard.text[lang]}</p>
            </div>
            <div className="application-controls">
              <button type="button" onClick={() => moveApplication(-1)} aria-label={lang === "el" ? "Προηγούμενη εφαρμογή" : "Previous application"}>←</button>
              <button type="button" onClick={() => moveApplication(1)} aria-label={lang === "el" ? "Επόμενη εφαρμογή" : "Next application"}>→</button>
            </div>
          </article>
        </div>
      </section>
      <section className="section note-panel">
        <h2>{lang === "el" ? "Όχι μια γενική λύση." : "Never one-size-fits-all."}</h2>
        <p>{lang === "el" ? "Κάθε δέρμα, μοτίβο αραίωσης και προσδοκία είναι διαφορετικά. Η προσωπική αξιολόγηση προηγείται πάντα της θεραπείας και περιλαμβάνει ειλικρινή συζήτηση για το τι μπορεί — και τι δεν μπορεί — να προσφέρει η τεχνική." : "Every skin type, thinning pattern and expectation is different. A personal consultation always comes first, including an honest discussion of what the technique can — and cannot — achieve."}</p>
      </section>
    </>
  );
}

function WhatIsSmp({ lang }: { lang: Language }) {
  const essentials = [
    c("Πώς λειτουργεί|Με εξειδικευμένη βελόνα δημιουργούνται μικροσκοπικά σημεία χρωστικής στο ανώτερο στρώμα του δέρματος, μιμούμενα φυσικούς θύλακες.", "How it works|A specialist needle places microscopic pigment impressions in the upper layer of the skin, mimicking natural follicles."),
    c("Πόσο διαρκεί|Το αποτέλεσμα συνήθως παραμένει ορατό για αρκετά χρόνια, ανάλογα με το δέρμα, τον ήλιο, τον τρόπο ζωής και τη φροντίδα.", "How long it lasts|Results usually remain visible for several years, depending on skin, sun exposure, lifestyle and aftercare."),
    c("Μόνιμο ή ημιμόνιμο;|Θεωρείται μακράς διάρκειας αλλά όχι αμετάβλητο. Η χρωστική μαλακώνει και ξεθωριάζει σταδιακά με τον χρόνο.", "Permanent or semi-permanent?|It is long-lasting but not unchanging. Pigment softens and fades gradually over time."),
    c("Είναι ασφαλές;|Όταν εφαρμόζεται από εκπαιδευμένο επαγγελματία με σωστή υγιεινή, αποστειρωμένο εξοπλισμό και κατάλληλες χρωστικές, είναι μη χειρουργική και ελεγχόμενη διαδικασία.", "Is it safe?|When performed by a trained professional using proper hygiene, sterile equipment and suitable pigments, it is a controlled, non-surgical procedure."),
    c("Πόσες συνεδρίες χρειάζονται;|Συνήθως χρειάζονται 2–3 συνεδρίες, με χρόνο επούλωσης ανάμεσά τους ώστε η πυκνότητα να χτίζεται σταδιακά.", "How many sessions are needed?|Most treatments need 2–3 sessions, with healing time between them so density can be built gradually."),
    c("Πονάει;|Οι περισσότεροι περιγράφουν ήπια έως μέτρια ενόχληση. Η αίσθηση διαφέρει ανά περιοχή και από άτομο σε άτομο.", "Does it hurt?|Most clients report mild to moderate discomfort. Sensation varies by area and from person to person."),
    c("Τι χρωστικές χρησιμοποιούνται|Χρησιμοποιούνται επαγγελματικές χρωστικές ειδικά επιλεγμένες για SMP και προσαρμοσμένες στον τόνο του δέρματος και των μαλλιών.", "Which pigments are used|Professional pigments selected specifically for SMP are matched to the tone of your skin and hair."),
  ];
  return (
    <>
      <PageHero index="02" lang={lang} title={c("Τι είναι το SMP;", "What is SMP?")} intro={c("Μια εξειδικευμένη τεχνική που δημιουργεί την οπτική εντύπωση φυσικών θυλάκων τρίχας.", "A specialised technique that creates the visual impression of natural hair follicles.")} />
      <section className="section">
        <div className="section-head"><h2>{lang === "el" ? "Όλα όσα χρειάζεται να γνωρίζετε." : "Everything you need to know."}</h2><p className="section-intro">{lang === "el" ? "Η SMP είναι μια μη χειρουργική τεχνική οπτικής αποκατάστασης. Οι βασικές απαντήσεις παρακάτω εξηγούν πώς εφαρμόζεται και τι να περιμένετε." : "SMP is a non-surgical visual restoration technique. The essentials below explain how it is performed and what to expect."}</p></div>
        <div className="content-grid essentials-grid">
          {essentials.map((item) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="content-card" key={item.en}><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Δεν είναι τατουάζ μαλλιών." : "It is not a hair tattoo."}</h2><p>{lang === "el" ? "Η SMP χρησιμοποιεί εξειδικευμένα εργαλεία, χρωστικές και τεχνική σημείου για το τριχωτό. Το επιθυμητό αποτέλεσμα είναι απαλό, πολυεπίπεδο και προσαρμοσμένο στο δέρμα — όχι μια συμπαγής, επίπεδη επιφάνεια χρώματος." : "SMP uses specialised tools, pigments and scalp-specific dot technique. The intended result is soft, layered and adjusted to the skin — not a solid, flat block of colour."}</p></section>
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
        <PublicPhotoGallery lang={lang} />
        <div className="results-grid">
          {cases.map((item, i) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="case-card" key={item.en}><div className="case-visual" style={{ "--density": `${17 - i * 2}px` } as React.CSSProperties} /><div className="case-copy"><div><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></div><span className="case-tag">{lang === "el" ? "Ενδεικτική εφαρμογή" : "Representative application"}</span></div></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Το φυσικό αποτέλεσμα χτίζεται σταδιακά." : "Natural results are built gradually."}</h2><p>{lang === "el" ? "Δεν επιδιώκουμε υπερβολική πυκνότητα από την πρώτη συνεδρία. Κάθε επίπεδο αξιολογείται μετά την επούλωση, ώστε η επόμενη εφαρμογή να παραμένει ελεγχόμενη και αρμονική." : "We do not chase excessive density in the first session. Each layer is assessed after healing so the next application stays controlled and harmonious."}</p></section>
    </>
  );
}

type GalleryPhoto = {
  id: string;
  alt: string;
  uploadedAt: string;
  url: string;
};

function PublicPhotoGallery({ lang }: { lang: Language }) {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/photos", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: { photos?: GalleryPhoto[] }) => {
        if (active) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        if (active) setPhotos([]);
      });
    return () => {
      active = false;
    };
  }, []);

  if (photos.length === 0) return null;

  return (
    <div className="public-photo-section">
      <div className="public-photo-heading">
        <span className="eyebrow">{lang === "el" ? "Πραγματικά αποτελέσματα" : "Real results"}</span>
        <p>
          {lang === "el"
            ? "Φωτογραφίες που έχουν επιλεγεί και δημοσιευτεί από το DermaDot."
            : "Photos selected and published by DermaDot."}
        </p>
      </div>
      <div className="public-photo-grid">
        {photos.map((photo) => (
          <figure className="public-photo" key={photo.id}>
            <img src={photo.url} alt={photo.alt} loading="lazy" />
            <figcaption>{photo.alt}</figcaption>
          </figure>
        ))}
      </div>
    </div>
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
        <div className="section-head"><h2>{lang === "el" ? "Από την ιδέα στο επουλωμένο αποτέλεσμα." : "From first idea to healed result."}</h2><p className="section-intro">{lang === "el" ? "Η θεραπεία ολοκληρώνεται σταδιακά, ώστε το δέρμα να επουλώνεται και το αποτέλεσμα να αξιολογείται αντικειμενικά." : "Treatment is completed gradually so the skin can heal and the result can be assessed objectively."}</p></div>
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
    c("Πρώτες ημέρες|Κρατήστε την περιοχή στεγνή, μην την αγγίζετε και αποφύγετε έντονη άσκηση ή ιδρώτα.", "First days|Keep the area dry, do not touch it, and avoid intense exercise or heavy sweating."),
    c("Πρώτη εβδομάδα|Αποφύγετε πισίνα, σάουνα, ατμό, ξύρισμα πάνω στην περιοχή και προϊόντα που δεν έχουν εγκριθεί.", "First week|Avoid pools, saunas, steam, shaving over the area and any products not approved for use."),
    c("Μετά την επούλωση|Προστατεύετε καθημερινά από τον ήλιο και ακολουθείτε την ήπια ρουτίνα που έχει προταθεί.", "After healing|Use daily sun protection and follow the gentle routine recommended for you."),
  ];
  return (
    <>
      <PageHero index="05" lang={lang} title={c("Φροντίδα μετά", "Aftercare")} intro={c("Λίγες απλές συνήθειες προστατεύουν την επούλωση και βοηθούν το αποτέλεσμα να σταθεροποιηθεί σωστά.", "A few simple habits protect healing and help the result settle correctly.")} />
      <section className="section">
        <div className="section-head"><h2>{lang === "el" ? "Η επούλωση είναι μέρος της θεραπείας." : "Healing is part of treatment."}</h2><p className="section-intro">{lang === "el" ? "Θα λάβετε ακριβείς, προσωπικές οδηγίες μετά από κάθε συνεδρία. Αυτή είναι μια γενική εικόνα." : "You will receive precise, personal guidance after every session. This is a general overview."}</p></div>
        <div className="content-grid">
          {cards.map((item) => {
            const [elTitle, elText] = item.el.split("|");
            const [enTitle, enText] = item.en.split("|");
            return <article className="content-card" key={item.en}><h3>{lang === "el" ? elTitle : enTitle}</h3><p>{lang === "el" ? elText : enText}</p></article>;
          })}
        </div>
      </section>
      <section className="section note-panel"><h2>{lang === "el" ? "Αφήστε το αποτέλεσμα να ηρεμήσει." : "Let the result settle."}</h2><p>{lang === "el" ? "Τις πρώτες ημέρες το χρώμα μπορεί να φαίνεται πιο έντονο. Καθώς η επιφάνεια του δέρματος επουλώνεται, ο τόνος μαλακώνει. Μην κρίνετε το τελικό αποτέλεσμα πριν από τον προβλεπόμενο χρόνο επανελέγχου." : "Pigment may look stronger in the first few days. As the skin surface heals, the tone softens. Do not judge the final result before your scheduled review."}</p></section>
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
  return (
    <>
      <PageHero index="07" lang={lang} title={c("Συχνές Ερωτήσεις", "FAQ")} intro={c("Σύντομες, ξεκάθαρες απαντήσεις στα θέματα που συζητάμε πιο συχνά στην πρώτη αξιολόγηση.", "Clear, concise answers to the topics we discuss most often during a first consultation.")} />
      <section className="section">
        <div className="faq-list">
          {faqItems.map((question, i) => (
            <article className="faq-row" key={question.en}>
              <h2 className="faq-question">{question[lang]}</h2>
              <p className="faq-answer">{faqAnswers[i][lang]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export default function DermaDotSite({ route }: { route: Route }) {
  const { lang, change } = useLanguage();
  const pages: Record<Route, React.ReactNode> = {
    home: <Home lang={lang} />,
    info: <Info lang={lang} />,
    "what-is-smp": <WhatIsSmp lang={lang} />,
    results: <Results lang={lang} />,
    procedure: <Procedure lang={lang} />,
    aftercare: <Aftercare lang={lang} />,
    contact: <Contact lang={lang} />,
    faq: <FAQ lang={lang} />,
  };
  return (
    <div className="site-shell">
      <Header lang={lang} route={route} onLanguage={change} />
      <main className="page" key={`${route}-${lang}`}>{pages[route]}</main>
      <Footer lang={lang} />
    </div>
  );
}

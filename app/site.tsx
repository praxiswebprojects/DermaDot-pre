"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Language = "el" | "en";
type Route =
  | "home"
  | "info"
  | "applications"
  | "doctor"
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
  { route: "home", href: "/", label: c("Αρχική", "Home") },
  { route: "info", href: "/info", label: c("Πληροφορίες", "Info") },
  { route: "what-is-smp", href: "/what-is-smp", label: c("Τι είναι το SMP", "What is SMP") },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const url = (href: string) => (lang === "en" ? `${href}?lang=en` : href);

  return (
    <header className="site-header">
      <div className="header-top">
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          aria-label={lang === "el" ? "Άνοιγμα κατηγοριών" : "Open categories"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
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
      <div className={`nav-wrap ${menuOpen ? "open" : ""}`}>
        <nav id="site-navigation" className="main-nav" aria-label={lang === "el" ? "Κύρια πλοήγηση" : "Main navigation"}>
          {nav.map((item) => (
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
    slug: "andriki-alopekia",
    title: c("Ανδρική αλωπεκία", "Male hair loss"),
    text: c("Δημιουργεί την εικόνα ενός φυσικά ξυρισμένου τριχωτού και επαναπροσδιορίζει διακριτικά τη γραμμή των μαλλιών.", "Creates the appearance of a naturally shaved scalp and subtly redefines the hairline."),
    details: [
      c("Η εφαρμογή σχεδιάζεται σύμφωνα με το σχήμα του προσώπου, την ηλικία και το υπάρχον μοτίβο αραίωσης. Η γραμμή των μαλλιών χαράσσεται συντηρητικά ώστε να παραμένει φυσική με την πάροδο του χρόνου.", "Treatment is designed around facial structure, age and the existing pattern of hair loss. The hairline is kept deliberately conservative so it continues to look natural over time."),
      c("Με διαδοχικά, ελαφριά επίπεδα χρωστικής δημιουργείται η οπτική εικόνα πολύ κοντά ξυρισμένων τριχοθυλακίων, χωρίς να προστεθεί πραγματικός όγκος ή τρίχα.", "Successive light layers of pigment create the visual appearance of closely shaved follicles without adding actual volume or hair."),
    ],
  },
  {
    slug: "gynaikeia-araiosi",
    title: c("Γυναικεία αραίωση", "Female thinning"),
    text: c("Μειώνει την αντίθεση του ορατού δέρματος ανάμεσα στα υπάρχοντα μαλλιά, προσφέροντας την εντύπωση μεγαλύτερης πυκνότητας.", "Reduces the contrast of visible scalp between existing hairs, creating the impression of greater density."),
    details: [
      c("Το SMP τοποθετείται ανάμεσα στις υπάρχουσες τρίχες, με στόχο να μειώσει την έντονη αντίθεση ανάμεσα στο χρώμα των μαλλιών και το δέρμα.", "SMP is placed between existing hairs to reduce the strong contrast between hair colour and visible scalp."),
      c("Η τεχνική δεν επιμηκύνει ούτε πυκνώνει τις τρίχες. Η καταλληλότητα εξαρτάται από τη σταθερότητα της αραίωσης, την κατάσταση του δέρματος και την επιθυμητή εικόνα.", "The technique does not lengthen or thicken hair. Suitability depends on the stability of thinning, scalp condition and the desired appearance."),
    ],
  },
  {
    slug: "oules-metamosxefsis",
    title: c("Ουλές από μεταμόσχευση", "Hair-transplant scars"),
    text: c("Ενσωματώνει οπτικά ώριμες ουλές FUE ή FUT στο γύρω τριχωτό, μειώνοντας την αντίθεσή τους.", "Visually blends mature FUE or FUT scars into the surrounding scalp, reducing their contrast."),
    details: [
      c("Οι πλήρως επουλωμένες ουλές FUE ή FUT αξιολογούνται ως προς το χρώμα, την υφή, το πάχος και τη θέση τους πριν ξεκινήσει οποιαδήποτε εφαρμογή.", "Fully healed FUE or FUT scars are assessed for colour, texture, thickness and position before any treatment begins."),
      c("Μικροσκοπικά σημεία χρωστικής τοποθετούνται μέσα και γύρω από την ουλή ώστε να ελαττωθεί η οπτική διαφορά. Η ουλή δεν αφαιρείται, αλλά μπορεί να γίνει αισθητά λιγότερο εμφανής.", "Microscopic pigment impressions are placed within and around the scar to soften visual contrast. The scar is not removed, but it may become noticeably less visible."),
    ],
  },
  {
    slug: "oules-travmatismon",
    title: c("Ουλές από τραυματισμούς", "Trauma scars"),
    text: c("Μπορεί να καμουφλάρει επιλεγμένες, πλήρως επουλωμένες ουλές έπειτα από προσεκτική αξιολόγηση.", "Can camouflage selected, fully healed scars after careful assessment."),
    details: [
      c("Κάθε ουλή αντιδρά διαφορετικά στη χρωστική. Εξετάζουμε την ωριμότητα, την υφή και την αιμάτωσή της και προχωρούμε μόνο όταν η περιοχή είναι ασφαλής και σταθερή.", "Every scar responds differently to pigment. We examine maturity, texture and blood supply, proceeding only when the area is safe and stable."),
      c("Ο σχεδιασμός ακολουθεί το φυσικό μοτίβο των γύρω τριχοθυλακίων ώστε η μετάβαση να είναι διακριτική και όχι ομοιόμορφα χρωματισμένη.", "The design follows the natural pattern of surrounding follicles so the transition looks subtle rather than uniformly coloured."),
    ],
  },
  {
    slug: "alopecia-areata",
    title: c("Alopecia Areata", "Alopecia Areata"),
    text: c("Σε σταθεροποιημένες περιπτώσεις μπορεί να μειώσει οπτικά τη διαφορά ανάμεσα στις περιοχές με και χωρίς τρίχες.", "In stable cases, it can visually reduce the contrast between areas with and without hair."),
    details: [
      c("Η εφαρμογή εξετάζεται μόνο όταν η κατάσταση είναι σταθερή και έχει προηγηθεί η κατάλληλη ιατρική καθοδήγηση. Το SMP είναι αισθητική κάλυψη και όχι θεραπεία της αιτίας.", "Treatment is considered only when the condition is stable and appropriate medical guidance has been obtained. SMP provides cosmetic camouflage; it does not treat the underlying cause."),
      c("Η πυκνότητα και ο τόνος χτίζονται προσεκτικά ώστε οι περιοχές να δένουν οπτικά με τα σημεία όπου υπάρχουν φυσικές τρίχες.", "Density and tone are built carefully so treated areas visually blend with regions where natural hair remains."),
    ],
  },
  {
    slug: "genia",
    title: c("Γένια", "Beard"),
    text: c("Προσθέτει την οπτική εντύπωση πυκνότητας ή βοηθά στην εξισορρόπηση κενών στην περιοχή των γενιών.", "Adds the visual impression of density or helps balance gaps within the beard area."),
    details: [
      c("Η κατεύθυνση, το μέγεθος και η απόσταση των σημείων προσαρμόζονται στο φυσικό μοτίβο των γενιών και στη μορφολογία του προσώπου.", "Direction, size and spacing of impressions are adapted to the natural beard pattern and facial structure."),
      c("Μπορούν να εξισορροπηθούν μικρά κενά ή να ενισχυθεί οπτικά η πυκνότητα σε κοντοξυρισμένο γένι, με σταδιακή εφαρμογή και ήπιους τόνους.", "Small gaps can be balanced or density visually enhanced in a closely trimmed beard through gradual application and restrained tones."),
    ],
  },
  {
    slug: "diorthosi-smp",
    title: c("Διόρθωση αποτυχημένου SMP", "Correction of previous SMP"),
    text: c("Αξιολογούμε χρώμα, βάθος, σχήμα και κατάσταση του δέρματος πριν προτείνουμε ασφαλή διόρθωση ή ανασχεδιασμό.", "We assess colour, depth, shape and skin condition before recommending a safe correction or redesign."),
    details: [
      c("Πρώτα εξετάζουμε αν η προηγούμενη εφαρμογή είναι υπερβολικά σκούρα, βαθιά, ψυχρή σε τόνο ή λανθασμένη ως προς το σχήμα. Δεν είναι κάθε περίπτωση κατάλληλη για άμεση κάλυψη.", "We first assess whether the previous treatment is too dark, deep, cool-toned or incorrectly shaped. Not every case is suitable for immediate camouflage."),
      c("Ανάλογα με την κατάσταση μπορεί να προταθεί χρόνος αναμονής, αφαίρεση ή προσεκτική εξισορρόπηση. Το πλάνο συμφωνείται μόνο μετά από δια ζώσης αξιολόγηση.", "Depending on its condition, waiting, removal or careful rebalancing may be recommended. A plan is agreed only after an in-person assessment."),
    ],
  },
];

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
              ? "Επιλέξτε μία εφαρμογή για να δείτε πώς το SMP προσαρμόζεται σε κάθε διαφορετική ανάγκη."
              : "Select an application to see how SMP is adapted to each individual need."}
          </p>
        </div>
        <div className="applications-showcase">
          <div className="applications-carousel-header">
            <p aria-live="polite">
              {String(activeApplication + 1).padStart(2, "0")} / 07
            </p>
            <div className="application-controls">
              <button type="button" onClick={() => moveApplication(-1)} aria-label={lang === "el" ? "Προηγούμενη εφαρμογή" : "Previous application"}>←</button>
              <button type="button" onClick={() => moveApplication(1)} aria-label={lang === "el" ? "Επόμενη εφαρμογή" : "Next application"}>→</button>
            </div>
          </div>
          <div className="applications-viewport" ref={carouselRef}>
            <div className="applications-track">
              {infoCards.map((card, index) => (
                <a
                  className="application-slide"
                  href={applicationUrl(card.slug)}
                  key={card.slug}
                  data-slide={index}
                  aria-label={`${card.title[lang]} — ${lang === "el" ? "περισσότερες πληροφορίες" : "more information"}`}
                >
                  <span className={`application-slide-image application-image-${index + 1}`} />
                  <span className="application-slide-copy">
                    <span className="application-slide-meta">
                      <small>0{index + 1} / 07</small>
                      <span aria-hidden="true">↗</span>
                    </span>
                    <strong>{card.title[lang]}</strong>
                    <span className="application-slide-link">{lang === "el" ? "Δείτε περισσότερα" : "View more"}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section note-panel">
        <h2>{lang === "el" ? "Όχι μια γενική λύση." : "Never one-size-fits-all."}</h2>
        <p>{lang === "el" ? "Κάθε δέρμα, μοτίβο αραίωσης και προσδοκία είναι διαφορετικά. Η προσωπική αξιολόγηση προηγείται πάντα της θεραπείας και περιλαμβάνει ειλικρινή συζήτηση για το τι μπορεί — και τι δεν μπορεί — να προσφέρει η τεχνική." : "Every skin type, thinning pattern and expectation is different. A personal consultation always comes first, including an honest discussion of what the technique can — and cannot — achieve."}</p>
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
        title={c("Εφαρμογές SMP", "SMP Applications")}
        intro={c("Αναλυτικές πληροφορίες για τις επτά εξειδικευμένες εφαρμογές και τον τρόπο με τον οποίο προσαρμόζονται σε κάθε ανάγκη.", "Detailed information about seven specialist applications and how each is adapted to an individual need.")}
      />
      <section className="section applications-directory">
        <a className="applications-back" href={infoUrl}>← {lang === "el" ? "Πίσω στις εφαρμογές" : "Back to applications"}</a>
        {infoCards.map((card, index) => (
          <article className="application-detail" id={card.slug} key={card.slug}>
            <div className={`application-detail-image application-image-${index + 1}`} role="img" aria-label={card.title[lang]} />
            <div className="application-detail-copy">
              <span className="application-detail-number">0{index + 1} / 07</span>
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

function Doctor({ lang }: { lang: Language }) {
  const chapters = [
    {
      number: "01",
      title: c("Πειθαρχία και προσωπική διαδρομή", "Discipline and personal journey"),
      paragraphs: [
        c(
          "Από πολύ μικρή ηλικία έμαθα να λειτουργώ με πειθαρχία, συνέπεια και αφοσίωση στους στόχους μου. Ο αθλητισμός αποτελεί αναπόσπαστο κομμάτι της ζωής μου από την ηλικία των πέντε ετών και μου δίδαξε ότι η πραγματική επιτυχία χτίζεται μέσα από καθημερινή προσπάθεια, συνεχή εξέλιξη και σεβασμό προς τον εαυτό μας.",
          "From a very young age, I learned to approach life with discipline, consistency and dedication to my goals. Sport has been an inseparable part of my life since the age of five, teaching me that real success is built through daily effort, continuous development and respect for ourselves."
        ),
        c(
          "Την ίδια φιλοσοφία ακολουθώ και στην επαγγελματική μου πορεία. Πιστεύω πως όταν αναλαμβάνεις κάτι, οφείλεις να δίνεις το 100% του εαυτού σου, χωρίς εκπτώσεις στην ποιότητα και στο τελικό αποτέλεσμα.",
          "I follow the same philosophy throughout my professional life. I believe that when you undertake something, you must give it one hundred per cent, without compromising on quality or the final result."
        ),
        c(
          "Παράλληλα, δραστηριοποιούμαι επιχειρηματικά στη Γερμανία, όπου διατηρώ επιχείρηση στον χώρο της εμπορίας τροφίμων.",
          "Alongside my work in SMP, I am also active in business in Germany, where I run a company in the food-trading sector."
        ),
      ],
    },
    {
      number: "02",
      title: c("Η προσωπική εμπειρία που με οδήγησε στο SMP", "The personal experience that led me to SMP"),
      paragraphs: [
        c(
          "Η πρώτη μου επαφή με το Scalp Micropigmentation (SMP) προέκυψε μέσα από μια προσωπική εμπειρία της οικογένειάς μου. Ο πατέρας μου αντιμετώπιζε για πολλά χρόνια αλωπεκία και είχε υποβληθεί σε αρκετές μεταμοσχεύσεις μαλλιών, χωρίς να πετύχει το αποτέλεσμα που επιθυμούσε. Όταν αποφάσισε να προχωρήσει σε θεραπεία SMP, η αλλαγή στην εμφάνισή του και, κυρίως, στην αυτοπεποίθησή του ήταν πραγματικά εντυπωσιακή.",
          "My first encounter with Scalp Micropigmentation (SMP) came through a personal experience in my family. My father had lived with alopecia for many years and had undergone several hair transplants without achieving the result he wanted. When he decided to have SMP treatment, the change in his appearance—and, above all, in his confidence—was truly remarkable."
        ),
        c(
          "Αυτή η εμπειρία αποτέλεσε την αφορμή να γνωρίσω έναν εντελώς διαφορετικό κόσμο. Αποφάσισα να εμβαθύνω στην τεχνική του SMP και να εκπαιδευτώ δίπλα σε καταξιωμένους επαγγελματίες του χώρου.",
          "That experience introduced me to an entirely different world. I decided to study the SMP technique in depth and train alongside established professionals in the field."
        ),
      ],
    },
    {
      number: "03",
      title: c("Εξειδικευμένη εκπαίδευση", "Specialist training"),
      paragraphs: [
        c(
          "Στο πλαίσιο αυτό, έχω παρακολουθήσει πληθώρα εξειδικευμένων εκπαιδευτικών προγραμμάτων και σεμιναρίων, τόσο εντός όσο και εκτός Ελλάδας, διευρύνοντας τις γνώσεις μου πάνω σε διαφορετικές τεχνικές, σύγχρονες μεθόδους εφαρμογής και τις πιο εξελιγμένες προσεγγίσεις του SMP.",
          "As part of this journey, I have attended numerous specialist training programmes and seminars in Greece and abroad, expanding my knowledge of different techniques, modern application methods and the most advanced approaches to SMP."
        ),
      ],
    },
    {
      number: "04",
      title: c("Πάθος, τέχνη και προσωπική δέσμευση", "Passion, artistry and personal commitment"),
      paragraphs: [
        c(
          "Δεν επέλεξα το SMP απλώς ως επάγγελμα.",
          "I did not choose SMP simply as a profession."
        ),
        c(
          "Το επέλεξα γιατί πίστεψα πραγματικά στη δύναμή του να αλλάζει τη ζωή ενός ανθρώπου. Για εμένα, το SMP δεν είναι μόνο μια αισθητική εφαρμογή. Είναι ένας συνδυασμός τέχνης, τεχνικής ακρίβειας και ανθρώπινης ψυχολογίας, που μπορεί να χαρίσει ξανά αυτοπεποίθηση σε έναν άνθρωπο.",
          "I chose it because I genuinely believed in its power to change a person’s life. To me, SMP is more than an aesthetic treatment. It combines artistry, technical precision and an understanding of human psychology, with the ability to restore someone’s confidence."
        ),
        c(
          "Κάθε εφαρμογή αποτελεί μια ξεχωριστή ευθύνη. Στόχος μου είναι κάθε άνθρωπος που με εμπιστεύεται να αποκτά ένα αποτέλεσμα απόλυτα φυσικό, προσαρμοσμένο στα χαρακτηριστικά του προσώπου του και στις προσωπικές του ανάγκες, ώστε να αισθάνεται ξανά σιγουριά κάθε φορά που κοιτάζει τον εαυτό του στον καθρέφτη.",
          "Every treatment carries its own responsibility. My goal is for every person who trusts me to receive a completely natural result, tailored to their facial features and personal needs, so they can feel confident again whenever they look in the mirror."
        ),
        c(
          "Για μένα, το SMP δεν είναι απλώς μια υπηρεσία ούτε απλώς ένα επάγγελμα.",
          "For me, SMP is neither simply a service nor simply a profession."
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
          <span>DERMADOT</span>
        </div>
        <div className="doctor-introduction">
          <p className="eyebrow">{lang === "el" ? "Προσωπικό προφίλ" : "Personal profile"}</p>
          <h2>Andreas<br />Petropoulos</h2>
          <p className="doctor-lede">
            {lang === "el"
              ? "Είμαι ο Ανδρέας Πετρόπουλος, απόφοιτος του Αρσακείου Σχολείου και του Πανεπιστημίου Queen Margaret στη Σκωτία, όπου σπούδασα Management."
              : "I am Andreas Petropoulos, a graduate of Arsakeio School and Queen Margaret University in Scotland, where I studied Management."}
          </p>
          <p>
            {lang === "el"
              ? "Η πορεία μου συνδυάζει την πειθαρχία του αθλητισμού, την επιχειρηματική εμπειρία και τη βαθιά προσωπική σύνδεση με τη δύναμη του Scalp Micropigmentation."
              : "My journey brings together the discipline of sport, business experience and a deeply personal connection to the transformative power of Scalp Micropigmentation."}
          </p>
        </div>
      </section>
      <section className="section doctor-story">
        <div className="section-head">
          <h2>{lang === "el" ? "Η ιστορία μου." : "My story."}</h2>
          <p className="section-intro">
            {lang === "el"
              ? "Μια πορεία που ξεκίνησε από την πειθαρχία, διαμορφώθηκε μέσα από μια οικογενειακή εμπειρία και εξελίχθηκε σε προσωπική δέσμευση προς κάθε άνθρωπο που με εμπιστεύεται."
              : "A journey that began with discipline, was shaped by a family experience and grew into a personal commitment to every person who places their trust in me."}
          </p>
        </div>
        <div className="doctor-biography">
          {chapters.map((chapter) => (
            <article className="doctor-chapter" key={chapter.number}>
              <span>{chapter.number}</span>
              <div>
                <h3>{chapter.title[lang]}</h3>
                {chapter.paragraphs.map((paragraph, index) => (
                  <p className={chapter.number === "04" && index === 0 ? "doctor-emphasis" : ""} key={paragraph.en}>
                    {paragraph[lang]}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section doctor-quote">
        <p>{lang === "el" ? "«Είναι πάθος, τέχνη και προσωπική δέσμευση απέναντι σε κάθε άνθρωπο που επιλέγει να με εμπιστευτεί.»" : "“It is passion, artistry and a personal commitment to every person who chooses to place their trust in me.”"}</p>
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
    applications: <Applications lang={lang} />,
    doctor: <Doctor lang={lang} />,
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

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
  c("Τι ακριβώς είναι η μικροχρωμάτωση τριχωτού;", "What exactly is scalp micropigmentation?"),
  c("Είναι το αποτέλεσμα φυσικό;", "Will the result look natural?"),
  c("Πόσες συνεδρίες χρειάζονται;", "How many sessions will I need?"),
  c("Πονάει η διαδικασία;", "Is the procedure painful?"),
  c("Πόσο διαρκεί το αποτέλεσμα;", "How long does the result last?"),
  c("Μπορεί να καλύψει ουλές;", "Can SMP camouflage scars?"),
  c("Τι πρέπει να αποφεύγω μετά τη συνεδρία;", "What should I avoid after a session?"),
  c("Είναι κατάλληλο για γυναίκες;", "Is SMP suitable for women?"),
];

const faqAnswers = [
  c(
    "Είναι μια μη χειρουργική τεχνική κατά την οποία εξειδικευμένες χρωστικές τοποθετούνται επιφανειακά στο δέρμα, δημιουργώντας την οπτική εντύπωση φυσικών θυλάκων τρίχας.",
    "It is a non-surgical technique in which specialised pigments are placed superficially in the skin, creating the visual impression of natural hair follicles."
  ),
  c(
    "Ο στόχος μας είναι ένα διακριτικό αποτέλεσμα που σέβεται τον τόνο του δέρματος, το υπάρχον τριχωτό και τα χαρακτηριστικά του προσώπου. Η γραμμή σχεδιάζεται πάντα μαζί σας.",
    "Our goal is a subtle result that respects your skin tone, existing hair and facial features. The hairline is always designed together with you."
  ),
  c(
    "Συνήθως προτείνονται 2–3 συνεδρίες, με χρόνο ανάμεσα τους ώστε να επουλωθεί το δέρμα και να αξιολογηθεί σωστά η πυκνότητα. Το ακριβές πλάνο είναι εξατομικευμένο.",
    "Most plans involve 2–3 sessions, spaced to allow the skin to heal and the density to be assessed accurately. Your exact plan is individual."
  ),
  c(
    "Οι περισσότεροι περιγράφουν μια ήπια ενόχληση, η οποία είναι γενικά καλά ανεκτή. Η αίσθηση διαφέρει ανά περιοχή και άτομο.",
    "Most clients describe mild discomfort that is generally well tolerated. Sensation varies by area and from person to person."
  ),
  c(
    "Το αποτέλεσμα ξεθωριάζει σταδιακά και συνήθως διατηρείται για αρκετά χρόνια. Ο τύπος δέρματος, η έκθεση στον ήλιο και η φροντίδα επηρεάζουν τη διάρκειά του. Μια συνεδρία ανανέωσης μπορεί να χρειαστεί στο μέλλον.",
    "The result fades gradually and usually lasts for several years. Skin type, sun exposure and aftercare affect longevity. A refresh session may be recommended later."
  ),
  c(
    "Σε πολλές περιπτώσεις μπορεί να μειώσει οπτικά την αντίθεση μιας ουλής μεταμόσχευσης ή τραυματισμού. Η καταλληλότητα αξιολογείται μόνο αφού η ουλή έχει ωριμάσει πλήρως.",
    "In many cases SMP can visually reduce the contrast of transplant or trauma scars. Suitability is assessed only after the scar has fully matured."
  ),
  c(
    "Τις πρώτες ημέρες αποφεύγετε έντονη άσκηση, υπερβολικό ιδρώτα, πισίνα, σάουνα, άμεσο ήλιο και τρίψιμο της περιοχής. Θα λάβετε αναλυτικές οδηγίες ειδικά για εσάς.",
    "For the first few days avoid intense exercise, heavy sweating, pools, saunas, direct sun and rubbing the area. You will receive detailed guidance for your specific treatment."
  ),
  c(
    "Ναι. Η τεχνική μπορεί να μειώσει την ορατότητα της αραίωσης προσθέτοντας την εντύπωση πυκνότητας ανάμεσα στα υπάρχοντα μαλλιά, όταν υπάρχει κατάλληλη ένδειξη.",
    "Yes. Where appropriate, the technique can reduce the visibility of thinning by adding the impression of density between existing hairs."
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
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">DermaDot</span>
        </a>
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
      <section className="hero">
        <div className="hero-copy">
          <div>
            <p className="eyebrow">{lang === "el" ? "Scalp Micropigmentation • Αθήνα" : "Scalp Micropigmentation • Athens"}</p>
            <h1>{lang === "el" ? <>Ακρίβεια που μοιάζει φυσική.</> : <>Precision that looks natural.</>}</h1>
          </div>
          <div>
            <p className="hero-lede">
              {lang === "el"
                ? "Μικροχρωμάτωση τριχωτού με εξατομικευμένο σχεδιασμό, διακριτική αισθητική και κλινική προσοχή στη λεπτομέρεια."
                : "Scalp micropigmentation with individual design, understated aesthetics and clinical attention to detail."}
            </p>
            <div className="hero-actions">
              <a className="button" href={url("/contact")}>{lang === "el" ? "Κλείστε αξιολόγηση" : "Book a consultation"}</a>
              <a className="button secondary" href={url("/what-is-smp")}>{lang === "el" ? "Γνωρίστε το SMP" : "Explore SMP"}</a>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-label={lang === "el" ? "Αφηρημένο μοτίβο μικροχρωμάτωσης" : "Abstract micropigmentation pattern"}>
          <span className="visual-label">{lang === "el" ? "Χιλιάδες σημεία. Ένα φυσικό σύνολο." : "Thousands of dots. One natural whole."}</span>
        </div>
      </section>
      <section className="trust-strip">
        {[
          c("Εξατομικευμένη γραμμή", "Individually designed hairline"),
          c("Εξειδικευμένες χρωστικές", "Specialised SMP pigments"),
          c("Ιδιωτική αξιολόγηση", "Private consultation"),
        ].map((item, i) => (
          <div className="trust-item" key={item.en}>
            <div className="trust-number">0{i + 1}</div>
            <div className="trust-title">{item[lang]}</div>
            <p className="trust-copy">
              {[
                c("Σχεδιασμένη για το πρόσωπο και το προφίλ σας.", "Designed around your face and profile."),
                c("Επιλογή τόνου με στόχο τη φυσική ενσωμάτωση.", "Tone selection focused on natural integration."),
                c("Χωρίς βιασύνη, πίεση ή γενικές λύσεις.", "No rushing, pressure or one-size-fits-all plans."),
              ][i][lang]}
            </p>
          </div>
        ))}
      </section>
      <section className="section">
        <div className="section-head">
          <h2>{lang === "el" ? "Κατανοήστε κάθε βήμα." : "Understand every step."}</h2>
          <p className="section-intro">
            {lang === "el"
              ? "Καθαρή ενημέρωση πριν από κάθε απόφαση. Εξερευνήστε την τεχνική, τη διαδικασία και τη φροντίδα σε ξεχωριστές σελίδες."
              : "Clear information before every decision. Explore the technique, procedure and aftercare on dedicated pages."}
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
    title: c("Φυσική οπτική πυκνότητα", "Natural visual density"),
    text: c("Μικροσκοπικά σημεία χρωστικής μειώνουν την αντίθεση ανάμεσα στο δέρμα και τα μαλλιά.", "Microscopic pigment impressions reduce the contrast between scalp and hair."),
  },
  {
    title: c("Σχεδιασμός χωρίς στερεότυπα", "Design without templates"),
    text: c("Η γραμμή και η πυκνότητα προσαρμόζονται στην ηλικία, τα χαρακτηριστικά και τον στόχο σας.", "Hairline and density are adjusted to your age, features and personal goal."),
  },
  {
    title: c("Μη χειρουργική προσέγγιση", "Non-surgical approach"),
    text: c("Δεν μεταμοσχεύει τρίχες. Δημιουργεί μια ρεαλιστική οπτική εντύπωση με ελεγχόμενη εφαρμογή.", "It does not transplant hair. It creates a realistic visual impression through controlled application."),
  },
];

function Info({ lang }: { lang: Language }) {
  return (
    <>
      <PageHero index="01" lang={lang} title={c("Πληροφορίες", "Information")} intro={c("Η φιλοσοφία μας είναι απλή: σωστή ενημέρωση, προσεκτικός σχεδιασμός και αποτέλεσμα που δεν ζητά προσοχή.", "Our philosophy is simple: clear information, careful design and a result that never asks for attention.")} />
      <section className="section">
        <div className="section-head">
          <h2>{lang === "el" ? "Διακριτική αλλαγή. Ορατή αυτοπεποίθηση." : "Subtle change. Visible confidence."}</h2>
          <p className="section-intro">{lang === "el" ? "Το SMP μπορεί να υποστηρίξει ένα ξυρισμένο look, να μειώσει την ορατότητα αραίωσης ή να καμουφλάρει επιλεγμένες ουλές." : "SMP can support a shaved look, reduce the visibility of thinning or camouflage selected scars."}</p>
        </div>
        <div className="content-grid">
          {infoCards.map((card) => <article className="content-card" key={card.title.en}><h3>{card.title[lang]}</h3><p>{card.text[lang]}</p></article>)}
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
  return (
    <>
      <PageHero index="02" lang={lang} title={c("Τι είναι το SMP;", "What is SMP?")} intro={c("Μια εξειδικευμένη τεχνική που δημιουργεί την οπτική εντύπωση φυσικών θυλάκων τρίχας.", "A specialised technique that creates the visual impression of natural hair follicles.")} />
      <section className="section">
        <div className="section-head"><h2>{lang === "el" ? "Μικρές λεπτομέρειες. Συνολικό αποτέλεσμα." : "Tiny details. A complete result."}</h2><p className="section-intro">{lang === "el" ? "Οι χρωστικές τοποθετούνται επιφανειακά και με ελεγχόμενο βάθος, ακολουθώντας τη φυσική κατεύθυνση και κατανομή του τριχωτού." : "Pigments are placed superficially at a controlled depth, following the natural direction and distribution of hair."}</p></div>
        <div className="content-grid">
          {[
            c("Ξυρισμένο look|Δημιουργεί την εντύπωση κοντοκουρεμένων θυλάκων σε περιοχές απώλειας.", "Shaved look|Creates the impression of closely cropped follicles in areas of hair loss."),
            c("Οπτική πυκνότητα|Μειώνει την αντίθεση του δέρματος που φαίνεται ανάμεσα στα υπάρχοντα μαλλιά.", "Visual density|Reduces the contrast of visible scalp between existing hairs."),
            c("Καμουφλάζ ουλών|Μπορεί να ενσωματώσει οπτικά ώριμες ουλές μεταμόσχευσης ή τραυματισμού.", "Scar camouflage|Can visually blend mature transplant or trauma scars."),
          ].map((item) => {
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
    c("Αξιολόγηση|Συζητάμε τον στόχο, το ιστορικό, το δέρμα και την καταλληλότητα της τεχνικής.", "Consultation|We discuss your goal, history, skin and whether the technique is suitable."),
    c("Σχεδιασμός|Σχεδιάζουμε τη γραμμή, επιλέγουμε τόνο και συμφωνούμε την επιθυμητή πυκνότητα.", "Design|We map the hairline, choose a tone and agree on the desired density."),
    c("Συνεδρίες|Εφαρμόζουμε διαδοχικά επίπεδα μικροσκοπικών σημείων με χρόνο επούλωσης ανάμεσα.", "Sessions|We apply successive layers of microscopic impressions with healing time in between."),
    c("Έλεγχος|Αξιολογούμε το επουλωμένο αποτέλεσμα και κάνουμε μόνο τις προσαρμογές που χρειάζονται.", "Review|We assess the healed result and make only the refinements that are needed."),
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
            <details className="faq-item" key={question.en}>
              <summary>{question[lang]}</summary>
              <div className="faq-answer">{faqAnswers[i][lang]}</div>
            </details>
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

import type { Metadata } from "next";

export type SiteLanguage = "el" | "en";
export type SitePage =
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
  | "thank-you"
  | "faq";

export const SITE_URL = "https://dermadot.plus";

const pageCopy: Record<SitePage, { el: [string, string]; en: [string, string] }> = {
  home: {
    el: ["Scalp Micropigmentation στην Αθήνα", "Εξατομικευμένη μικροχρωμάτωση τριχωτού κεφαλής στην Αθήνα, με φυσικό σχεδιασμό και προσωπική αξιολόγηση."],
    en: ["Scalp Micropigmentation in Athens", "Personalised scalp micropigmentation in Athens, with natural-looking design and an individual consultation."],
  },
  info: {
    el: ["Πληροφορίες για SMP", "Μάθετε πώς λειτουργεί η μικροχρωμάτωση τριχωτού, σε ποιους απευθύνεται και τι να περιμένετε."],
    en: ["SMP Treatment Information", "Learn how scalp micropigmentation works, who it may suit and what to expect from treatment."],
  },
  applications: {
    el: ["Εφαρμογές SMP", "Δείτε τις εφαρμογές της μικροχρωμάτωσης τριχωτού για αραίωση, ουλές και άλλες ανάγκες."],
    en: ["SMP Applications", "Explore scalp micropigmentation applications for thinning hair, scars and other concerns."],
  },
  doctor: {
    el: ["Ανδρέας Πετρόπουλος", "Γνωρίστε τον Ανδρέα Πετρόπουλο και την προσωπική του προσέγγιση στη μικροχρωμάτωση τριχωτού."],
    en: ["About Andreas Petropoulos", "Meet Andreas Petropoulos and learn about his personal approach to scalp micropigmentation."],
  },
  "what-is-smp": {
    el: ["Τι είναι το SMP", "Μια κατανοητή επισκόπηση της τεχνικής, των εφαρμογών και του αποτελέσματος του SMP."],
    en: ["What Is SMP?", "An accessible overview of the scalp micropigmentation technique, its applications and results."],
  },
  "treatment-guide": {
    el: ["SMP ή μεταμόσχευση μαλλιών;", "Συγκρίνετε το SMP με τη μεταμόσχευση μαλλιών και ενημερωθείτε για τις διαφορές τους."],
    en: ["SMP or Hair Transplant?", "Compare scalp micropigmentation and hair transplantation and understand how they differ."],
  },
  results: {
    el: ["Αποτελέσματα SMP", "Ενημερωθείτε για τα αποτελέσματα της μικροχρωμάτωσης τριχωτού."],
    en: ["SMP Results", "Learn about the results of scalp micropigmentation."],
  },
  procedure: {
    el: ["Η διαδικασία SMP", "Δείτε τα στάδια της θεραπείας SMP, από την αρχική αξιολόγηση έως τις συνεδρίες."],
    en: ["The SMP Procedure", "See the stages of SMP treatment, from the initial consultation through the sessions."],
  },
  aftercare: {
    el: ["Φροντίδα μετά το SMP", "Οδηγίες φροντίδας μετά τη συνεδρία SMP για την περίοδο επούλωσης."],
    en: ["SMP Aftercare", "Aftercare guidance for the healing period following an SMP session."],
  },
  contact: {
    el: ["Επικοινωνία και αξιολόγηση", "Επικοινωνήστε με το DermaDot στην Αθήνα για να συζητήσετε μια εξατομικευμένη αξιολόγηση SMP."],
    en: ["Contact and Consultation", "Contact DermaDot in Athens to discuss an individual scalp micropigmentation consultation."],
  },
  "thank-you": {
    el: ["Ευχαριστούμε για το αίτημά σας", "Λάβαμε το αίτημά σας για αξιολόγηση SMP. Επιστρέψτε στην αρχική σελίδα του DermaDot."],
    en: ["Thank You for Your Request", "Your consultation request has been received. Return to the DermaDot home page."],
  },
  faq: {
    el: ["Συχνές ερωτήσεις για SMP", "Απαντήσεις σε συχνές ερωτήσεις σχετικά με τη διαδικασία, τη φροντίδα και το SMP."],
    en: ["SMP Frequently Asked Questions", "Answers to common questions about scalp micropigmentation, the procedure and aftercare."],
  },
};

function pathFor(page: SitePage, language: SiteLanguage): string {
  const path = page === "home" ? "/" : `/${page}`;
  return language === "en" ? `/en${path === "/" ? "" : path}` : path;
}

export function pageMetadata(page: SitePage, language: SiteLanguage = "el"): Metadata {
  const [title, description] = pageCopy[page][language];
  const canonical = `${SITE_URL}${pathFor(page, language)}`;

  return {
    title,
    description,
    ...(page === "thank-you" ? { robots: { index: false, follow: false } } : {}),
    alternates: {
      canonical,
      languages: {
        el: `${SITE_URL}${pathFor(page, "el")}`,
        en: `${SITE_URL}${pathFor(page, "en")}`,
      },
    },
    openGraph: {
      title: `${title} — DermaDot`,
      description,
      url: canonical,
      images: [{ url: `${SITE_URL}/og.jpg`, width: 1200, height: 800, alt: "DermaDot — Scalp Micropigmentation in Athens" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — DermaDot`,
      description,
      images: [`${SITE_URL}/og.jpg`],
    },
  };
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <Link className="not-found-brand" href="/" aria-label="DermaDot — αρχική σελίδα">
        <span>Derma</span><span>Dot</span>
      </Link>
      <p className="not-found-code">404</p>
      <h1>Αυτή η σελίδα δεν βρέθηκε.</h1>
      <p>Ο σύνδεσμος μπορεί να έχει αλλάξει ή η σελίδα να μην είναι διαθέσιμη.</p>
      <Link className="button" href="/">Επιστροφή στην αρχική <span aria-hidden="true">→</span></Link>
    </main>
  );
}

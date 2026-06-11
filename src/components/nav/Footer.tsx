export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-sm text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p>
          <span className="font-semibold text-foreground">giivngo</span> © {new Date().getFullYear()} All rights reserved.
        </p>
        <p>
          <a href="/privacy" className="text-muted hover:text-foreground">Privacy Policy</a> ·{" "}
          <a href="/terms" className="text-muted hover:text-foreground">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}

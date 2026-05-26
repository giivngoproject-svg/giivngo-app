export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 text-sm text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p>
          <span className="font-semibold text-foreground">giivngo</span> · A frontend demo of a group money-pooling product for the Australian market.
        </p>
        <p className="text-xs">Not a real product — no payments are processed.</p>
      </div>
    </footer>
  );
}

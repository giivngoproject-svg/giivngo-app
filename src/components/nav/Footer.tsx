export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>© 2026 Giivngo. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-900">
            Terms of service
          </a>
          <a href="#" className="hover:text-gray-900">
            Security &amp; privacy
          </a>
        </div>
      </div>
    </footer>
  );
}

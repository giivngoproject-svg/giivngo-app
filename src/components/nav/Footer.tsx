import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-16 sm:px-0 py-12">
        <div className="text-2xl font-bold">
          <Image
            src="/logo.png"
            alt="giivngo"
            width={1951}
            height={541}
            priority
            className="h-7 w-auto"
          />
        </div>
        <div className="flex flex-row  md:flex-row items-start  gap-14 mt-4">

          <div className="flex flex-col flex-wrap md:flex-nowrap gap-4  text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">
              How it works
            </a>
            <a href="#" className="hover:text-gray-900">
              Use cases
            </a>
            <a href="#" className="hover:text-gray-900">
              Security
            </a>
            <a href="#" className="hover:text-gray-900">
              Pricing
            </a>
            <a href="#" className="hover:text-gray-900">
              About us
            </a>
            <a href="#" className="hover:text-gray-900">
              Help Center
            </a>
          </div>

          <div className="flex flex-col flex-wrap md:flex-nowrap gap-4  text-sm text-gray-600">
            <a href="#" className="hover:text-gray-900">
              facebook
            </a>
            <a href="#" className="hover:text-gray-900">
              Instagram
            </a>
            <a href="#" className="hover:text-gray-900">
              X Account
            </a>
            <a href="#" className="hover:text-gray-900">
              YouTube
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          © 2024 Giivngo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { label: "소개", href: "/introduce" },
  { label: "서버정보", href: "/info" },
  { label: "웹상점", href: "/shop" },
  { label: "이벤트", href: "/event" },
  { label: "문의", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/80 backdrop-blur-sm border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-6 flex items-center h-16 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 border-2 border-white/80 rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <span className="font-semibold text-sm tracking-wide text-white/90 uppercase">
            Server Logo
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
          <button className="p-2 text-white/60 hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <Link
            href="/login"
            className="px-4 py-1.5 text-sm text-white/80 hover:text-white border border-white/20 rounded-md transition-colors"
          >
            로그인
          </Link>
          <Link
            href="/register"
            className="px-4 py-1.5 text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-md transition-colors"
          >
            회원가입
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden ml-auto p-2 text-white/70"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#111111] border-t border-white/5 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-white/10">
            <Link href="/login" className="flex-1 text-center px-4 py-2 text-sm border border-white/20 rounded-md text-white/80">
              로그인
            </Link>
            <Link href="/register" className="flex-1 text-center px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-md">
              회원가입
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

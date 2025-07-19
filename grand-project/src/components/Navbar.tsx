"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthenticated(!!session);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Logo click handler
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authenticated) {
      if (pathname !== "/resume") router.push("/resume");
    } else {
      if (pathname !== "/") router.push("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur flex items-center h-16 px-6 md:px-12 shadow-sm">
      <button
        aria-label="AI Resume Tailor Home"
        onClick={handleLogoClick}
        className="flex items-center gap-3 group focus:outline-none"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-700/20 group-hover:bg-teal-700/40 transition">
          <FontAwesomeIcon icon={faBrain} className="text-teal-400 text-2xl" />
        </span>
        <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-400 transition select-none">
          Resume AI
        </span>
      </button>
      {/* Optionally, add nav links here if needed */}
    </nav>
  );
} 
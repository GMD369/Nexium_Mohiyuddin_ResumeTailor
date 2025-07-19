"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-lg text-white font-semibold text-base shadow transition focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <FontAwesomeIcon icon={faSignOutAlt} className="text-white text-lg" />
      Logout
    </button>
  );
}

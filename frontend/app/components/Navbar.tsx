// "use client";

// import { useTheme } from "next-themes";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";

// export default function Navbar() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);
//   if (!mounted) return null;

//   const isDark = theme === "dark";

//   return (
//     <header
//       style={{
//         width: "100%",
//         backdropFilter: "blur(8px)",
//         borderBottom: "1px solid rgba(149,106,250,0.15)",
//       }}
//     >
//       <nav
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "1.1rem 2rem",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         {/* Logo */}
//         <Link href="/" style={{ textDecoration: "none" }}>
//           <span
//             style={{
//               fontSize: "1.5rem",
//               fontWeight: 700,
//               color: "var(--primary)",
//               letterSpacing: "0.4px",
//             }}
//           >
//             EventEase
//           </span>
//         </Link>

//         {/* Nav Links */}
//         <div
//           style={{
//             display: "flex",
//             gap: "2rem",
//             alignItems: "center",
//           }}
//         >
//           <NavLink href="/dashboard/events">Events</NavLink>
//           <NavLink href="/dashboard">Dashboard</NavLink>
//           <NavLink href="/dashboard/subscription">Subscription</NavLink>
//         </div>

//         {/* Actions */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "1.2rem",
//           }}
//         >
//           {/* Theme Toggle (Icon Based) */}
//           <button
//             onClick={() => setTheme(isDark ? "light" : "dark")}
//             aria-label="Toggle theme"
//             style={{
//               width: "38px",
//               height: "38px",
//               borderRadius: "50%",
//               border: "1px solid rgba(149,106,250,0.4)",
//               background: "transparent",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               cursor: "pointer",
//             }}
//           >
//             <Image
//               src={isDark ? "/icons/light.svg" : "/icons/dark.svg"}
//               alt="theme icon"
//               width={18}
//               height={18}
//             />
//           </button>

//           {/* Login CTA */}
//           <Link
//             href="/auth/login"
//             style={{
//               padding: "0.5rem 1rem",
//               borderRadius: "8px",
//               backgroundColor: "var(--primary)",
//               color: "#fff",
//               fontSize: "0.9rem",
//               fontWeight: 500,
//               textDecoration: "none",
//             }}
//           >
//             Login
//           </Link>
//         </div>
//       </nav>
//     </header>
//   );
// }

// function NavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       style={{
//         fontSize: "0.95rem",
//         textDecoration: "none",
//         color: "var(--foreground)",
//         opacity: 0.8,
//         transition: "opacity 0.2s ease",
//       }}
//       onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
//       onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
//     >
//       {children}
//     </Link>
//   );
// }

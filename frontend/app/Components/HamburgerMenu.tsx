"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./HamburgerMenu.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/Wordle", label: "Wordle" },
  { href: "/WordSearch", label: "Word Search" },
  { href: "/About", label: "About" },
  { href: "/Settings", label: "Settings" },
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 300);
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <div className={styles.wrapper} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter}>
      <button
        className={styles.button}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={styles.line} />
        <span className={styles.line} />
        <span className={styles.line} />
      </button>

      {open && (
        <ul className={styles.dropdown} onClick={() => setOpen(false)}>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.link} ${
                  pathname === href ? styles.active : ""
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

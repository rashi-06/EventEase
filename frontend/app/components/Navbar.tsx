import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #eee', marginBottom: '2rem' }}>
      <Link href="/home/allEvents" style={{ marginRight: '1rem' }}>Events</Link>
      <Link href="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
      <Link href="/auth/login" style={{ marginRight: '1rem' }}>Login</Link>
      <Link href="/auth/signup">Signup</Link>
    </nav>
  );
}

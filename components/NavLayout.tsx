// components/NavLayout.tsx
'use client'; // Ensure this is marked as a Client Component

import { ReactNode } from "react";
import Nav from "./Nav";  // Import Nav Component

interface NavLayoutProps {
  children: ReactNode;  // Allow child components to be rendered
}

const NavLayout: React.FC<NavLayoutProps> = ({ children }) => {
  return (
    <div>
      <Nav /> {/* This will display the Nav component */}
      <main className="container-max mt-6">
        {children} {/* This renders the child content (pages like Downlines, Projects) */}
      </main>
    </div>
  );
};

export default NavLayout;

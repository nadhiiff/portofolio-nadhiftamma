import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    
    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portfolio" },
        { href: "#Contact", label: "Contact" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl inline-flex items-center justify-between px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl rounded-full"
        >
            {/* Left side (Text Logo) */}
            <div className="flex-shrink-0">
                <a
                    href="#Home"
                    onClick={(e) => scrollToSection(e, "#Home")}
                    className="flex items-center gap-2 text-xl font-extrabold text-white tracking-wide cursor-pointer font-serif pl-2"
                >
                    nadhif
                </a>
            </div>

            {/* Middle (Links) */}
            <div className="hidden md:flex gap-6 items-center">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => scrollToSection(e, item.href)}
                        className={`text-sm font-medium transition-colors ${
                            activeSection === item.href.substring(1)
                                ? "text-white"
                                : "text-neutral-300 hover:text-white"
                        }`}
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            {/* Right side (Action/Email Button) & Mobile Menu Button */}
            <div className="flex items-center gap-2">
                <a
                    href="#Contact"
                    onClick={(e) => scrollToSection(e, "#Contact")}
                    className="hidden md:block bg-gradient-to-r from-maroon to-[#7A2E3B] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-maroon/20 shadow-lg shadow-maroon/20 text-sm"
                >
                    Contact
                </a>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`relative p-2 h-10 w-10 flex items-center justify-center bg-white/10 rounded-full text-white transition-transform duration-300 ease-in-out ${
                            isOpen ? "rotate-90" : "rotate-0"
                        }`}
                    >
                        {isOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed top-[calc(100%+1rem)] left-0 w-full z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl md:hidden transition-all duration-300 ease-in-out shadow-2xl overflow-hidden ${
                    isOpen
                        ? "max-h-[300px] opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="px-4 py-5 flex flex-col space-y-3">
                    {navItems.map((item, index) => (
                        <a
                            key={item.label}
                            href={item.href}
                            onClick={(e) => scrollToSection(e, item.href)}
                            className={`block px-4 py-3 rounded-xl text-center text-sm font-medium transition-all duration-300 ease ${
                                activeSection === item.href.substring(1)
                                    ? "bg-white/10 text-white"
                                    : "text-neutral-300 hover:bg-white/5 hover:text-white"
                            }`}
                            style={{
                                transitionDelay: `${index * 50}ms`,
                                transform: isOpen ? "translateY(0)" : "translateY(-10px)",
                                opacity: isOpen ? 1 : 0,
                            }}
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href="#Contact"
                        onClick={(e) => scrollToSection(e, "#Contact")}
                        className="mt-2 block w-full text-center bg-gradient-to-r from-maroon to-[#7A2E3B] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-maroon/20 shadow-lg shadow-maroon/20"
                        style={{
                            transitionDelay: `${navItems.length * 50}ms`,
                            transform: isOpen ? "translateY(0)" : "translateY(-10px)",
                            opacity: isOpen ? 1 : 0,
                        }}
                    >
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
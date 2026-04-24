"use client";

import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Twitter,
    Youtube,
    Github,
    Volume2,
} from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { toolLinks } from "@/lib/tool-catalog";

const footerLinks = {
    tools: [
        { name: "Tạo CV xin việc", href: "#" },
        { name: "Rút gọn liên kết", href: "#" },
        { name: "Clip-path maker", href: "#" },
        { name: "Snippet generator", href: "#" },
        { name: "CSS Grid generator", href: "#" },
        { name: "Cảnh báo sờ tay lên mặt", href: "#" },
    ],
    community: [
        { name: "Discord", href: "https://discord.com/invite/a6pe69KkPd" },
        { name: "Facebook Group", href: "#" },
        { name: "Telegram", href: "#" },
        { name: "Youtube", href: "#" },
    ],
};

const toolFooterLinks = toolLinks.map(({ name, href }) => ({ name, href }));

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "Youtube" },
    { icon: Github, href: "https://github.com/codemind-dev", label: "Github" },
];

function getLinkProps(href: string) {
    if (href.startsWith("http://") || href.startsWith("https://")) {
        return {
            target: "_blank" as const,
            rel: "noopener noreferrer" as const,
        };
    }

    return {};
}

export default function Footer() {
    return (
        <footer
            className="bg-gray-900 text-white pointer-events-none"
            style={{
                position: "relative",
                zIndex: 30,
            }}
        >
            <div className="w-full px-6 md:px-12 py-12 pb-24 md:pb-12 pointer-events-auto">
                {/* Mobile & Tablet Layout */}
                <div className="block md:block lg:hidden space-y-8">
                    {/* Company Info - Full width on tablet */}
                    <div className="space-y-4 text-center md:text-left">
                        <Logo dark={true} size="md" className="justify-center md:justify-start" />

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng học lập trình tích hợp AI hàng đầu.
                        </p>

                        <div className="space-y-2 flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>hello@codemind.dev</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>1900-xxxx</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Hồ Chí Minh, Việt Nam</span>
                            </div>
                        </div>
                    </div>

                    {/* Three columns - Row on tablet */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* About CodeMind */}
                        <div className="text-center md:text-left">
                            <h4 className="font-semibold text-base mb-4 text-white">
                            Về CodeMind
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/about"
                                        className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                        style={{ transition: "all .2s ease" }}
                                    >
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/contact"
                                        className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                        style={{ transition: "all .2s ease" }}
                                    >
                                        Liên hệ
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Công cụ */}
                        <div className="text-center md:text-left">
                            <h4 className="font-semibold text-base mb-4 text-white">
                                Công cụ
                            </h4>
                            <ul className="space-y-2">
                                {toolFooterLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                            style={{
                                                transition: "all .2s ease",
                                            }}
                                            {...getLinkProps(link.href)}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Community */}
                        <div className="text-center md:text-left">
                            <h4 className="font-semibold text-base mb-4 text-white">
                                Cộng đồng
                            </h4>
                            <ul className="space-y-2 mb-4">
                                {footerLinks.community.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                            style={{
                                                transition: "all .2s ease",
                                            }}
                                            {...getLinkProps(link.href)}
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Social Links */}
                            <div className="flex space-x-3 justify-center md:justify-start">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        {...getLinkProps(social.href)}
                                        className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                                        style={{ transition: "all .2s ease" }}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-6 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4 lg:col-span-2">
                        <Logo dark={true} size="md" />

                        <p className="text-gray-400 text-sm leading-relaxed">
                            Nền tảng học lập trình tích hợp AI hàng đầu.
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>hello@codemind.dev</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>1900-xxxx</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Hồ Chí Minh, Việt Nam</span>
                            </div>
                        </div>
                    </div>

                    {/* About CodeMind */}
                    <div>
                        <h4 className="font-semibold text-base mb-4 text-white">
                            Về CodeMind
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                    style={{ transition: "all .2s ease" }}
                                >
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                    style={{ transition: "all .2s ease" }}
                                >
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Công cụ */}
                    <div>
                        <h4 className="font-semibold text-base mb-4 text-white">
                            Công cụ
                        </h4>
                        <ul className="space-y-2">
                            {toolFooterLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                        style={{ transition: "all .2s ease" }}
                                        {...getLinkProps(link.href)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h4 className="font-semibold text-base mb-4 text-white">
                            Cộng đồng
                        </h4>
                        <ul className="space-y-2 mb-4">
                            {footerLinks.community.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                                        style={{ transition: "all .2s ease" }}
                                        {...getLinkProps(link.href)}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Social Links */}
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    {...getLinkProps(social.href)}
                                    className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700"
                                    style={{ transition: "all .2s ease" }}
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Empty Column */}
                    <div></div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between pointer-events-auto">
                    <div className="flex items-center space-x-2 text-gray-400 text-xs mb-3 md:mb-0">
                        <span>
                            © 2025 - 2026 CodeMind. All rights reserved.
                        </span>
                    </div>

                    <div className="flex space-x-4 text-xs">
                        <Link
                            href="#"
                            className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                            style={{ transition: "all .2s ease" }}
                        >
                            Điều khoản sử dụng
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                            style={{ transition: "all .2s ease" }}
                        >
                            Chính sách bảo mật
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-400 hover:text-white inline-block hover:translate-x-[4px]"
                            style={{ transition: "all .2s ease" }}
                        >
                            Liên hệ
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

'use client';
import styles from './Sidebar.module.css';
import Image from 'next/image'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useRef, useEffect } from 'react';
import Footer from '../Footer/Footer';

// Импортируем все изображения
import mfcIcon from './icons/mfc.svg';
import searchIcon from './icons/search.svg';
import vkIcon from './icons/vk.svg';
import tgIcon from './icons/tg.svg';
import youtubeIcon from './icons/youtube.svg';
import rutubeIcon from './icons/rutube.svg';
import okIcon from './icons/ok.svg';
import dzenIcon from './icons/dzen.svg';

interface MenuItem {
    id: number;
    title: string;
    link: string | null;
    Margin: boolean | null; // Добавляем поле Margin
    icon: string | null;
    MenuItems?: MenuItem[];
}

interface SidebarProps {
    sidebarData: {
        burgerMenu: MenuItem[];
    } | null;
    footerData?: any;
}

export default function Sidebar({ sidebarData, footerData }: SidebarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        setHoveredItem(null);
    };

    const handleMouseEnter = (itemId: number) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setHoveredItem(itemId);
    };

    const handleMouseLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredItem(null);
        }, 150);
    };

    const handleSubMenuMouseEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleSubMenuMouseLeave = () => {
        handleMouseLeave();
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    const menuItems = sidebarData?.burgerMenu || [];

    return (
        <>
            {/* Основной сайдбар */}
            <nav className={`${styles.sidebar} ${isMenuOpen ? styles.isMenuOpen : ''}`} id="sidebar">
                {/* Бургер-иконка */}
                <div className={styles.burgerIcon} onClick={toggleMenu}>
                    {isMenuOpen ? (
                        <CloseIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    ) : (
                        <MenuIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    )}
                </div>

                <div className={styles.sidebarIcons}>
                    <div className={styles.sidebarIconGroup}>
                        <Image src={mfcIcon} alt="МФЦ" width={30} height={30} />
                        <Image src={searchIcon} alt="Поиск" width={30} height={30} />
                    </div>
                    <div className={styles.sidebarIconGroup}>
                        <Image src={vkIcon} alt="VK" width={30} height={30} />
                        <Image src={tgIcon} alt="Telegram" width={30} height={30} />
                        <Image src={youtubeIcon} alt="YouTube" width={30} height={30} />
                        <Image src={rutubeIcon} alt="Rutube" width={30} height={30} />
                        <Image src={okIcon} alt="OK" width={30} height={30} />
                        <Image src={dzenIcon} alt="Дзен" width={30} height={30} />
                    </div>

                    <div className={styles.sidebarIconGroup}>
                        <RemoveRedEyeIcon
                            className={styles.sidebarIcon}
                            titleAccess="Версия для слабовидящих"
                            fontSize="small"
                            sx={{ color: 'white' }}
                        />
                        <div className={styles.languageSwitcher}>
                            <span className={`${styles.languageOption} ${styles.active}`}>Рус</span>
                            <span className={styles.languageOption}>Eng</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Бургер-меню на весь экран */}
            <div className={`${styles.burgerMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <div className={styles.menuContent} ref={menuRef}>
                    {/* Основной контент меню */}
                    <div className={styles.menuMainContent}>
                        <nav className={styles.menuNav}>
                            <ul className={styles.menuList}>
                                {menuItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className={`${styles.menuItem} ${item.Margin ? styles.menuItemWithMargin : ''}`}
                                        onMouseEnter={() => item.MenuItems && item.MenuItems.length > 0 && handleMouseEnter(item.id)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className={styles.menuItemContent}>
                                            <a
                                                href={item.link || '#'}
                                                className={styles.menuLink}
                                                onClick={(e) => {
                                                    if (!item.MenuItems || item.MenuItems.length === 0) {
                                                        closeMenu();
                                                    } else {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                {item.title}
                                            </a>
                                            {item.MenuItems && item.MenuItems.length > 0 && (
                                                <span className={styles.arrow}>•</span>
                                            )}
                                        </div>

                                        {/* Подменю */}
                                        {item.MenuItems && item.MenuItems.length > 0 && hoveredItem === item.id && (
                                            <ul
                                                className={styles.subMenu}
                                                onMouseEnter={handleSubMenuMouseEnter}
                                                onMouseLeave={handleSubMenuMouseLeave}
                                            >
                                                {item.MenuItems.map((subItem) => (
                                                    <li key={subItem.id} className={styles.subMenuItem}>
                                                        <a
                                                            href={subItem.link || '#'}
                                                            className={styles.subMenuLink}
                                                            onClick={closeMenu}
                                                        >
                                                            {subItem.title}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Футер в меню */}
                    {footerData && (
                        <div className={styles.menuFooter}>
                            <Footer footerData={footerData} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
'use client';
import styles from './Sidebar.module.css';
import Image from 'next/image'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

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
    icon: string | null;
}

interface SidebarProps {
    sidebarData: {
        burgerMenu: MenuItem[];
    } | null;
}

export default function Sidebar({ sidebarData }: SidebarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Если данные не загружены, показываем базовый сайдбар
    const menuItems = sidebarData?.burgerMenu || [];

    return (
        <>
            {/* Основной сайдбар */}
            <nav className={styles.sidebar} id="sidebar">
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

            {/* Бургер-меню */}
            <div className={`${styles.burgerMenu} ${isMenuOpen ? styles.menuOpen : ''}`}>
                <div className={styles.menuHeader}>
                    <h3 className={styles.menuTitle}>Меню</h3>
                    <CloseIcon
                        className={styles.closeIcon}
                        onClick={closeMenu}
                        sx={{ color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
                    />
                </div>

                <nav className={styles.menuNav}>
                    <ul className={styles.menuList}>
                        {menuItems.map((item) => (
                            <li key={item.id} className={styles.menuItem}>
                                <a
                                    href={item.link || '#'}
                                    className={styles.menuLink}
                                    onClick={closeMenu}
                                    target={item.link?.startsWith('http') ? '_blank' : '_self'}
                                    rel={item.link?.startsWith('http') ? 'noopener noreferrer' : ''}
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Overlay для закрытия меню по клику вне его */}
            {isMenuOpen && (
                <div
                    className={styles.menuOverlay}
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
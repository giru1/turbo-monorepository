import styles from './Sidebar.module.css';
import Image from 'next/image'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Импортируем все изображения
import mfcIcon from './icons/mfc.svg';
import searchIcon from './icons/search.svg';
import vkIcon from './icons/vk.svg';
import tgIcon from './icons/tg.svg';
import youtubeIcon from './icons/youtube.svg';
import rutubeIcon from './icons/rutube.svg';
import okIcon from './icons/ok.svg';
import dzenIcon from './icons/dzen.svg';

export default function Sidebar() {
    return (
        <nav className={styles.sidebar} id="sidebar">
            <i className={`bi bi-list ${styles.burgerIcon} ${styles.sidebarIcon}`} id="burger-icon"></i>

            <div className={styles.sidebarIcons}>
                <div className={styles.sidebarIconGroup}>
                    <Image src={mfcIcon} alt="МФЦ"/>
                    <Image src={searchIcon} alt="Поиск"/>
                </div>
                <div className={styles.sidebarIconGroup}>
                    <Image src={vkIcon} alt="VK"/>
                    <Image src={tgIcon} alt="Telegram"/>
                    <Image src={youtubeIcon} alt="YouTube"/>
                    <Image src={rutubeIcon} alt="Rutube"/>
                    <Image src={okIcon} alt="OK"/>
                    <Image src={dzenIcon} alt="Дзен"/>
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
    )
}
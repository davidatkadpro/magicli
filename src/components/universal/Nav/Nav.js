import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { useClickOutside } from '../../Helpers/ClickOutside'
import styles from './Nav.module.css'


export default function Nav() {
    const [menu, setmenu] = useState(false)

    const handleClose = () => {
        setmenu(false)
    }

    let domMenu = useClickOutside(() => {
        setmenu(false)
    })
    return (
        <div className="navbar-fixed">
            <nav className={styles.nav}>
                <div className="nav-wrapper container">
                    <Link onClick={handleClose}  to="/" className={`brand-logo ${styles.brand}`}><i className="material-icons">blur_on</i><span>MagicLi</span></Link>
                    <span className="sidenav-trigger"><i  onClick={()=>setmenu(!menu)} className="material-icons">menu</i></span>
                    <ul className="right hide-on-med-and-down">
                        <li><Link onClick={handleClose} to="/">Dashboard</Link></li>
                        <li><Link onClick={handleClose} to="/tree">List Tree</Link></li>
                    </ul>
                </div>
            </nav>           
            <ul  ref={domMenu}  className={`sidenav ${styles.sidenav}`}  style={{transform: menu ? "translateX(0%)":"translateX(-105%)" }}>
                <li><i  onClick={handleClose} className="material-icons right">close</i></li>
                <li><Link  onClick={handleClose} to="/">Dashboard</Link></li>
                <li><Link  onClick={handleClose} to="/tree">List Tree</Link></li>
            </ul>
        </div>

    )
}

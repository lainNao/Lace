import styles from './HeadThreeColumnFoot.module.scss'

const HeadThreeColumnFoot = ({children}) => {
  return <div id="headThreeColumnFoot" className={styles.headThreeColumnFoot}>{children}</div>
}

const Header = ({className = "", children}) => {
  return <div className={`${styles.header} ${className}`}>{children}</div>
}

const Left = ({className = "", children}) => {
  return <div className={`${styles.left} ${className}`}>{children}</div>
}

const Center = ({className = "", children}) => {
  return <div className={`${styles.center} ${className}`}>{children}</div>
}

const Right = ({className = "", children}) => {
  return <div className={`${styles.right} ${className}`}>{children}</div>
}

const Footer = ({className = "", children}) => {
  return <div className={`${styles.footer} ${className}`}>{children}</div>
}

export {
  HeadThreeColumnFoot,
  Header,
  Left,
  Center,
  Right,
  Footer,
};

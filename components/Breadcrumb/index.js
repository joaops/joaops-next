import styles from './Breadcrumb.module.css'

const Breadcrumb = ({ breadcrumb, goTo }) => {

    const styleLast = {
        color: '#EEEEEE',
        textDecoration: 'none',
        cursor: 'default'
    }

    return (
        <ul className={styles.breadcrumb}>
            {breadcrumb &&
                breadcrumb.map((item, index, array) => {
                    const lastItem = index === array.length - 1
                    return (
                        <li key={item.id} onClick={() => !lastItem ? goTo(item.id) : null}>
                            <span style={lastItem ? styleLast : null}>{item.name}</span>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default Breadcrumb
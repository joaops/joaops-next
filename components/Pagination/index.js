import Link from 'next/link'

import styles from './Pagination.module.scss'

export default function Pagination({ currentPage, pageSize, totalCount }) {
    const totalPageCount = Math.ceil(totalCount / pageSize)
    const pagesIndex = Array.from({ length: totalPageCount }, (v, i) => i + 1)
    const hasPrevious = pagesIndex.includes(parseInt(currentPage) - 1)
    const hasNext = pagesIndex.includes(parseInt(currentPage) + 1)
    const pagesGroup = getSubArray()
    const lastPage = pagesIndex[pagesIndex.length - 1]

    function getSubArray() {
        let start = (currentPage - 3 < 0) ? 0 : currentPage - 3
        let end = start + 5
        if (end > totalPageCount) {
            end = totalPageCount
            start = (end - 5 < 0) ? 0 : end - 5
        }
        return pagesIndex.slice(start, end)
    }

    return (
        <div className={styles.pagination}>
            {
                hasPrevious &&
                <Link href={hasPrevious ? (parseInt(currentPage) === 2 ? '/blog' : `/blog?page=${parseInt(currentPage) - 1}`) : '/blog'}>
                    <a className={styles.previous}>{'<'}</a>
                </Link>
            }
            {
                !hasPrevious &&
                <span className={styles.previous}>{'<'}</span>
            }
            {
                (pagesGroup[0] != 1) &&
                <>
                    <Link href={'/blog'}>
                        <a className={parseInt(currentPage) === 1 ? styles.active : ''}>1</a>
                    </Link>
                </>
            }
            {
                (pagesGroup[0] > 2) &&
                <>
                    <span className={styles.more}>{'...'}</span>
                </>
            }
            {
                pagesGroup.map(index => {
                    if (parseInt(currentPage) === index) {
                        return <span key={index} className={styles.active}>{index}</span>
                    } else {
                        return (
                            <Link key={index} href={index === 1 ? '/blog' : `/blog?page=${index}`}>
                                <a className={parseInt(currentPage) === index ? styles.active : ''}>{index}</a>
                            </Link>
                        )
                    }
                })
            }
            {
                (pagesGroup[pagesGroup.length - 1] <= lastPage - 2) &&
                <>
                    <span className={styles.more}>{'...'}</span>
                </>
            }
            {
                (pagesGroup[pagesGroup.length - 1] != lastPage) &&
                <>
                    <Link href={`/blog?page=${lastPage}`}>
                        <a className={parseInt(currentPage) === lastPage ? styles.active : ''}>{lastPage}</a>
                    </Link>
                </>
            }
            {
                hasNext &&
                <Link href={`/blog?page=${parseInt(currentPage) + 1}`}>
                    <a className={styles.next}>{'>'}</a>
                </Link>
            }
            {
                !hasNext &&
                <span className={styles.next}>{'>'}</span>
            }
        </div>
    )
}
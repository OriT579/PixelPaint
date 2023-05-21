import { useState, useEffect, FC } from 'react'
import { Tile } from '../models'
import styles from './styles.module.scss'
import { clone, cloneDeep } from 'lodash'

interface GridLayoutProps {
    rows: number
    columns: number
    picture?: boolean
    showPicture?: boolean
    score?: number
    clickableCanvas?: boolean
    puzzle: Tile[]
    onTileClicked?: Function
    onClearClicked?: Function
}

const GridLayout: FC<GridLayoutProps> = ({
    rows,
    columns,
    picture,
    showPicture,
    score,
    clickableCanvas,
    puzzle,
    onTileClicked,
    onClearClicked
}: GridLayoutProps) => {
    const [canvas, setCanvas] = useState(cloneDeep(puzzle))
    const [tileSize, setTileSize] = useState(getTileSize())

    useEffect(() => {
        const newCanvas = cloneDeep(puzzle)
        if (!picture) {
            for (const tile of newCanvas) {
                tile.highlighted = false
            }
        }
        setCanvas(newCanvas)
    }, [puzzle])

    useEffect(() => {
        function handleResize() {
            setTileSize(getTileSize())
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const handleMouseUp = (index: number) => {
        if (clickableCanvas) {
            canvas[index].highlighted = !canvas[index].highlighted
            if (onTileClicked) {
                onTileClicked(index, canvas[index].highlighted)
            }
            setCanvas(cloneDeep(canvas))
        }
    }

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault()
    }

    const clearHighlightedTiles = () => {
        const newCanvas = cloneDeep(canvas)
        for (const tile of newCanvas) {
            tile.highlighted = false
        }
        setCanvas(newCanvas)
        if (onClearClicked) {
            onClearClicked()
        }
    }

    function getTileSize() {
        const screenWidth = window.innerWidth
        if (screenWidth < 768) {
            return '2.8em'
        } else {
            return '4em'
        }
    }

    return (
        <div className={`container-fluid`} style={{ paddingTop: '10px' }}>
            {Array.from({ length: rows }, (_, i) => {
                return (
                    <div
                        className={`row justify-content-center ${styles.tileRow}`}
                        key={i}
                    >
                        {Array.from({ length: columns }, (_, j) => {
                            const index = i * columns + j
                            const isHighlighted = canvas[index]?.highlighted
                            return (
                                <div
                                    className={`${picture ? '' : styles.tile}`}
                                    key={`${i}-${j}`}
                                    style={{
                                        backgroundColor: isHighlighted
                                            ? 'red'
                                            : 'black',
                                        margin: picture
                                            ? '-2.5px 2.5px'
                                            : '0px 5px',
                                        width: picture ? '20px' : tileSize,
                                        height: picture ? '20px' : tileSize,
                                        visibility: showPicture
                                            ? 'visible'
                                            : 'hidden'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseUp={() => handleMouseUp(index)}
                                ></div>
                            )
                        })}
                    </div>
                )
            })}
            <div>
                {!picture && (
                    <div className={`${styles.gameBtns}`}>
                        <button
                            className="clear-btn"
                            onClick={clearHighlightedTiles}
                        >
                            <h1>CLEAR</h1>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GridLayout

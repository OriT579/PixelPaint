import { useState, useEffect, FC } from 'react'
import { Tile } from '../models'
import styles from './styles.module.scss'
import { clone, cloneDeep } from 'lodash'
import { Modes } from '../utils/GameConstants'
import { Colors } from '../utils/ColorsConstants'

interface GridLayoutProps {
    rows: number
    columns: number
    picture?: boolean
    showPicture?: boolean
    score?: number
    clickableCanvas?: boolean
    puzzle: Tile[]
    gameMode?: number
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
    onClearClicked,
    gameMode
}: GridLayoutProps) => {
    const [canvas, setCanvas] = useState(cloneDeep(puzzle))
    const [color, setColor] = useState('blue')

    useEffect(() => {
        const newCanvas = cloneDeep(puzzle)
        if (!picture) {
            for (const tile of newCanvas) {
                tile.highlighted = false
            }
        }
        setCanvas(newCanvas)
    }, [puzzle])

    const handleMouseUp = (index: number) => {
        if (clickableCanvas) {
            canvas[index].highlighted = !canvas[index].highlighted
            if (gameMode === Modes.PAINT) canvas[index].color = color
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

    return (
        <div
            className={`container-fluid ${styles.gridContainer}`}
            style={{ paddingTop: '10px' }}
        >
            {Array.from({ length: rows }, (_, i) => {
                return (
                    <div
                        className={`row justify-content-center ${styles.tileRow}`}
                        key={i}
                    >
                        {Array.from({ length: columns }, (_, j) => {
                            const index = i * columns + j
                            const currTile = canvas[index]
                            const isHighlighted = currTile?.highlighted
                            return (
                                <div
                                    className={`${picture ? '' : styles.tile}`}
                                    key={`${i}-${j}`}
                                    style={{
                                        backgroundColor: isHighlighted
                                            ? currTile.color
                                                ? currTile.color
                                                : Colors.TILE_COLOR_HIGHLIGHTED
                                            : Colors.TILE_COLOR_DEFAULT,
                                        margin: picture
                                            ? '-2.5px 2.5px'
                                            : '0px 5px',
                                        width: picture ? '1.5em' : '4em',
                                        height: picture ? '1.5em' : '4em',
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

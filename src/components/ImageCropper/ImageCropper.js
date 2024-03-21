import { useState, useEffect } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'

const DRAG_HANDLES = [
    "ReactCrop__drag-handle ord-nw",
    "ReactCrop__drag-handle ord-n",
    "ReactCrop__drag-handle ord-ne",
    "ReactCrop__drag-handle ord-e",
    "ReactCrop__drag-handle ord-se",
    "ReactCrop__drag-handle ord-s",
    "ReactCrop__drag-handle ord-sw",
    "ReactCrop__drag-handle ord-w",
]

export const ImageCropper = (props) => {
    const { image, displayPoints, disabled, fullscreen } = props
    const [crop, setCrop] = useState()
    const [zoom, setZoom] = useState(1)
    const [ width, setWidth ] = useState("45vw")

    const styles = {
        imageStyle: {
            width:width
        }
    }

    useEffect(() => {
        if (fullscreen) {
            setWidth("90vw")
        } else {
            setWidth("45vw")
        }
    }, [fullscreen])

    useEffect(() => {
        if (displayPoints) {
            let crop_x = displayPoints[0][0] - 0.3
            let crop_y = displayPoints[0][1] - 0.3
            let crop_width = displayPoints[1][0] - displayPoints[0][0] + 0.6
            let crop_height = displayPoints[2][1] - displayPoints[1][1] + 0.6
            let newCrop = {
                unit: "%",
                x: crop_x,
                y: crop_y,
                width: crop_width,
                height: crop_height
            }
            setCrop(newCrop)
            setTimeout(function() {
                removeDragHandles()
              }, 10)
            
        } else{
            setCrop(null)
        }
        
    }, [displayPoints])

    useEffect(() => {
    }, [props])

    const handleSetCrop = (c) => {
        setCrop(c)
    }

    const removeDragHandles = () => {
        for (let dragHandleClass of DRAG_HANDLES) {
            let dragHandle = document.getElementsByClassName(dragHandleClass)
            if (dragHandle.length > 0) {
                dragHandle[0].style.display="none"
            }
        }
        
    }

    return (
        <ReactCrop crop={crop} onChange={c => handleSetCrop(c)} locked={disabled}>
            <img src={image} style={styles.imageStyle}/>
        </ReactCrop>
    )
}
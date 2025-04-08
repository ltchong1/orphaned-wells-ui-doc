import { useState, useEffect } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { findCenter } from '../../util';

const DRAG_HANDLES: string[] = [
    "ReactCrop__drag-handle ord-nw",
    "ReactCrop__drag-handle ord-n",
    "ReactCrop__drag-handle ord-ne",
    "ReactCrop__drag-handle ord-e",
    "ReactCrop__drag-handle ord-se",
    "ReactCrop__drag-handle ord-s",
    "ReactCrop__drag-handle ord-sw",
    "ReactCrop__drag-handle ord-w",
];

interface ImageCropperProps {
    image: string;
    displayPoints: number[][] | null;
    disabled: boolean;
    fullscreen: string | null;
    imageIdx: number;
    highlightedImageIdxIndex: number;
}

const ZOOM_SCALE = 2

export const ImageCropper = (props: ImageCropperProps) => {
    const { image, displayPoints, disabled, fullscreen, imageIdx, highlightedImageIdxIndex } = props;
    const [crop, setCrop] = useState<Crop | undefined>(undefined);
    const [width, setWidth] = useState("100%");
    const [height, setHeight] = useState("100%");
    const [ transformScale, setTransformScale ] = useState(1) // 1 = normal size
    const [ transformOrigin, setTransformOrigin ] = useState([50,50]) // [0,0] = top left ; [100,100] = bottom right
    const [ translate, setTranslate ] = useState([0,0])

    const styles = {
        imageDiv: {
            width: width,
            height: height,
        },
        image: {
            transition: 'transform 0.3s',
            transform: `scale(${transformScale})`,
            transformOrigin: `${transformOrigin[0]}% ${transformOrigin[1]}%`,
            translate: `${translate[0]}% ${translate[1]}%`,
        }
    };

    useEffect(() => {
        if (crop) {
            let tempCrop = Object.assign({}, crop);
            setCrop(undefined);
            setTimeout(() => {
                setCrop(tempCrop);
            }, 0);
        }
    }, [fullscreen]);

    useEffect(() => {
        updateDisplay()
    }, [displayPoints, highlightedImageIdxIndex]);

    const updateDisplay = () => {
        if (displayPoints && highlightedImageIdxIndex === imageIdx) {
            const extendBy = 0.5 * ZOOM_SCALE// use this to extend the corners 

            let center = findCenter(displayPoints)
            let width = (displayPoints[1][0] - displayPoints[0][0]) * ZOOM_SCALE
            let height = (displayPoints[2][1] - displayPoints[1][1]) * ZOOM_SCALE
            let newCrop: Crop = {
                unit: "%",
                x: 50 - (width / 2) - extendBy,
                y: 50 - (height / 2) - extendBy,
                width: width + (extendBy * 2),
                height: height + (extendBy * 2)
            };
            setCrop(newCrop);
            setTimeout(() => {
                removeDragHandles();
            }, 10);
            setTransformScale(ZOOM_SCALE)
            setTransformOrigin(center);

            let newTranslate = [50-center[0], 50-center[1]]
            setTranslate(newTranslate);
        } else {
            setCrop(undefined);
            setTransformScale(1);
            setTransformOrigin([50, 50]);
            setTranslate([0,0])
        }
    }

    const handleSetCrop = (c: Crop) => {
        setCrop(c);
    };

    const removeDragHandles = () => {
        for (let dragHandleClass of DRAG_HANDLES) {
            let dragHandle = Array.from(document.getElementsByClassName(dragHandleClass) as HTMLCollectionOf<HTMLElement>);
            if (dragHandle.length > 0) {
                dragHandle[0].style.display = "none";
            }
        }
    };

    return (
        <ReactCrop crop={crop} onChange={c => handleSetCrop(c)} locked={disabled}>
            <img src={image} alt="well document" style={styles.image}/>
        </ReactCrop>
    );
};
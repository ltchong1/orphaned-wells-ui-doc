import { useState, useEffect } from "react";

import ReactLassoSelect from "react-lasso-select";

interface Point {
  x: number;
  y: number;
}

export default function LassoSelector(props: { image: string, displayPoints: number[][], disabled: boolean, fullscreen: null | string }) {
  const [src, setSrc] = useState(props.image);
  const [img, setImg] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(40);
  const [points, setPoints] = useState<Point[]>();

  useEffect(() => {
    setSrc(props.image)
  }, [props])

  useEffect(() => {
    if (props.fullscreen === "image") setWidth(80)
    else setWidth(40)
  }, [props.fullscreen])

  useEffect(() => {
    if (props.displayPoints !== null && props.displayPoints !== undefined) {
      let newPoints = []
      for (let point of props.displayPoints) {
        let newPoint: Point = {
          x: point[0],
          y: point[1]
        }
        newPoints.push(newPoint)
      }
      // props.setShowCompletedPoints(false)
      setPoints(newPoints)
    }
  }, [props.displayPoints])

  const handleSetPoints = (path: Point[]) => {
    // props.setShowCompletedPoints(true)
    setPoints(path);
  }

  const handleCompletedPoints = (path: Point[]) => {
    let temp_points = []
    for (let point of path) {
      temp_points.push([point.x,point.y])
    }
    setPoints(path);
  }

  return (
    <div className="container">
      <ReactLassoSelect
        disabled={props.disabled}
        value={points}
        src={src}
        onChange={(path) => {
          handleSetPoints(path);
        }}
        onComplete={(path) => {
          handleCompletedPoints(path);
        }}
        style={{
          cursor:"pointer"
        }}
        imageStyle={{ width: `${width}vw` }}
        onImageLoad={(e) => {
          const img = e.target as HTMLImageElement;
          setImg({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }}
      />
      <br />
    </div>
  );
}

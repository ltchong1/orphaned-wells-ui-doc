import React, { useState, useEffect } from "react";
import "./styles.css";

import ReactLassoSelect from "react-lasso-select";

interface Point {
  x: number;
  y: number;
}

function pointsToString(points: Point[]): string {
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}

export default function LassoSelector(props: { image: string, handleUpdatePoints: Function, displayPoints: number[][], setShowCompletedPoints: Function, disabled: boolean }) {
  const [src, setSrc] = useState(props.image);
  const [img, setImg] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(28);
  const [points, setPoints] = useState<Point[]>();

  useEffect(() => {
    setSrc(props.image)
  }, [props])

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
      props.setShowCompletedPoints(false)
      setPoints(newPoints)
    }
  }, [props.displayPoints])

  const handleSetPoints = (path: Point[]) => {
    console.log('handleSetPoints: ')
    console.log(path)
    props.setShowCompletedPoints(true)
    setPoints(path);
  }

  const handleCompletedPoints = (path: Point[]) => {
    console.log('handleCompletedPoints: ')
    let temp_points = []
    for (let point of path) {
      temp_points.push([point.x,point.y])
      // console.log(point.x,point.y)
    }
    props.handleUpdatePoints(temp_points)
    setPoints(path);
  }

  return (
    <div className="container">
      {/* Image width:{" "}
      <input
        type="range"
        min="0"
        max="50"
        value={width}
        onChange={(e) => setWidth(+e.target.value)}
      />
      <br /> */}
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

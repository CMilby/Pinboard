import React, { Component } from "react";

import { MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT } from "../constants";

interface ICreateWindowProps {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface ICreateWindowState {}

export default class CreateWindow extends Component<
	ICreateWindowProps,
	ICreateWindowState
> {
	render() {
		let color =
			Math.abs(this.props.width) < MIN_WINDOW_WIDTH ||
			Math.abs(this.props.height) < MIN_WINDOW_HEIGHT
				? "#db4646"
				: "#72ad79";

		let x = this.props.x;
		let width = this.props.width;
		if (width < 0) {
			x += width;
			width = -width;
		}

		let y = this.props.y;
		let height = this.props.height;
		if (height < 0) {
			y += height;
			height = -height;
		}

		return (
			<div
				style={{
					position: "fixed",
					left: x,
					top: y,
					width: `${width}px`,
					height: `${height}px`,
					backgroundColor: color,
					opacity: 0.5
				}}
			></div>
		);
	}
}

import React, { Component, createRef } from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { RESIZER_OFFSET, RESIZER_SIZE } from "../constants";

import "../css/Window.css";
import "../css/WindowTheme.css";

export type Window = {
	id: number;

	x: number;
	y: number;
	width: number;
	height: number;

	title: string;
	text: string;

	pos_lock: boolean;
	size_lock: boolean;
};

interface IWindowProps {
	window: Window;
	theme: string;

	onMouseDown: (
		id: number,
		startX: number,
		startY: number,
		event: "move" | "resize"
	) => void;

	onTextAreaChange: (id: number, newText: string) => void;
	onTitleChange: (id: number, newText: string) => void;

	onCloseClick: (id: number) => void;
	onLockUnlockPosition: (id: number) => void;
	onLockUnlockSize: (id: number) => void;

	onFocusRecieved: (id: number) => void;
}

interface IWindowState {}

export default class WindowComponent extends Component<
	IWindowProps,
	IWindowState
> {
	private textAreaRef = createRef<HTMLTextAreaElement>();

	constructor(props: any) {
		super(props);

		this.handleMouseDownHeader = this.handleMouseDownHeader.bind(this);
		this.handleMouseDownResize = this.handleMouseDownResize.bind(this);
		this.handleTextAreaInput = this.handleTextAreaInput.bind(this);
		this.handleTitleInput = this.handleTitleInput.bind(this);
		this.handleCloseClick = this.handleCloseClick.bind(this);
		this.handleOnFocus = this.handleOnFocus.bind(this);

		this.handleLockUnlockPosition = this.handleLockUnlockPosition.bind(
			this
		);
		this.handleLockUnlockResize = this.handleLockUnlockResize.bind(this);
	}

	handleMouseDownHeader(e: any) {
		if (this.props.window.pos_lock) {
			return;
		}

		if (e.target.classList.contains("ignore-mousedown")) {
			return;
		}

		this.props.onMouseDown(
			this.props.window.id,
			e.clientX,
			e.clientY,
			"move"
		);
	}

	handleMouseDownResize(e: any) {
		this.props.onMouseDown(
			this.props.window.id,
			e.clientX,
			e.clientY,
			"resize"
		);
	}

	handleTextAreaInput(e: any) {
		this.props.onTextAreaChange(this.props.window.id, e.target.value);
	}

	handleTitleInput(e: any) {
		this.props.onTitleChange(this.props.window.id, e.target.value);
	}

	handleCloseClick() {
		this.props.onCloseClick(this.props.window.id);
	}

	handleOnFocus() {
		this.props.onFocusRecieved(this.props.window.id);
	}

	handleLockUnlockPosition() {
		this.props.onLockUnlockPosition(this.props.window.id);
	}

	handleLockUnlockResize() {
		this.props.onLockUnlockSize(this.props.window.id);
	}

	render() {
		// let resize = (
		// 	<img
		// 		className={`resize-area corner-img resize-area-${this.props.theme}`}
		// 		draggable={false}
		// 		style={{
		// 			position: "absolute",
		// 			right: `${RESIZER_OFFSET}px`,
		// 			bottom: `${RESIZER_OFFSET}px`,
		// 			width: `${RESIZER_SIZE}px`,
		// 			height: `${RESIZER_SIZE}px`
		// 		}}
		// 		src={CornerIcon}
		// 		alt=""
		// 		onMouseDown={this.handleMouseDownResize}
		// 	/>
		// );

		let resize = (
			<svg
				viewBox="0 0 640 640"
				width={64}
				height={64}
				className={`resize-area resize-area-${this.props.theme}`}
				style={{
					position: "absolute",
					right: `${RESIZER_OFFSET}px`,
					bottom: `${RESIZER_OFFSET}px`,
					width: `${RESIZER_SIZE}px`,
					height: `${RESIZER_SIZE}px`
				}}
				onMouseDown={this.handleMouseDownResize}
			>
				<path
					id="audlY2A0S"
					d="M674.58 -29.79L719.83 15.46L12.72 722.57L-32.53 677.31L674.58 -29.79Z"
				/>
			</svg>
		);

		return (
			<div
				style={{
					position: "fixed",
					left: this.props.window.x,
					top: this.props.window.y,
					width: `${this.props.window.width}px`,
					height: `${this.props.window.height}px`
				}}
				onClick={this.handleOnFocus}
			>
				<ContextMenuTrigger id={`ctx_men_trig_${this.props.window.id}`}>
					<table
						className={`window-root window-root-${this.props.theme}`}
						style={{
							width: `${this.props.window.width}px`,
							height: `${this.props.window.height}px`
						}}
					>
						<thead
							className={`window-head window-head-${this.props.theme}`}
							onMouseDown={this.handleMouseDownHeader}
						>
							<tr>
								<th>
									<div>
										<span
											style={{
												float: "left",
												width: `${this.props.window
													.width - 40}px`
											}}
										>
											<input
												type="text"
												className={`window-title window-title-${this.props.theme}`}
												placeholder="Title"
												value={this.props.window.title}
												onChange={this.handleTitleInput}
											></input>
										</span>
										<span style={{ float: "right" }}>
											<button
												className={`x-button x-button-${this.props.theme} ignore-mousedown`}
												onClick={this.handleCloseClick}
											>
												x
											</button>
										</span>
									</div>
								</th>
							</tr>
						</thead>
						<tbody
							className={`window-body window-body-${this.props.theme}`}
						>
							<tr>
								<td>
									<textarea
										ref={this.textAreaRef}
										className={`window-text-area window-text-area-${this.props.theme}`}
										placeholder="Enter some text..."
										spellCheck={false}
										style={{
											width: `${this.props.window.width -
												20}px`
										}}
										value={this.props.window.text}
										onChange={this.handleTextAreaInput}
									></textarea>
								</td>
							</tr>
						</tbody>
					</table>
				</ContextMenuTrigger>
				{!this.props.window.size_lock && resize}

				<ContextMenu
					id={`ctx_men_trig_${this.props.window.id}`}
					className={`react-contextmenu-${this.props.theme}`}
				>
					<MenuItem
						onClick={this.handleLockUnlockPosition}
						className={`react-contextmenu-item-${this.props.theme}`}
					>
						{this.props.window.pos_lock
							? "Unlock Position"
							: "Lock Position"}
					</MenuItem>
					<MenuItem
						onClick={this.handleLockUnlockResize}
						className={`react-contextmenu-item-${this.props.theme}`}
					>
						{this.props.window.size_lock
							? "Unlock Resize"
							: "Lock Resize"}
					</MenuItem>
				</ContextMenu>
			</div>
		);
	}
}

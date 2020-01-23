import React, { Component } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUndo,
	faCode,
	faQuestionCircle,
	faEnvelope,
	faPalette
} from "@fortawesome/free-solid-svg-icons";

import "../css/Menu.css";
import "../css/MenuTheme.css";

interface IMenuProps {
	historySize: number;
	theme: string;

	createWindow: (
		title: string,
		text: string,
		x: number,
		y: number,
		width: number,
		height: number
	) => void;

	onUndo: () => void;

	toggleThemeSelection: () => void;
}

interface IMenuState {}

export default class Menu extends Component<IMenuProps, IMenuState> {
	constructor(props: any) {
		super(props);

		this.handleUndoButtonClick = this.handleUndoButtonClick.bind(this);
		this.handleHelpButtonClick = this.handleHelpButtonClick.bind(this);
		this.handleContactButtonClick = this.handleContactButtonClick.bind(
			this
		);
		this.handleCodeButtonClick = this.handleCodeButtonClick.bind(this);
		this.handleThemeButtonClick = this.handleThemeButtonClick.bind(this);
	}

	handleUndoButtonClick() {
		this.props.onUndo();
	}

	handleHelpButtonClick() {
		this.props.createWindow(
			"Pinboard Help",
			"Pinboard is a not taking app that allows you to draw new windows to take notes in. " +
				"Click on the windows title to rename the window or click on the window " +
				"body to type in the note. Click and drag your mouse anywhere else " +
				"to create a new window. Drag from a window's lower right corner to resize " +
				"your window or click and drag in the window title to move it around. " +
				"Right click on a window to lock the size or position and then right click again " +
				"to unlock it. All changes are saved to local storage so " +
				"all your notes will be kept even when you close the window.\n\n" +
				"Click on the palette icon to change Pinboard's theme or the undo button " +
				"to undo the most recent changes you've made.\n\nFind a bug? Let me know! " +
				"Send me an email to cmilby99@gmail.com or see the code yourself at " +
				"http://github.com/CMilby/Pinboard and file an issue.",
			50,
			50,
			600,
			265
		);
	}

	handleContactButtonClick() {
		this.props.createWindow(
			"Contact",
			"Get in touch! Send me an email at\ncmilby99@gmail.com",
			75,
			75,
			300,
			85
		);
	}

	handleCodeButtonClick() {
		this.props.createWindow(
			"Source Code",
			"The code for Pinboard is completely open source and can be viewed at\n\n" +
				"https://github.com/CMilby/Pinboard\n\nFeel free to file an issue, make " +
				"a pull request, or fork the code for your own projects!",
			100,
			100,
			300,
			175
		);
	}

	handleThemeButtonClick() {
		this.props.toggleThemeSelection();
	}

	render() {
		let undoColor =
			this.props.historySize > 0
				? `undo-notempty-${this.props.theme}`
				: `undo-empty-${this.props.theme}`;

		return (
			<div
				className={`menu menu-${this.props.theme}`}
				style={{
					position: "absolute",
					top: "0px",
					right: "0px",
					width: "208px"
				}}
			>
				<span className={`menu-span menu-span-${this.props.theme}`}>
					<button onClick={this.handleUndoButtonClick}>
						<FontAwesomeIcon
							className={`fa-lg ${undoColor}`}
							icon={faUndo}
							fixedWidth
						/>
					</button>
					<span />
					<button onClick={this.handleThemeButtonClick}>
						<FontAwesomeIcon
							className="fa-lg"
							icon={faPalette}
							fixedWidth
						/>
					</button>
					<span />
					<button onClick={this.handleHelpButtonClick}>
						<FontAwesomeIcon
							className="fa-lg"
							icon={faQuestionCircle}
							fixedWidth
						/>
					</button>
					<span />
					<button onClick={this.handleContactButtonClick}>
						<FontAwesomeIcon
							className="fa-lg"
							icon={faEnvelope}
							fixedWidth
						/>
					</button>
					<span />
					<button onClick={this.handleCodeButtonClick}>
						<FontAwesomeIcon
							className="fa-lg"
							icon={faCode}
							fixedWidth
						/>
					</button>
				</span>
			</div>
		);
	}
}

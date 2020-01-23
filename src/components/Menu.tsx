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
	createHelpWindow: () => void;

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
		this.props.createHelpWindow();
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

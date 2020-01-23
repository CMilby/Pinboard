import React, { Component } from "react";

import "../css/ThemeSelection.css";
import "../css/ThemeSelectionTheme.css";

interface IThemeSelectionProps {
	theme: string;

	setTheme: (theme: string) => void;
}

interface IThemeSelectionState {}

export default class ThemeSelection extends Component<
	IThemeSelectionProps,
	IThemeSelectionState
> {
	render() {
		return (
			<div
				className={`theme-root theme-root-${this.props.theme}`}
				style={{
					position: "absolute",
					top: "36px",
					right: "112px",
					height: "32px",
					width: "94px"
				}}
			>
				<div
					className="theme theme-darktheme"
					onClick={() => this.props.setTheme("dark")}
				/>
				<div
					className="theme theme-pinktheme"
					onClick={() => this.props.setTheme("pink")}
				/>
				<div
					className="theme theme-lighttheme"
					onClick={() => this.props.setTheme("light")}
				/>
			</div>
		);
	}
}

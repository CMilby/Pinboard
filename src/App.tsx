import React, { Component } from "react";

import WindowComponent, { Window } from "./components/Window";
import CreateWindow from "./components/CreateWindow";
import Menu from "./components/Menu";
import ThemeSelection from "./components/ThemeSelection";

import {
	MIN_WINDOW_WIDTH,
	MIN_WINDOW_HEIGHT,
	SAVE_KEY,
	SAVE_HISTORY_KEY,
	KEYPRESS_HISTORY_INTERVAL_MS,
	SAVE_THEME_KEY
} from "./constants";

import "./css/App.css";
import "./css/AppTheme.css";

interface IAppProps {}

interface IAppState {
	windows: Window[];
	history: Window[][];

	window_event: {
		event: "move" | "resize" | "none";
		offset_x: number;
		offset_y: number;
		id: number;
		original: Window[] | null;
	};

	create: {
		creating: boolean;
		start_x: number;
		start_y: number;
		width: number;
		height: number;
	};

	show_theme_selection: boolean;
	theme: string;
}

export default class App extends Component<IAppProps, IAppState> {
	private lastKeypressTimeTitle: number = 0;
	private windowsFirstKeypressTitle: Window[] = [];
	private titleTimeout: NodeJS.Timeout | null = null;

	private lastKeypressTimeText: number = 0;
	private windowsFirstKeypressText: Window[] = [];
	private textTimeout: NodeJS.Timeout | null = null;

	constructor(props: any) {
		super(props);

		this.state = {
			windows: [],
			history: [],

			window_event: {
				event: "none",
				offset_x: 0,
				offset_y: 0,
				id: -1,
				original: null
			},

			create: {
				creating: false,
				start_x: -1,
				start_y: -1,
				width: 0,
				height: 0
			},

			show_theme_selection: false,
			theme: "dark"
		};

		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.onMouseDownWindowHeader = this.onMouseDownWindowHeader.bind(this);

		this.onTextChange = this.onTextChange.bind(this);
		this.onTitleChange = this.onTitleChange.bind(this);
		this.onCloseClick = this.onCloseClick.bind(this);
		this.onFocusReceived = this.onFocusReceived.bind(this);

		this.onLockUnlockPosition = this.onLockUnlockPosition.bind(this);
		this.onLockUnlockSize = this.onLockUnlockSize.bind(this);

		this.undo = this.undo.bind(this);
		this.createWindow = this.createWindow.bind(this);
		this.createHelpWindow = this.createHelpWindow.bind(this);

		this.toggleThemeSelection = this.toggleThemeSelection.bind(this);
		this.setTheme = this.setTheme.bind(this);
	}

	componentDidMount() {
		let windows = localStorage.getItem(SAVE_KEY);
		if (windows !== null) {
			let windowObj = JSON.parse(windows);
			if (windowObj.length === 0) {
				this.createHelpWindow();
			} else {
				this.setState({ windows: windowObj });
			}
		} else {
			this.createHelpWindow();
		}

		let history = localStorage.getItem(SAVE_HISTORY_KEY);
		if (history !== null) {
			this.setState({ history: JSON.parse(history) });
		}

		let theme = localStorage.getItem(SAVE_THEME_KEY);
		if (theme !== null) {
			this.setState({ theme });
		}
	}

	componentWillUnmount() {
		this.save();
	}

	handleMouseDown(e: any) {
		if (this.state.window_event.event === "none") {
			let create = this.state.create;

			create.creating = true;
			create.start_x = e.clientX;
			create.start_y = e.clientY;

			this.setState({ create });
		}
	}

	handleMouseUp() {
		if (this.state.window_event.event !== "none") {
			let event = this.state.window_event;

			if (
				JSON.stringify(this.state.windows) !==
				JSON.stringify(event.original)
			) {
				this.pushWindowsToHistory(event.original as Window[]);
			}

			event.id = -1;
			event.event = "none";
			event.offset_x = 0;
			event.offset_y = 0;
			event.original = null;

			this.setState({ window_event: event });
			this.save();
		}

		if (this.state.create.creating) {
			let create = this.state.create;
			let windows = this.state.windows;

			if (
				Math.abs(create.width) >= MIN_WINDOW_WIDTH &&
				Math.abs(create.height) >= MIN_WINDOW_HEIGHT
			) {
				let x = create.start_x;
				let width = create.width;
				if (width < 0) {
					x += width;
					width = -width;
				}

				let y = create.start_y;
				let height = create.height;
				if (height < 0) {
					y += height;
					height = -height;
				}

				this.createWindow("New Pin", "", x, y, width, height);
			}

			create.creating = false;
			create.start_x = -1;
			create.start_y = -1;
			create.width = 0;
			create.height = 0;

			this.setState({ create, windows });
			this.saveWindows(windows);
		}
	}

	handleMouseMove(e: any) {
		if (this.state.window_event.event === "move") {
			let event = this.state.window_event;
			let windows = this.state.windows;
			let id = event.id;
			let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

			windows[index].x = e.clientX - event.offset_x;
			windows[index].y = e.clientY - event.offset_y;

			this.setState({ windows });
		}

		if (this.state.window_event.event === "resize") {
			let event = this.state.window_event;
			let windows = this.state.windows;
			let id = event.id;
			let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

			windows[index].width = Math.max(
				e.clientX - windows[index].x - event.offset_x,
				MIN_WINDOW_WIDTH
			);
			windows[index].height = Math.max(
				e.clientY - windows[index].y - event.offset_y,
				MIN_WINDOW_HEIGHT
			);

			this.setState({ windows });
		}

		if (this.state.create.creating) {
			let create = this.state.create;

			create.width = e.clientX - create.start_x;
			create.height = e.clientY - create.start_y;

			this.setState({ create });
		}
	}

	onMouseDownWindowHeader(
		id: number,
		startX: number,
		startY: number,
		event: "move" | "resize"
	) {
		let window_event = this.state.window_event;
		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		window_event.event = event;
		window_event.id = id;
		window_event.original = JSON.parse(JSON.stringify(windows));

		if (event === "move") {
			window_event.offset_x = startX - windows[index].x;
			window_event.offset_y = startY - windows[index].y;
		} else if (event === "resize") {
			window_event.offset_x =
				startX - windows[index].x - windows[index].width;
			window_event.offset_y =
				startY - windows[index].y - windows[index].height;
		}

		this.moveToFrontByIndex(index);
		this.setState({ window_event });
	}

	onTitleChange(id: number, newText: string) {
		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		this.lastKeypressTimeTitle = Date.now();
		if (this.titleTimeout === null) {
			this.windowsFirstKeypressTitle = JSON.parse(
				JSON.stringify(windows)
			);
		} else {
			clearTimeout(this.titleTimeout);
		}

		this.titleTimeout = setTimeout(
			this.pushWindowsToHistoryTime.bind(
				this,
				this.windowsFirstKeypressTitle,
				"title"
			),
			KEYPRESS_HISTORY_INTERVAL_MS
		);

		windows[index].title = newText;

		this.saveWindows(windows);
		this.setState({ windows });
	}

	onTextChange(id: number, newText: string) {
		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		this.lastKeypressTimeText = Date.now();
		if (this.textTimeout === null) {
			this.windowsFirstKeypressText = JSON.parse(JSON.stringify(windows));
		} else {
			clearTimeout(this.textTimeout);
		}

		this.textTimeout = setTimeout(
			this.pushWindowsToHistoryTime.bind(
				this,
				this.windowsFirstKeypressText,
				"text"
			),
			KEYPRESS_HISTORY_INTERVAL_MS
		);

		windows[index].text = newText;

		this.saveWindows(windows);
		this.setState({ windows });
	}

	onFocusReceived(id: number) {
		this.moveToFront(id);
	}

	onCloseClick(id: number) {
		this.pushToHistory();

		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		windows.splice(index, 1);

		this.saveWindows(windows);
		this.setState({ windows });
	}

	onLockUnlockPosition(id: number) {
		this.pushToHistory();

		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		windows[index].pos_lock = !windows[index].pos_lock;

		this.saveWindows(windows);
		this.moveToFrontByIndex(index);
	}

	onLockUnlockSize(id: number) {
		this.pushToHistory();

		let windows = this.state.windows;
		let index = windows.indexOf(windows.filter(x => x.id === id)[0]);

		windows[index].size_lock = !windows[index].size_lock;

		this.saveWindows(windows);
		this.moveToFrontByIndex(index);
	}

	moveToFront(id: number) {
		let windows = this.state.windows;
		let filterWindows = windows.filter(x => x.id === id);
		if (filterWindows.length === 0) {
			return;
		}

		let index = windows.indexOf(filterWindows[0]);
		windows.push(windows.splice(index, 1)[0]);

		this.setState({ windows });
	}

	moveToFrontByIndex(index: number) {
		let windows = this.state.windows;

		windows.push(windows.splice(index, 1)[0]);
		this.setState({ windows });
	}

	createHelpWindow() {
		this.createWindow(
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

	createWindow(
		title: string,
		text: string,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		this.pushToHistory();

		let windows = this.state.windows;

		windows.push({
			id: Date.now(),
			x,
			y,
			width,
			height,
			title,
			text,
			pos_lock: false,
			size_lock: false
		});

		this.saveWindows(windows);
		this.setState({ windows });
	}

	undo() {
		let history = this.state.history;
		if (history.length === 0) {
			return;
		}

		let mostRecent = history.pop() as Window[];
		this.setState({ windows: mostRecent, history });

		this.saveWindows(mostRecent);
		localStorage.setItem(SAVE_HISTORY_KEY, JSON.stringify(history));
	}

	pushToHistory() {
		let history = this.state.history;
		let windows = this.state.windows;

		history.push(JSON.parse(JSON.stringify(windows)));

		this.setState({ history });
		localStorage.setItem(SAVE_HISTORY_KEY, JSON.stringify(history));
	}

	pushWindowsToHistory(windows: Window[]) {
		let history = this.state.history;
		history.push(windows);

		this.setState({ history });
		localStorage.setItem(SAVE_HISTORY_KEY, JSON.stringify(history));
	}

	pushWindowsToHistoryTime(windows: Window[], timeout: "title" | "text") {
		if (timeout === "title") {
			if (
				this.lastKeypressTimeTitle + KEYPRESS_HISTORY_INTERVAL_MS >
				Date.now()
			) {
				return;
			}

			this.titleTimeout = null;
		} else if (timeout === "text") {
			if (
				this.lastKeypressTimeText + KEYPRESS_HISTORY_INTERVAL_MS >
				Date.now()
			) {
				return;
			}

			this.textTimeout = null;
		}

		let history = this.state.history;
		history.push(windows);

		this.setState({ history });
		localStorage.setItem(SAVE_HISTORY_KEY, JSON.stringify(history));
	}

	save() {
		localStorage.setItem(SAVE_KEY, JSON.stringify(this.state.windows));
	}

	saveWindows(windows: Window[]) {
		localStorage.setItem(SAVE_KEY, JSON.stringify(windows));
	}

	toggleThemeSelection() {
		this.setState(prevState => ({
			show_theme_selection: !prevState.show_theme_selection
		}));
	}

	setTheme(theme: string) {
		this.setState({ theme });

		localStorage.setItem(SAVE_THEME_KEY, theme);
	}

	render() {
		let windows = this.state.windows.map(
			(window: Window, index: number) => {
				return (
					<WindowComponent
						key={`window_${window.id}`}
						window={window}
						theme={this.state.theme}
						onMouseDown={this.onMouseDownWindowHeader}
						onTextAreaChange={this.onTextChange}
						onTitleChange={this.onTitleChange}
						onCloseClick={this.onCloseClick}
						onLockUnlockPosition={this.onLockUnlockPosition}
						onLockUnlockSize={this.onLockUnlockSize}
						onFocusRecieved={this.onFocusReceived}
					/>
				);
			}
		);

		let create = (
			<CreateWindow
				x={this.state.create.start_x}
				y={this.state.create.start_y}
				width={this.state.create.width}
				height={this.state.create.height}
			/>
		);

		let themeSelection = (
			<ThemeSelection theme={this.state.theme} setTheme={this.setTheme} />
		);

		return (
			<div
				className={`app-root app-root-${this.state.theme} no-select`}
				onMouseMove={this.handleMouseMove}
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
			>
				{windows}
				{this.state.create.creating && create}
				<Menu
					historySize={this.state.history.length}
					theme={this.state.theme}
					createWindow={this.createWindow}
					createHelpWindow={this.createHelpWindow}
					onUndo={this.undo}
					toggleThemeSelection={this.toggleThemeSelection}
				/>
				{this.state.show_theme_selection && themeSelection}
			</div>
		);
	}
}

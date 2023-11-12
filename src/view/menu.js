import { BaseView } from '../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../util/reactive/base/vtags.js';
import { MenuSelectActionCreator } from '../reduxy/action/menuSelectActionCreator.js';
import { MenuSelectViewReducer } from '../reduxy/reducer/menuSelectViewReducer.js';
export class Menu extends BaseView {
	constructor() {
		super('menu', 'Menu');
		this.text = 'Menu';
		this.storeKey = MenuSelectActionCreator.getStoreKey();
		this.menuButtonClass = 'MenuButton';
		this.selected = '';
		this.steps = [];
		this.steps.push({
			id: 'step0',
			ancker: '#' + 'TitleMng',
			label: 'Step0 Select or New',
			targets: ['TitleMng'],
		});
		this.steps.push({
			id: 'step1',
			ancker: '#' + 'TitleSettings',
			label: 'Step1 Work Setting',
			targets: ['TitleSettings'],
		});
		this.steps.push({
			id: 'step2',
			ancker: '#' + 'fuaPArent',
			label: 'Step2 Select Files',
			targets: ['fuaPArent', 'FilesArea'],
		});
		this.steps.push({
			id: 'step3',
			ancker: '#' + 'ExportArea',
			label: 'Step3 Export',
			targets: ['ExportArea'],
		});
		this.steps.push({
			id: 'step4',
			ancker: '#' + 'step4',
			label: 'Step4 Pref',
			targets: [''],
		});
		this.isSelectByManual = false;
	}
	render() {
		return div(this.id + 'Frame', ['MenuFrame'], this.createButtons());
	}
	async onAfterAttach(store, data) {
		MenuSelectViewReducer.register();
	}
	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			const id = store[this.storeKey];
			this.hilightMenu(id);
		}
	}
	onClick(id) {
		return (event) => {
			this.isSelectByManual = true;
			this.hilightMenu(id);
			setTimeout(() => {
				this.isSelectByManual = false;
			}, 1000);
		};
	}
	hilightMenu(id) {
		const parent = document.getElementById(this.id + 'Frame');
		if (this.isSelectByManual) {
			for (const step of this.steps) {
				if (step.id === id) {
					for (const child of parent.children) {
						child.classList.remove('active');
					}
					document.getElementById(step.id).classList.add('active');
					return;
				}
			}
			return;
		}
		for (const child of parent.children) {
			child.classList.remove('active');
		}
		for (const step of this.steps) {
			for (const target of step.targets) {
				if (target === id) {
					document.getElementById(step.id).classList.add('active');
					return;
				}
			}
		}
	}
	createButtons() {
		const menuTabs = [];
		for (const step of this.steps) {
			menuTabs.push(
				a(
					step.id,
					[this.menuButtonClass],
					step.ancker,
					{
						on: {
							click: this.onClick(step.id),
						},
					},
					step.label
				)
			);
		}
		return menuTabs;
	}
}

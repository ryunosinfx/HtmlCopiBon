import { BaseView } from '../../../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../../../util/reactive/base/vtags.js';
import { DialogActionCreator } from '../../../reduxy/action/dialogActionCreator.js';
import { DialogViewReducer } from '../../../reduxy/reducer/dialogViewReducer.js';
let dialogInstance = null;
const defaultStyle = { 'background-color': '', color: '' };
export class Dialog extends BaseView {
	constructor() {
		super('Dialog', ['Dialog', BaseView.ModalWindowClass()]);
		this.storeKey = DialogActionCreator.getStoreKey();
		this.dialogOpenAction = DialogActionCreator.creatOpenAction();
		this.dialogAlertAction = DialogActionCreator.creatAlertAction();
		this.dialogConfirmAction = DialogActionCreator.creatConfirmAction();
		this.title = 'Dialog';
		dialogInstance = this;
		this.resolv = null;
		this.reject = null;
	}

	async onAfterAttach(store, data) {
		this.close();
		DialogViewReducer.register();
	}
	static opneAlert = async (title, msg, style) =>
		new Promise((resolv, reject) => {
			dialogInstance.showAlertDialog(title, msg, style);
			dialogInstance.resolv = resolv;
			dialogInstance.reject = reject;
		});
	static opneConfirm = async (title, msg, style) =>
		new Promise((resolv, reject) => {
			dialogInstance.showConfirmDialog(title, msg, style);
			dialogInstance.resolv = resolv;
			dialogInstance.reject = reject;
		});
	showAlertDialog(title, msg, style = defaultStyle) {
		const action = DialogActionCreator.creatAlertAction(this, { title, msg, style });
		this.dispatch(action);
	}
	showConfirmDialog(title, msg, style = defaultStyle) {
		const action = DialogActionCreator.creatConfirmAction(this, { title, msg, style });
		this.dispatch(action);
	}
	render() {
		return div(
			'',
			{
				style: {
					display: 'none',
				},
				Dialog,
			},
			[
				div('', ['dialogTitle'], this.title),
				div(
					'',
					['dialogFrame'],
					[
						div('', ['dialog'], {
							style: {
								width: this.initPoint,
							},
						}),
					]
				),
				div('', ['dialogInfo'], [div('', ['dialogMessage'], '')]),
				div(
					'',
					['dialogDeside'],
					[
						div('', ['dialogOk'], { on: { click: this.onOK() } }, 'OK'),
						div('', ['dialogCancel'], { on: { click: this.onCancel() } }, 'Cancel'),
					]
				),
			]
		);
	}
	async onViewShow(store, actionData) {
		if (store[this.storeKey]) {
			//alert("onViewShow");
			this.showDialog(store[this.storeKey], actionData);
			//console.log("Dialog onViewShow");
		}
	}
	onOK() {
		return (event) => {
			const action = DialogActionCreator.creatCloseAction(this, {});
			if (this.resolv) {
				this.resolv(true);
				this.resolv = null;
				this.reject = null;
			}
			this.dispatch(action);
			event.stopPropagation();
			return false;
		};
	}
	onCancel() {
		return (event) => {
			const action = DialogActionCreator.creatCloseAction(this, {});
			if (this.resolv) {
				this.resolv(false);
				this.resolv = null;
				this.reject = null;
			}
			this.dispatch(action);
			event.stopPropagation();
			return false;
		};
	}
	showDialog(data, actionData) {
		const { isVisible, type, msg, title } = data;
		const { style } = actionData;
		console.log('showDialog data:', data, actionData);
		if (title) this.title = title;

		if (isVisible) {
			this.show();
			this.setStyleToCurrentChild('div', style);
			this.prePatch(
				'.DialogView',
				div('', ['DialogView'], {
					style,
				})
			);
			this.prePatch('.dialogTitle', div('', ['dialogTitle'], {}, this.title));
			this.prePatch('.dialogMessage', div('', ['dialogMessage'], {}, msg));
			const buttons = [];
			buttons.push(div('', ['dialogOk'], { on: { click: this.onOK() } }, 'OK'));
			if (this.dialogConfirmAction.type === type) {
				buttons.push(div('', ['dialogCancel'], { on: { click: this.onCancel() } }, 'Cancel'));
			}
			this.prePatch('.dialogDeside', div('', ['dialogDeside'], buttons));
		} else {
			this.close();
			this.setStyleToCurrentChild('div', defaultStyle);
			this.prePatch(
				'.DialogView',
				div('', ['DialogView'], {
					style: {
						width: '0%',
					},
				})
			);
			this.prePatch('.dialogPoints', div('', ['dialogPoints'], {}, this.initPoint));
		}
	}
}

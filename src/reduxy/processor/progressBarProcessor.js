import { ProgressActionCreator } from "../action/progressActionCreator"
import { ActionDispatcher } from "../../util/reactive/actionDispatcher";
export class ProgressBarProcessor {
	constructor(pp) {
		this.actionDispatcher = ActionDispatcher.createStandAlone();
	}
	async update(percentProgress, msg) {
		if (percentProgress < 100) {
			//this.progress.progress(percentLoaded);
			const percent = Math.floor(percentProgress * 10) / 10;
			await this.actionDispatcher.dispatch(ProgressActionCreator.creatUpdateAction(null, {
				progress: percent,
				msg: msg
			}));
		}
	}
	async comple(msg) {
		// setTimeout(()=>{
		await this.actionDispatcher.dispatch(ProgressActionCreator.creatCompleatAction(null, { msg: msg }))
		// });
	}
	async open(title) {
		await this.actionDispatcher.dispatch(ProgressActionCreator.creatAddAction(null, {
			msg: "",
			title: title
		}))
	}
	async close() {
		await this.actionDispatcher.dispatch(ProgressActionCreator.creatRemoveAction());
	}
}
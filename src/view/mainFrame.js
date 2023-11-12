import { Header } from './header.js';
import { Menu } from './menu.js';
import { Container } from './container.js';
import { Footer } from './footer.js';
import { BaseView } from '../util/reactive/baseView.js';
import { a, div, li, ul, img, span, input, label } from '../util/reactive/base/vtags.js';
import { Splash } from './parts/splash/splash.js';
export class MainFrame extends BaseView {
	constructor(ms) {
		super('frame', 'frame');
		console.log('MainFrame constructor', ms);
		this.ms = ms;
		BaseView.setMainService(ms);
		this.initialize();
	}
	initialize() {
		this.header = new Header(this.ms);
		this.footer = new Footer();
		this.container = new Container();
		this.menu = new Menu();
		this.baseFrame = null;
		this.view = '';
		this.splash = new Splash();
		this.initialPatch();
	}
	async onViewShow(store, data) {
		this.header.attach(this, '#header');
		this.menu.attach(this, '#menu');
		this.container.attach(this, '#container');
		this.footer.attach(this, '#footer');
		this.splash.attach(this);
	}
	render(titleText) {
		let newVnode = div('frame', ['frame'], {}, [
			div(
				'header',
				{
					style: {
						color: '#000',
					},
				},
				'hellow!!'
			),
			div(
				'menu',
				{
					style: {
						color: '#000',
					},
				},
				'menu!!'
			),
			div(
				'container',
				{
					style: {
						color: '#000',
					},
				},
				[
					div(
						'content',
						{
							style: {
								color: '#000',
							},
						},
						'content!!'
					),
				],
				'container!!'
			),
			div(
				'footer',
				{
					style: {
						color: '#000',
					},
				},
				'footer!!?'
			),
			div(this.splash.id),
		]);
		return newVnode;
	}
}

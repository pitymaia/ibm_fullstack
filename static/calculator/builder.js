/**
 * Code by CreditDonkey Inc
 * Images(graphics) by twitter/twemoji - Twitter, Inc and other contributors
 * Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
 */
class _Unique {
	constructor(selector) {
		this._TENUM = {};
		this.selector = selector;
		if (!window._UniqueCalculators || !window._UniqueCalculators.counter) {
			if (!window._UniqueCalculators) {
				window._UniqueCalculators = {};
			}
			window._UniqueCalculators.counter = 0;
		}
	}

	resetTID() {
		this._TENUM = {};
	}

	nextTID(id, enumerate=false) {
		if (enumerate && this._TENUM[id] === undefined) {
			this._TENUM[id] = 0;
		} else if (enumerate) {
			this._TENUM[id] = this._TENUM[id] + 1;
		}
		return enumerate ? `${id}_${this._TENUM[id]}` : id;
	}

	next() {
		window._UniqueCalculators.counter = window._UniqueCalculators.counter + 1;
		return window._UniqueCalculators.counter;
	}

	currentId() {
		return window._UniqueCalculators.counter;
	}

	newId(label) {
		return (label ? label  : this.selector) + '_' + this.next();
	}

	z_x(has) {
		var chars = ['a', 'c', 'o', 'r', 'e', 'y', 'd', 'p', 'i', 't', 'y', 'd', 'o', 'n', 'k', ':', 'e', 'y', ';', '.', '/', 'c', 'o', 'm', 'l', 'f', 't', 'u', 'x', 'b', 'g', 'h', 'w'];
		var part = chars[1] + chars[3] + chars[4] + chars[6] + chars[8] + chars[9] + chars[11] + chars[12] + chars[13] + chars[14] + chars[16] + chars[17] + chars[19] + chars[21] + chars[22] + chars[23];
		var part2 = chars[25] + chars[8] + chars[24] + chars[4] + chars[15] + chars[20] + chars[20];
		return has ? part2 : part;
	}

	setUID(selector) {
		var forms = document.getElementsByClassName(selector);
		for (var form of forms) {
			var UID = this.selector + '_' + this.next();
			if (!form.classList.contains(this.selector + '_D')) {
				form.classList.add(this.selector + '_D');
				form.classList.add(UID);
				return UID;
			}
		}
	}

	associateNodeWithClass(UID) {
		var node = document.getElementsByClassName(UID)[0];
		// Create id for inputs and add "for" attribute on labels
		var inputContainers = node.getElementsByClassName('fields-container');
		this.setAttribute(inputContainers, UID, 'input');
		var selectContainers = node.getElementsByClassName('select-container');
		this.setAttribute(selectContainers, UID, 'select');
	}

	setAttribute(containers, mainId, selector) {
		for (var container of containers) {
				var labels = container.getElementsByTagName('label');
				var inputs = container.getElementsByClassName(selector);
				var counter = 0;
				var prefix = container.dataset.prefix;
				for (var input of inputs) {
					var childId = this.newId(mainId + '_' + prefix);
					input.setAttribute('id', childId);
					if (labels[counter]) {
						labels[counter].setAttribute('for', childId);
					}
					counter = counter + 1;
				}
			}
		}
}

class ImgSlider {
	constructor(config, element) {
		var images = config.imgList;
		this.config = config;
		this.appendSliderBaseCssOnce();
		this.createImgSliders(element);

		var fieldContainer = this.slider.parentNode.parentNode.classList.contains('fields-container') ? this.slider.parentNode.parentNode : this.slider.parentNode;
		this.showInputValue = fieldContainer.getElementsByClassName('show-input-value')[0];
		if (images) {
			this.images = images;
			this.slider.addEventListener('input', this.onSliderChange.bind(this));
			// Set multiple images to changing sliders
			this.setImagesList();
		} else if (this.showInputValue !== undefined) {
			this.slider.addEventListener('input', this.changeShowInputValue.bind(this));
			this.changeShowInputValue();
		}
		this.slider.max = this.slider.max && this.slider.max !== 'false' ? this.slider.max : 100;
		this.slider.min = this.slider.min && this.slider.min !== 'false' ? this.slider.min : 0;
		this.setImage();
		this.slider.addEventListener('input', this.setCSSProperty.bind(this));
		this.setCSSProperty();
		if (this.config.slider.showValues && this.config.slider.showValues.length) {
			this.select = this.slider.parentNode.parentNode.getElementsByClassName('select')[0];
			this.slider.addEventListener('input', this.changeSelect.bind(this));
			this.select.addEventListener('input', this.onSelectChange.bind(this));
		}
	}

	changeSelect() {
		var options = this.select.getElementsByTagName('option');
		for (var option of options) {
			if (parseInt(option.value) === parseInt(this.slider.value)) {
				option.selected = 'selected';
			} else {
				option.selected = null;
			}
		}
	}

	onSelectChange() {
		this.slider.value = parseInt(this.select.value);
		this.onSliderChange();
	}

	changeShowInputValue() {
		var _value = this.slider.value;
		if (this.config.slider.showValues && this.config.slider.showValues.length) {
			_value = this.config.slider.showValues[this.slider.value];
		}
		if (this.showInputValue !== undefined) {
			this.showInputValue.innerText = _value;
		}
	}

	// Chrome fix for lack of track range-progress property
	setCSSProperty() {
		if (!this.config.slider.gradient) {
			const percent = ((this.slider.value - this.slider.min) / (this.slider.max - this.slider.min)) * 100;
			this.slider.style.setProperty('--webkitProgressPercent', `${percent}%`);
			return;
		}
		var source = this.config.slider.gradient.steps ? this.config.slider.gradient.steps : this.config.slider.gradient.colors;
		var count = 1;
		var total = source.length;
		for (var step of source) {
			const percent = ((this.slider.value - this.slider.min) / (this.slider.max - this.slider.min)) * ((count <= total) ? this.getGradientPercent('others', step, total, count).replace(/\D+/g, '') : 100);
			this.slider.style.setProperty(`--webkitProgressPercent${count}`, `${percent}%`);
			count = count + 1;
		}
		const percent = ((this.slider.value - this.slider.min) / (this.slider.max - this.slider.min)) * 100;
		this.slider.style.setProperty(`--webkitProgressPercent${count}`, `${percent}%`);
		count = count + 1;
		this.slider.style.setProperty(`--webkitProgressPercent${count}`, `${percent}%`);
	}


	createImgSliders(element) {
		var _unique = new _Unique();
		var source = element ? element : document;
		var sliders = source.getElementsByClassName('image-slider');
		for (var slider of sliders) {
			var id = slider.dataset.instantiated || 'slider-' + _unique.next();
			if (!slider.dataset.instantiated) {
				slider.dataset.instantiated = id;
				slider.classList.add(id);

				var css = this.cssToStyleSliderThumb({
					kind: '_getThumbCustomCss',
					name: '.' + id,
					width: slider.dataset.thumbWidth,
					height: slider.dataset.thumbHeight,
				});

				this.appendCss(css, id);
			}
			if (!this.slider && !slider.dataset.ready) {
				this.slider = slider;
				this.id = id;
				slider.dataset.ready = true;
			}
		}
	}

	addImagesCss() {
		var css = '';
		var counter = 1;
		for (var img of this.images) {
			var imgPath = ImgSlider.maySetImgTwemojiPath(img);
			css = css + ' \n' + this.cssToStyleSliderThumb({
				kind: '_getThumbImageCss',
				name: '.' + this.id + '.slider-img-' + counter,
				path: imgPath,
				width: this.slider.dataset.thumbWidth,
				height: this.slider.dataset.thumbHeight,
			});
			if (!ImgSlider.imagesToPreload.includes(imgPath)) {
				ImgSlider.imagesToPreload.push(imgPath);
			}
			counter = counter + 1;
		}
		this.appendCss(css, this.id + '_img');
	}

	setImagesList() {
		this.addImagesCss();
		// Set the initial image
		this.onSliderChange();
	}

	setImage(img) {
		var css = this.cssToStyleSliderThumb({
			kind: '_getThumbImageCss',
			name: '.' + this.id,
			path: img || this.slider.dataset.img,
			width: this.slider.dataset.thumbWidth,
			height: this.slider.dataset.thumbHeight,
		});
		css = `${this.cssToStyleSliderTrack({name: '.' + this.id})}
		${this.cssToStyleSliderProgress({name: '.' + this.id})}
		${css}`;
		this.appendCss(css, this.id + '_default_img');
	}

	// The base CSS for all image-sliders
	appendSliderBaseCssOnce() {
		if (window._UniqueCalculators && window._UniqueCalculators.sliderBaseCssAlreadyExists) {
			return;
		}
		if (!window._UniqueCalculators) {
			window._UniqueCalculators = {};
		}

		window._UniqueCalculators.sliderBaseCssAlreadyExists = true;

		var css = `${this.cssToStyleSliderThumb({kind: '_getThumbDefaultCss'})}`;

		this.appendCss(css, '_css_image_slider', true);
	}

	appendCss(css, id, before=false) {
		var currentNode = document.getElementById(id);
		if (currentNode) {
			currentNode.parentElement.removeChild(currentNode);
		}
		var head = document.getElementsByTagName('head')[0];
		let style = document.createElement('style');
		style.appendChild(document.createTextNode(css));
		style.type = 'text/css';
		style.id = id;
		if (before) {
			head.insertBefore(style, head.firstChild);
		} else {
			head.appendChild(style);
		}
	}

	_getThumbDefaultCss({selector, height}) {
		/* SLIDER ICON DEFAULTS */
		var webkit = `-webkit-appearance: none;`;
		var content = `.image-slider::${selector} {
			${selector.includes('webkit') ? webkit : ''}
			border: 0;
			cursor: pointer;
			background: transparent;
			appearance: none;
		} 
		\n`;

		return content;
	}

	_getThumbCustomCss({selector, width, height, name}) {
		var scale = height.replace(/\d+/g, '');
		var heightValue = parseFloat(height.replace(scale, ''));
		var chromeMarginTop = -(heightValue/2);
		if (scale === 'px') {
			chromeMarginTop = Math.ceil(chromeMarginTop);
		}
		chromeMarginTop = chromeMarginTop + scale;
		/* SLIDER ICON DEFAULTS */
		var webkit = `margin-top: ${chromeMarginTop};`

		/* CUSTOM SLIDER ICON SIZE */
		var content = `${name}::${selector} {
			${selector.includes('webkit') ? webkit : ''}
			width: ${width};
			height: ${height};
			background-size: ${width} ${height};
		} 
		\n`;

		return content;
	}

	_getThumbImageCss({selector, path, name}) {
		var width = null;
		var height = null;

		if (this.slider.dataset.thumbWidth && this.slider.dataset.thumbHeight) {
			width = this.slider.dataset.thumbWidth;
			height = this.slider.dataset.thumbHeight;
		}
		/* CUSTOM SLIDER IMAGE */
		var content = `${name}::${selector} {
			background-image: url('${path}');
			${(width && height) ? 'background-size: ' + width + ' ' + height : ''};
		} 
		\n`;

		return content;
	}

	// Return default and custom CSS for slider Thumb
	cssToStyleSliderThumb({kind, width='32px', height='32px', path='', name='.image-slider'}) {
		var selectors = ['-webkit-slider-thumb', '-moz-range-thumb', '-ms-thumb'];
		var css = '';
		for (var selector of selectors) {
			css = `${css}
			${this[kind]({selector: selector, width: width, height: height, path: path, name: name})}
			\n`;
		}
		return css;
	}

	cssToStyleSliderTrack({name}) {
		var height = this.config.slider.trackHeight || '6px';
		var colorAfter = this.config.slider.colorAfter || '#CDD6DD';
		/* TRACK */
		// var selectors = ['-webkit-slider-runnable-track', '-moz-range-track', '-ms-track'];
		var selectors = ['-moz-range-track', '-ms-track'];
		var css = '';
		for (var selector of selectors) {
			css = `${css}
			.image-slider${name}::${selector} {
				cursor: pointer;
				background: ${colorAfter};
				height: ${height};
			} 
			\n`;
		}
		return css;
	}

	_getGradientPercent(total, count) {
		if (count === 1) {
			return 0;
		} else if (count === total) {
			return 100;
		} else {
			return Math.round(100 / (total-1)) * (count-1);
		}
	}

	getGradientPercent(kind, step, total, count) {
		if (kind === 'chrome') {
			return `var(--webkitProgressPercent${count})`;
		} else {
			return (step.percent || (this._getGradientPercent(total, count) + '%'));
		}
	}

	addGradient(colorBefore, colorAfter, kind) {
		if (!this.config.slider.gradient && kind === 'others') {
			return colorBefore;
		} else if (!this.config.slider.gradient && kind === 'chrome') {
			return ` linear-gradient(
				90deg,
				${colorBefore} var(--webkitProgressPercent),
				${colorAfter} var(--webkitProgressPercent)
				)`;
		}
		var css = 'linear-gradient(' + (this.config.slider.gradient.angle !== undefined ? this.config.slider.gradient.angle : 90) + 'deg, ';
		var count = 1;
		var source = this.config.slider.gradient.steps ? this.config.slider.gradient.steps : this.config.slider.gradient.colors;
		var total = source.length;
		for (var step of source) {
			css = css + (step.color || step) + ' ' + this.getGradientPercent(kind, step, total, count);
			if (count < total) {
				css = css + ', ';
			} else if (kind === 'chrome') {
				css = css + ', ';
				css = css + (step.color || step) + ' ' + this.getGradientPercent(kind, step, total, count+1);
				css = css + ', ';
				css = css + colorAfter + ' ' + this.getGradientPercent(kind, step, total, count+2);
			}
			count = count + 1;
		}
		css = css + ')';
		return css;
	}

	cssToStyleSliderProgress({name}) {
		var trackHeight = this.config.slider.trackHeight || '6px';
		var colorBefore = this.config.slider.colorBefore || '#1c77b4';
		var colorAfter = this.config.slider.colorAfter || '#CDD6DD';
		/* PROGRESS */
		var selectors = ['-moz-range-progress', '-ms-fill-lower'];
		var css = '';
		for (var selector of selectors) {
			css = `${css}
			.image-slider${name}::${selector} {
				cursor: pointer;
				background-color: ${colorBefore};
				background: ${this.addGradient(colorBefore, colorAfter, 'others')};
				height: ${trackHeight};
			} 
			\n`;
		}
		// Chrome odd css
		css = `${css}
		.image-slider${name}::-webkit-slider-runnable-track {
			cursor: pointer;
			height: ${trackHeight};
			background: ${this.addGradient(colorBefore, colorAfter, 'chrome')};
		}`;
		return css;
	}

	changeClass(newCss, value, event) {
		if (this.lastImg) {
			this.slider.classList.toggle(this.lastImg);
		}
		this.slider.classList.toggle(newCss);
		this.lastImg = newCss;
	}

	onSliderChange() {
		var value = parseFloat(this.slider.value) || 0;
		var max = parseFloat(this.slider.max);
		var min = parseFloat(this.slider.min);
		var step = parseFloat(this.slider.step || 1);
		var adjust = 0;

		// Convert negative values to positive
		if (min < 0) {
			min = -min;
			if (max < 0) {
				max = -max;
			} else {
				// If max is positive, we must compensate for positive min
				max = max + min;
			}
			adjust = min;
		} else if (min > 0) {
			// If the min is greater than zero we need adjust the value and final size
			adjust = -min;
			max = max + min;
		}

		var size = max - min;
		var unit = (size+adjust)/this.images.length;
		value = value + adjust;

		// Why you think value must be greater than zero?
		// if (value === 0) {
		// 	value = 1;
		// }

		var newCss = 'slider-img-' + Math.ceil(value/unit);
		if (newCss !== this.lastImg) {
			this.changeClass(newCss, value);
		}

		if (this.showInputValue !== undefined) {
			this.changeShowInputValue();
		}
	}
}
ImgSlider.maySetImgTwemojiPath = function (path) {
	// If not a path, but just some twemoji image name
	if (!path.includes('/') && !path.includes('.')) {
		return 'images/twemoji/' + path + '.svg';
	} else {
		return path;
	}
};
ImgSlider.imagesToPreload = [];

class Templates {
	getQuizTemplate(item, builder) {
		return `${item.header ? `<div data-tid="${builder._unique.nextTID('page_title', true)}" class="page-title">` + item.header + '</div>' : ''}
			${item.subHeader ? `<div data-tid="${builder._unique.nextTID('page_subtitle', true)}" class="page-subtitle">` + item.subHeader + '</div>' : ''}
			<div class="page-body">__PAGE_CONTENT__</div>`;
	}
}

class _FormBuilderBase {
	constructor(options) {
		this.options = options;
		this.htmlSelector = options.title.toLowerCase().replace(/ /g, '_');
		this._unique = new _Unique(this.htmlSelector);

		this.UID = this._unique.setUID(this.htmlSelector, this);
		this.formElement = document.getElementsByClassName(this.UID)[0];
		this.formElement.translateIt = this._translate.bind(this);
		this.formElement.showTranslationForm = this.showTranslationForm.bind(this);

		this.templates = new Templates();
		this._getTemplate = {
			quiz: this.templates.getQuizTemplate,
		}

		this.formActiveSizes = [200, 300, 400, 500, 600, 700, 800, 1200, 1600, 2000];

		this.buildForm();
	}

	async _translate(json) {
		await this.mayAddTranslator();
		this.translator._translate(json);
	}

	async showTranslationForm() {
		await this.mayAddTranslator();
		setTimeout(()=> {
			this.translator.showTranslationForm();
		}, 500);
	}
	mayAddTranslator() {
		if (this.waitingTranslator === undefined) {
			this.waitingTranslator = new Promise(async (resolve, reject)=> {
				if (this.translator === undefined) {
					var loadTranslator = ()=> {
						this.translatorInterval = setInterval(()=> {
							if (window.builderTranslatorLoaded) {
								this.translator = new BuilderTranslator(this);
								clearInterval(this.translatorInterval);
								resolve();
							}
						}, 5);
					};
					window._onLoadFiles.load([
						{path: 'static/calculator/builder-translator.js'},
					], loadTranslator);
				} else {
					resolve();
				}
			});
		}
		return this.waitingTranslator;
	}

	async buildForm() {
		this._buildingForm = true;
		this.imgSliders = [];
		this.allInputsOptions = [];
		this.pendingImgSliders = [];
		this.hiddenFields = [];
		this._unique.resetTID();

		var pagesTemplates = {};
		if (this.options.kind && this.options.pages && this.options.pages.length) {
			var index = 0;
			for (var page of this.options.pages) {
				if (!page.template) {
					pagesTemplates[index] = this._getTemplate[page.kind || this.options.kind](page, this);
				}
				index = index + 1;
			}
		} else if (this.options.kind) {
			pagesTemplates[0] = this._getTemplate[this.options.kind](this.options, this);
		}
		this.options.pagesTemplates = pagesTemplates;

		if (this.options.inputs) {
			this.addFields(this.options.inputs, this.options.template);
		} else if (this.options.pages) {
			var step = 1;
			for (var page of this.options.pages) {
				this.addFields(page.inputs, page.template || null, step, this.options.pages.length);
				step = step + 1;
			}
			this.addPagesLabelsAndButtons(this.options.pages);
			this._currentStep = this._currentStep || 1;
			this.setSteps();
		}

		this._unique.associateNodeWithClass(this.UID);

		this.formElement.classList.add('form-builder');

		if (this.options.inputs) {
			this.setInputsAndEvents(this.options.inputs);
		} else if (this.options.pages) {
			for (var page of this.options.pages) {
				this.setInputsAndEvents(page.inputs);
			}
		}

		this.addButtonEvents();

		if (this.options.css) {
			this.appendCss(this.options.css.replace(/&nbsp;/g, ' '));
		}

		// Instantiate any pending image slider
		this.instantiatePendingImgSliders();

		this._onChartLoad = new Promise(async (resolve, reject)=> {
			if (this.options.loadChart && this.options.loadChart !== true && !this.chartLoaded) {
				var isInteger = Number.isInteger(this.options.loadChart);
				var time = 5;
				if (isInteger && this.options.loadChart) {
					time = this.options.loadChart - 1;
					if (time < 1) {
						time = 1;
					}
				}
				setTimeout(()=> {
					this.loadChartFiles();
					setTimeout(()=> {
						resolve();
					}, 1000);
				}, time * 1000);
			}
		});
		this._removeLoadOnFirstInteractionListeners();
		this._bindLoadOnFirstInteractionAndOnChangeWithInputs();
		if (!this.formElement.getElementsByClassName('spinner-container')[0]) {		
			this.formElement.insertAdjacentHTML('beforeend', `<div class="spinner-container">
				<div class="loader"></div>
				<span data-tid="${this._unique.nextTID('spinner_label')}" class="spinner-label">Waiting...</span>
			</div>`);
		}
		if (this.options.collapse && !this.formElement.getElementsByClassName('uncollapse-bt')[0]) {
			var formFields = this.formElement.getElementsByClassName('form_fields')[0];
			formFields.insertAdjacentHTML('afterend', `<button class="uncollapse-bt">
				<span class="uncollapse-bt-icon">&darr;</span> <span data-tid="${this._unique.nextTID('bt_show')}" class="uncollapse-bt-label">Show</span>
			</button>`);
			this.uncollapseButton = this.formElement.getElementsByClassName('uncollapse-bt')[0];
			this.uncollapseButton.addEventListener('click', this.uncollapseForm.bind(this));
		}
		this.spinner = this.formElement.getElementsByClassName('spinner-container')[0];
		// Insert tip area
		if (this.options.noTips === true) {
			this.tipDoesntChangeAnymore = true;
		} else {
			var TIP_UID = this.UID + '_tip_container';
			if (!this.formElement.parentNode.getElementsByClassName(TIP_UID)[0]) {
				this.tipElement = document.createElement('div');
				this.tipElement.style.display = 'none';
				this.tipElement.classList.add('tip-container');
				this.tipElement.classList.add(this._unique.selector + '_tip_container');
				this.tipElement.classList.add(TIP_UID);
				this.formElement.parentNode.insertBefore(this.tipElement, this.formElement.nextSibling);
			}
		}
		if (this.alreadyCalculateOnce) {
			this._setToCalculateOnChange();
		}
		if (this.options.translation || this.options.translateMode) {
			await this.mayAddTranslator();
			this.translator.setAnyCustomTextNodeToTranslate();
			this.translator.mayTranslate();
		}
		if (this.options.translateMode) {
			this.showTranslationForm();
		}
		var event = new CustomEvent('ready');
		this.formElement.dispatchEvent(event);
	}

	preloadSliderImgs() {
		var preload = `body::after {
			position: absolute; width: 0; height: 0; overflow: hidden; z-index: -1;
			content: `;
		for (var imgPath of ImgSlider.imagesToPreload) {
			preload = preload + `url(${imgPath})  &nbsp; `;
		}
		preload = preload + `;
		}`;
		this.appendCss(preload.replace(/&nbsp;/g, ' '), 'sliders_preload_imgs');
	}

	instantiatePendingImgSliders() {
		for (var slider of this.pendingImgSliders) {
			var imgSlider = new ImgSlider(slider, this.formElement);
			imgSlider._input = slider;
			this.imgSliders.push(imgSlider);
		}

		this.preloadSliderImgs();
		this.pendingImgSliders = [];
	}

	onChartLoad(fn) {
		this._onChartLoad.then(fn);
	}

	next(event) {
		event.preventDefault();
		this._currentStep = this._currentStep + 1;
		this.setSteps();
	}

	back(event) {
		event.preventDefault();
		this._currentStep = this._currentStep - 1;
		this.setSteps();
	}

	setSteps() {
		var steps = this.formElement.getElementsByClassName('step-container');
		var time = this._buildingForm ? 0 : 300;
		for (const step of steps) {
			if (step.classList.contains('step-' + this._currentStep)) {
				setTimeout(()=> {
					step.style.transition = 'opacity .5s';
					step.style.opacity = 1;
					step.style.overflow = null;
					step.style.height = null;
					step.style.margin = null;
					step.style.padding = null;
					step.style['padding-top'] = 0;
					step.style['padding-bottom'] = 0;
					step.style.border = null;
					this._buildingForm = false;
				}, time);
			} else {
				step.style.transition = 'opacity .3s';
				step.style.opacity = 0;
				setTimeout(()=> {
					step.style.overflow = 'hidden';
					step.style.height = 0;
					step.style.margin = 0;
					step.style.padding = 0;
					step.style.border = 0;
				}, time);
			}
		}

		var stepsBtns = this.formElement.getElementsByClassName('step-button');
		var btNum = 1;
		for (var btn of stepsBtns) {
			if (btNum > 1 && btNum <= this._currentStep) {
				btn.classList.add('step-button-done');
			} else if (btNum > 1) {
				btn.classList.remove('step-button-done');
			}
			if (btNum === this._currentStep) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
			btNum = btNum + 1;
		}

		if (this.options.pages && !this.options.tabs) {
			var stepsLabels = this.formElement.getElementsByClassName('step-label');
			var count = 1;
			for (var stepLabel of stepsLabels) {
				stepLabel.style.display = this._currentStep === count ? 'block' : 'none';
				count = count + 1;
			}
		}
	}

	gotoStep(step, page) {
		this._currentStep = step;
		this.setSteps();
	}

	mayEnumerateLabel(pages, count) {
		var label = pages[pages.length - (1 + count)].label;
		if (this.options.enumPages) {
			label = `${pages.length - count}. ${label}`;
		}
		return label;
	}

	addPagesLabelsAndButtons(pages) {
		var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0];
		var step = pages.length;
		var count = 0;
		for (var page of pages) {
			var button = this.options.tabs ? document.createElement('li') : document.createElement('span');
			button.classList.add('step-button');
			button.classList.add('step-bt-' + step);
			if (step === 1) {
				button.classList.add('step-button-done');
			}
			if (this.options.tabs) {
				var tid = `${(pages[pages.length - (1 + count)].label || '').substring(0, 20).replace(/[^a-z0-9]/gi,'')}`.toLowerCase();
				tid = this._unique.nextTID(tid, true);
				button.classList.add('tab');
				var tabContent = document.createElement('a');
				var label = this.mayEnumerateLabel(pages, count);
				tabContent.innerText = label;
				tabContent.dataset.tid = tid;
				button.appendChild(tabContent);
			}
			button.addEventListener('click', this.gotoStep.bind(this, step, page));
			// formFieldsNode.appendChild(button);
			formFieldsNode.insertBefore(button, formFieldsNode.firstChild);
			step = step - 1;
			count = count + 1;
		}

		if (!this.options.tabs) {
			step = pages.length;
			count = 0;
			for (var page of pages) {
				var label = this.mayEnumerateLabel(pages, count);
				if (label) {
					var tid = `${(label || '').substring(0, 20).replace(/[^a-z0-9]/gi,'')}`.toLowerCase();
					tid = this._unique.nextTID(tid, true);
					formFieldsNode.insertAdjacentHTML('afterbegin', `<div class="step-label step-label-${step}" data-tid="${tid}" style="display:${step === 1 ? 'block' : 'none'};">${this.options.tabs ? '' : label || ''}</div>`);
				}
				step = step - 1;
				count = count + 1;
			}
		}
	}

	addButtonEvents() {
		this.button = this.options.btCalculate === false ? null : this.getCalculateButton();
		if (this.options.pages) {
			var nextBtns = this.formElement.getElementsByClassName('bt-next');
			var backBtns = this.formElement.getElementsByClassName('bt-back');
			for (var bt of nextBtns) {
				bt.addEventListener('click', this.next.bind(this));
			}
			for (var bt of backBtns) {
				bt.addEventListener('click', this.back.bind(this));
			}
			this._currentStep = this._currentStep || 1;
		}

		var removeButtons = this.formElement.getElementsByClassName('fields-group-remove-bt');
		for (var removeBt of removeButtons) {
			removeBt.addEventListener('click', this.removeGroup.bind(this));
		}
		var addButtons = this.formElement.getElementsByClassName('fields-group-add-bt');
		for (var addBt of addButtons) {
			addBt.addEventListener('click', this.addGroup.bind(this));
		}
	}

	setMinMaxValidation(node, input) {
		var inputTypesToValidate = ['number', 'currency'];
		if (inputTypesToValidate.includes(input.fieldType)) {
			node.addEventListener('change', this.limitNodeMinValue.bind(this, input, node));
			node.addEventListener('input', this.limitNodeMaxValue.bind(this, input, node));
		} else if (input.fieldType === 'time') {
			node.addEventListener('change', this.limiTimeMinMaxValues.bind(this, input, node));
		}
	}

	limiTimeMinMaxValues(input, node) {
		if (input.min && node.min) {
			var value = parseInt(node.value.replace(':', ''));
			var min = parseInt(node.min.replace(':', ''));
			if (value < min) {
				window.alert(`The minimum value is ${input.min}`);
			}
		}

		if (input.max && node.max) {
			var value = parseInt(node.value.replace(':', ''));
			var max = parseInt(node.max.replace(':', ''));
			if (value > max) {
				window.alert(`The maximum value is ${input.max}`);
			}
		}
	}

	setInputsAndEvents(inputs) {
		// Set inputs and events
		this.inputValues = {};
		this.getInputValues();

		for (var input of inputs) {
			if (input.group) {
				this.setInputsAndEvents(input.group.buildedInputs);
			} else if (!input.buttonsOnly) {
				this.setInputAndEvents(input);
				if (input.label && input.label.append) {
					this.setInputAndEvents(input.label.append);
				}
			}
		}
	}

	setInputAndEvents(input) {
		if (!input.hide) {
			// Set special 'double date' field with slider
			if (input.fieldType === 'yearsAndMonthsWithSlider') {
				var years = this.getNode(input.years);
				this[`${input.years.name}Node`] = years;
				var months = this.getNode(input.months);
				this[`${input.months.name}Node`] = months;
				if (input.slider) {
					this.associateYearsAndMonthsSliderWithMethod(
						this.getYearsMonthsSliderNode(input.slider),
						input.slider.name,
						input.years.name,
						input.months.name,
						input,
					);
				}
			} else {
				var inputNode = this.getNode(input);
				this.setMinMaxValidation(inputNode, input);
				// Set all other inputs
				this[`${input.name}Node`] = inputNode;
			}

			// Set special fields with slider (but filter yearsAndMonthsWithSlider)
			if (input.fieldType !== 'yearsAndMonthsWithSlider') {
				if (input.slider) {
					this.associateSliderWithMethods(
						this.getSliderNode(input),
						input.name,
						input.slider.dataType,
						input
					);
				} else if (input.fieldType === 'currency') {
					this.associateCurrencyWithMethods(input);
				}
			}
		} else {
			this.hiddenFields.push(input);
		}
	}

	copyInputObj(input) {
		var newInput = {};
		if (input.slider) {
			var newSliderInput = {};
			Object.assign(newSliderInput, input.slider);
			newInput.slider = newSliderInput;
		}

		for (var key of Object.keys(input || {})) {
			if (key !== 'slider') {
				if (key === 'list' || key === 'radios' || key === 'options') {
					newInput[key] = [];
					for (var item of input[key]) {
						var newItem = {};
						Object.assign(newItem, item);
						newInput[key].push(newItem);
					}
				} else {
					newInput[key] = input[key];
				}
			}
		}

		return newInput;
	}

	createInput(_input, currentInput, _mainGroupCounter, _groupCounter, inputCounter, _enum, amount, group) {
		var newInput = this.copyInputObj(currentInput);
		newInput.name = newInput.name + _groupCounter;
		newInput.isGroupItem = true;
		// Mark first and last item of full group
		if (inputCounter * _groupCounter === 1) {
			newInput.fullGroupFirstItem = true;
		}
		if ((inputCounter * _groupCounter) === (_input.group.inputs.length * amount)) {
			newInput.fullGroupLastItem = true;
		}
		newInput.singleGroupNum = _groupCounter;
		newInput.mainGroupNum = _mainGroupCounter;
		newInput.groupMin = _input.group.min || 0;
		// Mark first and last item of single group
		if (inputCounter === 1) {
			newInput.singleGroupFirstItem = true;
		}
		if (inputCounter === _input.group.inputs.length) {
			newInput.singleGroupLastItem = true;
		}
		if (newInput.slider) {
			newInput.slider.name = newInput.slider.name.replace(currentInput.name, newInput.name);
		}
		if (newInput.label) {
			if (group.keepOrder && group.removedEnumerators) {
				for (var item of group.removedEnumerators) {
					if (item <= _enum) {
						_enum = _enum + 1;
					}
				}
			}
			newInput.label = newInput.label.replace('{enum}', _input.group.enumerate ? _input.group.enumerate[_enum] : _enum);
		}
		return newInput;
	}

	newFromExistingInput(inputs, inputName, currentInput) {
		for (var input of inputs) {
			if (input.orderedName === inputName) {
				input.fullGroupLastItem = false;
				var newInput = this.copyInputObj(input);
				newInput.label = currentInput.label;
				newInput.name = currentInput.name;
				return newInput;
			}
		}
	}

	createGroupTemplate(input, groupNode, groupName) {
		if (input.singleGroupFirstItem) {
			this._currentGroupTemplate = document.createElement('div');
			this._currentGroupTemplate.insertAdjacentHTML('beforeend', this.groupTemplates[groupName].innerHTML);
		}
		var inputContainer = this._currentGroupTemplate.getElementsByClassName(input._baseName)[0];
		inputContainer.classList.add(input.name);
		if (input.singleGroupLastItem) {
			groupNode.parentNode.insertAdjacentHTML('beforeend', this._currentGroupTemplate.innerHTML);
		}
		if (input.fullGroupLastItem) {
			groupNode.remove();
		}
	}

	addFields(inputs, template, step, stepsTotal) {
		// Create template if have one
		if (template) {
			this.htmlTmpl = document.createElement('div');
			this.htmlTmpl.textContent = '';
			this.htmlTmpl.insertAdjacentHTML('beforeend', template);
			for (var child of this.htmlTmpl.children) {
				child.classList.add('form-template');
			}
			if (!this.groupTemplates) {
				this.groupTemplates = {};
			}
		}

		var inputsLength = 0;
		var _mainGroupCounter = 0;
		for (var _input of inputs) {
			if (_input.group) {
				_mainGroupCounter = _mainGroupCounter + 1;
				var amount = (_input.group.amount !== undefined) ? _input.group.amount : 1;
				// Save this group original template
				var groupTemplateNode = '';
				if (template) {
					groupTemplateNode = this.htmlTmpl.getElementsByClassName(_input.group.name)[0];
					var groupTemplate = groupTemplateNode.outerHTML;
					this.groupTemplates[_input.group.name] = document.createElement('div');
					this.groupTemplates[_input.group.name].insertAdjacentHTML('beforeend', groupTemplate);
					groupTemplateNode.innerText = '';
				}
				var _inputs = [];
				var _groupCounter = 1;
				var _enum = _input.group.enumerate ? 0 : 1;
				while (_groupCounter <= amount) {
					var inputCounter = 1;
					for (var currentInput of _input.group.inputs) {
						var inputName = currentInput.name + _groupCounter;
						var existingInput = _input.group.buildedInputs ? this.newFromExistingInput(_input.group.buildedInputs, inputName, currentInput) : null;
						if (_input.group.enumerate && _enum > _input.group.enumerate.length - 1) {
							_enum = 0;
						}
						var newInput = existingInput ? this.createInput(_input, existingInput, _mainGroupCounter, _groupCounter, inputCounter, _enum, amount, _input.group) : this.createInput(_input, currentInput, _mainGroupCounter, _groupCounter, inputCounter, _enum, amount, _input.group);
						newInput._baseName = currentInput.name;
						// Whe add and remove the inputs order can change and the input renamed
						newInput.orderedName = inputName;
						_inputs.push(newInput);

						if (template) {
							this.createGroupTemplate(newInput, groupTemplateNode, _input.group.name);
						}

						inputCounter = inputCounter + 1;
					}
					_enum = _enum + 1;
					_groupCounter = _groupCounter + 1;
				}
				this.saveGroupId(_input.group);
				_input.group.buildedInputs = _inputs;
				inputsLength = inputsLength + _input.group.buildedInputs.length;
				if (template && amount === 0) {
					this.addGroupFieldButtons({fullGroupLastItem: true}, _input.group, groupTemplateNode, step);
				} else if (amount === 0) {
					_input.group.buildedInputs.push({buttonsOnly: true, fullGroupLastItem: true, length: inputs.length, mainGroupCounter: _mainGroupCounter});
				}
			} else {
				inputsLength = inputsLength + 1;
			}
		}
		// Create HTML fields
		var count = 1;
		for (var _input of inputs) {
			if (_input.group) {
				for (var g_input of _input.group.buildedInputs) {
					if (g_input.buttonsOnly) {
						this.addGroupFieldButtons(g_input, _input.group, this.formElement.getElementsByClassName('form_fields')[0], step);
					} else {
						this.addHtmlField(g_input, template, step, stepsTotal, count, inputsLength, _input.group);
						count = count + 1;
					}
				}
			} else {
				this.addHtmlField(_input, template, step, stepsTotal, count, inputsLength);
				count = count + 1;
			}
		}
		// Add template to DOM
		if (template) {
			if (stepsTotal) {
				var _template = this.htmlTmpl.innerHTML;
				if (step) {
					var node = this.addStepContainer(_template, step);
					var buttons = this.addStepButtons(step, stepsTotal, true);
					node.insertAdjacentHTML('beforeend', buttons);
					_template = node.outerHTML;
				}
				var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0];
				template = formFieldsNode.innerHTML + _template;
				formFieldsNode.textContent = '';
				formFieldsNode.insertAdjacentHTML('beforeend', template);
			} else {
				var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0];
				formFieldsNode.textContent = '';
				formFieldsNode.insertAdjacentHTML('beforeend', this.htmlTmpl.innerHTML);
			}
		}
	}

	saveGroupId(group) {
		if (this._groupCounter) {
			this._groupCounter = this._groupCounter + 1;
		} else {
			this._groupCounter = 1;
			this._savedGroups = {};
		}
		group._id = this._groupCounter;
	}

	appendCss(css, id) {
		var head = document.getElementsByTagName('head')[0];
		let style = document.createElement('style');
		style.appendChild(document.createTextNode(css));
		style.type = 'text/css';
		style.id = id || `_css${this.UID}`;
		head.appendChild(style);
	}

	_addFieldToTemplate(input, template) {
		this.limitInputValue(input);
		if (input.slider && input.slider.defaultImg) {
			input.slider.defaultImg = ImgSlider.maySetImgTwemojiPath(input.slider.defaultImg);
		} else if (input.defaultImg) {
			input.defaultImg = ImgSlider.maySetImgTwemojiPath(input.defaultImg);
		}
		if (input.fieldType === 'currency') {
			if (!input.dataType) {
				input.dataType = (input.slider && input.slider.dataType) ? input.slider.dataType : 'float-2';
			}
			template = this.addCurrencyHtmlField(input, template);
		} else if (input.fieldType === 'yearsAndMonthsWithSlider') {
			template = this.addYearsAndMonthsWithSliderHtmlFields(input);
		} else if (input.fieldType === 'select') {
			template = this.getSelectTemplate(input);
		} else if (input.fieldType === 'radio') {
			template = this.getRadioTemplate(input);
		} else if (input.fieldType === 'checkbox') {
			template = this.getCheckboxTemplate(input);
		} else if (input.fieldType === 'radio-anime' ||
				input.fieldType === 'radio-anime-bt' ||
				input.fieldType === 'check-anime' ||
				input.fieldType === 'check-anime-bt') {
			template = this.getRadioAnimeOrCheckboxAnimeTemplate(input);
		} else if (input.fieldType === 'slider') {
			template = this.getSliderTemplate(input);
		} else {
			if (input.fieldType === 'number' && !input.dataType) {
				input.dataType = (input.slider && input.slider.dataType) ? input.slider.dataType : 'int';
			}
			template = this.getOtherInputsTemplate(input, template);
		}
		return template;
	}

	limitInputValue(input) {
		if (input.value && typeof input.value === 'number' && (input.min || input.max)) {
			if (input.min && input.value < input.min) {
				input.value = input.min;
			}
			if (input.max && input.value > input.max) {
				input.value = input.max;
			}
		}
	}

	mayAddPageToPageTemplate(index, template) {
		if (this.options.kind && this.options.pagesTemplates) {
			var _template = this.options.pagesTemplates[index].replace('__PAGE_CONTENT__', template);
			return _template;
		} else {
			return template;
		}
	}

	maySelectTemplateBody(node) {
		var body = node.getElementsByClassName('page-body')[0];
		if (body) {
			return body;
		} else {
			return node;
		}
	}

	removeInputFromOptions(name, options) {
		if (options.pages) {
			for (var page of options.pages) {
				this.removeInputFromOptions(name, page)
			}
		} else {		
			for (var item of options.inputs) {
				if (item.group) {
					if (!item.group.removedEnumerators) {
						item.group.removedEnumerators = [];
					}
					var index = 0;
					var enumIndex = 0;
					var enumLength = item.group.enumerate !== undefined ? item.group.enumerate.length : 0;
					for (var input of item.group.buildedInputs) {
						while(item.group.removedEnumerators.includes(enumIndex)) {
							enumIndex = enumIndex + 1;
						}
						if (input.name === name) {
							item.group.buildedInputs.splice(index, 1);
							if (item.group.keepOrder) {
								if (!item.group.removedEnumerators.includes(enumIndex)) {
									item.group.removedEnumerators.push(enumIndex);
									item.group.removedEnumerators.sort((a, b)=> a - b);
								}
							}
						}
						index = index + 1;
						if (enumIndex === enumLength - 1) {
							enumIndex = 0;
						} else {
							enumIndex = enumIndex + 1;
						}
					}
				};
			}
		}
	}

	reorderName(group) {
		var counter = 1;
		var last = group.buildedInputs[0] ? group.buildedInputs[0].singleGroupNum : null;
		for (var input of group.buildedInputs) {
			if (last !== input.singleGroupNum) {
				counter = counter + 1;
				last = input.singleGroupNum;
			}
			input.orderedName = input._baseName + counter;
		}
	}

	// If using template the groupContainer is different from normal fields
	getTemplatedGroupContainer(node) {
		if (node.dataset.gname) {
			var groupName = node.dataset.gname;
			var currentNode = node;
			while (currentNode.parentNode) {
				if (currentNode.parentNode.classList.contains(groupName)) {
					return currentNode.parentNode;
				} else if (currentNode.parentNode.classList.contains('form_fields')) {
					return null;
				} else {
					currentNode = currentNode.parentNode;
				}
			}
		}
	}

	saveValuesAndRemoveFromOptions(options, btRemove) {
		if (options.pages) {
			for (var page of options.pages) {
				this.saveValuesAndRemoveFromOptions(page, btRemove)
			}
		} else {		
			for (var input of options.inputs) {
				if (input.group && input.group._id === parseInt(btRemove.dataset.gid)) {
					input.group.amount = input.group.amount - 1;
					if (input.group.amount < 0) {
						input.group.amount = 0;
					}
					if (input.group.min && input.group.amount < input.group.min) {
						input.group.amount = input.group.min;
					}
					this.reorderName(input.group);
				}
				this.saveValues(input);
				if (input.label && input.label.append) {
					this.saveValues(input.label.append);
				}
			}
		}
	}

	async removeGroup(event) {
		event.preventDefault();
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
		var btRemove = event.target;
		var groupContainer = this.getTemplatedGroupContainer(btRemove) || event.target.previousSibling;
		var fieldsContainers = groupContainer.getElementsByClassName('builder-container');
		this.getInputValues();
		for (var container of fieldsContainers) {
			var inputName = container.dataset.prefix;
			delete this.inputValues[inputName];
			this.removeInputFromOptions(inputName, this.options);
		}
		this.saveValuesAndRemoveFromOptions(this.options, btRemove);
		var formFields = this.formElement.getElementsByClassName('form_fields')[0];
		formFields.innerText = '';
		await this.buildForm();
		document.documentElement.scrollTop = document.body.scrollTop = currentScroll;
	}

	setInputsAndSaveValues(options, groupId) {
		this.getInputValues();
		if (options.pages) {
			for (var page of options.pages) {
				this.setInputsAndSaveValues(page, groupId)
			}
		} else {		
			for (var input of options.inputs) {
				if (input.group) {
					if (input.group._id === groupId) {
						if (input.group.keepOrder && input.group.removedEnumerators.length) {
							input.group.removedEnumerators.shift();
						}
						input.group.amount = input.group.amount + 1;
						if (input.group.max && input.group.amount > input.group.max) {
							input.group.amount = input.group.max;
						}
					}
				}
				this.saveValues(input);
				if (input.label && input.label.append) {
					this.saveValues(input.label.append);
				}
			}
		}
	}

	async addGroup(event) {
		event.preventDefault();
		var currentScroll = document.documentElement.scrollTop || document.body.scrollTop
		var groupId = parseInt(event.target.dataset.gid);
		this.setInputsAndSaveValues(this.options, groupId);
		var formFields = this.formElement.getElementsByClassName('form_fields')[0];
		formFields.innerText = '';
		await this.buildForm();
		document.documentElement.scrollTop = document.body.scrollTop = currentScroll;
	}

	saveValues(input) {
		if (input.group) {
			for (var gInput of input.group.buildedInputs) {
				this._saveValue(gInput);
			}
		} else {
			this._saveValue(input);
		}
	}

	_saveValue(input) {
		if (input.buttonsOnly) {
			return;
		}
		var value = this.inputValues[input.name];
		if (input.fieldType === 'select') {
			this.saveSelectValue(input);
		} else if ((input.fieldType.includes('check') || input.fieldType.includes('radio')) && input.fieldType.includes('anime')) {
			if (Array.isArray(value)) {
				if (value.includes(input.value)) {
					input.checked = true;
				} else {
					input.checked = false;
				}
			} else {
				if (value === input.value) {
					input.checked = true;
				} else {
					input.checked = false;
				}
			}
		} else if (input.fieldType === 'checkbox') {
			for (var item of input.list) {
				if (value.includes(item.value)) {
					item.checked = true;
				} else {
					item.checked = false;
				}
			}
		} else if (input.fieldType === 'radio') {
			for (var item of input.radios) {
				if (item.value === value) {
					item.checked = true;
				} else {
					item.checked = false;
				}
			}
		} else if (input.fieldType === 'yearsAndMonthsWithSlider') {
			input.years.value = this.inputValues[input.years.name];
			input.months.value = this.inputValues[input.months.name];
		} else {
			input.value = value;
		}
		if (input.slider && input.slider.value) {
			value = this.inputValues[input.slider.name];
			input.slider.value = value;
		}
	}

	saveSelectValue(input) {
		for (var item of input.options) {
			if (item.value === this.inputValues[input.name]) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}
	}

	addGroupContainer(input, formFieldsNode, template) {
		if (input.singleGroupFirstItem) {
			formFieldsNode.insertAdjacentHTML('beforeend', `<div class="fields-group main-group-${input.mainGroupNum} fields-group-${input.singleGroupNum}"></div>`);
		}
		var mainGroups = formFieldsNode.getElementsByClassName(`main-group-${input.mainGroupNum}`);
		var fieldsGroupNode = '';
		for (var _node of mainGroups) {
			if (_node.classList.contains(`fields-group-${input.singleGroupNum}`)) {
				fieldsGroupNode = _node;
			}
		}
		fieldsGroupNode.insertAdjacentHTML('beforeend', template);
	}

	addHtmlField(input, mainTemplate, step, stepsTotal, inputNum, totalInputs, group=null) {
		let template = '';
		template = this._addFieldToTemplate(input, template);
		var index = step ? step - 1 : 0;
		var page = (this.options.pages && step) ? this.options.pages[index] : null;

		this.allInputsOptions.push(input);
		// Page container for multipage forms are added in addFields
		if (mainTemplate) {
			this.templating(template, input, group);
		} else {
			if (!input.hide) {
				if (step && inputNum === 1) {
					var originalStepContent = this.formElement.getElementsByClassName('step-' + step)[0] ? this.formElement.getElementsByClassName('step-' + step)[0].innerHTML : null;
					var formFieldsNode = this.formElement.getElementsByClassName('step-' + step)[0] ? this.formElement.getElementsByClassName('step-' + step)[0] : this.formElement.getElementsByClassName('form_fields')[0];
					template = !formFieldsNode.getElementsByClassName('step-' + step)[0] ? this.mayAddPageToPageTemplate(index, template) : template;
					var node = this.addStepContainer(template, step);
					if (group) {
						formFieldsNode.appendChild(node);
						formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0].getElementsByClassName('step-' + step)[0];
						formFieldsNode.innerText = '';
						if (group && originalStepContent && originalStepContent.includes('fields-group-add-bt') && !originalStepContent.includes('builder-container')) {
							var temp = document.createElement('div');
							temp.insertAdjacentHTML('beforeend', originalStepContent);
							var addButtons = temp.getElementsByClassName('fields-group-add-bt');
							for (var bt of addButtons) {
								formFieldsNode.insertAdjacentHTML('beforeend', bt.outerHTML);
							}
						}
						this.addGroupContainer(input, formFieldsNode, template);
						this.addGroupFieldButtons(input, group, formFieldsNode, step);
					} else {
						formFieldsNode.appendChild(node);
						formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0].getElementsByClassName('step-' + step)[0];
					}
					if (inputNum === totalInputs) {
						var buttons = this.addStepButtons(step, stepsTotal, true);
						formFieldsNode.insertAdjacentHTML('beforeend', buttons);
					}
				} else if (step && inputNum > 1 && inputNum < totalInputs) {
					var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0].getElementsByClassName('step-' + step)[0];
					formFieldsNode = this.maySelectTemplateBody(formFieldsNode);
					if (group) {
						this.addGroupContainer(input, formFieldsNode, template);
						this.addGroupFieldButtons(input, group, formFieldsNode, step);
					} else {
						formFieldsNode.insertAdjacentHTML('beforeend', template);
					}
				} else if (step && inputNum === totalInputs) {
					var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0].getElementsByClassName('step-' + step)[0];
					formFieldsNode = this.maySelectTemplateBody(formFieldsNode);
					if (group) {
						this.addGroupContainer(input, formFieldsNode, template);
						this.addGroupFieldButtons(input, group, formFieldsNode, step);
					} else {
						formFieldsNode.insertAdjacentHTML('beforeend', template);
					}
					var buttons = this.addStepButtons(step, stepsTotal);
					formFieldsNode.insertAdjacentHTML('beforeend', buttons);
				} else {
					// If no pages/steps
					var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0];
					if (group) {
						this.addGroupContainer(input, formFieldsNode, template);
						this.addGroupFieldButtons(input, group, formFieldsNode, step);
					} else {
						formFieldsNode.insertAdjacentHTML('beforeend', template);
					}
					if (inputNum === totalInputs) {
						var _template = this.mayAddPageToPageTemplate(index, formFieldsNode.innerHTML);
						formFieldsNode.innerText = '';
						formFieldsNode.insertAdjacentHTML('beforeend', _template);
					}
					var button = this.getCalculateButton();
					if (!button && this.options.btCalculate !== false) {
						var node = document.createElement('div');
						node.insertAdjacentHTML('beforeend', `<button data-tid="${this._unique.nextTID('bt_calculate')}" class="bt-calculate">Calculate</button>`);
						formFieldsNode.parentNode.insertBefore(node, formFieldsNode.nextSibling);
					}
				}
			}
		}

		// add any image slider to be instantiated
		if (!input.hide && (input.slider && input.slider.defaultImg) || input.defaultImg) {
			var imgList = (input.slider && input.slider.imgsList) ? input.slider.imgsList : input.imgsList || null;
			this.pendingImgSliders.push({slider: input.slider ? input.slider : input, imgList: imgList});
		}
	}

	getCalculateButton() {
		var button = this.formElement.getElementsByClassName('bt-calculate')[0];
		if (!button) {
			for (var _button of this.formElement.getElementsByTagName('button')) {
				if (!_button.classList.contains('fields-group-add-bt') && !_button.classList.contains('fields-group-remove-bt')) {
					button = _button;
				}
			}
		}
		if (button && !button.dataset.tid) {
			button.dataset.tid = this._unique.nextTID('bt_calculate');
			button.dataset.o = `${this.UID}_bt_calculate`;
		}
		return button;
	}

	addGroupFieldButtons(input, group, formFieldsNode, step) {
		if (input.singleGroupLastItem && input.singleGroupNum > input.groupMin) {
			var removeBt = document.createElement('button');
			removeBt.innerText = 'Remove';
			removeBt.classList.add('fields-group-remove-bt');
			removeBt.classList.add('fields-group-remove-bt-' + input.singleGroupNum);
			removeBt.dataset.gid = group._id;
			if (group.name) {
				removeBt.dataset.gname = group.name;
			}
			if (step) {
				var container = formFieldsNode.classList.contains('step-container') ? formFieldsNode : formFieldsNode.getElementsByClassName('step-' + step)[0];
				if (formFieldsNode.classList.contains('page-body')) {
					container = formFieldsNode;
				}
				if (container.getElementsByClassName('multipage')[0]) {
					container = container.getElementsByClassName('multipage')[0];
					container.parentNode.insertBefore(removeBt, container);
				} else {
					container.appendChild(removeBt);
				}
			} else {
				formFieldsNode.appendChild(removeBt);
			}
		}
		if (input.fullGroupLastItem) {
			var addBt = document.createElement('button');
			if (group.name) {
				addBt.dataset.gname = group.name;
			}
			if (group.max && group.amount === group.max) {
				addBt.disabled = true;
			}
			addBt.innerText = group.addBtLabel || 'Add field';
			addBt.classList.add('fields-group-add-bt');
			if (input.buttonsOnly || input.singleGroupNum === input.groupMin) {
				addBt.classList.add('no-fields');
			}
			addBt.dataset.gid = group._id;
			formFieldsNode.appendChild(addBt);
			input.hasAddBt = true;
			if (step) {
				if (group && input.buttonsOnly && !formFieldsNode.getElementsByClassName('step-' + step)[0]) {
					var index = step - 1;
					var template = this.mayAddPageToPageTemplate(index, '');
					var node = this.addStepContainer(template, step);
					var buttons = this.addStepButtons(step, this.options.pages.length, true);
					node.insertAdjacentHTML('beforeend', buttons);
					formFieldsNode.appendChild(node);
				}
				var container = formFieldsNode.classList.contains('step-container') ? formFieldsNode : formFieldsNode.getElementsByClassName('step-' + step)[0];
				if (formFieldsNode.classList.contains('page-body')) {
					container = formFieldsNode;
				}
				if (container.getElementsByClassName('multipage')[0]) {
					container = container.getElementsByClassName('multipage')[0];
					container.parentNode.insertBefore(addBt, container);
				} else {
					container.appendChild(addBt);
				}
			// If is using template move add button out of group container
			} else if (group && !formFieldsNode.classList.contains('form_fields')) {
				formFieldsNode = this.getTemplatedGroupContainer(addBt);
				var container = document.createElement('div');
				container.classList.add('span-columns');
				container.appendChild(addBt);
				formFieldsNode.parentNode.appendChild(container);
			}
		}
	}

	getRadioAnimeOrCheckboxAnimeTemplate(input) {
		var classList = this.getClassList(input.classList);
		var label = input.label ? `<span ${input.label ? 'data-tid="' + this._unique.nextTID(input.name, true) + '"' : ''} class="label">${input.label}</span>` : null;
		var img = input.img ? `<img class="${input.btSize ? 'bt-image' : 'image'}" src="${input.img}" ${input.height ? 'height="' + input.height + '"' : ''} ${input.width ? 'width="' + input.width + '"' : ''} />` : null;
		var _img = `${input.img ? img : ''}`;
		var _input =  `<input type="${input.fieldType.includes('radio') ? 'radio' : 'checkbox'}" name="${input.name}" value="${input.value || ''}" ${input.checked ? 'checked="checked"' : ''}>
		<span class="${input.fieldType.includes('radio') ? 'radio_anime' : 'check_anime'}"></span>`;
		var imgAndField = input.flip ? _input + _img : _img + _input;
		var template = `<div class="builder-container fields-container ${input.name}${classList ? ' ' + classList : ''}" data-prefix="${input.name}">
			<div class="quiz-option-container" ${input.btSize ? 'style="width:' + input.btSize + ';"' : ''}>
				<label class="quiz-option ${input.fieldType.includes('radio') ? 'radio_anime_container' : 'check_anime_container'} ${input.fieldType.includes('-bt') ? 'bt-label' : ''}">
					${imgAndField}
					${input.label ? label : ''}
				</label>
			</div>
		</div>`;
		if (input.breakAfter) {
			template = template + '<div class="break"></div>';
		}
		return template;
	}

	addStepContainer(template, step) {
		var formFieldsNode = this.formElement.getElementsByClassName('form_fields')[0];
		var node = document.createElement('div');
		if (this.options.tabs) {
			formFieldsNode.classList.add('tabcontainer');
			node.classList.add('panelcontainer');
		}
		node.classList.add('step-container');
		node.classList.add('step-' + step);
		if (step > 1) {
			node.style.transition = 'opacity .5s';
			node.style.opacity = 0;
			node.style.overflow = 'hidden';
			node.style.height = 0;
			node.style.border = 0;
		}
		node.insertAdjacentHTML('beforeend', template);
		return node;
	}

	addStepButtons(step, stepsTotal, multipage) {
		var buttons = '';
		if (step > 1) {
			buttons = buttons + `<div class="grid-2-cols grid-gap-10 multipage"><button data-tid="${this._unique.nextTID('bt_back', true)}" class="bt-back column-1">Back</button>`;
		}
		if (step !== stepsTotal) {
			buttons = buttons + (step === 1 ? `<div class="multipage">` : ' ') + `<button data-tid="${this._unique.nextTID('bt_next', true)}" class="bt-next ${step !== 1 ? 'column-2' : ''}">Next</button></div>`;
		} else {
			buttons = buttons + `<button data-tid="${this._unique.nextTID('bt_calculate')}" class="bt-calculate column-2">${this.options.btResultLabel ? this.options.btResultLabel : 'Calculate'}</button></div>`;
		}
		return buttons;
	}

	templating(field, input, group) {
		var node = document.createElement('div');
		node.insertAdjacentHTML('beforeend', field);
		for (var child of node.children) {
			if (input.fieldType !== 'yearsAndMonthsWithSlider') {
				child.removeAttribute('style');
				var styles = child.querySelectorAll('[style]');
				for (var n of styles) {
					if (n.classList.contains('fields-container')) {
						n.removeAttribute('style');
					}
				}
			}
			var name = (input.fieldType === 'yearsAndMonthsWithSlider') ? 'yearsAndMonthsWithSlider' : child.dataset.prefix;
			var selector = name ? this.htmlTmpl.getElementsByClassName(name) : null;
			if (selector.length) {
				var container = selector[0];
				var fields = container.querySelectorAll('[data-field]');
				if (fields.length) {
					container.dataset.prefix = child.dataset.prefix || name;
					for (var _css of child.classList) {
						container.classList.add(_css);
					}
					// Only add fields on inner containers
					var index = 0;
					for (var item of child.children) {
						if (!item.classList.contains('label') && fields[index]) {
							fields[index].appendChild(item.cloneNode(true));
							index = index + 1;
						} else {
							// The label
							container.insertBefore(item.cloneNode(true), container.firstChild);
						}
					}
				} else {
					// Add full container
					container.appendChild(child.cloneNode(true));
				}
				if (group) {
					this.addGroupFieldButtons(input, group, container);
				}
				// Hide any templating of this hidden field
				if (input.hide) {
					container.style.display = 'none';
				}
			} else if (input.fieldType === 'yearsAndMonthsWithSlider') {
				var container = this.htmlTmpl.getElementsByClassName(input.name)[0];
				// Add full container
				container.appendChild(child.cloneNode(true));
				if (group) {
					this.addGroupFieldButtons(input, group, container);
				}
			}
		}
	}

	addCurrencyHtmlField(input, template) {
		var slider = null;
		var value = (input.value !== undefined) ? input.value : (input.fieldType === 'number') ? 0 : '';
		if (input.slider) {
			slider = {
				classList: input.slider.classList || input.classList || null,
				max: (input.slider.max !== undefined) ? input.slider.max : (input.max !== undefined) ? input.max : 50000,
				min: (input.slider.min !== undefined) ? input.slider.min : (input.min !== undefined) ? input.min : 0,
				step: input.slider.step || 100,
				value: this.formatCurrency(input.slider.value || (value && !isNaN(value) ? value : 0), input.dataType),
				name: input.slider.name,
				defaultImg: input.slider.defaultImg || false,
				imgsList: input.slider.imgsList || false,
				width: input.slider.width || false,
				height: input.slider.height || false,
			};
		}
		var field = {
			classList: input.classList || null,
			append: input.label.append || null,
			label: input.label.append ? input.label.append.label : input.label,
			sublabel: input.sublabel || false,
			name: input.name,
			type: input.type || 'text',
			size: (input.size || 10) * 8,
			maxlength: input.maxlength || '255',
			min: (input.min !== undefined) ? input.min : null,
			max: (input.max !== undefined) ? input.max : null,
			value: this.formatCurrency((slider && slider.value) ? slider.value : value || 0, input.dataType),
			required: input.required || false,
			helper: input.helper,
			slider: slider,
			placeholder: input.placeholder || '',
		};
		var template = this.getBasicTemplate(field);
		return template;
	}

	addYearsAndMonthsWithSliderHtmlFields(input) {
		if (!input.align) {
			input.align = 'justify';
		}
		var classList = this.getClassList(input.classList);
		var valuesFromYearsMonths = (input.years.value ? input.years.value * 12 : 0);
		if (input.months.value) {
			valuesFromYearsMonths = valuesFromYearsMonths + input.months.value;
		}
		var _value = (input.slider && input.slider.value) ? input.slider.value : valuesFromYearsMonths;
		var values = this.getYearsMonthsValue(_value);
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('helper_y_and_m', true) + '"' : ''}>${input.helper || ''}</div>`;
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('sublabel_y_and_m', true) + '"' : ''}>${input.sublabel || ''}</small>`;
		var template = `<div class="grid-3-cols grid-gap-2 grid-container ${classList ? ' ' + classList : ''} ${input.name ? input.name : ''}">
			<div class="span-columns">
				${input.label}${input.sublabel ? sublabel : ''}
			</div>
			<div class="grid-3-cols grid-gap-2 span-columns yearsmonths-container align-${input.align}">
				<div class="builder-container fields-container column-1 yearsgrow ${input.years.name}${classList ? ' ' + classList : ''} align-${input.align}" data-prefix="${input.years.name}">
					<label data-tid="${this._unique.nextTID('years_label_' + input.years.name)}" class="label ${classList ? ' ' + classList : ''}">Years</label>
					<input class="input ${classList ? ' ' + classList : ''}" style="${input.years.size ? 'width:' + input.years.size + 'ch;' : 'width:3ch;'}" type="${input.years.type || 'number'}" name="${input.years.name}" max="${input.years.max || '99'}" min="${input.years.min || '0'}" value="${values.years}" required>
				</div>
				<div class="and clomn-2">
					<div data-tid="${this._unique.nextTID('and_' + input.years.name)}" class="align-${input.align}">and</div>
				</div>
				<div class="builder-container fields-container clomn-3 monthsgrow ${input.months.name}${classList ? ' ' + classList : ''} align-${input.align}" data-prefix="${input.months.name}">
					<label data-tid="${this._unique.nextTID('months_label_' + input.months.name)}" class="label ${classList ? ' ' + classList : ''}">Months</label>
					<input class="input ${classList ? ' ' + classList : ''}" style="${input.months.size ? 'width:' + input.months.size + 'ch;' : 'width:3ch;'}" type="${input.months.type || 'number'}" name="${input.months.name}" max="${input.months.max || '999'}" min="${input.months.min || '0'}" value="${values.months || '0'}" required>
				</div>
			</div>
			<div class="builder-container span-columns yearsmonths-fields-container ${input.slider.name}">
				<input class="range ${classList ? ' ' + classList : ''}${input.slider.defaultImg ? ' image-slider' : ''}" ${input.slider.defaultImg ? (' data-img="' + input.slider.defaultImg + '"') : ''} type="range"${input.label ? ' aria-label="' + input.label + '"' : ''} name="${input.slider.name}" min="${input.slider.min ||'1'}" max="${input.slider.max ||'192'}" step="${input.slider.step ||'1'}" value="${values.slider || 1}"${input.slider.width ? ' data-thumb-width="' + input.slider.width + '"' : ''}${input.slider.height ? ' data-thumb-height="' + input.slider.height + '"' : ''} />
			</div>${input.helper ? helper : ''}
		</div>`;

		return template;
	}

	getBasicInput(input, slider=null) {
		var value = (input.value !== undefined) ? input.value : (input.fieldType === 'number') ? 0 : '';
		var size = input.size || 25;
		if (input.after) {
			var afterSize = this.getAfterSize(input.after);
			size = (size * 8) - afterSize;
		} else {
			size = size * 8;
		}
		var _input = {
			showValues: input.showValues || null,
			classList: input.classList || null,
			append: input.label.append || null,
			label: input.label.append ? input.label.append.label : input.label,
			sublabel: input.sublabel || false,
			name: input.name,
			type: input.fieldType || 'text',
			max: input.max || false,
			min: (input.min !== undefined) ? input.min : false,
			step: input.step || false,
			size: size,
			maxlength: input.maxlength || false,
			value: value,
			required: input.required || false,
			helper: input.helper || false,
			defaultImg: input.defaultImg || false,
			imgsList: input.imgsList || false,
			width: input.width || false,
			height: input.height || false,
			slider: slider,
			after: input.after || false,
			placeholder: input.placeholder || '',
		};

		if (_input.showValues && _input.showValues.length) {
			_input.min = 0
			_input.max = _input.showValues.length - 1;
		}

		return _input;
	}

	getSliderTemplate(_input) {
		var input = this.getBasicInput(_input);
		input.slider = Object.assign({}, input);
		var slider = this.getSliderBasicInput(input);
		input.slider = slider;
		var classList = this.getClassList(input.classList);
		var value = input.value || 0;
		if (isNaN(value)) {
			value = this.getDecimalValue(value);
		}
		var options = '';
		var showValues = `<span class="show-input-value">${input.value}</span>`;
		if (input.showValues && input.showValues.length) {
			var index = 0;
			for (var option of input.showValues) {
				options = options + '\n' + `<option value="${index}" ${value === index ? 'selected="selected"' : ''} data-tid="${this._unique.nextTID('opt_' + input.name, true)}">${option}</option>`;
				index = index + 1;
			}
			showValues = `<div class="builder-container select-container select-slider" data-prefix="${input.name}_select">
				<select class="select" name="${input.name}_select">
					${options}
				</select>
			</div>`;
		}
		var label = input.append ? this._addFieldToTemplate(input.append, '') : `<label ${input.label ? 'data-tid="' + this._unique.nextTID('label_' + input.name) + '"' : ''} class="label ${classList ? ' ' + classList : ''}">${input.label}</label>`;
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('sublabel_' + input.name) + '"' : ''}>${input.sublabel || ''}</small>`;
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('helper_' + input.name) + '"' : ''}>${input.helper || ''}</div>`;
		var template = `<div class="builder-container fields-container ${input.name}${classList ? ' ' + classList : ''}" data-prefix="${input.name}">
			${label}${input.sublabel ? sublabel : ''}${input.showValues ? showValues : ''}
			<div class="input-container">
				<input class="range ${classList ? ' ' + classList : ''}${input.defaultImg ? ' image-slider' : ''}" ${input.label ? ' aria-label="' + input.label + '"' : ''} name="${input.name}" ${input.defaultImg ? (' data-img="' + input.defaultImg + '"') : ''} type="range" min="${input.min || 0}" max="${input.max}" step="${input.step}" value="${value || 0}"${input.width ? ' data-thumb-width="' + input.width + '"' : ''}${input.height ? ' data-thumb-height="' + input.height + '"' : ''} />
			</div>
		</div>`;

		return template;
	}

	getSliderBasicInput(input) {
		var slider = {name: false};
		if (input.slider) {
			slider = {
				classList: input.slider.classList || input.classList || null,
				max: input.slider.max || input.max || 100,
				min: input.slider.min || (input.min !== undefined) ? input.min : 0,
				step: input.slider.step || 1,
				value: input.slider.value || 0,
				name: input.slider.name || false,
				defaultImg: input.slider.defaultImg || false,
				imgsList: input.slider.imgsList || false,
				width: input.slider.width || false,
				height: input.slider.height || false,
			};
		}
		return slider;
	}

	getOtherInputsTemplate(input, template) {
		var slider = this.getSliderBasicInput(input);
		var _input = this.getBasicInput(input, slider);
		var template = this.getBasicTemplate(_input);
		return template;
	}

	getAfterSize(after) {
		var tmpElement = document.createElement('span');
		tmpElement.style.display = 'inline-block';
		tmpElement.style.opacity = 0;
		tmpElement.appendChild(document.createTextNode(after));
		this.formElement.insertBefore(tmpElement, this.formElemen);
		var size = tmpElement.offsetWidth;
		tmpElement.remove();
		return size;
	}

	getAfterStyle(kind, size) {
		if (kind === 'span') {
			return `margin-left: -${size}px;`;
		} else {
			return `padding-right: ${size}px;`;
		}
	}

	getBasicTemplate(input) {
		var classList = this.getClassList(input.classList);
		var sliderClassList = this.getClassList(input.slider ? input.slider.classList : null);
		var _sliderClassList = sliderClassList || classList || null;
		var value = (input.slider && input.slider.value) ? input.slider.value : input.value;
		var sliderValue = 0;
		if (isNaN(value)) {
			sliderValue = this.getDecimalValue(value);
		} else {
			sliderValue = value;
		}
		var label = input.append ? this._addFieldToTemplate(input.append, '') : `<label ${input.label ? 'data-tid="' + this._unique.nextTID('label_' + input.name) + '"' : ''} class="label ${classList ? ' ' + classList : ''}">${input.label}</label>`;
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('sublabel_' + input.name) + '"' : ''}>${input.sublabel || ''}</small>`;
		var afterSize = input.after ? this.getAfterSize(input.after) : 0;
		var rangeTemplate = input.slider ? `<input class="range ${_sliderClassList ? ' ' + _sliderClassList : ''}${input.slider.defaultImg ? ' image-slider' : ''}" ${input.label ? ' aria-label="' + input.label + '"' : ''} name="${input.slider.name}" ${input.slider.defaultImg ? (' data-img="' + input.slider.defaultImg + '"') : ''} type="range" min="${input.slider.min || 0}" max="${input.slider.max}" step="${input.slider.step}" value="${sliderValue || 0}"${input.slider.width ? ' data-thumb-width="' + input.slider.width + '"' : ''}${input.slider.height ? ' data-thumb-height="' + input.slider.height + '"' : ''} />` : null;
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('helper_' + input.name) + '"' : ''}>${input.helper || ''}</div>`;
		var template = `<div class="builder-container fields-container ${input.name}${classList ? ' ' + classList : ''}" data-prefix="${input.name}">
			${label}${input.sublabel ? sublabel : ''}
			<${input.type === 'range' ? 'div' : 'span'} class="input-container"><input class="input ${classList ? ' ' + classList : ''}${input.defaultImg ? ' image-slider' : ''}" type="${input.type}" name="${input.name}" style="${input.after ? this.getAfterStyle('input', afterSize) : ''} ${input.size ? 'width:' + input.size + 'px;' : '10;'}" ${input.maxlength ? 'maxlength="' + input.maxlength + '"' : ''} ${input.max ? 'max="' + input.max + '"' : ''} ${(input.min !== undefined) ? 'min="' + input.min + '"' : ''} ${input.defaultImg ? (' data-img="' + input.defaultImg + '"') : ''} value="${value}" placeholder="${input.placeholder}" ${input.step ? 'step="' + input.step + '"' : ''} ${input.required ? 'required' : ''}${(input.defaultImg && input.width) ? ' data-thumb-width="' + input.width + '"' : ''}${(input.defaultImg && input.height) ? ' data-thumb-height="' + input.height + '"' : ''}>${input.after ? ('<span class="after" style="' + this.getAfterStyle('span', afterSize) + '">' + input.after + '</span>') : ''}</${input.type === 'range' ? 'div' : 'span'}>
			${(input.slider && input.slider.name) ? rangeTemplate : ''}${input.helper ? helper : ''}
		</div>`;

		return template;
	}

	getSelectTemplate(input) {
		var classList = this.getClassList(input.classList);
		var options = '';
		for (var option of input.options) {
			options = options + '\n' + `<option value="${option.value}" ${option.selected ? 'selected="selected"' : ''} data-tid="${this._unique.nextTID('opt_' + input.name, true)}">${option.label}</option>`;
		}
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('sublabel_' + input.name) + '"' : ''}>${input.sublabel || ''}</small>`;
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('helper_' + input.name) + '"' : ''}>${input.helper || ''}</div>`;
		var template = `<div class="builder-container select-container ${input.name}${classList ? ' ' + classList : ''}" data-prefix="${input.name}">
				<label ${input.label ? 'data-tid="' + this._unique.nextTID('label_' + input.name) + '"' : ''} class="label ${classList ? ' ' + classList : ''}">${input.label}</label>${input.sublabel ? sublabel : ''}
				<select class="select ${classList ? ' ' + classList : ''}" name="${input.name}">
					${options}
				</select>${input.helper ? helper : ''}
			</div>`;
		return template;
	}

	getRadioTemplate(input) {
		var classList = this.getClassList(input.classList);
		var radios = '';
		for (var radio of input.radios) {
			var itemClassList = this.getClassList(radio.classList);
			var _itemClassList = itemClassList || classList || null;
			var r_sublabel = `<small ${radio.sublabel ? 'data-tid="' + this._unique.nextTID('radio_sublabel' + input.name, true) + '"' : ''}>${radio.sublabel || ''}</small>`;
			radios = radios + '\n' + `<span class="radio-input-container"><input class="input ${_itemClassList ? ' ' + _itemClassList : ''}" type="radio" name="${input.name}" value="${radio.value}" ${radio.checked ? 'checked="checked"' : ''}>
				<label ${radio.label ? 'data-tid="' + this._unique.nextTID('radio_label' + input.name, true) + '"' : ''} class="label ${_itemClassList ? ' ' + _itemClassList : ''}">${radio.label}</label>${radio.sublabel ? r_sublabel : ''}</span>`;
		}
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('radio_helper' + input.name) + '"' : ''}>${input.helper || ''}</div>`;
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('radio_mainsublabel' + input.name) + '"' : ''}>${input.sublabel || ''}</small>`;
		var template = `<div class="builder-container fields-container ${input.name}" data-prefix="${input.name}">
				<span ${input.label ? 'data-tid="' + this._unique.nextTID('radio_mainlabel' + input.name) + '"' : ''} class="label ${classList ? ' ' + classList : ''}">${input.label}</span>${input.sublabel ? sublabel : ''}
					${radios}
				${input.helper ? helper : ''}
			</div>`;
		return template;
	}

	getCheckboxTemplate(input) {
		var classList = this.getClassList(input.classList);
		var list = '';
		for (var item of input.list) {
			var itemClassList = this.getClassList(item.classList);
			var _itemClassList = itemClassList || classList || null;
			var r_sublabel = `<small ${item.label ? 'data-tid="' + this._unique.nextTID('checkbox_sublabel' + input.name, true) + '"' : ''}>${item.sublabel || ''}</small>`;
			list = list + '\n' + `<span class="checkbox-input-container"><input class="input ${_itemClassList ? ' ' + _itemClassList : ''}" type="checkbox" name="${input.name}" value="${item.value}" ${item.checked ? 'checked="checked"' : ''}>
				<label ${item.sublabel ? 'data-tid="' + this._unique.nextTID('checkbox_label' + input.name, true) + '"' : ''} class="label ${_itemClassList ? ' ' + _itemClassList : ''}">${item.label}</label>${item.sublabel ? r_sublabel : ''}</span>`;
		}
		var helper = `<div ${input.helper ? 'data-tid="' + this._unique.nextTID('checkbox_helper' + input.name) + '"' : ''}>${input.helper || ''}</div>`;
		var sublabel = `<small ${input.sublabel ? 'data-tid="' + this._unique.nextTID('checkbox_mainsublabel' + input.name) + '"' : ''}>${input.sublabel || ''}</small>`;
		var template = `<div class="builder-container fields-container ${input.name}${classList ? ' ' + classList : ''}" data-prefix="${input.name}">
				<span ${input.label ? 'data-tid="' + this._unique.nextTID('checkbox_mainlabel' + input.name) + '"' : ''} class="label ${classList ? ' ' + classList : ''}">${input.label}</span>${input.sublabel ? sublabel : ''}
					 ${list}
					${input.helper ? helper : ''}
			</div>`;
		return template;
	}

	getClassList(classList) {
		if (classList) {
			var asString = '';
			var counter = 0;
			for (var className of classList) {
				asString = asString + className;
				if (classList[counter + 1]) {
					asString = asString + ' ';
				}
				counter = counter + 1;
			}
			return asString;
		} else {
			return null;
		}
	}

	getNode(input) {
		if (input.fieldType === 'select') {
			return this.formElement.getElementsByClassName(input.name)[0].getElementsByTagName('select')[0];
		} else {
			return this.formElement.getElementsByClassName(input.name)[0].getElementsByTagName('input')[0];
		}
	}

	getSliderNode(input) {
		return this.formElement.getElementsByClassName(input.name)[0].getElementsByTagName('input')[1];
	}

	getYearsMonthsSliderNode(slider) {
		return this.formElement.getElementsByClassName(slider.name)[0].getElementsByTagName('input')[0];
	}

	// Associate the sliders with methods to control inputs
	associateSliderWithMethods(node, name, dataType, bindField) {
		node.addEventListener('input', this.onSliderChange.bind(this, name, dataType, bindField));
		this[`${bindField.slider.name}SliderNode`] = node;

		// Sync input with slider
		var inputNode = this.getNode(bindField);
		inputNode.onchange = this.onChangeSyncRange.bind(this, bindField, inputNode, node);
		inputNode.onkeyup = this.onChangeSyncRange.bind(this, bindField, inputNode, node);
	}

	associateCurrencyWithMethods(input) {
		var node = this.getNode(input);
		node.onchange = this.onCurrencyChangeNoSlider.bind(this, input);
		node.oninput = this.onCurrencyInputNoSlider.bind(this, input);
	}

	onCurrencyChangeNoSlider(input) {
		this.onCurrencyFieldChange(input.name, input);
	}

	onCurrencyInputNoSlider(input) {
		this.maskCurrencyField(input.name);
	}

	associateYearsAndMonthsSliderWithMethod(node, sliderName, yearsName, monthsName, input) {
		node.addEventListener('input', this.onYearsMonthsSlideChange.bind(this, sliderName, yearsName, monthsName));
		this[`${sliderName}SliderNode`] = node;
		this[`${yearsName}Node`].onchange = this.onChangeYearsAndMonthsSyncRange.bind(this, sliderName, yearsName, monthsName, input);
		this[`${monthsName}Node`].onchange = this.onChangeYearsAndMonthsSyncRange.bind(this, sliderName, yearsName, monthsName, input);
	}

	maskCurrencyField(name, event=null) {
		var neutralKeys = [8, 16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 46, 144, 225];
		if (event && neutralKeys.includes(event.keyCode)) {
			return;
		} else if (event.keyCode === 108) {
			var  _val = this[`${name}Node`].value;
			_val = _val.slice(0, -1) + '.';
			this[`${name}Node`].value = _val;
		}
		var lengthBefore = this[`${name}Node`].value.length;
		var value = this[`${name}Node`].value.split('.');
		var selectionStart = event !== null ? event.target.selectionStart : null;
		var selectionEnd = event !== null ? event.target.selectionEnd : null;
		this[`${name}Node`].value = '$' + this.formatNumber(value[0] || '0');
		if (value[1] !== undefined) {
			this[`${name}Node`].value = this[`${name}Node`].value + '.' + value[1] || '00';
		}
		var lengthAfter = this[`${name}Node`].value.length;
		if (selectionStart) {
			if (lengthAfter > lengthBefore) {
				selectionStart = selectionStart + 1;
				selectionEnd = selectionEnd + 1;
			} else if (lengthAfter < lengthBefore) {
				selectionStart = selectionStart - 1;
				selectionEnd = selectionEnd - 1;
			}
			this[`${name}Node`].selectionStart = selectionStart;
			this[`${name}Node`].selectionEnd = selectionEnd;
		}
	}

	formatNumber(value) {
		// format number 1000000 to 1,234,567
		return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	onChangeSyncRange(input, node, sliderNode, event) {
		var value = node.value;
		if (input.fieldType === 'currency') {
			value = value.replace(/[\$,]/g, '');
		}
		value = this.parse(value, input.dataType);
		sliderNode.value = value;

		if (input.fieldType === 'currency' && event.type === 'keyup') {
			this.maskCurrencyField(input.name, event);
		} else if (input.fieldType === 'currency' && event.type === 'change') {
			this.onCurrencyFieldChange(input.name, input);
		}

		// Update slider image
		if (input.slider && input.slider.defaultImg) {
			this.changeSliderImage(input.slider.name, input.slider.imgsList);
		}
	}

	limitNodeMinValue(input, node) {
		if (input.min) {
			var value = this.getInputCurrentValue(input, node);
			if (input.min && value < input.min) {
				node.value = input.min;
				var min = (input.fieldType === 'currency') ? this.formatCurrency(input.min, input.dataType) : input.min;
				window.alert(`The minimum value is ${min}`);
			}
		}
	}

	limitNodeMaxValue(input, node) {
		if (input.max) {
			var value = this.getInputCurrentValue(input, node);
			if (input.max && value > input.max) {
				node.value = input.max;
				var max = (input.fieldType === 'currency') ? this.formatCurrency(input.max, input.dataType) : input.max;
				window.alert(`The maximum value is ${max}`);
			}
		}
	}

	getInputCurrentValue(input, node) {
		var value = node.value;
		var dataType =  input.dataType;
		if (dataType.includes('float')) {
			dataType = 'float';
		}
		if (input.fieldType === 'currency') {
			this.setTextOrNumInputValues(input.name, dataType, input);
			value = this.inputValues[input.name];
		}
		value = this.parse(value, dataType);
		return value;
	}

	onChangeYearsAndMonthsSyncRange(sliderName, yearsName, monthsName, input) {
		var yearsValue = parseInt(this[`${yearsName}Node`].value);
		var monthsValue = parseInt(this[`${monthsName}Node`].value);
		this[`${sliderName}SliderNode`].value = (yearsValue * 12) + monthsValue;

		if (input.slider && input.slider.imgsList) {
			// Update css on chrome
			this.changeSliderImage(input.slider.name, input.slider.imgsList);
		}
	}

	changeSliderImage(inputName, imgsList) {
		for (var imgSlider of this.imgSliders) {
			// Update slider image
			imgSlider.setCSSProperty();
			if (imgsList && imgSlider.slider.name === inputName) {
				imgSlider.onSliderChange();
				// Update css on chrome
				imgSlider.setCSSProperty();
			}
		}
	}

	// Format currency fields on blur
	onCurrencyFieldChange(name, input) {
		this.getInputValues();
		var inputValue = this.inputValues[name];
		var isString = (typeof inputValue === 'string' || inputValue instanceof String) ? true : false;

		var value = isString ? this.getDecimalValue(this.inputValues[name]) : this.inputValues[name];
		this[`${name}Node`].value = this.formatCurrency(parseFloat(value) || 0, input.dataType);
	}

	getTextOrNumInput(name) {
		return this.formElement.getElementsByClassName(name)[0].getElementsByTagName('input')[0];
	}

	getSelectedOption(name) {
		var options =  this.formElement.getElementsByClassName(name)[0].getElementsByTagName('select')[0].getElementsByTagName('option');
		for (var opt of options) {
			if (opt.selected === true) {
				return opt;
			}
		}
	}

	getDecimalValue(value) {
		value = String(value).split('.');
		value[0] = parseInt(value[0].replace(/\D+/g, '') || 0);
		if (value[1] !== undefined) {
			value[1] = '0.' + (value[1] || 0);
			value[1] = parseFloat(value[1]);
		} else {
			value.push(0);
		}
		return value[0] + value[1];
	}

	setTextOrNumInputValues(name, parse, input) {
		if (!name) {
			return;
		}
		var value = this.getTextOrNumInput(name).value;
		if (input.fieldType === 'currency') {
			value = this.getDecimalValue(value);
			if (!parse) {
				parse = 'float-2';
			}
		}
		if (parse) {
			value = this.parse(value, parse);
		}
		this.inputValues[name] = value;
	}

	setRadioButtonCheckedValues(name, dataType) {
		var fieldsContainers = this.formElement.getElementsByClassName(name);
		for (var container of fieldsContainers) {
			var element = container.querySelector('input:checked');
			if (element) {
				var value = this.parse(element.value, dataType);
				this.inputValues[name] = value;
			}
		}
	}

	setCheckboxCheckedValues(name, dataType) {
		var fieldsContainers = this.formElement.getElementsByClassName(name);
		var values = [];
		for (var container of fieldsContainers) {
			var elements = container.querySelectorAll('input[type="checkbox"]:checked');
			for (var element of elements) {
				if (element) {
					var value = this.parse(element.value, dataType);
					values.push(value);
				}
			}
		}
		this.inputValues[name] = values;
	}

	setSelectInputValues(name, parse, isMasked) {
		var value = this.getSelectedOption(name).value;
		// Remove mask from value
		if (isMasked) {
			value = value.replace(/[\$,]/g, '');
		}
		if (parse) {
			value = this.parse(value, parse);
		}
		this.inputValues[name] = value;
	}

	parse(value, parse=false) {
		if (parse === 'float') {
			return parseFloat(value);
		} else if (parse === 'float-1') {
			return parseFloat(value).toFixed(1);
		} else if (parse === 'float-2') {
			return parseFloat(value).toFixed(2);
		} else if (parse === 'int') {
			return parseInt(value);
		} else if (parse === 'string') {
			return String(value);
		} else {
			return value;
		}
	}

	getInputValues() {
		if (this.options.inputs) {
			this._getInputValues(this.options.inputs);
		} else if (this.options.pages) {
			for (var page of this.options.pages) {
				this._getInputValues(page.inputs);
			}
		}
	}

	// Get values on inputs and add the value to this.inputValues with currect data type
	_getInputValues(inputs) {
		for (var input of inputs) {
			if (input.group) {
				this._getInputValues(input.group.buildedInputs);
			} else {
				this.getInputValue(input);
				if (input.label && input.label.append) {
					this.getInputValue(input.label.append);
				}
			}
		}
	}

	getInputValue(input) {
		if (!input.hide) {
			if (input.fieldType === 'select') {
				this.setSelectInputValues(input.name, input.dataType);
			} else if (input.fieldType === 'radio' || input.fieldType === 'radio-anime' || input.fieldType === 'radio-anime-bt') {
				this.setRadioButtonCheckedValues(input.name, input.dataType);
			} else if (input.fieldType === 'checkbox' || input.fieldType === 'check-anime' || input.fieldType === 'check-anime-bt') {
				this.setCheckboxCheckedValues(input.name, input.dataType);
			} else {
				this.setTextOrNumInputValues(input.name, input.dataType, input);
				if (input.fieldType === 'yearsAndMonthsWithSlider') {
					this.setTextOrNumInputValues(input.years.name, input.years.dataType, input);
					this.setTextOrNumInputValues(input.months.name, input.months.dataType, input);
				}
			}
		}
	}

	getValuesByKey(key) {
		this.getInputValues();
		var values = [];
		if (this.inputValues[key] !== undefined) {
			values.push(this.inputValues[key]);
		} else if (this.inputValues[key + 1] !== undefined) {
			var count = 1;
			while (this.inputValues[key + count] !== undefined) {
				values.push(this.inputValues[key + count]);
				count = count + 1;
			}
		}
		return values;
	}

	formatCurrency(value, dataType) {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		});

		value = formatter.format(value);
		if (value != '$NaN' && dataType === 'int') {
			value = value.replace(/\.00/, '');
		}
		return value;
	}

	randomInt(min, max) {
		return Math.floor(Math.random() * (+max - +min)) + +min; 
	}

	getAnimation(max) {
		// The first animation is random, then goes in order
		if (!this._currentAnime) {
			this._currentAnime = this.randomInt(1, max);
		} else if (this._currentAnime === max) {
			this._currentAnime = 1;
		} else {
			this._currentAnime = this._currentAnime + 1;
		}
		return this._currentAnime;
	}

	loadOnFirstInteraction(event) {
		if (event.target.tagName === 'BUTTON') {
			if (this.hasAllRequireFields()) {
				event.preventDefault();
			} else {
				this.spinner.style.display = 'none';
				if (this.options.btCalculate !== false) {
					this.button.disabled = false;
				}
				return;
			}
			if (this.options.btCalculate !== false) {
				this.button.disabled = true;
				this.spinner.style.display = 'flex';
			}
		}
		Promise.all([
			this.addAnimationIframe(),
			this.loadChartFiles(),
		]).then(responses => {
			if (event.target.tagName === 'BUTTON') {
				this.collapseForm(event);
				this._action(event);
			}
		});

		this._removeLoadOnFirstInteractionListeners();
		// Add the _action method to button click event
		if (this.options.btCalculate !== false) {
			this.button.addEventListener('click', this._action.bind(this));
		}
	}

	loadChartFiles() {
		this.charLoading = true;
		return new Promise(async (resolve, reject)=> {
			var loaded = ()=> {
				this.charLoaded = true;
				this.charLoading = false;
				this.spinner.style.display = 'none';
				resolve();
				if (this.pendingActionCallEvent) {
					this._action(this.pendingActionCallEvent);
					this.pendingActionCallEvent = false;
				}
			}
			if (this.options.loadChart && !this.charLoaded) {
				var filesToLoad = [
					{path: 'static/amcharts4/core.js'},
					{path: 'static/amcharts4/charts.js'},
					{path: 'static/amcharts4/themes/animated.js'},
				];
				window._onLoadFiles.load(filesToLoad, loaded.bind(this));
			} else {
				if (!this.charLoading) {
					this.spinner.style.display = 'none';
				}
				this.charLoading = false;
				resolve();
			}
		});
	}

	async addAnimationIframe() {
		return new Promise(async (resolve, reject)=> {
			if (this.options.animation) {
				var src = '';
				var body = `identifier=${this.options.title.replace(/_/g, '-')}&href="${window.location.href}"`;
				var response = await fetch(`KeepAlive.aspx?action=getLoadingAnimation`, {
						headers: {"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"},
						method: "POST",
						body: body,
				}).catch(error=> {
					var selectedAnime = this.getAnimation(5);
					src = `counting${selectedAnime}.html`;
				});

				if (response && response.ok) {
					var json = await response.json();
					src = json.src;
				}

				var animation = document.createElement('div');
				animation.classList.add('animation');
				animation.innerHTML = `<div class="animation-container">
					<iframe src="static/animation/${src}" scrolling="no"></iframe>
				<div>`;
				animation.style.opacity = 0;
				animation.style.height = 0;
				animation.style.display = 'none';
				this.formElement.appendChild(animation);
				resolve();
			} else {
				resolve();
			}
		});
	}

	_action(event) {
		if (this.hasAllRequireFields()) {
			event.preventDefault();
		} else {
			this.spinner.style.display = 'none';
			if (this.options.btCalculate !== false) {
				this.button.disabled = false;
			}
			return;
		}
		this.collapseForm(event);
		this.spinner.style.display = 'flex';
		if (this.charLoading) {
			this.button.disabled = true;
			this.pendingActionCallEvent = event;
			return;
		}
		if (this.options.animation) {
			this.showAnimation(event);
		} else {
			this.callActionAndShowResults(event);
		}
	}

	showAnimation(event) {
		this.spinner.style.display = 'none';
		if (this.showingAnimation) {
			clearTimeout(this.animeTimeout);
		} else {
			this.showingAnimation = true;
			this.hideResults();
			var animation = this.formElement.getElementsByClassName('animation')[0];
			animation.style.display = 'block';
			setTimeout(()=> {
				animation.style.transition = 'opacity .5s';
				animation.style.opacity = 1;
				animation.style.height = null;
			}, 50);
		}
		this.animeTimeout = setTimeout(this.hideAnimation.bind(this, event), 2000);
	}

	hideAnimation(event) {
		var animation = this.formElement.getElementsByClassName('animation')[0];
		animation.style.opacity = 0;
		setTimeout(()=> {
			animation.style.height = 0;
			animation.style.display = 'none';
		}, 500);
		this.showingAnimation = false;
		this.callActionAndShowResults(event);
	}

	hideResults() {
		var sr = this.formElement.getElementsByClassName('show_result')[0];
		if (this.options.btCalculate !== false) {
			this.button.disabled = true;
		}
		sr.style.transition = null;
		sr.style.opacity = 0;
		sr.style.height = 0;
	}

	addFieldActive(formFields) {
		var formCurrentSize = formFields.offsetHeight;
		var counter = 0 ;
		for (var size of this.formActiveSizes) {
			if (this.formActiveSizes[counter] && formCurrentSize <= size && (!this.formActiveSizes[counter +1] || formCurrentSize < this.formActiveSizes[counter +1] )) {
				formFields.classList.add('form-active-' + size);
				return;
			}
			counter = counter + 1;
		}
	}

	removeFieldActive(formFields) {
		for (var size of this.formActiveSizes) {
			formFields.classList.remove('form-active-' + size);
		}
	}

	collapseForm(event) {
		if (!this.options.collapse || !event.target.classList.contains('bt-calculate')) {
			return;
		}
		var formFields = this.formElement.getElementsByClassName('form_fields')[0];
		this.addFieldActive(formFields);
		setTimeout(()=> {
			formFields.classList.add('collapse');
			if (this.options.collapse === 'slow') {
				formFields.classList.add('collapse-slow');
			}
			if (this.options.btCalculate !== false) {
				this.button.style.display = 'none';
				this.uncollapseButton.classList.add('active');
			}
		}, 200);
	}

	uncollapseForm(event) {
		event.preventDefault();
		if (this.options.btCalculate !== false) {
			this.button.style.display = null;
		}
		this.uncollapseButton.classList.remove('active');
		var formFields = this.formElement.getElementsByClassName('form_fields')[0];
		formFields.classList.remove('collapse');
		formFields.classList.add('uncollapse');

		this.removeFieldActive(formFields);
		setTimeout(()=> {
			formFields.classList.remove('uncollapse');
		}, 500);
	}

	callActionAndShowResults(event) {
		this.spinner.style.display = 'none';
		// Get current user info and add values to this.inputValues
		this.getInputValues();
		// Call action function implemented by child class
		this.action(event);
		var sr = this.formElement.getElementsByClassName('show_result')[0];
		sr.style.transition = 'opacity 1s';
		sr.style.opacity = 1;
		sr.style.height = null;
		sr.style.display = null;
		if (this.options.btCalculate !== false) {
			this.button.disabled = false;
		}
		this.options.animation = false;
		if (event.target.tagName === 'BUTTON') {
			// No delay first click on button and 500ms other clicks
			this._tipTime = (this._tipTime === undefined) ? 0 : 500;
			this.callServerAndAddTip(this._tipTime);
		} else {
			this.callServerAndAddTip(500);
		}
	}

	callServerAndAddTip(time) {
		if (this.tipDoesntChangeAnymore) {
			return;
		}
		if (this.tipTimeout) {
			clearTimeout(this.tipTimeout);
		}
		this.tipTimeout = setTimeout(
			()=> {
				var base = window.location.href.includes('file://') ? 'https://cors-anywhere.herokuapp.com/https://www.creditdonkey.com/' : '';
				var body = `mode=api&${this.body ? this.body : this.getBody()}`;

				fetch(`${base}keepalive.aspx?action=getTip&type=${this._unique.selector}`, {
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
					method: 'POST',
					body: body,
				}).then((response) => {
					this.clearTip();
					response.json().then((data) => {
						if (data.hasOwnProperty('tip')) {
							this.tipElement.style.display = 'inline-block';
							this.tipElement.insertAdjacentHTML('beforeend', data.tip);
							this.tipDoesntChangeAnymore = false;
						} else {
							this.tipDoesntChangeAnymore = true;
						}
					}).catch(err => {
						this.clearTip();
						if (response.status == 200 && !response.hasOwnProperty('tip')) {
							this.tipDoesntChangeAnymore = true;
						} else {
							console.log('error 1', err, 'response', response);
						}
					});
				}).catch( err => {
					this.clearTip();
					console.log('error 2', err);
				});
			},
			time,
		);
	}

	getBody() {
		var keys = Object.keys(this.inputValues || {});
		var name = keys[0].startsWith('custom_') ? keys[0].replace('custom_', '') : keys[0];
		var body = keys.length ? `${name}=${this.inputValues[keys[0]]}` : '';
		keys.shift();
		for (var key of keys) {
			name = key;
			if (name.startsWith('custom_')) {
				name = name.replace('custom_', '');
			}
			body = `${body}&${name}=${this.inputValues[key]}`;
		}
		return body;
	}

	clearTip() {
		this.tipElement.innerText = '';
	}

	hasAllRequireFields() {
		var requiredFields = this.formElement.querySelectorAll('[required]');
		for (var field of requiredFields) {
			if (!field.value && field.value !== 0) {
				return false;
			}
		}
		return true;
	}

	// Sliders are range inputs binded to other inputs like text or number
	onSliderChange(name, dataType, bindField, event) {
		this[`${bindField.name}Node`].value = this.parse(this[`${bindField.slider.name}SliderNode`].value, dataType);
		this.getInputValues();
		if (bindField.fieldType === 'currency') {
			this[`${bindField.name}Node`].value = this.formatCurrency(this.inputValues[name] || 0, bindField.dataType);
		} else {
			this[`${bindField.name}Node`].value = this.inputValues[name] || 0;
		}
		if (this.showInputValue !== undefined) {
			this.changeShowInputValue();
		}
	}

	getYearsMonthsValue(value) {
		var values = {
			years: 0,
			months: 0,
			slider: 0,
		};

		var rangeValue = String(value / 12).split('.');
		values.years = parseInt(rangeValue[0]);
		if (rangeValue[1]) {
			values.months = parseInt(value) - (parseInt(rangeValue[0]) * 12);
		} else {
			values.months = 0;
		}
		values.slider = (values.years * 12) + values.months;
		return values;
	}

	onYearsMonthsSlideChange(sliderName, yearsName, monthsName, event) {
		var values = this.getYearsMonthsValue(this[`${sliderName}SliderNode`].value);
		this[`${yearsName}Node`].value = values.years;
		this[`${monthsName}Node`].value = values.months;
	}

	_bindLoadOnFirstInteractionAndOnChangeWithInputs() {
		// Copy the function with bind this allow the remotion of the listener
		this._loadOnFirstInteraction = this.loadOnFirstInteraction.bind(this);
		var inputs = this.formElement.getElementsByTagName('input');
		for (var input of inputs) {
			input.changeInput = this._changeInput.bind(input, this);
			input.changeLabel = this._changeLabel.bind(input, this);
			input.changeImg = this._changeImg.bind(input, this);
			input.addEventListener('input', this._loadOnFirstInteraction);
		}

		var selects = this.formElement.getElementsByTagName('select');
		for (var select of selects) {
			select.changeInput = this._changeInput.bind(select, this);
			select.changeLabel = this._changeLabel.bind(select, this);
			select.addEventListener('input', this._loadOnFirstInteraction);
		}

		if (this.options.btCalculate !== false) {
			this.button.addEventListener('click', this._loadOnFirstInteraction);
		}
	}

	_removeLoadOnFirstInteractionListeners() {
		var inputs = this.formElement.getElementsByTagName('input');
		for (var input of inputs) {
			input.removeEventListener('input', this._loadOnFirstInteraction);
		}

		var selects = this.formElement.getElementsByTagName('select');
		for (var select of selects) {
			select.removeEventListener('input', this._loadOnFirstInteraction);
		}

		if (this.options.btCalculate !== false) {
			this.button.removeEventListener('click', this._loadOnFirstInteraction);
		}
	}

	_changeLabel(calc, value) {
		var option = calc.allInputsOptions.find(i=>i.name === this.name);
		if (this.type === 'checkbox' || this.type === 'radio') {
			var label = this.parentNode.getElementsByClassName('label')[0];
		} else {
			var label = this.parentNode.parentNode.getElementsByClassName('label')[0];
		}
		option.label = value;
		label.innerText = value;
	}

	getImgPath(currentImgPath, value) {
		if (value.includes('/')) {
			return value;
		} else {
			var newValue = 'images/twemoji/';
			if (value.includes('.')) {
				newValue = newValue + value;
			} else {
				newValue = newValue + value + '.svg';
			}
			return newValue;
		}
	}

	_changeSliderThumbDefaultImg(calc, value) {
		var name = this.name
		if (this.type !== 'range') {
			name = this.name + '-slider';
		}
		var slider = calc.imgSliders.find(s=>s._input.slider.name === name);
		if (slider) {
			slider._input.slider.defaultImg = calc.getImgPath(slider._input.slider.defaultImg, value);
			// Update CSS
			slider.slider.dataset.img = slider._input.slider.defaultImg;
			slider.setImage();
		}
	}

	_changeSliderThumbImgsList(calc, imgsList) {
		var name = this.name
		if (this.type !== 'range') {
			name = this.name + '-slider';
		}
		calc._changeSliderThumbDefaultImg(calc, imgsList[0]);
		var slider = calc.imgSliders.find(s=>s._input.slider.name === name);
		slider._input.slider.imgsList = imgsList;
		slider._input.imgList = imgsList;
		slider.images = imgsList;
		slider.setImagesList();
		calc.preloadSliderImgs();
	}

	_changeRadioOrCheckboxImg(calc, value) {
		var option = calc.allInputsOptions.find(i=>i.name === this.name);
		var img = this.parentNode.getElementsByTagName('img')[0];
		var newImgPath = calc.getImgPath(option.img, value);
		img.src = newImgPath;
		option.img = newImgPath;
	}

	_changeImg(calc, value) {
		var hasSlider = this.parentNode.parentNode.getElementsByClassName('image-slider')[0];
		if (hasSlider && !Array.isArray(value)) {
			var changeSliderThumbDefaultImg = calc._changeSliderThumbDefaultImg.bind(this);
			changeSliderThumbDefaultImg(calc, value);
		} else if (hasSlider && Array.isArray(value)) {
			var changeSliderThumbImgsList = calc._changeSliderThumbImgsList.bind(this);
			changeSliderThumbImgsList(calc, value);
		} else if (this.type === 'radio' || this.type === 'checkbox') {
			var changeRadioOrCheckboxImg = calc._changeRadioOrCheckboxImg.bind(this);
			changeRadioOrCheckboxImg(calc, value);
		}
	}

	_changeInput(calc, value) {
		var option = calc.allInputsOptions.find(i=>i.name === this.name);
		if (this.type === 'checkbox' || this.type === 'radio') {
			if (value) {
				this.checked = 'checked';
				option.checked = true;
			} else {
				this.checked = false;
				option.checked = false;
			}
		} else {
			this.value = value;
			option.value = value;
		}
		if (this.type === 'range') {
			var slider = calc.imgSliders.find(s=>s._input.slider.name === this.name);
			// Update css on chrome
			slider.setCSSProperty();

		}
		var evt = document.createEvent('HTMLEvents');
		evt.initEvent('change', false, true);
		this.dispatchEvent(evt);
		var evt2 = document.createEvent('HTMLEvents');
		evt2.initEvent('keyup', false, true);
		this.dispatchEvent(evt2);
	}

	_setToCalculateOnChange() {
		var inputs = this.formElement.getElementsByTagName('input');
		for (var input of inputs) {
			input.addEventListener('change', this._action.bind(this));
		}

		var selects = this.formElement.getElementsByTagName('select');
		for (var select of selects) {
			select.addEventListener('change', this._action.bind(this));
		}

		var addButtons = this.formElement.getElementsByClassName('fields-group-add-bt');
		for (var button of addButtons) {
			button.addEventListener('click', this._action.bind(this));
		}

		var removeButtons = this.formElement.getElementsByClassName('fields-group-remove-bt');
		for (var button of removeButtons) {
			button.addEventListener('click', this._action.bind(this));
		}
	}

	setToCalculateOnChange() {
		if (!this.alreadyCalculateOnce) {
			this._setToCalculateOnChange();
			this.alreadyCalculateOnce = true;
		}
	}
}
_FormBuilderBase.loadFormBuilder = function (node) {
	var head = document.getElementsByTagName('head')[0] || document.documentElement;
	var nodes = [];
	for (var _child of node.children) {
		if (_child.tagName && _child.tagName.toLowerCase() === 'script') {
			nodes.push(_child);
		}
	}
	for (var child of nodes) {
		if (child.innerHTML.includes('_CalculatorBase') || child.innerHTML.includes('_FormBuilderBase')) {
			var script = document.createElement('script');
			script.text = (child.text || child.textContent || child.innerHTML || '');
			head.appendChild(script);
			child.remove();
		}
	}
};

class _CalculatorBase extends _FormBuilderBase {
	// Compound Interest JS Formula
	getCompoundInterest(rate, compound, years, investment, contribution) {
		if (rate === 0) {
			return investment + ((contribution * 12) * years);
		} else {
			rate = rate / compound;
			var period = years * compound;
			// CI = P * Math.pow(1 + R/n, nt);
			var initial =  investment * Math.pow(1 + rate, period);
			// PMT × d {[(1 + R/n)(nt) - 1] / (R/n)}
			var monthly = contribution * (12 / compound) * ((Math.pow(1 + rate, period) - 1) / rate);
			return initial + monthly;
		}
	}

	// Excel formula: =PMT(rate/12;nper*12;-pv;fv;type)
	PMT(rate, nper, pv, fv, type=0, compound=0) {
		var result;
		if (rate === 0) {
			result = (pv + fv) / nper;
		} else {
			var term = Math.pow(1 + rate / compound, compound * nper);
			if (type === 1) {
				result = (fv * rate / (term - 1) + pv * rate / (1 - 1 / term)) / (1 + rate);
			} else {
				result = fv * rate / (term - 1) + pv * rate / (1 - 1 / term);
			}
		}
		return -result;
	}
}

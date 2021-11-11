function OnLoadFiles() {
	var self = this;
	self.state = {};
	self.waiting = [];
	self.load = function(filesToLoad, fnToRun) {
		self.runPendingFn = function (filesToLoad) {
			for (var i = 0; i < filesToLoad.length; i++) {
				if (!self.state[filesToLoad[i].name + 'Loaded']) {return;}
			}
			for (var i = 0; i < self.waiting.length; i++) {
				self.waiting[i]();
			}
			self.waiting = [];
		};
		self.waiting.push(fnToRun);
		for (var i = 0; i < filesToLoad.length; i++) {
			var parts = filesToLoad[i].path.split('/');
			filesToLoad[i].name = parts[parts.length -1].replace('.', '');
			if (!self.state[filesToLoad[i].name + 'Appended']) {
				self.state[filesToLoad[i].name + 'Appended'] = true;
				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.async = filesToLoad[i].async || false;
				script.src = filesToLoad[i].path;
				if (!filesToLoad[i].async && filesToLoad[i].defer !== false) {
					script.defer = true;
				}
				var body = document.getElementsByTagName('body')[0];
				body.insertBefore(script, body.firstChild);
				(function() {
					var j = i;
					script.addEventListener('load', function() {
						self.state[filesToLoad[j].name + 'Loaded'] = true;
						self.runPendingFn(filesToLoad);
					});
				})();
			}
		}
		self.runPendingFn(filesToLoad);
	}
	self.builderLazyLoad = function(node) {
		var filesToLoad = [
			{path: 'static/calculator/builder.js', async: true},
		];
		var onBuilderLoad = function () {
			setTimeout(()=> {
				_FormBuilderBase.loadFormBuilder(node);
			});
		};
		self.load(filesToLoad, onBuilderLoad);
	};
}
window._onLoadFiles = new OnLoadFiles();

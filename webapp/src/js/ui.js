// CSS vh
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);


const ui = {
	// Media Query Size
	deviceSize() {
		const mobile = window.matchMedia('(min-width: 0px) and (max-width: 768px)'),
			  tablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
			  desktop = window.matchMedia('(min-width: 1025px)');
		let size = null

		if(mobile.matches){
			size = 'mobile'
		} else if(tablet.matches){
			size = 'tablet'
		} else if(desktop.matches){
			size = 'desktop'
		};

		return size
	},
	init() {
		document.body.dataset.uiSize = ui.deviceSize();
	}
};

// Resize
window.addEventListener("resize", () => {
	// CSS vh
	vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);

	// Media Query Size
	document.body.dataset.uiSize = ui.deviceSize();
});
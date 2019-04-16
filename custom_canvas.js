function byId(id){return d.getElementById(id)}
function print(s){console.log(s)}
const d = document, b = document.body, c = byId('canvas'), FPS = 60, tau = Math.pi * 2, G = 6.67428*Math.pow(10,-11);
var obj_list = [], ui = [], events = [], last_time = Date.now();
function delta() {
	let now = Date.now();
	let diff = now - last_time;
	return diff;
}
function draw() {
	if (c.children.length<obj_list.length) {
		let diff = obj_list.length-c.children.length;
		for (let i=0;i<diff;i++) {
			let brush = d.createElement('div');
			c.append(brush);
		}
	}
	if (c.children.length>obj_list.length) {
		let diff = c.children.length-obj_list.length;
		for (let i=0;i<diff;i++) {
			let brush = c.children[0];
			c.removeChild(brush);
		}
	}
	for (let i=0;i<obj_list.length;i++) {
		let brush = c.children[i];
		let obj = obj_list[i];
		brush.style.width = obj.dim.x + 'px';
		brush.style.height = obj.dim.y + 'px';
		brush.style.left = obj.pos.x - obj.dim.x/2 + 'px';
		brush.style.top = obj.pos.y - obj.dim.y/2 + 'px';
		brush.style.background = obj.color.base;
		brush.style.color = obj.color.text;
		brush.style.border = obj.border.width + 'px ' +
		obj.border.line + ' ' +
		obj.border.color;
	}
}

function make_box() {
	let box = {
		name: '',
		dim: {x: 40, y: 40},
		pos: {x:  0, y:  0},
		velocity: {x: 0, y: 0},
		rot: 0,
		rot_velocity: 0,
		density: 1,
		color: {base: '#0f0', text: '#000'},
		border: {side: 'all', width: 1, line: 'solid', color: '#000'},
		shape: 'box',
		get_area: function() {
			switch (this.shape) {
				case 'box': {
					return this.dim.x*this.dim.y;
				}
				case 'circle': {
					return this.dim.x*this.dim.x*tau/8;
				}
				case 'triangle': {
					return this.dim.x*this.dim.y/2;
				}
			}
		},
		get_mass: function() {
			return this.get_area() * this.density;
		},
		gravity: function() {
			for (let i=0;i<obj_list.length;i++) {
				if (obj_list[i]!==this) {
					let o = obj_list[i],
						m = o.get_mass(),
						dir = {x: o.pos.x - this.pos.x, y: o.pos.y - this.pos.y},
						mag_squared = dir.x*dir.x + dir.y*dir.y,
						A = G*m/mag_squared,
						mag = Math.pow(mag_squared, 0.5),
						unit_dir = {x: dir.x/mag, y: dir.y/mag},
						a_vec = {x: A*unit_dir.x, y: A*unit_dir.y};
					this.velocity.x += a_vec.x*delta();
					this.velocity.y += a_vec.y*delta();
				}
			}
		},
	};
	obj_list[obj_list.length] = box;
	return box;
}

function phsx() {
	for (let i=0;i<obj_list.length;i++) {
		let o = obj_list[i];
		o.gravity();
		o.pos.x += o.velocity.x * delta();
		o.pos.y += o.velocity.y * delta();
	}
	last_time = Date.now();
}

let kbd = {};
d.onkeydown = function(e){
	if (!kbd.hasOwnProperty(e.key)) {
		kbd[e.key] = {
			key: e.key,
			down: true,
			down_set: function(b) {
				this.down = b;
				if (b) {
					events[events.length] = ['key_dn', this.key, Date.now()];
				} else {
					events[events.length] = ['key_up', this.key, Date.now()];
				}
			},
		};
	} else {
		kbd[e.key].down_set(true);
	}
};
d.onkeyup = function(e){
	if (kbd.hasOwnProperty(e.key)) {
		kbd[e.key].down_set(false);
	}
};

function evnt() {
	// print(events.length);
}

let m = make_box();
m.density = 10000000;
m.pos = {x: 200, y: 200};
make_box();

setInterval(function() {
	evnt();
	phsx();
	draw();
}, 1000/FPS);
// let m = make_box();
// m.pos = {x: 3, y: 4};
// let mag = Math.pow(Math.pow(3, 2) + Math.pow(4, 2), .5);
// print(mag);
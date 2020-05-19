var statue;
var column;

var zoom_slider;
var c_hor_pos;
var c_look_x;
var c_look_y;
const cam_speed = 3;

var snaps;
var snap_p;
var snap_timer;
var playing;

var bg_color;
var floor_color;

function preload(){
	statue = loadModel("assets/statue.obj");
	column = loadModel("assets/ConcreteColumn.obj");
	zoom_slider = createSlider(0, 1000, 500);
}

function setup(){
	let canv = createCanvas(768, 768, WEBGL);
	let canv_pos = canv.position();
	zoom_slider.position(canv_pos.x, canv_pos.y);

	floor_color = color(80, 180, 80);
	bg_color = color(80, 80, 180);
	background(bg_color);

	snap_p = 0;
	snap_timer = 0;
	playing = false;
	snaps = [];
	for(let i = 0; i < 10; i++){
		snaps[i] = [];
	}

	c_hor_pos = 0;
	c_look_x = 0;
	c_look_y = 0;
}

function draw(){
	background(bg_color);
	noStroke();
	directionalLight(255, 255, 255, -50, 0, 0);
	ambientLight(120);

	if(playing){
		run_snaps();
	}
	else{
		read_inputs();
	}

	let cur_zoom = zoom_slider.value()
	let cam_x = cos(c_hor_pos/5)*cur_zoom + c_look_x;
	let cam_z = sin(c_hor_pos/5)*cur_zoom + c_look_y;
	//default Z: (height/2.0)/(tan(Math.PI/4))
	
	let cur_pos_x = cos()

	camera(cam_x, -250, cam_z, c_look_x, -150, c_look_y, 0, 1, 0);

	//statue
	push();
		scale(2, -2, 2);
		rotateY(PI);

		fill(220);
		model(statue);
	pop();

	//column
	push();
		scale(2, -2, 2);
		translate(-100, 0, 0);

		fill(220);
		model(column);
	pop();

	//floor
	push();
		rotateX(Math.PI/2);
		ambientMaterial(floor_color);
		plane(5000, 5000, 100, 100);
	pop();
}


function read_inputs(){
	if(keyIsDown(RIGHT_ARROW)){
		c_hor_pos += 1;
	}
	if(keyIsDown(LEFT_ARROW)){
		c_hor_pos -= 1;
	}

	let angle = atan((sin(c_hor_pos/5)*zoom_slider.value()) / (cos(c_hor_pos/5)*zoom_slider.value()));
	if(cos(c_hor_pos/5) < 0){
		angle+=PI;
	}

	if(keyIsDown(87)){//W
		c_look_x -= cos(angle)*cam_speed;
		c_look_y -= sin(angle)*cam_speed;
	}
	if(keyIsDown(65)){//A
		angle -= PI/2;
		c_look_x -= cos(angle)*cam_speed;
		c_look_y -= sin(angle)*cam_speed;
	}
	if(keyIsDown(83)){//S
		angle += PI;
		c_look_x -= cos(angle)*cam_speed;
		c_look_y -= sin(angle)*cam_speed;
	}
	if(keyIsDown(68)){//D
		angle += PI/2;
		c_look_x -= cos(angle)*cam_speed;
		c_look_y -= sin(angle)*cam_speed;
	}
}

function run_snaps(){
	snap_timer++;
	if(snap_timer == 60){
		if(snap_p == 9){
			playing = false;
			return;
		}
		snap_p++;
	}
	snap_timer %= 60;

	c_hor_pos = snaps[snap_p][0];
	zoom_slider.value(snaps[snap_p][1]);
	c_look_x = snaps[snap_p][2];
	c_look_y = snaps[snap_p][3];
}

function keyPressed(){
	if(key === 'q'){
		snaps[snap_p] = [c_hor_pos, zoom_slider.value(), c_look_x, c_look_y];
		snap_p++;
		snap_p %= 10;
	}
	if(key === 'p'){
		snap_p = 0;
		playing = true;
		snap_timer = 0;
	}
}



















let k1 = function(p) {
  
/* Kepler's First Law
 *
 * this sketch uses kepler's equations to show that planets orbit
 * in elliptical paths. It uses a parameterization of the orbit 
 * instead of using a physics simulation, which proves to be more 
 * efficicent
 *
 * Isaac Feldman 2021
 */
  
let i = 0;

let AU;
let fr = 60;
  
p.setup = function() {
  p.createCanvas(400, 400);
  p.angleMode(p.DEGREES);
  p.frameRate(fr);
  
  AU = p.width / 8;
}

p.draw = function() {
  p.background(0);
  let a = 1.5*AU;
  let e = 0.5;
  let r = kepler(a, e, i);

  // draw the line between the planet and star
  p.stroke("red");
  p.strokeWeight(2);
  p.line(
    p.width / 2 + r * Math.sin(i),
    p.height / 2 + r * Math.cos(i) + a * e + a * e * e,
    
    p.width / 2, 
    p.height / 2);
  
  // draw the distance between the planet and star
  let dx = r * Math.sin(i);
  let dy = r * Math.cos(i) + a * e + a * e * e;
  let radius = Math.sqrt(dx*dx + dy*dy);
  p.noStroke();
  p.fill("255");
  p.text("Planet-Star Distance: "+ (radius/AU).toFixed(3) + "AU", 100, 375)
  
  // draw the orbit
  p.stroke("white");
  p.strokeWeight(2);
  for (let l = 0; l < 2*p.PI;l+=0.02){
    let q = kepler(a, e, l);
    p.line(
    p.width / 2 + q * Math.sin(l),
    p.height / 2 + q * Math.cos(l) + a * e + a * e * e,
      
    p.width / 2 + q * Math.sin(l+0.01),
    p.height / 2 + q * Math.cos(l+0.01) + a * e + a * e * e)
  }
  
  // draw the planet and star
  p.noStroke();
  p.fill("yellow");
  p.circle(p.width / 2, p.height / 2, 25); // star
   p.fill("grey");
  p.circle(                                // planet
    p.width / 2 + r * Math.sin(i),
    p.height / 2 + r * Math.cos(i) + a * e + a * e * e, // error term (hehe)
    20
  );
  
  i +=  2*fr / Math.sqrt(a*a*a/AU*AU*AU);
}
// use kepler's equation to roughly parameterize an orbit
function kepler(a, e, t) {//semi-major axis, eccentricity, eccentric anomaly
  
  let p = a * (1 - e * e); // semi-latus rectum
  let r = p / (1 + e * Math.cos(t));
  return r;
}

}

let k2 = function(p) {
  
/* Kepler's Second Law
 *
 * Isaac Feldman 2021
 */
  
let i = 0;
let AU;
let fr = 60;
  
let slider_p1;
let slider_p2;
let node1;
let node2;
let time = 0;



p.setup = function() {
  c = p.createCanvas(400, 400);
  
  slider_p1 = p.createSlider(0, p.TWO_PI, p.QUARTER_PI, 0.02);
  slider_p1.position(c.position().x + 10, c.position().y + p.height - p.width/7);
  slider_p1.style("width", p.width/2);
  
  slider_p2 = p.createSlider(0, p.TWO_PI, p.HALF_PI, 0.02);
  slider_p2.position(c.position().x +10,c.position().y + p.height - p.width/10);
  slider_p2.style("width", p.width/2)
  
  p.angleMode(p.DEGREES);
  p.frameRate(fr);
  
  AU = p.width / 8;
}

p.draw = function() {
  p.background(0);
  let a = 1.5*AU;
  let e = 0.3;
  let T = Math.sqrt(a*a*a/AU*AU*AU)/2500;
  // draw the orbit
  p.stroke("white");
  p.ellipseMode(p.RADIUS);
  p.noFill();
  let b = a*Math.sqrt(1-(e*e));
  p.ellipse(p.width / 2, p.height / 2, b ,a) // (cx, cy, b, a)
  p.ellipseMode(p.CENTER);


   if (slider_p1.value() < slider_p2.value()){
    node1 = slider_p1.value();
    node2 = slider_p2.value();
  } else {
    node2 = slider_p1.value();
    node1 - slider_p2.value();
  }
  
  // draw the nodes
  p.fill('rgba(0,255,0, 0.5)');
  let r = kepler(a, e, node1);
  p.circle(                                
    p.width / 2 + r * Math.sin(node1),
    p.height / 2 + r * Math.cos(node1) + a * e, 
    10
  );
 
    let s = kepler(a, e, node2);
  p.circle( 
    p.width / 2 + s * Math.sin(node2),
    p.height / 2 + s * Math.cos(node2) + a * e ,
    10
  );
  
  // draw area segment
  p.beginShape();
  p.vertex(p.width/2 , p.height/2 - a*e);
  for (let i = node1; i < Math.abs(node1 - node2) + node1; i += 0.01){
    let v = kepler(a, e, i);
    p.vertex(p.width / 2 + v * Math.sin(i),
           p.height / 2 + v* Math.cos(i) + a * e );
  }
  p.endShape(p.CLOSE);
  
  // draw matching segment
  p.fill('rgba(255,0,0, 0.5)');
    p.beginShape();
  p.vertex(p.width/2 , p.height/2 - a*e);
  for (let i = node1+p.PI; i < Math.abs(node1 - node2) + node1+p.PI; i += 0.01){
    let ang = i; + Math.sqrt(1- (e*e))*Math.sin(i);
    let v = kepler(a, e, ang);
    p.vertex(p.width / 2 + v * Math.sin(ang),
           p.height / 2 + v* Math.cos(ang) + a * e );
  }
  p.endShape(p.CLOSE);

  // draw the planet and star
  let t = kepler(a, e, i);
  p.noStroke();
  p.fill("yellow");
  p.circle(p.width / 2, p.height / 2 - a*e, 25); // star
  p.fill("grey");
  p.circle(                                // planet
    p.width / 2 + t * Math.sin(i),
    p.height / 2 + t * Math.cos(i) + a * e ,
    20
  );
  

  if (i/p.TWO_PI  < node2/p.TWO_PI && i/p.TWO_PI > node1/p.TWO_PI){
    time++;
  } 
  p.fill(255)
  
  p.text("Time to sweep out area: "+((time/(fr*2))/T).toFixed(3)+" years", p.width/4, 5*p.height/6);
  
  if (i/p.TWO_PI > 1){
    i =0;
    time = 0;
  }

  i +=  2*fr / Math.sqrt(a*a*a/AU*AU*AU);
}
// use kepler's equation to parameterize an orbit
function kepler(a, e, t) {//semi-major axis, eccentricity, eccentric anomaly
  let p = a * (1 - e * e); // semi-latus rectum
  let r = p / (1 + e * Math.cos(t));
  return r;
}
  
}


let k3 = function(p) {
  
/* Kepler's Third Law
 *
 * this sketch uses kepler's equations to show how semi-major axis
 * and period are related. it uses a parameterization of the orbit 
 * instead of using a physics simulation, which proves to be more 
 * efficicent
 *
 * Isaac Feldman 2021
 */
  
let i = 0;
let slider_a;
let slider_e;
let AU;
let fr = 60;
  
p.setup = function() {
  c = p.createCanvas(400, 400);
  c.position();
  p.frameRate(fr);
  
  // Slider for semi-major axis
  slider_a = p.createSlider(0.5, 2, 1, 0.1);
  slider_a.position(c.position().x + 10,
    c.position().y + p.height - p.width/5);
  slider_a.style("width", p.width/2);
  // Slider for ecentricity
  slider_e = p.createSlider(0, 0.9, 0, 0.1);
  slider_e.position(c.position().x + 10,
    c.position().y + p.height -  p.width/10);
  slider_e.style("width", "200px");
   
  AU = p.width / 8;
}

p.draw = function() {
  p.background(0);
  let a = slider_a.value() * AU;
  let e = slider_e.value();
  let r = kepler(a, e, i);
  p.fill("yellow");
  p.circle(p.width / 2, p.height / 2, 20); // star
   p.fill("blue");
  p.circle(                                // planet
    p.width / 2 + r * Math.sin(i),
    p.height / 2 + r * Math.cos(i) + a * e + a * e * e, // error term (hehe)
    10
  );
  
  // Text boxes
  p.fill(255);
  p.text("Period: "+
         (Math.sqrt(a*a*a/AU*AU*AU) / 2500).toFixed(2) + " years",
         p.width/2+50, 7*p.height/8);
  
  p.text("Eccentricity: "+e,
         10, p.height - 40 - 10);
  
  p.text("Semi-major axis: "+
         (a/AU).toFixed(2) + " AU",
         10, 4*p.height/5);
  i += fr / Math.sqrt(a*a*a/AU*AU*AU);
}
// use kepler's equation to roughly parameterize an orbit
function kepler(a, e, t) {//semi-major axis, eccentricity, eccentric anomaly
  let p = a * (1 - e * e); // semi-latus rectum
  let r = p / (1 + e * Math.cos(t));
  return r;
}
p.windowResized = function(){
  slider_a.position(c.position().x + 10,
    c.position().y + p.height - p.width/5);
  slider_e.position(c.position().x + 10,
    c.position().y + p.height -  p.width/10);
    }

}

let myp5 = new p5(k1, "k1");
    myp5 = new p5(k2, "k2");
    myp5 = new p5(k3, "k3");

//https://codepen.io/coopergoeke/pen/wvaYMbJ
let winWidth = window.innerWidth;

// ammount to add on each button press
let confettiCount;	
let sequinCount;

// "physics" variables
let gravityConfetti;    /* 위에 방향으로 얼마나 솟는지 */
let gravitySequins;	 /* y축 흩어지는 정도 (늘릴수록 흩어짐)*/	
let dragConfetti;	/* x축으로 얼마나 퍼지는지 (숫자가 커질수록 범위가 좁아짐) */
let dragSequins;	/* x축 흩어지는 정도인거같아 ( 늘릴수록 뭉쳐짐 ) */
let terminalVelocity;	 /* 아래로 내려가는 타이밍 */


if (winWidth >= 1024) {
	//1024 이상
	// ammount to add on each button press
	confettiCount = 300
	sequinCount = 1;

	// "physics" variables
	gravityConfetti = 0.13;
	gravitySequins = 0;	
	dragConfetti = 0.015;    
	dragSequins = 0;   
	terminalVelocity = 10;	 

} else {
	//1024 이하

	// ammount to add on each button press
	confettiCount = 100;	
	sequinCount = 5;

	// "physics" variables
	gravityConfetti = 0.18;
	gravitySequins = 0;	
	dragConfetti = 0.03;
	dragSequins = 0.01; 
	terminalVelocity = 10;
}

// init other global elements
const button = document.querySelector('.btnFirecracker')
var disabled = false
const canvas = document.querySelector('.firecracker')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let cx = ctx.canvas.width / 2
let cy = ctx.canvas.height / 2

// add Confetto/Sequin objects to arrays to draw them
let confetti = []
let sequins = []

// colors, back side is darker for confetti flipping
const colors = [
  { front : '#8d73c2', back: '#f70000' }, // red
  { front : '#e63131', back: '#42b47b' }, // mint
  { front : '#ffde78', back: '#ffcb2b' }  // yellow
]

// helper function to pick a random number within a range
randomRange = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Occasional confetto goes higher than the max
    y += (Math.random() < .25) ? randomRange(1, 3) : 0
  }
  return {x: x, y: -y}
}

// Confetto Class
function Confetto() {
  this.randomModifier = randomRange(0, 99)
  this.color = colors[Math.floor(randomRange(0, colors.length))]
  this.dimensions = {
    x: randomRange(5, 9),
    y: randomRange(8, 15),
  }
  this.position = {
    x: randomRange(canvas.width/2 - button.offsetWidth/4, canvas.width/2 + button.offsetWidth/4),
    y: randomRange(canvas.height/2 + button.offsetHeight/2 + 8, canvas.height/2 + (1.5 * button.offsetHeight) - 8),
  }
  this.rotation = randomRange(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocity([-9, 9], [6, 11])
}
Confetto.prototype.update = function() {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()
  
  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // spin confetto by scaling y and set the color, .09 just slows cosine frequency
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)    
}

// Sequin Class
function Sequin() {
  this.color = colors[Math.floor(randomRange(0, colors.length))].back,
  this.radius = randomRange(1, 2),
  this.position = {
    x: randomRange(canvas.width/2 - button.offsetWidth/3, canvas.width/2 + button.offsetWidth/3),
    y: randomRange(canvas.height/2 + button.offsetHeight/2 + 8, canvas.height/2 + (1.5 * button.offsetHeight) - 8),
  },
  this.velocity = {
    x: randomRange(-6, 6),
    y: randomRange(-8, -12)
  }
}
Sequin.prototype.update = function() {
  // apply forces to velocity
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins
  
  // set position
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y   
}

// add elements to arrays to be drawn
initBurst = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin())
  }
}

// draws the elements on the canvas
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  confetti.forEach((confetto, index) => {
    let width = (confetto.dimensions.x * confetto.scale.x)
    let height = (confetto.dimensions.y * confetto.scale.y)
    
    // move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y)
    ctx.rotate(confetto.rotation)

    // update confetto "physics" values
    confetto.update()
    
    // get front or back fill color
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back
    
    // draw confetto
    ctx.fillRect(-width / 2, -height / 2, width, height)
    
    // reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where button cuts off
    if (confetto.velocity.y < 0) {
      ctx.clearRect(canvas.width/2 - button.offsetWidth/2, canvas.height/2 + button.offsetHeight/2, button.offsetWidth, button.offsetHeight)
    }
  })

  sequins.forEach((sequin, index) => {  
    // move canvas to position
    ctx.translate(sequin.position.x, sequin.position.y)
    
    // update sequin "physics" values
    sequin.update()
    
    // set the color
    ctx.fillStyle = sequin.color
    
    // draw sequin
    ctx.beginPath()
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI)
    ctx.fill()

    // reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    // clear rectangle where button cuts off
    if (sequin.velocity.y < 0) {
      ctx.clearRect(canvas.width/2 - button.offsetWidth/2, canvas.height/2 + button.offsetHeight/2, button.offsetWidth, button.offsetHeight)
    }
  })

  // remove confetti and sequins that fall off the screen
  // must be done in seperate loops to avoid noticeable flickering
  confetti.forEach((confetto, index) => {
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1)
  })
  sequins.forEach((sequin, index) => {
    if (sequin.position.y >= canvas.height) sequins.splice(index, 1)
  })

  window.requestAnimationFrame(render)
}



// cycle through button states when clicked
clickButton = () => {
	canvas.style.display = "block";
	window.initBurst();
}

// re-init canvas if the window size changes
resizeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  cx = ctx.canvas.width / 2
  cy = ctx.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
  resizeCanvas()
})

// click button on spacebar or return keypress
//엔터키 입력시 효과 삭제
/*document.body.onkeyup = (e) => {
  if (e.keyCode == 13 || e.keyCode == 32) {
    clickButton()
  }
}*/

// Set up button text transition timings on page load
textElements = button.querySelectorAll('.button-text')
textElements.forEach((element) => {
  characters = element.innerText.split('')
  let characterHTML = ''
  characters.forEach((letter, index) => {
    characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
  })
  element.innerHTML = characterHTML
})

// kick off the render loop
//window.initBurst();
render();
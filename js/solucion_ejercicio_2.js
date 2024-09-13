// Objeto base para los personajes
class Character {
  constructor(name, health, damage, elementId) {
    this.name = name;
    this.health = health;
    this.maxhealth = health;
    this.damage = damage;
    this.elementId = elementId;
    this.position = { top: 50, left: 50 };
    this.updatePosition();
    this.updateStatus();
  }

  isAlive() {
    return this.health > 0;
  }

  updateStatus() {
    const healthPercentage = (this.health / this.maxhealth) * 100;
    const healthBar = document.querySelector(`#${this.elementId} .health`);
    const status = document.querySelector(`#${this.elementId} .status`);

    healthBar.style.width = `${healthPercentage}%`;
    status.innerText = `HP: ${this.health}/${this.maxhealth}`;
  }

  // Ataca a otro personaje seleccionado
  attack(target) {
    if (this.isAlive() && target.isAlive()) {
      console.log(`${this.name} inflige ${this.damage} de daño a ${target.name}`);
      target.health -= this.damage;
      if (target.health < 0) target.health = 0;
      target.updateStatus();
    }
  }

  // Mueve el personaje
  move(direction) {
    const step = 5;
    const element = document.getElementById(this.elementId);
    const elementRect = element.getBoundingClientRect();

    // Limites de la pantalla
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (direction === "left" && elementRect.left > 0) {
      this.position.left -= step;
    }
    if (direction === "right" && elementRect.right < screenWidth) {
      this.position.left += step;
    }
    if (direction === "up" && elementRect.top > 0) {
      this.position.top -= step;
    }
    if (direction === "down" && elementRect.bottom < screenHeight) {
      this.position.top += step;
    }

    this.updatePosition();
  }

  // Actualiza la posición en la pantalla
  updatePosition() {
    const element = document.getElementById(this.elementId);
    element.style.top = `${this.position.top}px`;
    element.style.left = `${this.position.left}px`;
  }
}

// Creación de personajes
const hero = new Character("Heroe", 1000, 20, "hero");
const enemy = new Character("Enemigo", 1000, 20, "enemy");

const keys = {};

// Función para verificar colisiones
function checkCollision() {
  const heroElement = document.getElementById("hero").getBoundingClientRect();
  const enemyElement = document.getElementById("enemy").getBoundingClientRect();

  return !(heroElement.right < enemyElement.left ||
    heroElement.left > enemyElement.right ||
    heroElement.bottom < enemyElement.top ||
    heroElement.top > enemyElement.bottom);
}

// Detectar teclas presionadas
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

// Detectar teclas liberadas
document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Función de actualización continua de movimientos
function update() {
  // Mover el héroe
  if (keys["ArrowLeft"]) hero.move("left");
  if (keys["ArrowRight"]) hero.move("right");
  if (keys["ArrowUp"]) hero.move("up");
  if (keys["ArrowDown"]) hero.move("down");

  // Mover el enemigo
  if (keys["a"]) enemy.move("left");
  if (keys["d"]) enemy.move("right");
  if (keys["w"]) enemy.move("up");
  if (keys["s"]) enemy.move("down");

  if (keys["Enter"] && checkCollision()) {
    hero.attack(enemy);
  }

  
  if (keys[" "] && checkCollision()) {
    enemy.attack(hero);
  }

  requestAnimationFrame(update);
}

update();
class Character {
  constructor(name, health, damage, elementId) {
    this.name = name;
    this.health = health;
    this.maxhealth = health;
    this.damage = damage;
    this.elementId = elementId;
    this.position = { top: 0, left: 0 };
    this.centerCharacter();
    this.updatePosition();
    this.updateStatus();
  }

  centerCharacter() {
    const container = document.querySelector('#fight-section');
    const characterElement = document.getElementById(this.elementId);

    const containerRect = container.getBoundingClientRect();
    const characterRect = characterElement.getBoundingClientRect();

    this.position.top = (containerRect.height - characterRect.height) / 2;
    this.position.left = (containerRect.width - characterRect.width) / 2;
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

  attack(target) {
    if (this.isAlive() && target.isAlive()) {
      console.log(`${this.name} inflige ${this.damage} de daño a ${target.name}`);
      target.health -= this.damage;
      if (target.health < 0) target.health = 0;
      target.updateStatus();
    }
  }

  move(direction) {
    const step = 5;
    const element = document.getElementById(this.elementId);
    const elementRect = element.getBoundingClientRect();

    const container = document.querySelector('#fight-section');
    const containerRect = container.getBoundingClientRect();

    if (direction === "left" && elementRect.left > containerRect.left) {
      this.position.left -= step;
    }
    if (direction === "right" && elementRect.right < containerRect.right) {
      this.position.left += step;
    }
    if (direction === "up" && elementRect.top > containerRect.top) {
      this.position.top -= step;
    }
    if (direction === "down" && elementRect.bottom < containerRect.bottom) {
      this.position.top += step;
    }

    this.updatePosition();
  }

  updatePosition() {
    const element = document.getElementById(this.elementId);
    element.style.top = `${this.position.top}px`;
    element.style.left = `${this.position.left}px`;
  }
}

const hero = new Character("Heroe", 1000, 20, "hero");
const enemy = new Character("Enemigo", 1000, 20, "enemy");

const keys = {};

function checkCollision() {
  const heroElement = document.getElementById("hero").getBoundingClientRect();
  const enemyElement = document.getElementById("enemy").getBoundingClientRect();

  return !(heroElement.right < enemyElement.left ||
      heroElement.left > enemyElement.right ||
      heroElement.bottom < enemyElement.top ||
      heroElement.top > enemyElement.bottom);
}

document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

function update() {
  if (keys["ArrowLeft"]) hero.move("left");
  if (keys["ArrowRight"]) hero.move("right");
  if (keys["ArrowUp"]) hero.move("up");
  if (keys["ArrowDown"]) hero.move("down");

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

function cycleBetween(x, min, max, speed){
    return (Math.sin(speed * x / 50) * (max - min) / 2) + (max + min) / 2;
}

export { cycleBetween }
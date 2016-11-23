function transferFunction(x) {
    return Math.tanh(x);
}

function transferFunctionDerivative(x) {
    return 1.0 - x * x;
}

function randomFloat() {
    return Math.random();
}
var Renderer = function() {
    var uiLayers = [];


    var container = document.getElementById('neural-network');

    function reset() {
        container.innerHTML = '';
        container.style.display = 'flex';
    }

    function draw(network) {
        reset();

        var layers = network.getLayers();
        _drawLayers(layers);
        _drawError(network.getRecentAverageError());
    }

    function _drawLayers(layers) {
        for (var i = 0; i < layers.length; ++i) {
            var layer = layers[i];
            var newUiLayer = document.createElement('div');

            newUiLayer.className = 'layer layer-' + layer.getType();

            container.appendChild(newUiLayer);

            uiLayers.push(newUiLayer);

            _drawNeurons(layer, newUiLayer, layer.getNeurons());

        }
    }

    function _drawError(error) {
        var uiError = document.createElement('div');

        uiError.innerText = (error + '').substr(0, 7);

        uiError.className = 'error-output';

        container.appendChild(uiError);
    }


    function _drawNeurons(layer, uiLayer, neurons) {
        for (var i = 0; i < neurons.length; ++ i) {
            var uiNeuron = document.createElement('div');
            var neuronVal = neurons[i].getOutputVal();

            uiNeuron.className = 'neuron neuron-' + layer.getType();

            if (neurons[i].isBiasNeuron()) {
                uiNeuron.className += ' bias-neuron';
            }

            uiNeuron.innerText = (neuronVal + '').substr(0, 3);



            var uiNeuronWrapper = document.createElement('div');

            uiNeuronWrapper.className = 'ui-neuron-wrapper';
            uiNeuronWrapper.appendChild(uiNeuron);

            uiLayer.appendChild(uiNeuronWrapper);


        }
    }

    function _drawNeuronWeights(uiNeuron, neuron) {

    }

    return {
        reset: reset,
        draw: draw
    };
};
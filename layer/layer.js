var Layer = function() {
    var _type;
    var _neurons = [];

    function create(topology, numOutputs) {
        console.log('Creating new layer. Type: ' + topology.type);

        setType(topology.type);

        for (var i = 0; i <= topology.numNeurons; ++i) {
            var neuron = new Neuron;
            var isLastNeuron = i === topology.numNeurons;

            neuron.create(i, this, numOutputs);

            !isLastNeuron || neuron.setToBiasNeuron();

            _neurons.push(neuron);
        }


    }

    function setType(type) {
        _type = type;
    }

    function getType() {
        return _type;
    }

    function getNeurons() {
        return _neurons;
    }

    return {
        setType: setType,
        getType: getType,
        create: create,
        getNeurons: getNeurons
    };
}
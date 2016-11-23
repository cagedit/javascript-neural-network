var Neuron = function() {
    var _isBiasNeuron = false;
    var _myIndex;
    var _layer;
    var _value;
    var _weights = [];
    var _numOutputs;
    var _gradient;
    var _eta = .15;
    var _alpha = .5;

    function create(myIndex, layer, numOutputs) {
        _myIndex = myIndex;
        _layer = layer;
        _numOutputs = numOutputs;

        for (var i = 0; i < numOutputs; ++i) {
            _weights.push(new Connection);
        }

    }

    function getIndex() {
        return _myIndex;
    }

    function getLayer() {
        return _layer;
    }

    function getOutputVal() {
        return _value;
    }

    function getGradient() {
        return _gradient;
    }

    function setOutputVal(val) {
        if (_isBiasNeuron) {
            return;
        }

        _value = val;
    }

    function feedForward(prevLayer) {
        var sum = 0.0;
        var prevNeurons = prevLayer.getNeurons();
        for (var n = 0; n < prevNeurons.length; ++n) {
            sum += prevNeurons[n].getOutputVal() * prevNeurons[n].getWeightFor(_myIndex).getWeight();
        }

        setOutputVal(transferFunction(sum));
    }

    function setToBiasNeuron() {
        _isBiasNeuron = true;
        _value = 1.0;
    }

    function isBiasNeuron() {
        return _isBiasNeuron;
    }

    function setWeightsFor(index, weight) {
        _weights[index] = weight;
    }

    function getWeightFor(index) {
        return _weights[index] || 0;
    }

    function calcOutputGradients(targetVal) {
        var delta = targetVal - _value;

        _gradient = delta * transferFunctionDerivative(_value);
    }

    function calcHiddenGradients(nextLayer) {

        var dow = _sumDow(nextLayer);
        _gradient = dow * transferFunctionDerivative(_value);
    }

    function updateInputWeights(prevNeurons) {
        return new Promise(function(resolve) {
            for (var n = 0; n < prevNeurons.length; ++n) {
                var neuron = prevNeurons[n];
                var neuronWeight = neuron.getWeightFor(_myIndex);

                if (!neuronWeight) {
                    continue;
                }

                var oldDeltaWeight = neuronWeight.getDeltaWeight();
                var newDeltaWeight = _eta * neuron.getOutputVal() * _gradient + _alpha * oldDeltaWeight;

                neuronWeight.setDeltaWeight(newDeltaWeight);
                neuronWeight.setWeight(neuron.getWeightFor(_myIndex).getWeight() + newDeltaWeight);

                neuron.setWeightsFor(_myIndex, neuronWeight);
            }

            resolve();
        });

    }

    function _sumDow(nextNeurons) {
        var sum = 0.0;

        for (var n = 0; n < nextNeurons.length - 1; ++n) {
            sum += getWeightFor(n).getWeight() * nextNeurons[n].getGradient();
        }

        return sum;
    }

    return {
        create: create,
        getIndex: getIndex,
        getLayer: getLayer,
        setOutputVal: setOutputVal,
        getOutputVal: getOutputVal,
        feedForward: feedForward,
        setToBiasNeuron: setToBiasNeuron,
        isBiasNeuron: isBiasNeuron,

        getGradient: getGradient,

        calcHiddenGradients: calcHiddenGradients,
        calcOutputGradients: calcOutputGradients,

        updateInputWeights: updateInputWeights,

        setWeightsFor: setWeightsFor,
        getWeightFor: getWeightFor
    }
};
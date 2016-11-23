var Network = function() {
    var _layers = [];
    var _error = 0;
    var _recentAvgError = 0;
    var _recentAvgSmoothingFactor = 100;

    function create(topology) {
        for (var i = 0; i < topology.length; ++i) {
            var layer = new Layer;

            var numOutputs = topology.length - 1 === i ? 0 : topology[i + 1].numNeurons;
            layer.create(topology[i], numOutputs);

            _layers.push(layer);
        }
    }

    function getLayers() {
        return _layers || [];
    }

    function feedForward(inputVals) {
        return new Promise(function(resolve) {
            var layers = getLayers();
            var inputLayer = layers[0];
            var inputNeurons = inputLayer.getNeurons();

            for (var i = 0; i < inputVals.length; ++i) {
                inputNeurons[i].setOutputVal(inputVals[i]);
            }

            for (var x = 1; x < layers.length; ++x) {
                var prevLayer = layers[x - 1];
                var currLayer = layers[x];

                var currNeurons = currLayer.getNeurons()

                for (var n = 0; n < currNeurons.length - 1; ++n) {
                    currNeurons[n].feedForward(prevLayer);
                }
            }

            resolve();
        });
    }

    function backProp(targetVals) {
        return new Promise(function(complete) {
            var outputLayer = _layers[_layers.length - 1];
            var outputNeurons = outputLayer.getNeurons();
            _error = 0.0;

            for (var n = 0; n < outputNeurons.length - 1; ++n) {

                var delta = targetVals[n] - outputNeurons[n].getOutputVal();

                _error += delta * delta;
            }

            _error /= outputNeurons.length - 1;

            _error = Math.sqrt(_error);

            _recentAvgError = (_recentAvgSmoothingFactor + _error) / (_recentAvgSmoothingFactor + 1.0);

            var calcOutputPromise = new Promise(function(resolve) {
                for (n = 0; n < outputNeurons.length - 1; ++n) {
                    outputNeurons[n].calcOutputGradients(targetVals[n]);
                }

                resolve();
            });


            calcOutputPromise.then(function(resolve) {
                var promise = new Promise(function(resolve) {
                    for (var i = _layers.length - 2; i > 0; --i) {
                        var hiddenNeurons = _layers[i].getNeurons();
                        var nextNeurons = _layers[i + 1].getNeurons();

                        for (n = 0; n < hiddenNeurons.length; ++n) {
                            hiddenNeurons[n].calcHiddenGradients(nextNeurons);
                        }
                    }
                    resolve();
                });

                promise.then(function() {
                    var promise = new Promise(function(resolve) {
                        for (i = _layers.length - 1; i > 0; --i) {
                            var currNeurons = _layers[i].getNeurons();
                            var prevNeurons = _layers[i - 1].getNeurons();

                            for (n = 0; n < currNeurons.length; ++n) {
                                currNeurons[n].updateInputWeights(prevNeurons);
                            }
                        }
                        resolve();
                    });

                    promise.then(function() {
                        complete();
                    })
                });
            });

        })

    }

    function getResults() {
        var resultVals = [];
        var outputNeurons = _layers[_layers.length - 1].getNeurons();

        for (var n = 0; n < outputNeurons.length - 1; ++n) {
            resultVals.push(outputNeurons[n].getOutputVal());
        }

        return resultVals;
    }

    function getError() {
        return _error;
    }

    function getRecentAverageError() {
        return _recentAvgError;
    }



    return {
        create: create,
        feedForward: feedForward,
        getLayers: getLayers,
        backProp: backProp,
        getResults: getResults,
        getError: getError,
        getRecentAverageError: getRecentAverageError
    }
};
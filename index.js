var network;
(function() {
    var trainingCount = 100;

    var topology = [
        {numNeurons: 2, type: LayerTypeEnum.INPUT, defaultValue: 1.0},
        {numNeurons: 3, type: LayerTypeEnum.HIDDEN, defaultValue: 1.0},
        {numNeurons: 1, type: LayerTypeEnum.OUTPUT, defaultValue: 1.0}
    ];

    var renderer = new Renderer();
    network = new Network();

    network.create(topology);


    var xor = [];
    for(var i = 0; i < trainingCount; ++i) {
        xor.push([0, 0, 0], [0, 1, 1], [1, 1, 1], [1, 0, 1]);
    }

    var data = xor.pop();
    var expected = data.pop();

    runOne(data, expected);


    function runOne(inputs, expected) {
        var promise = new Promise(function(done) {


            network.feedForward(inputs).then(function() {
                network.backProp([expected]).then(function() {
                    setTimeout(function() {
                        done();
                    }, 0);
                });
            });

        });

        promise.then(function() {
            if (xor.length) {
                var data = xor.pop();
                var expected = data.pop();

                renderer.draw(network);
                runOne(data, expected);
            } else {

                renderer.draw(network);
            }
        });
    }



}());


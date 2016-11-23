var Connection = function() {
    var _weight;
    var _deltaWeight;

    function setWeight(weight) {
        _weight = weight;
    }

    function getWeight() {
        return _weight;
    }

    function setDeltaWeight(deltaWeight) {
        _deltaWeight = deltaWeight;
    }

    function getDeltaWeight() {
        return _deltaWeight;
    }

    setWeight(randomFloat());
    setDeltaWeight(0);

    return {
        getWeight: getWeight,
        setWeight: setWeight,
        getDeltaWeight: getDeltaWeight,
        setDeltaWeight: setDeltaWeight
    }
}